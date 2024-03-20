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
            <div className="mt-8 ml-8 w-[450px] h-[350px] shadow-2xl rounded-lg border-2 border-black">
                <p className="pt-4 ml-3 text-sm font-medium leading-6 text-gray-900">Connected Accounts</p>
                <div className="ml-12 mt-10">
                    <Toggle image_url="/hubspot.svg" settings={true} />
                </div>
                <div className="ml-12 mt-16">
                    <Toggle image_url="/salesforce.svg" settings={true} />
                </div>
            </div>
        </div>
    );
}
