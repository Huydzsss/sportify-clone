"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/userPlayer";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { BiPlusCircle } from "react-icons/bi";

import { useState, useEffect } from "react";

const RightSidebar = () => {
    const player = usePlayer();
    const { song } = useGetSongById(player.activeId);
    const imageUrl = useLoadImage(song!);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (player.activeId) {
            setIsOpen(true);
        }
    }, [player.activeId]);

    if (!song || !player.activeId || !isOpen) {
        return null;
    }

    return (
        <div className="hidden lg:flex flex-col bg-black h-full w-[350px] p-4 rounded-lg ml-2 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-lg">AIZO</h2>
                <div className="flex gap-x-2 text-neutral-400">
                    <AiOutlineClose 
                        size={20} 
                        className="cursor-pointer hover:text-white" 
                        onClick={() => setIsOpen(false)}
                    />
                </div>
            </div>

            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                <Image
                    fill
                    src={imageUrl || '/images/liked.png'}
                    alt="Album Artwork"
                    className="object-cover"
                />
            </div>

            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                    <h1 className="text-white font-bold text-2xl truncate">{song.title}</h1>
                    <p className="text-neutral-400 text-sm truncate">{song.author}</p>
                </div>
                <div className="flex gap-x-3 text-neutral-400 pt-1">
                    <BiPlusCircle size={24} className="cursor-pointer hover:text-white" />
                </div>
            </div>

            <div className="bg-neutral-800/50 p-4 rounded-lg flex flex-col gap-y-2 relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <Image 
                    fill 
                    src={imageUrl || '/images/liked.png'} 
                    alt="Artist Background" 
                    className="object-cover opacity-50 transition-transform group-hover:scale-105"
                />
                <div className="relative z-20">
                    <p className="text-white font-bold text-sm mb-1">Giới thiệu về nghệ sĩ</p>
                    <p className="text-neutral-300 font-semibold text-lg">{song.author}</p>
                    <p className="text-neutral-400 text-xs mt-8">Đang cập nhật tiểu sử...</p>
                </div>
            </div>
        </div>
    );
}

export default RightSidebar;
