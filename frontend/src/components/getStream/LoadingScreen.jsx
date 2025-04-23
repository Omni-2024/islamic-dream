"use client"

import React from 'react';
import { PuffLoader } from "react-spinners";

export const LoadingScreen = () => (
    <div className="loading-container">
        <PuffLoader color="#36d7b7" size={100}/>
    </div>
);