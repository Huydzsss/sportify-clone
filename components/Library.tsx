"use client"
import useAuthModal from "@/hooks/useAuthModal"
import useUploadModal from "@/hooks/useUploadModal"
import { useUser } from "@/hooks/useUser"
import { Song } from "@/type"
import { AiOutlinePlus } from "react-icons/ai"
import { TbPlaylist } from "react-icons/tb"
import MediaItem from "./MediaItem"
import useOnPlay from "@/hooks/useOnPlay"

interface LibraryProps{
    songs:Song[];
}

const Library:React.FC<LibraryProps> = ({songs}) =>{
    const authModal = useAuthModal();
    const {user,subscription} = useUser();
    const upLoadModal = useUploadModal();
    const onClick = () => {
        //Upload tại đây
        if(!user){
            return authModal.onOpen();
        }
        //todo:kiểm tra Subscription
        return upLoadModal.onOpen();
    }
    const onPlay = useOnPlay(songs);
    console.log(songs)
    return(
        <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center pt-2 pb-4 gap-y-4">
                <div className="group flex flex-col items-center gap-y-1 cursor-pointer hover:text-white text-neutral-400 transition">
                    <TbPlaylist size={28}/>
                    <p className="text-[10px] font-medium">Thư viện</p>
                </div>
                <AiOutlinePlus
                    onClick={onClick}
                    size={20}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
            </div>
            <div className="flex flex-col gap-y-4 mt-4 px-1 items-center">
                {songs.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => onPlay(item.id)}
                        className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden cursor-pointer hover:opacity-75 transition"
                    >
                        {/* We use an img tag or next/image. Since useLoadImage is a hook, we can just use MediaItem but we'd need to modify MediaItem to hide text if possible. Let's just pass an extra prop or create a wrapper. Actually, using MediaItem in a narrow container will hide the text with `truncate` but it will take space. Let's create a custom icon block here. But we need `imageUrl`. We should extract a small component inside Library or just keep MediaItem but add a custom class. */}
                        <MediaItem
                            onClick={(id:string) => onPlay(id)}
                            key={item.id}
                            data={item}
                            isIconOnly={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Library