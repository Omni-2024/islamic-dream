import React, { useState } from "react";
import CustomSelect from "@/components/ui/input/select";
import { BorderInput } from "@/components/ui/input/input";

const EditProfilePopup = ({ data, onClose, onSave, genderOptions, countries, languages }) => {
  const defaultValues = {
    name: "",
    email: "",
    gender: "",
    dob: new Date().toISOString().split('T')[0],
    country: "",
    language: "",
    mobile: ""
  };

  const [popupData, setPopupData] = useState({
    name: data?.name || defaultValues.name,
    email: data?.email || defaultValues.email,
    gender: data?.gender || defaultValues.gender,
    dob: data?.dob || defaultValues.dob,
    country: data?.country || defaultValues.country,
    language: data?.language || defaultValues.language,
    mobile: data?.mobile || defaultValues.mobile,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPopupData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, selectName) => {
    setPopupData(prev => ({
      ...prev,
      [selectName]: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleSaveButtonClick = () => {
    if (popupData.mobile && !validateMobile(popupData.mobile)) {
      alert("Please enter mobile number in format: (XXX) XXX-XXXX");
      return;
    }

    const changedValues = {};
    Object.keys(popupData).forEach((key) => {
      if (popupData[key] && popupData[key] !== data[key]) {
        changedValues[key] = popupData[key];
      }
    });

    if (Object.keys(changedValues).length === 0) {
      alert("No changes made");
      return;
    }

    onSave(changedValues);
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 pt-10 overflow-y-auto">
      <div className="bg-white rounded-lg relative w-full max-w-3xl mx-4 md:mx-0 shadow-lg mb-10">
        <div className="bg-gray-200 p-4 flex justify-between rounded-t-lg items-center">
          <span className="text-gray-600 text-lg">Edit Profile Details</span>
            <button onClick={onClose} className="text-white px-3 py-1.5 rounded-lg font-sans hover:text-gray-600 bg-red-500 text-lg font-bold " >
              &times;
            </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="flex flex-col md:grid gap-6 md:grid-cols-2">
            <div className="relative mb-6">
              <BorderInput
                type="text"
                name="name"
                label={"First Name"}
                value={popupData.name}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
            <div className="relative mb-6">
              <BorderInput
                type="email"
                name="email"
                label={"Email"}
                value={popupData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className="relative mb-6">
              <label className="text-sm text-gray-600 absolute -top-3 left-8 bg-white px-1 w-auto">Gender</label>
              <div className="flex justify-center items-center rounded-full border px-4 py-1 border-teal-500 focus:ring-teal-500">
                <CustomSelect 
                  options={genderOptions} 
                  value={genderOptions.find(option => option.value === popupData.gender) || null}
                  onChange={(option) => handleSelectChange(option, 'gender')}
                  name="gender" 
                  placeholder="Select Gender"
                />
              </div>
            </div>
            <div className="relative mb-6">
              <BorderInput
                type="date"
                name="dob"
                label={"Date of Birth"}
                value={popupData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="relative mb-6">
              <label className="text-sm text-gray-600 absolute -top-3 left-8 bg-white px-2 mb-2 w-auto">Country</label>
              <div className="flex justify-center items-center rounded-full border px-4 py-1 border-teal-500 focus:ring-teal-500">
                <CustomSelect 
                  options={countries} 
                  value={countries.find(option => option.value === popupData.country) || null}
                  onChange={(option) => handleSelectChange(option, 'country')}
                  name="country" 
                  placeholder="Select Country"
                />
              </div>
            </div>
            <div className="relative mb-6">
              <label className="text-sm text-gray-600 absolute -top-3 left-8 bg-white px-1 w-auto">Language</label>
              <div className="flex justify-center items-center rounded-full border px-4 py-1 border-teal-500 focus:ring-teal-500">
                <CustomSelect 
                  options={languages} 
                  value={languages.find(option => option.value === popupData.language) || null}
                  onChange={(option) => handleSelectChange(option, 'language')}
                  name="language" 
                  placeholder="Select Language"
                />
              </div>
            </div>
            <div className="relative mb-6">
              <BorderInput
                type="tel"
                name="mobile"
                label={"Mobile Number"}
                value={popupData.mobile}
                onChange={handleChange}
                placeholder="(XXX) XXX-XXXX"
              />
            </div>
            <div className="grid grid-cols-2 col-span-2 gap-6">
              <button onClick={onClose} className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-full py-3 mt-5 transition duration-300">
                Cancel
              </button>
              <button onClick={handleSaveButtonClick} className="w-full bg-RuqyaGreen hover:bg-teal-700 text-white rounded-full py-3 mt-5 transition duration-300">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePopup;
