"use client";

import { Song } from "@/type";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPause, BsPlay, BsRepeat } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { TbMicrophone2 } from "react-icons/tb";
import Slider from "./Slider";
import usePlayer from "@/hooks/userPlayer";
import { useEffect, useState, useRef } from "react";
import useSound from "use-sound";
import LyricsOverlay from "./LyricsOverlay";
import { incrementPlayCount } from "@/actions/incrementPlayCount";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);

    const hasIncremented = useRef(false);

    const Icon = isPlaying ? BsPause : BsPlay;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const [play, { pause, sound }] = useSound(songUrl, {
        volume,
        onplay: () => {
            setIsPlaying(true);
            // Gọi Backend Server Action để đếm lượt nghe (chỉ đếm 1 lần mỗi khi đổi bài)
            if (!hasIncremented.current) {
                hasIncremented.current = true;
                incrementPlayCount(song.id).catch(console.error);
            }
        },
        onend: () => {
            if (isLooping) {
                play();
            } else {
                setIsPlaying(false);
                onPlayNext();
            }
        },
        onpause: () => setIsPlaying(false),
        format: ["mp3"],
    });

    useEffect(() => {
        if (sound) {
            setDuration(sound.duration());
            const updateProgress = setInterval(() => {
                setProgress(sound.seek());
            }, 1000);
            return () => clearInterval(updateProgress);
        }
    }, [sound]);

    useEffect(() => {
        if (sound) {
            sound.stop(); // Stop the current song when the songUrl changes
            setIsPlaying(false); // Reset playing state
            setProgress(0); // Reset progress
            hasIncremented.current = false; // Reset cờ đếm lượt nghe
        }
    }, [songUrl]); // This effect will run when songUrl changes
    

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    };

    const toggleMute = () => {
        setVolume(volume === 0 ? 1 : 0);
    };

    const toggleLoop = () => {
        setIsLooping(!isLooping);
    };

    const handleSeekChange = (value: number) => {
        if (sound) {
            sound.seek(value);
            setProgress(value);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const onPlayPrevious = () => {
        if (player.ids.length === 0) return;
        if (sound) sound.stop(); // Dừng nhạc hiện tại
        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const prevSong = player.ids[currentIndex - 1];
        player.setId(prevSong || player.ids[player.ids.length - 1]);
    };
    
    const onPlayNext = () => {
        if (player.ids.length === 0) return;
        if (sound) sound.stop(); // Dừng nhạc hiện tại
        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];
        player.setId(nextSong || player.ids[0]);
    };
    
  
  

    return (
        <div className="flex md:grid md:grid-cols-3 justify-between items-center h-full w-full">
            {/* Left: Song Info */}
            <div className="flex w-1/2 md:w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} onClick={() => {}} />
                    <LikeButton songId={song.id} />
                </div>
            </div>

            {/* Center: Playback Controls */}
            <div className="flex md:flex-col items-center justify-end md:justify-center w-1/2 md:w-full max-w-[722px] pr-2 md:pr-0">
                <div className="flex items-center gap-x-4 md:gap-x-6">
                    {/* Shuffle Icon (mock) */}
                    <div className="hidden md:block text-neutral-400 cursor-pointer hover:text-white transition">
                        <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 4.5l-2.83-3.578z"></path><path d="M12.449 8.224a.75.75 0 1 0-1.06 1.06L12.408 10H11.16a2.25 2.25 0 0 1-1.724-.804L8.14 7.653l1.144-1.363 1.32 1.573a3.75 3.75 0 0 0 2.873 1.34h1.637l-1.017-1.018a.75.75 0 1 0-1.06-1.06l2.829-2.828 2.829 2.828a.75.75 0 1 0-1.06 1.06L14.46 6.51h-3.3z"></path></svg>
                    </div>
                    <AiFillStepBackward onClick={onPlayPrevious} size={24} className="hidden md:block text-neutral-400 cursor-pointer hover:text-white transition" />
                    <div onClick={handlePlay} className="flex items-center justify-center h-8 w-8 rounded-full bg-white p-1 cursor-pointer hover:scale-105 transition">
                        <Icon size={24} className="text-black" />
                    </div>
                    <AiFillStepForward onClick={onPlayNext} size={24} className="text-neutral-400 cursor-pointer hover:text-white transition" />
                    <BsRepeat
                        size={20}
                        onClick={toggleLoop}
                        className={`hidden md:block cursor-pointer transition hover:text-white ${isLooping ? "text-green-500 hover:text-green-400" : "text-neutral-400"}`}
                    />
                </div>

                {/* Progress Bar */}
                <div className="hidden md:flex items-center w-full gap-x-2 mt-2">
                    <span className="text-xs text-neutral-400">{formatTime(progress)}</span>
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        value={progress}
                        onChange={(e) => handleSeekChange(Number(e.target.value))}
                        className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-neutral-400">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Extra Controls */}
            <div className="hidden md:flex w-full justify-end pr-2 items-center gap-x-4">
                <TbMicrophone2 
                    size={20} 
                    onClick={() => setShowLyrics(true)} 
                    className="cursor-pointer transition text-neutral-400 hover:text-white" 
                />
                {/* Queue (mock) */}
                <svg role="presentation" height="16" width="16" aria-hidden="true" className="text-neutral-400 hover:text-white cursor-pointer" viewBox="0 0 16 16" fill="currentColor"><path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z"></path></svg>
                {/* Connect Device (mock) */}
                <svg role="presentation" height="16" width="16" aria-hidden="true" className="text-neutral-400 hover:text-white cursor-pointer" viewBox="0 0 16 16" fill="currentColor"><path d="M6 2.75C6 1.784 6.784 1 7.75 1h6.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15h-6.5A1.75 1.75 0 0 1 6 13.25V2.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25h-6.5zm-6 0a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25H4V11H1.75A1.75 1.75 0 0 1 0 9.25v-6.5C0 1.784.784 1 1.75 1H4v1.5H1.75zM4 15H2v-1.5h2V15z"></path></svg>
                
                <div className="flex items-center gap-x-2 w-[100px]">
                    <VolumeIcon size={20} onClick={toggleMute} className="cursor-pointer text-neutral-400 hover:text-white" />
                    <Slider value={volume} onChange={(value) => setVolume(value)} />
                </div>
                {/* Fullscreen (mock) */}
                <svg role="presentation" height="16" width="16" aria-hidden="true" className="text-neutral-400 hover:text-white cursor-pointer" viewBox="0 0 16 16" fill="currentColor"><path d="M6.53 9.47a.75.75 0 0 1 0 1.06l-2.72 2.72h1.018a.75.75 0 0 1 0 1.5H1.25v-3.579a.75.75 0 0 1 1.5 0v1.018l2.72-2.72a.75.75 0 0 1 1.06 0zm2.94-2.94a.75.75 0 0 1 0-1.06l2.72-2.72h-1.018a.75.75 0 1 1 0-1.5h3.578v3.579a.75.75 0 0 1-1.5 0V3.81l-2.72 2.72a.75.75 0 0 1-1.06 0z"></path></svg>
            </div>
            
            <LyricsOverlay 
                song={song} 
                progress={progress} 
                isOpen={showLyrics} 
                onClose={() => setShowLyrics(false)} 
            />
        </div>
    );
};

export default PlayerContent;
