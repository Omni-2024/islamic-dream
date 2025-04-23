import React from 'react';

const PleaseLogin = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-xl z-10 w-96">
        <h2 className="text-xl font-semibold mb-4">Please Login</h2>
        <p className="mb-6">You need to be logged in to continue. Would you like to login now?</p>
        <div className="flex justify-end space-x-4">

          <button onClick={onClose} className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-full py-3 mt-5 transition duration-300">
            Cancel
          </button>
          <button onClick={onLogin} className="w-full bg-RuqyaGreen hover:bg-teal-700 text-white rounded-full py-3 px-5 mt-5 transition duration-300">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PleaseLogin;
