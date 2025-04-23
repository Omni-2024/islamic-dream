import React from "react";
// import logo from "@/assets/images/logo-icon.png";
import styles from "@/styles/Triangle.module.css";

function Triangle() {
  return (
    <div className={styles.container}>
      <svg className={styles.svg} viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 160L82.5 150.5L183.5 135.5L294 116.5L413 93.5L526.5 64.5L627.5 33.5L717 0L787.5 24.5L879.5 52.5L1082.5 101L1264 136.5L1368.5 152.5L1440 160" fill="#E6E6FA" />
      </svg>
      <img src={"/logo-icon.png"} alt="Logo" className={styles.logo} />
    </div>
  );
}

export default Triangle;
