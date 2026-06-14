import { Song } from "@/type";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"
import getSongs from "./getSongs";

export const getSongsByUserTitle = async (title:string): Promise<Song[]> => {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
        cookies: () => cookieStore
    });

   const { 
    data: sessionData,
    error: sessionError } = await supabase.auth.getSession();
    if(!title){
        const allSongs = await getSongs();
        return allSongs;
    }

    if (sessionError) {
        console.log(sessionError.message)
        return [];
    }
    

    const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${title}%`)
    .order('created_at', {ascending: false});

    if (error) {
        console.log(error.message)
    }
return (data as any || [])
}