import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display_bold } from '@/app/ui/fonts';

export default function Navbar({ url, button = false }) {
    return (
        <div className="min-w-full">
            <div className="h-[150px] min-w-screen border-b-4 grow border-b-black flex items-center">
                <p className={`text-black font-bold text-3xl pl-6 ${libre_caslon_display_bold.className}`}>
                    {url}
                </p>
                <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Button text
                </button>
            </div>
        </div>
    );
}
