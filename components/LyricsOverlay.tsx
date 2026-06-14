"use client";

import { Song } from "@/type";
import { useEffect, useState, useRef } from "react";
import { IoClose } from "react-icons/io5";

interface LyricLine {
  time: number;
  text: string;
}

function parseLrc(lrcString: string): LyricLine[] {
  const lines = lrcString.split('\n');
  const result: LyricLine[] = [];
  // Regex matches [MM:SS.xx] or [MM:SS.xxx]
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  
  for (const line of lines) {
    const match = timeReg.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = parseInt(match[3]);
      const time = min * 60 + sec + (ms.toString().length === 2 ? ms / 100 : ms / 1000);
      const text = line.replace(timeReg, '').trim();
      if (text) {
        result.push({ time, text });
      }
    }
  }
  return result;
}

interface LyricsOverlayProps {
  song: Song;
  progress: number;
  isOpen: boolean;
  onClose: () => void;
}

const LyricsOverlay: React.FC<LyricsOverlayProps> = ({ song, progress, isOpen, onClose }) => {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (song.lyrics) {
      setLyrics(parseLrc(song.lyrics));
    } else {
      setLyrics([]);
    }
  }, [song.lyrics]);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeLine = activeLineRef.current;
      
      const scrollPosition = activeLine.offsetTop - (container.clientHeight / 2) + (activeLine.clientHeight / 2);
      
      container.scrollTo({
        top: scrollPosition,
        behavior: "smooth"
      });
    }
  }, [progress, lyrics]);

  if (!isOpen) return null;

  // Find current active line index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (progress >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-900/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition text-white"
      >
        <IoClose size={30} />
      </button>

      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{song.title}</h2>
        <p className="text-xl text-neutral-400">{song.author}</p>
      </div>

      <div 
        ref={containerRef}
        className="w-full max-w-2xl h-[50vh] overflow-y-auto hide-scrollbar px-4 flex flex-col items-center space-y-6 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {lyrics.length > 0 ? (
          lyrics.map((line, index) => {
            const isActive = index === activeIndex;
            const isPassed = index < activeIndex;
            
            return (
              <p
                key={index}
                ref={isActive ? activeLineRef : null}
                className={`
                  text-2xl md:text-4xl text-center font-bold transition-all duration-500
                  ${isActive ? 'text-green-500 scale-110 drop-shadow-md' : ''}
                  ${isPassed ? 'text-neutral-500' : ''}
                  ${!isActive && !isPassed ? 'text-neutral-300' : ''}
                `}
              >
                {line.text}
              </p>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-2xl text-neutral-500 font-medium text-center">
            Looks like we don't have lyrics for this song yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsOverlay;
