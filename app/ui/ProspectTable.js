'use client';

//import Link from 'next/link';
import { grabUserJobs } from '@/app/lib/actions';

import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display } from '@/app/ui/fonts';
import { libre_caslon_display_bold } from '@/app/ui/fonts';
import Navbar from "@/app/ui/Navbar";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useState } from 'react';

function isSubset(str1, str2) {
    // Convert strings to lowercase for case-insensitive comparison
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    for (let i = 0; i < str2.length; i++) {
        if (str1.indexOf(str2[i]) === -1) {
            // If any character of str2 is not found in str1, return false
            return false;
        }
    }
    // If all characters of str2 are found in str1, return true
    return true;
}

export default function ProspectTable({ jsxEntries }) {

    const [searchTerm, setSearchTerm] = useState('');
    var filteredJsxEntries = jsxEntries.filter(trav => {
        return isSubset(trav.key, searchTerm)
    })

    /*
        This could def live on the server
    */

    // const jsxTableEntries = jobData.map(jobData)
    return (
        <div className="mb-4">
            <div className="pl-16 pt-8 pr-2 flex">
                <div className="relative flex flex-1 flex-shrink-0">
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <input
                        className="peer block w-full rounded-lg border border-black py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        onChange={(e) => {
                            console.log(e.target.value)
                            setSearchTerm(e.target.value)}}
                        value={searchTerm}
                        placeholder="Find past searches..."
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                <div className="flex flex-row-reverse pr-16 pl-20">
                    <Link
                        type="button"
                        href="/newmailmerge"
                        className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-4 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        New Email Merge
                    </Link>
                </div>
            </div>
            <div className="pr-2">
                <div className="pl-16 pt-8 pr-16">
                    <div className="min-w-full max-h-[450px] border-black-500/75 shadow-m rounded-lg border-2 border-black overflow-y-scroll">
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black ">
                                <thead className="text-xs text-gray-700  dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-black">
                                            Job name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-black">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-black">
                                            Current Progress
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-black">
                                            View Results
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredJsxEntries}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}