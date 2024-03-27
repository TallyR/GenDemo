import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display } from '@/app/ui/fonts';
import { libre_caslon_display_bold } from '@/app/ui/fonts';
import Navbar from "@/app/ui/Navbar";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import ProspectTable from "@/app/ui/ProspectTable";
import Toggle from "@/app/ui/Toggle";

export default function CustomPrompt() {
    return (
        <div className="min-w-full">
            <Navbar url="Your Custom Prompt" />
            <div className="w-full flex m-6">
                <a
                    type="button"
                    href="/viewcustomprompt"
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-center border-2 w-40 border-black rounded-md bg-indigo-600 px-8 py-4 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    View Prompt
                </a>
            </div>
        </div>
    );
}
