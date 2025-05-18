'use client';
import React, { useState } from "react";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import { BorderInput } from "@/components/ui/input/input";
const ChangePassword = ({ onClose, onSubmit }) => {
  const MIN_PASSWORD_LENGTH = 8; // Add this constant
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setError(null); // Clear error when user types
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setError(null); // Clear error when closing
    onClose();
  };

  const handleSubmit = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    onSubmit(passwordData);
    handleClose();
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 pt-10 overflow-y-auto ">
      <div className="bg-white rounded-lg relative w-full max-w-md mx-4 md:mx-0 shadow-lg mb-10">
        <div className=" bg-RuqyaGreen p-4 flex justify-between rounded-t-lg items-center">
          <span className="text-white text-2xl font-semibold">Change Password</span>
          <button onClick={handleClose} className="bg-red-500 text-white h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-red-600">
              <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6">
          {error && <ErrorMessage message={error} />}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <BorderInput
                label="Current Password"
                type="password"
                name="currentPassword"
                placeholder={"Enter your current password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                autoComplete="off"
              />
            </div>
            <div className="relative">
              <BorderInput
                label="New Password"
                type="password"
                name="newPassword"
                placeholder={"Enter your new password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                autoComplete="off"
              />
            </div>
            <div className="relative">
              <BorderInput
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                placeholder={"Confirm your new password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <button onClick={handleClose} className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-full py-3 mt-5 transition duration-300">
                Cancel
              </button>
              <button onClick={handleSubmit} className="w-full bg-RuqyaGreen hover:bg-RuqyaDarkGreen  text-white rounded-full py-3 mt-5 transition duration-300">
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
