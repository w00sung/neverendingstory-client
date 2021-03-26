import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function BgmFile({ bgm_audio, bgm, setBgmFile }) {
    const onClick_music = () => {
        setBgmFile(bgm);
        bgm_audio.src = bgm.music;
        bgm_audio.play();
    };

    return (
        <div onClick={onClick_music}>
            <img src={`https://neverending.s3.ap-northeast-2.amazonaws.com/original/music_icon.jpg`} alt="img" />
            {bgm.name}
        </div>
    );
}

export default BgmFile;
