"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import qs from "query-string";


interface HeaderProps{
    children:React.ReactNode;
    className?: string
}

const Header:React.FC<HeaderProps> = ({children,className}) =>{
    const authModal = useAuthModal();
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabaseClient = useSupabaseClient();
    const { user, userDetails } = useUser();
    const avatarUrl = userDetails?.avatar_url || user?.user_metadata?.avatar_url;
    const fullName = userDetails?.full_name || user?.user_metadata?.full_name || "User";
    
    const [searchValue, setSearchValue] = useState<string>("");
    // const [activeTab, setActiveTab] = useState<'all' | 'music' | 'podcast'>('all');
    const activeTab = searchParams.get('category') || 'all';

    const handleTabClick = (category: string) => {
        if (category === 'all') {
            router.push('/');
        } else {
            const url = qs.stringifyUrl({
                url: '/',
                query: { category }
            });
            router.push(url);
        }
    };

    const debouncedSearch = useDebounce<string>(searchValue, 500);

    useEffect(() => {
        if (debouncedSearch !== "") {
            const query = { title: debouncedSearch };
            const url = qs.stringifyUrl({
                url: '/search',
                query: query
            });
            router.push(url);
        }
    }, [debouncedSearch, router]);

    const handleLogOut = async() =>{
        const {error} = await supabaseClient.auth.signOut();
        router.refresh();
        if(error){
            toast.error(error.message);
        }else{
          toast.success("Logout susscess")
        }
    }
    console.log(user);
    return(
        <div className={twMerge(`h-fit bg-gradient-to-b from-neutral-900 p-6`, className)}>
            <div className="w-full mb-4 flex items-center justify-between">
                {/* Left Navigation */}
                <div className="hidden md:flex gap-x-2 items-center">
                    <button onClick={() => router.back()} className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
                        <RxCaretLeft className="text-white" size={35} />
                    </button>
                    <button onClick={() => router.forward()} className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
                        <RxCaretRight className="text-white" size={35} />
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex md:hidden gap-x-2 items-center">
                    <button onClick={() => router.push('/')} className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
                        <HiHome className="text-black" size={20} />
                    </button>
                    <button onClick={() => router.push('/search')} className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
                        <BiSearch className="text-black" size={20} />
                    </button>
                </div>

                {/* Center Search Bar */}
                <div className="hidden md:flex flex-1 max-w-[500px] items-center bg-neutral-800 rounded-full px-4 py-2 mx-4 group hover:bg-neutral-700 transition border border-transparent hover:border-neutral-500">
                    <BiSearch className="text-neutral-400 group-hover:text-white" size={24} />
                    <input 
                        type="text" 
                        placeholder="Bạn muốn phát nội dung gì?" 
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="bg-transparent text-white placeholder-neutral-400 focus:outline-none w-full ml-2"
                        onClick={() => {
                            if (searchValue === "") {
                                router.push('/search')
                            }
                        }}
                    />
                </div>

                {/* Right Profile & Actions */}
                <div className="flex items-center gap-x-4">
                    {user ? (
                        <div className="flex gap-x-4 items-center">
                            <Button onClick={handleLogOut} className="bg-transparent text-neutral-300 px-6 py-2">
                                Logout
                            </Button>
                            <Button onClick={() => router.push('/account')} className="bg-black border border-neutral-700 w-10 h-10 p-0 flex items-center justify-center rounded-full">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <FaUserAlt className="text-neutral-400" /> 
                                )}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <Button onClick={authModal.onOpen} className="bg-transparent text-neutral-300 font-medium">
                                    Sign Up
                                </Button>
                            </div>
                            <div>
                                <Button onClick={authModal.onOpen} className="bg-white px-6 py-2">
                                    Log in
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex gap-x-2 mb-4">
                <button 
                    onClick={() => handleTabClick('all')}
                    className={twMerge("px-4 py-1.5 rounded-full text-sm font-medium transition", activeTab === 'all' ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700")}
                >
                    Tất cả
                </button>
                <button 
                    onClick={() => handleTabClick('music')}
                    className={twMerge("px-4 py-1.5 rounded-full text-sm font-medium transition", activeTab === 'music' ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700")}
                >
                    Nhạc
                </button>
                <button 
                    onClick={() => handleTabClick('podcast')}
                    className={twMerge("px-4 py-1.5 rounded-full text-sm font-medium transition", activeTab === 'podcast' ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700")}
                >
                    Podcast
                </button>
            </div>

            {children}
        </div>
        
    )
}
export default Header