import Link from "next/link";
import { IconType } from "react-icons"
import { twMerge } from "tailwind-merge";

interface SidebarProps {
    icon: IconType;
    label: string;
    active?: Boolean;
    href: string;
}

const SidebarItem: React.FC<SidebarProps> = ({
    icon:Icon,
    label,
    active,
    href
}) => {
    return (
        <Link href={href} className={twMerge('flex flex-col h-auto items-center justify-center w-full gap-y-1 text-xs font-medium cursor-pointer hover:text-white transition text-neutral-400 py-2',
            active && "text-white"
        )}>
            <Icon size={28}/>
            <p className="truncate text-[10px]">{label}</p>
        </Link>
    )
}
export default SidebarItem