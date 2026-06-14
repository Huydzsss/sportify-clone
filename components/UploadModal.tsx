"use client"
import useUploadModal from "@/hooks/useUploadModal"
import uniqid from "uniqid"
import Modal from "./Modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal();
    const {user} = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
            lyrics: ''
        }
    })
    const onChange = (open: boolean) => {
        //Lam moi lai form
        reset();
        uploadModal.onClose();
    }
    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        //up len supabase data
        try{
            setIsLoading(true);
            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];
            if(!imageFile || !songFile || !user){
                toast.error("Missing fields!");
                return;
            }
            if (songFile.size > 10 * 1024 * 1024) {
                toast.error("Song file size must be less than 10MB!");
                return;
            }
            if (imageFile.size > 2 * 1024 * 1024) {
                toast.error("Image file size must be less than 2MB!");
                return;
            }
            const unqId = uniqid();
            //Tải lên các bài hát len database
            const {
                data:songData,
                error:songError

            } = await supabaseClient
            .storage
            .from("songs")
            .upload(`song-${values.title}-${unqId}`,songFile,{
                cacheControl:'3600',
                upsert:false
                
            });
            if(songError){
                setIsLoading(false);
                return toast.error("Failed song upload!")
            }
            //Tai anh len database
            const {
                data:imageData,
                error:imageError

            } = await supabaseClient
            .storage
            .from("images")
            .upload(`image-${values.title}-${unqId}`,imageFile,{
                cacheControl:'3600',
                upsert:false
                
            });
            if(imageError){
                setIsLoading(false);
                return toast.error("Failed image upload!")
            }
            const {
                error: supabaseError
            
            } = await supabaseClient
                            .from('songs')
                            .insert({
                                user_id:user.id,
                                title:values.title,
                                author:values.author,
                                image_path:imageData.path,
                                song_path:songData.path,
                                lyrics: values.lyrics || null
                            });
                if(supabaseError){
                    setIsLoading(false);
                    return toast.error(supabaseError.message);
                }
                router.refresh();
                setIsLoading(false);
                toast.success("Song created successfully!")
                uploadModal.onClose();
        }catch(error){
            toast.error("Something went wrong!");
        }finally{
            setIsLoading(false);
        }

    }
    return (
        <Modal
            title="Add a song"
            description="Upload an mp3 file"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form
                className="flex flex-col gap-y-4"
                onSubmit={handleSubmit(onSubmit)}

            >
                <Input
                    id="title"
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder="Song title"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder="Song author"
                />
                <div>
                    <div className="
                            pb-1

                            ">
                        Select song files
                        <Input
                            id="song"
                            type="file"
                            disabled={isLoading}
                            accept=".mp3"
                            {...register('song', { required: true })}
                        />
                    </div>
                    <div className="
                            pb-1

                            ">
                        Select a image
                        <Input
                            id="image"
                            type="file"
                            disabled={isLoading}
                            accept="image/*"
                            {...register('image', { required: true })}
                        />
                    </div>
                    <div className="pb-1 mt-2">
                        Song Lyrics (Optional, LRC Format)
                        <textarea
                            id="lyrics"
                            disabled={isLoading}
                            {...register('lyrics')}
                            placeholder="[00:15.00] Line 1..."
                            className="
                                flex w-full rounded-md bg-neutral-700
                                border border-transparent px-3 py-3 text-sm
                                focus:outline-none disabled:cursor-not-allowed
                                disabled:opacity-50 text-white placeholder:text-neutral-400
                                h-24 resize-y
                            "
                        />
                    </div>
                </div>
                <Button disabled={isLoading} type="submit">
                    Create
                </Button>
            </form>
        </Modal>
    )
}
export default UploadModal