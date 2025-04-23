"use client";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

export const ErrorMessage = ({ message = "Something went wrong", type = "error" }) => {
  const notify = () => {
    if (type === "success") {
      toast.success(typeof message === "object" ? message.message : message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "toast-success",
        theme: "colored",
      });
    } else {
      toast.error(typeof message === "object" ? message.message : message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "toast-error",
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    notify();
  }, [message]);

  return <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />;
};
