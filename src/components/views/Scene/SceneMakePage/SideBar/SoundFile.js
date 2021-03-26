import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function SoundFile({ sound_audio, sound, setSoundFile }) {
    const onClick_music = () => {
        setSoundFile(sound);
        sound_audio.src = sound.music;
        sound_audio.play();
    };

    return (
        <div onClick={onClick_music}>
            <img src={`https://neverending.s3.ap-northeast-2.amazonaws.com/original/music_icon.jpg`} alt="img" />
            {sound.name}
        </div>
    );
}

export default SoundFile;
