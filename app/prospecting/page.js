import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display } from '@/app/ui/fonts';
import { libre_caslon_display_bold } from '@/app/ui/fonts';
import Navbar from "@/app/ui/Navbar";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import ProspectTable from "@/app/ui/ProspectTable";

export default function Prospecting() {
    return (
        <div className="min-w-full">
            <Navbar url="Prospecting" />
            <div className="mb-20">
                <div className="pl-16 pt-8 pr-2 flex">
                    <div className="relative flex flex-1 flex-shrink-0">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <input
                            className="peer block w-full rounded-lg border border-black py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            placeholder="Find past searches..."
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    <div className="flex flex-row-reverse pr-16 pl-20">
                        <Link
                            type="button"
                            href="/prospecting/newsearch"
                            className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-4 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            New Search
                        </Link>
                    </div>
                </div>
                <div className="pr-2">
                    <div className="pl-16 pt-8 pr-16">
                        <ProspectTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
