'use client'

import {
    SpeakingWhileMutedNotification,
    ToggleAudioPublishingButton,
    ToggleVideoPublishingButton,
    ScreenShareButton,
    RecordCallButton,
    ReactionsButton,
    CancelCallButton,
} from '@stream-io/video-react-sdk';

interface ControlsProps {
    onLeave: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onLeave }) => (
    <div className="str-video__call-controls">
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


