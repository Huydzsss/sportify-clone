import { Song } from "@/type";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"
import getSongs from "./getSongs";
import { useUser } from "@/hooks/useUser";

export const getLikedSongs = async (): Promise<Song[]> => {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
        cookies: () => cookieStore
    });
   const {data:{session}} = await supabase.auth.getSession();

    const { data, error } = await supabase
    .from('liked_songs')
    .select('*,songs(*)')
    .eq('user_id',session?.user?.id)
    .order('created_at', {ascending: false});

    if (error) {
        console.log(error.message)
    }
    if(!data){
        return []
    }
    return data.map((item) => ({
        ...item.songs
    }));
    
}