"use client";
import React, { useState, useEffect } from "react";
import EditProfilePopup from "@/components/ui/popup/editPofile";
import { countries, languages } from "@/lib/constance";
import CustomSelect from "@/components/ui/input/select";
import Loading from "@/components/shared/common/LoadingSpinner";
import { getOwnProfile, updateUserProfile, changePassword } from "@/lib/api";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import { getCountryLabel, getLanguageLabel } from "@/lib/utils";
import { camelCase, startCase } from "lodash";
import ChangePassword from "@/components/ui/popup/ChangePassword";

const MyProfile = () => {
  const defaultValues = {
    name: "",
    email: "",
    gender: "",
    dob: new Date().toISOString().split('T')[0],
    country: "",
    language: "",
    mobile: ""
  };

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(defaultValues);
  const [popupData, setPopupData] = useState(defaultValues);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getOwnProfile();
        if (!data) {
          throw new Error("No data returned from API");
        }
        setUserData(data);
        setFormData({
          name: startCase(data.name) || defaultValues.name,
          email: data.email || defaultValues.email,
          gender: data.gender || defaultValues.gender,
          dob: data.DOB || defaultValues.dob,
          country: data.country || defaultValues.country,
          language: data.language || defaultValues.language,
          mobile: data.mobile || defaultValues.mobile,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
       
        setUserData({
          ...defaultValues,
          DOB: defaultValues.dob
        });
        setFormData(defaultValues);
      }
    };

    fetchUserData();
  }, []);

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const validateMobile = (number) => {
    const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    return phoneRegex.test(number);
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleEditButtonClick = () => {
    setIsEditPopupOpen(true);
    setPopupData({ ...formData }); // Ensure formData is copied correctly
  };

  const handleClosePopup = () => {
    setIsEditPopupOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPopupData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, selectName) => {
    if (!selectedOption) return;

    setPopupData((prevState) => ({
      ...prevState,
      [selectName]: selectedOption.value,
    }));
  };

  const handleSaveButtonClick = async () => {
    // Only validate mobile if it has been changed
    if (popupData.mobile && popupData.mobile !== formData.mobile) {
      if (!validateMobile(popupData.mobile)) {
        alert("Please enter mobile number in format: (XXX) XXX-XXXX");
        return;
      }
    }

    const changedValues = {};
    Object.keys(popupData).forEach((key) => {
      // Only include values that are different from the original and not empty
      if (popupData[key] && popupData[key] !== formData[key]) {
        changedValues[key] = popupData[key];
      }
    });

    if (Object.keys(changedValues).length === 0) {
      alert("No changes made");
      return;
    }

    // Update only the changed values
    setFormData((prevState) => ({
      ...prevState,
      ...changedValues,
    }));

    try {
      await updateUserProfile({
        ...formData,
        ...changedValues,
      });
      setIsDataSaved(true);
      setIsEditPopupOpen(false);

      const displayChanges = {};
      Object.keys(changedValues).forEach((key) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        displayChanges[label] = changedValues[key];
      });

      // if (Object.keys(displayChanges).length > 0) {
      //   alert(`Updated Values:\n${JSON.stringify(displayChanges, null, 2)}`);
      // }
      setErrorMessage({message: "User profile updated successfully", type: "success"});
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("Error updating user profile. Please try again later.");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async (passwordData) => {
    const { currentPassword, newPassword } = passwordData;
    try {
      const response = await changePassword(currentPassword, newPassword);
      if (response.status === 200) {
        setIsChangePasswordOpen(false);
        // setErrorMessage({ message: response.data.message || "Password updated successfully", type: "success" });
      }
      setErrorMessage({ message: "Password updated successfully", type: "success" });
    } catch (error) {
      setErrorMessage({ message: error?.response?.data?.message || "Failed to change password. Please try again.", type: "error" });
    }
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      await updateUserProfile(updatedData);
      setFormData((prevState) => ({
        ...prevState,
        ...updatedData,
      }));
      setIsDataSaved(true);
      setIsEditPopupOpen(false);

      const displayChanges = {};
      Object.keys(updatedData).forEach((key) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        displayChanges[label] = updatedData[key];
      });

      // if (Object.keys(displayChanges).length > 0) {
      //   alert(`Updated Values:\n${JSON.stringify(displayChanges, null, 2)}`);
      // }

      setErrorMessage({message: "User profile updated successfully", type: "success"});
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("Error updating user profile. Please try again later.");
    }
  };

  useEffect(() => {
    if (isEditPopupOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    }
  }, [isEditPopupOpen]);

  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault();
    };

    if (isEditPopupOpen) {
      window.addEventListener("scroll", handleScroll, { passive: false });
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isEditPopupOpen]);

  if (isLoading) {
    return <Loading />;
  }

  // Update the error state to show default values instead of error message
  if (!userData) {
    return (
     <Loading />
    );
  }

return (
  <div className="md:mx-[6%] px-3 py-5 md:pl-1 md:pr-3 min-h-screen  relative">
    {/* Show popups before the main content */}
    {isChangePasswordOpen && (
      <ChangePassword 
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={handleChangePassword}
      />
    )}
    {errorMessage.message && <ErrorMessage message={errorMessage.message} type={errorMessage.type} />}

    {isEditPopupOpen && (
      <EditProfilePopup 
        data={formData}
        onClose={() => setIsEditPopupOpen(false)}
        onSave={handleSaveProfile}
        genderOptions={genderOptions}
        countries={countries}
        languages={languages}
      />
    )}

    {/* Left sidebar */}
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3 lg:w-1/4 text-white p-6 md:min-h-screen">
        <div className="flex flex-col mb-12 items-center">
          {/* Profile avatar with dark background */}
          <div className="relative w-32 h-32 mb-4">
            <div className="w-32 h-32 rounded-md bg-RuqyaLightGreen flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
            </div>
            {/* Decorative elements */}
            {/* <div className="absolute top-0 right-0 w-8 h-8 bg-RuqyaLightGreen rounded-tr-md rounded-bl-lg transform translate-x-2 -translate-y-2"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 bg-RuqyaLightGreen rounded-bl-md rounded-tr-lg transform -translate-x-2 translate-y-2"></div> */}
          </div>
          
          {/* User name and email */}
          <h1 className="text-2xl  text-RuqyaGray mt-4">{formData.name}</h1>
          <p className="text-sm opacity-80 mt-1 text-RuqyaGray font-medium">{formData.email}</p>
          
          {/* Action buttons - vertical layout on sidebar */}
          <div className="w-full mt-12 space-y-3">
            <button 
              onClick={handleEditButtonClick} 
              className="w-full flex items-center justify-center px-4 py-3 bg-RuqyaLightGreen hover:bg-RuqyaDarkGreen  text-white font-medium rounded-md transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
            <button 
              onClick={() => setIsChangePasswordOpen(true)} 
              className="w-full flex items-center justify-center px-4 py-3 bg-RuqyaGray/60 hover:bg-RuqyaGray text-white font-medium rounded-md transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
              </svg>
              Change Password
            </button>
          </div>
        </div>
        
      
      </div>

      {/* Main content area */}
      <div className="md:w-2/3 lg:w-3/4 p-6 pt-0  md:p-12 ">
        <h2 className="text-xl sm:text-3xl md:text-3xl font-semibold text-RuqyaGreen mb-8 pb-4 border-b border-gray-200">Profile Information</h2>
        
        {/* Profile info in a 2-column table layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
          {/* Row 1: Gender */}
          <div className="border-b border-dashed border-gray-200 pb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-RuqyaGreen/10 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-RuqyaGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Gender</p>
                <p className="text-xl font-medium text-header">{formData.gender || "Not specified"}</p>
              </div>
            </div>
          </div>
          
          {/* Row 2: Age & Birthday */}
          <div className="border-b border-dashed border-gray-200 pb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-RuqyaGreen/10 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-RuqyaGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Age & Birthday</p>
                <p className="text-xl font-medium text-header">{formData.dob ? `${calculateAge(formData.dob)} years (${formatDate(formData.dob)})` : "Not specified"}</p>
              </div>
            </div>
          </div>
          
          {/* Row 3: Country */}
          <div className="border-b border-dashed border-gray-200 pb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-RuqyaGreen/10 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-RuqyaGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Country</p>
                <p className="text-xl font-medium text-header">{getCountryLabel(formData.country) || "Not specified"}</p>
              </div>
            </div>
          </div>
          
          {/* Row 4: Language */}
          <div className="border-b border-dashed border-gray-200 pb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-RuqyaGreen/10 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-RuqyaGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Language</p>
                <p className="text-xl font-medium text-header">{getLanguageLabel(formData.language) || "Not specified"}</p>
              </div>
            </div>
          </div>
          
          {/* Row 5: Mobile Number - spanning both columns on large screens */}
          <div className="border-b border-dashed border-gray-200 pb-4 lg:col-span-2">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-RuqyaGreen/10 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-RuqyaGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Mobile Number</p>
                <p className="text-xl font-medium text-header">{formData.mobile || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
        
      
      </div>
    </div>
  </div>
);
};

export default MyProfile;

