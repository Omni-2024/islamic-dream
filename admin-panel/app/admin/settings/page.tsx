"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import {Eye, EyeOff, X} from "lucide-react";
import { countries, languages } from "@/lib/constance";
import { UserDto } from "@/contexts/AuthContexts";
import { changePassword, getOwnProfile, updateUserProfile } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import withAuth from "@/hoc/withAuth";
import {motion} from "framer-motion";

const SettingsPage=()=> {
    const [user, setUser] = useState<UserDto | null>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        reenterPassword: false
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await getOwnProfile();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch profile. Please try again.",
                    variant: "destructive",
                });
            }
            finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUserChange = (field: keyof UserDto, value: string | string[]) => {
        setUser((prev) => (prev ? { ...prev, [field]: value } : prev));
        setErrors((prevErrors) => ({ ...prevErrors, [field]: "" })); // Clear error on input change
    };

    const addLanguage = (lang: string) => {
        if (user && !user.languages?.includes(lang)) {
            handleUserChange("languages", [...(user.languages || []), lang]);
        }
    };

    const removeLanguage = (lang: string) => {
        if (user) {
            handleUserChange("languages", user.languages?.filter((l) => l !== lang) || []);
        }
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length > 7) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handlePasswordChange = (password: string) => {
        setNewPassword(password);
        const strength = calculatePasswordStrength(password);
        setPasswordStrength(strength);
    };


    const validateProfile = () => {
        const newErrors: Record<string, string> = {};
        if (!user?.name) newErrors.name = "Name is required";
        if (!user?.email || !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(user.email))
            newErrors.email = "Valid email is required";
        if (!user?.country) newErrors.country = "Country is required";
        if (!user?.languages || user.languages.length === 0)
            newErrors.languages = "At least one language is required";
        if (!user?.age || isNaN(Number(user.age)) || Number(user.age) < 1)
            newErrors.age = "Valid age is required";
        if (!user?.yearOfExperience || isNaN(user.yearOfExperience) || Number(user.yearOfExperience) < 0)
            newErrors.yearOfExperience = "Valid number of experience years is required";
        if (!user?.mobileNumber || !/^\+\d{1,4} \d{7,15}$/.test(user.mobileNumber))
            newErrors.mobile = "Enter a valid mobile number with country code (e.g., +1 123456789)";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSecurity = () => {
        const newErrors: Record<string, string> = {};
        if (!currentPassword) newErrors.currentPassword = "Current password is required";
        if (!newPassword) newErrors.newPassword = "New password is required";
        if (newPassword !== reenterPassword) newErrors.reenterPassword = "Passwords do not match";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileSubmit = async () => {
        console.log(errors)
        if (!validateProfile()) return;

        try {
            await updateUserProfile(user);
            toast({ title: "Success", description: "Profile updated successfully." });
            setErrors({});
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleSecuritySubmit = async () => {
        if (!validateSecurity()) return;

        try {
            await changePassword(currentPassword, reenterPassword);
            toast({ title: "Success", description: "Password changed successfully."});
            setCurrentPassword("");
            setNewPassword("");
            setReenterPassword("");
            setErrors({});
        } catch (error) {
            console.error("Failed to change password:", error);
            toast({
                title: "Error",
                description: "Failed to change password. Please try again.",
                variant: "destructive",
            });
        }
    };

    const renderPasswordStrengthIndicator = () => {
        const strengthColors = [
            'bg-red-500',
            'bg-orange-500',
            'bg-yellow-500',
            'bg-green-500'
        ];

        return (
            <div className="flex space-x-1 h-1.5 mt-1">
                {[0, 1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className={`flex-1 rounded-full ${
                            index < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>
        );
    };

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
        <div className="p-4 grid gap-8 md:grid-cols-2">
            <Card>
                <CardContent>
                    <h2 className="text-xl font-semibold my-4">Profile</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <Input
                                type="text"
                                value={user?.name || ""}
                                onChange={(e) => handleUserChange("name", e.target.value)}
                                placeholder="Enter your name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <Input
                                type="email"
                                value={user?.email || ""}
                                onChange={(e) => handleUserChange("email", e.target.value)}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Age</label>
                            <Input
                                type="number"
                                value={user?.age || ""}
                                onChange={(e) => handleUserChange("age", e.target.value)}
                                placeholder="Enter your age"
                                min={1}
                            />
                            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Mobile Number</label>
                            <Input
                                type="text"
                                value={user?.mobileNumber || ""}
                                onChange={(e) => handleUserChange("mobileNumber", e.target.value)}
                                placeholder="+1 123456789"
                            />
                            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Bio</label>
                            <Textarea
                                value={user?.description || ""}
                                onChange={(e) => handleUserChange("description", e.target.value)}
                                placeholder="Write something about yourself..."
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Years of Experience</label>
                            <Input
                                type="number"
                                value={user?.yearOfExperience || ""}
                                onChange={(e) => handleUserChange("yearOfExperience", e.target.value)}
                                placeholder="Enter number of years"
                                min={1}
                            />
                            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Country</label>
                            <Select onValueChange={(value) => handleUserChange("country", value)}
                                    value={user?.country || ""}>
                                <SelectTrigger className="w-full">{user?.country || "Select a country"}</SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem key={country.value} value={country.value}>
                                            {country.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Languages</label>
                            <Select onValueChange={addLanguage}>
                                <SelectTrigger className="w-full">Select languages</SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Selected languages as tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user?.languages?.map((lang) => (
                                    <div key={lang}
                                         className="flex items-center gap-1 bg-gray-200 text-sm px-2 py-1 rounded-lg">
                                        {lang}
                                        <X className="w-4 h-4 cursor-pointer" onClick={() => removeLanguage(lang)}/>
                                    </div>
                                ))}
                            </div>
                            {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
                        </div>

                        <Button className="mt-4 w-full bg-primary-700 rounded-2xl hover:bg-primary-100 font-bold" onClick={handleProfileSubmit} >
                            Save Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="h-96">
                <CardContent>
                    <h2 className="text-xl font-semibold my-4">Security</h2>
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block mb-1 font-medium">Current Password</label>
                            <div className="relative">
                                <Input
                                    type={passwordVisibility.currentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('currentPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {passwordVisibility.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.currentPassword &&
                                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">New Password</label>
                            <div className="relative">
                                <Input
                                    type={passwordVisibility.newPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    placeholder="Enter new password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('newPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {passwordVisibility.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {renderPasswordStrengthIndicator()}
                            {errors.newPassword &&
                                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                        </div>

                        <div className="relative">
                            <label className="block mb-1 font-medium">Re-enter Password</label>
                            <div className="relative">
                                <Input
                                    type={passwordVisibility.reenterPassword ? "text" : "password"}
                                    value={reenterPassword}
                                    onChange={(e) => setReenterPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('reenterPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {passwordVisibility.reenterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.reenterPassword &&
                                <p className="text-red-500 text-sm mt-1">{errors.reenterPassword}</p>}
                        </div>

                        <Button
                            className="mt-4 w-full bg-primary-700 rounded-2xl hover:bg-primary-100 font-bold"
                            onClick={handleSecuritySubmit}
                        >
                            Change Password
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default withAuth(SettingsPage, ["admin", "super-admin"]);

