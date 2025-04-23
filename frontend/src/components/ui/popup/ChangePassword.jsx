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
        <div className="bg-gray-200 p-4 flex justify-between rounded-t-lg items-center">
          <span className="text-gray-600 text-lg">Change Password</span>
          <button onClick={handleClose} className="text-white px-3 py-1.5 rounded-lg font-sans hover:text-gray-600 bg-red-500 text-lg font-bold">
            &times;
          </button>
        </div>
        <div className="p-6">
          {error && <ErrorMessage message={error} />}
          <div className="flex flex-col gap-4">
            <div className="relative mb-3">
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
            <div className="relative mb-3">
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
            <div className="relative mb-3">
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
            <div className="grid grid-cols-2 gap-6 text-xs">
              <button onClick={handleClose} className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-full py-3 mt-5 transition duration-300">
                Cancel
              </button>
              <button onClick={handleSubmit} className="w-full bg-RuqyaGreen hover:bg-teal-700 text-white rounded-full py-3 px-5 mt-5 transition duration-300">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
