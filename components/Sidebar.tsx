"use client";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import { Song } from "@/type";
import { twMerge } from "tailwind-merge";
import Player from "./Player";
import usePlayer from "@/hooks/userPlayer";
import RightSidebar from "./RightSidebar";

// Định nghĩa giao diện `SidebarProps` với một prop `children` có kiểu là `ReactNode`
interface SidebarProps {
    children: ReactNode; // Đây là nơi chứa các thành phần con sẽ được render trong Sidebar
    songs:Song[];
}

// Định nghĩa component `Sidebar` kiểu `React.FC` với prop là `SidebarProps`
const Sidebar: React.FC<SidebarProps> = ({ children,songs }) => {
    // Sử dụng `usePathname` để lấy đường dẫn hiện tại
    const pathname = usePathname();
    const player = usePlayer();
    // Sử dụng `useMemo` để tạo danh sách các route
    const routes = useMemo(() => [
        {
            icon: HiHome,
            label: 'Home',
            active: pathname !== '/search',
            href: '/'
        },
        {
            icon: BiSearch,
            label: 'Search',
            active: pathname === '/search',
            href: '/search'
        }
    ], [pathname]);

    return (
        <div className={twMerge(`
        flex
        h-full
        bg-black
        p-2
        gap-x-2
        `,player.activeId && "h-[calc(100% - 80px)]")}>
            {/* Collapsed Left Sidebar */}
            <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[72px]">
                <Box>
                    <div className="flex flex-col gap-y-4 py-4 items-center">
                        {routes.map((item) => (
                            <SidebarItem 
                                key={item.label}
                                {...item}
                            />
                        ))}
                    </div>
                </Box>
                <Box className="overflow-y-auto h-full flex flex-col items-center py-4">
                   <Library songs={songs}/>
                </Box>
            </div>
            
            {/* Main Content */}
            <main className="h-full flex-1 overflow-y-auto bg-neutral-900 rounded-lg">
                {children}
            </main>

            {/* Right Sidebar (AIZO) */}
            <RightSidebar />
        </div>
    ); // Kết thúc câu lệnh `return`
}

// Xuất component `Sidebar` để sử dụng ở nơi khác trong ứng dụng
export default Sidebar;
