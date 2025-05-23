"use client"

import React from 'react';
import { PuffLoader } from "react-spinners";

export const LoadingScreen = () => (
    <div className="loading-container">
        <PuffLoader color="#1B184C" size={100}/>
    </div>
);