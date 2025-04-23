"use client";

import React, { useState, useEffect } from "react";
import {  Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {getMeetingsByRakiId, getUsers, updateUserRole} from "@/lib/api";
import { toast } from "@/components/ui/toast";
import {useAuth, UserDto} from "@/contexts/AuthContexts";
import {getCountryLabel} from "@/lib/utils";
import {IMeeting} from "@/components/SessionList";
import withAuth from "@/hoc/withAuth";
import UserDetailsDialog from "@/components/ui/user/UserDetailsDialog";
import {motion} from "framer-motion";



const roleOptions = ["super-admin", "admin", "user"];

const UsersPage=()=> {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [session, setSession] = useState<IMeeting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [isRoleChangeDialogOpen, setIsRoleChangeDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>("");
  const [loading, setLoading] = useState(true);


  const isSuperAdmin= currentUser?.role==="super-admin"


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const userData = await getUsers();
        setUsers(userData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
      finally {
        setLoading(false);
      }
    };

    const fetchSession = async () => {
      try {
        setLoading(true)
        const sessionData = await getMeetingsByRakiId();
        setSession(sessionData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
      finally {
        setLoading(false);
      }
    };

    if (!isSuperAdmin) {
      fetchSession();
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (countryFilter === "all" ||
        countryFilter === "" ||
        user.country === countryFilter) &&
      (statusFilter === "all" ||
        statusFilter === "" ||
        user.status === statusFilter)
  );

  const meetingUsers = session.map((meeting) => meeting.userId);

  const meetingFilteredUsers = filteredUsers.filter((user) =>
      meetingUsers.includes(user._id)
  );

  const countries = Array.from(new Set(users.map((user) => user.country)));

  const handleRoleChange = async (userId: string, newRole: string) => {
    setSelectedUser(users.find((user) => user._id === userId) || null);
    setNewRole(newRole);
    setIsRoleChangeDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;

    try {
      await updateUserRole(selectedUser._id, newRole);
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id
            ? { ...user, role: newRole as UserDto["role"] }
            : user
        )
      );
      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRoleChangeDialogOpen(false);
    }
  };


  const usersToDisplay = isSuperAdmin ? filteredUsers : meetingFilteredUsers;


  if (loading) return  (
      <div className="w-full h-full  flex flex-col items-center justify-center">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281]"
        />
      </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Users</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" border border-gray-300 shadow-sm rounded p-2 pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="md:w-1/4 border border-gray-300 shadow-sm rounded p-2">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {getCountryLabel(country)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-1/4 border border-gray-300 shadow-sm rounded p-2">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Country</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersToDisplay.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell> {getCountryLabel(user.country ?? "ae")}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        :  "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.status ?? "Active"}
                  </span>
                </TableCell>
                <TableCell>
                  {currentUser?.role === "super-admin" ? (
                    <Select
                      value={user.role}
                      onValueChange={(newRole) =>
                        handleRoleChange(user._id, newRole)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell>
                  <UserDetailsDialog tutor={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isRoleChangeDialogOpen}
        onOpenChange={setIsRoleChangeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the role of {selectedUser?.name}{" "}
              to {newRole}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleChangeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmRoleChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default withAuth(UsersPage, ["admin", "super-admin"]);

