import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display_bold } from '@/app/ui/fonts';

export default function Navbar({ url, button = false }) {
    return (
        <div className="min-w-full">
            <div className="h-40 min-w-screen border-b-4 grow border-b-black flex items-center whitespace-nowrap">
                <p className={`text-black font-bold text-3xl pl-6 ${libre_caslon_display_bold.className}`}>
                    {url}
                </p>
                {
                    button &&
                    <div className="w-full flex flex-row-reverse pr-6">
                        <button
                            type="button"
                            className="border-2 w-40 border-black rounded-md bg-indigo-600 px-8 py-4 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {button.title}
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}
