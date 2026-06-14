import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/type"
import Image from "next/image";

interface MediaItemProps{
    data:Song;
    onClick?:(id:string) => void;
    isIconOnly?: boolean;
}

const MediaItem:React.FC<MediaItemProps> = ({data,onClick, isIconOnly}) => {
    const imageUrl = useLoadImage(data);
    const handleClick = () => {
        if(onClick){
            return onClick(data.id);
        }

    }
    return(
        <div
        onClick={handleClick}
        className="
        flex
        items-center
        gap-x-3
        cursor-pointer
        hover:bg-neutral-800/50
        w-full
        p-2
        rounded-md

        "
        >
            <div className="
            relative
            rounded-md
            min-h-[48px]
            min-w-[48px]
            overflow-hidden
            

            ">
                <Image
                fill
                src={imageUrl || 'images/liked.png'}
                alt="Media item"
                className="
                object-cover
                "
                />
            </div>
            {!isIconOnly && (
                <div className="
                flex
                flex-col
                gap-y-1
                overflow-hidden
                ">
                    <p
                    className="
                    font-semibold
                    text-white
                    truncate

                    "
                    >{data.title}</p>
                    <p className="truncate text-neutral-400">
                        {data.author}
                    </p>
                </div>
            )}
        </div>
    )
}
export default MediaItem