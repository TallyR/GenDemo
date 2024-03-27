import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display } from '@/app/ui/fonts';
import { libre_caslon_display_bold } from '@/app/ui/fonts';
import Navbar from "@/app/ui/Navbar";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import ProspectTable from "@/app/ui/ProspectTable";
import Toggle from "@/app/ui/Toggle";

export default function Prospecting() {
    return (
        <div className="min-w-full">
            <Navbar url="Settings" />
            <p className="mt-3 ml-3 font-semibold leading-6 text-gray-900">Your current Prompt</p>
        </div>
    );
}
