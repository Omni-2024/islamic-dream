"use client"

import React from "react";
import { useNoiseCancellation } from "@stream-io/video-react-sdk";
import { MdNoiseControlOff, MdOutlineNoiseAware } from "react-icons/md";
import { Tooltip } from "react-tooltip";

export const NoiseCancellationButton = () => {
    const { isSupported, isEnabled, setEnabled } = useNoiseCancellation();

    return (
        <div>
            <button
                id="noise-cancellation-button"
                className="noise-btn"
                disabled={!isSupported}
                type="button"
                onClick={() => setEnabled(!isEnabled)}
            >
                {isEnabled ? <MdOutlineNoiseAware size={25} /> : <MdNoiseControlOff size={25} />}
            </button>
            <Tooltip
                anchorSelect="#noise-cancellation-button"
                content={isEnabled ? "Disable Noise Cancellation" : "Enable Noise Cancellation"}
                place="top"
            />
        </div>
    );
};
