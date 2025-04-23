'use client'

import {
    SpeakingWhileMutedNotification,
    ToggleAudioPublishingButton,
    ToggleVideoPublishingButton,
    ScreenShareButton,
    RecordCallButton,
    ReactionsButton,
    CancelCallButton, useNoiseCancellation,
} from '@stream-io/video-react-sdk';


export const Controls = ({ onLeave }) => (
    <div className="str-video__call-controls bottom-0">
        <SpeakingWhileMutedNotification>
            <ToggleAudioPublishingButton />
        </SpeakingWhileMutedNotification>
        <ToggleVideoPublishingButton />
        <ScreenShareButton />
        <RecordCallButton />
        {/*<MyToggleNoiseCancellationButton />*/}
        <ReactionsButton />
        <CancelCallButton onLeave={onLeave} />
    </div>
);


// const MyToggleNoiseCancellationButton = () => {
//     const {isSupported, isEnabled, setEnabled} = useNoiseCancellation();
//     return (
//         <div>
//             <button
//                 id="noise-cancellation-button"
//                 className="noise-btn"
//                 disabled={!isSupported}
//                 type="button"
//                 onClick={() => {
//                     setEnabled(!isEnabled);
//                     console.log(isEnabled);
//                 }}
//             >
//                 {isEnabled ? <MdOutlineNoiseAware size={25}/> : <MdNoiseControlOff size={25}/>}
//             </button>
//             <Tooltip
//                 content={() => (
//                     <span>{isEnabled ? "Disable Noise Cancellation" : "Enable Noise Cancellation"}</span>
//                 )}
//                 place="top"
//             />
//         </div>
//     );
// };