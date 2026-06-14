import { Song } from "@/type";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (category?: string):Promise<Song[]> =>{
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
        cookies: () => cookieStore
    })
    
    let query = supabase
        .from('songs')
        .select('*')
        .order('created_at',{ascending:false});
        
    if (category && category !== 'all') {
        query = query.eq('category', category);
    }
    
    const {data,error} = await query;
    if(error){
        console.log(error);
    }
    return data as any || [];
}
export default getSongs;