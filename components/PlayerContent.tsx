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
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} onClick={() => {}} />
                    <LikeButton songId={song.id} />
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="flex items-center gap-x-6">
                    <AiFillStepBackward onClick={onPlayPrevious} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" />
                    <div onClick={handlePlay} className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer">
                        <Icon size={30} className="text-black" />
                    </div>
                    <AiFillStepForward onClick={onPlayNext} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" />
                    <BsRepeat
                        size={30}
                        onClick={toggleLoop}
                        className={`cursor-pointer transition ${isLooping ? "text-white" : "text-neutral-400"}`}
                    />
                    <TbMicrophone2 
                        size={30} 
                        onClick={() => setShowLyrics(true)} 
                        className="cursor-pointer transition text-neutral-400 hover:text-white" 
                    />
                </div>

                {/* Thanh tiến trình phát nhạc */}
                <input
                    type="range"
                    min={0}
                    max={duration}
                    value={progress}
                    onChange={(e) => handleSeekChange(Number(e.target.value))}
                    className="w-full mt-2"
                />
                {/* Thời gian hiện tại và tổng thời lượng */}
                <div className="flex justify-between w-full text-sm text-gray-400 mt-1 ">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon size={34} onClick={toggleMute} className="cursor-pointer" />
                    <Slider value={volume} onChange={(value) => setVolume(value)} />
                </div>
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
