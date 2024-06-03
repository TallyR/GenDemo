'use client';

import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { extractStringBeforeLastAt } from '@/app/lib/random'

function isSubset(str1, str2) {
    // Convert strings to lowercase for case-insensitive comparison
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    // Check if str1 contains str2 as a continuous subset
    return str1.includes(str2);
}

export default function JobsStatusTable({ processedJobs }) {
    const [searchTerm, setSearchTerm] = useState('');
    
    var filteredJsxEntries = processedJobs.map(trav => {
        if (isSubset(trav.personName, searchTerm) || isSubset(trav.company, searchTerm) || isSubset(trav.sequence, searchTerm) || isSubset(trav.stage, searchTerm) || isSubset(trav.lastContacted, searchTerm)) {
            return (
                <tr className="border rounded-lg" key={trav.personName + trav.linkedin}>
                    <th className="px-5 py-2 font-medium">
                        {trav.personName}
                    </th>
                    <td className="px-5 py-2">
                        {trav.company}
                    </td>
                    <td className="px-5 py-2">
                        {extractStringBeforeLastAt(trav.sequence)}
                    </td>
                    <td className="px-5 py-2">
                        {trav.stage}
                    </td>
                    <td className="px-5 py-2">
                        {trav.lastContacted}
                    </td>
                    <td className="px-5 py-2">
                        <Link className={trav.personName !== "Bad Data" && trav.personName !== "Bad-Data" ? "text-blue-700" : "text-red-500"} href={trav.linkedin} rel="noopener noreferrer" target="_blank">
                            {trav.linkedin}
                        </Link>
                    </td>
                </tr>
            )
        }
        return null;
    });

    return (
        <div className="mb-4">
            <div className="pl-16 pt-8 pr-2 flex">
                <div className="relative flex flex-1 flex-shrink-0 pr-16">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <input
                        className="peer block w-full rounded-lg border border-black py-[15px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        onChange={(e) => {
                            console.log(e)
                            setSearchTerm(e.target.value)
                        }}
                        value={searchTerm}
                        placeholder="Search for a person, a company etc."
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
            </div>
            <div className="pr-2">
                <div className="pl-16 pt-8 pr-16 pb-20">
                    <div className="min-w-full max-h-[450px] border-black-500/75 shadow-m rounded-lg border-2 border-black overflow-y-scroll">
                        <div className="relative overflow-x-auto">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-xs text-left rtl:text-right text-gray-500 dark:text-black">
                                    <thead className="text-xs text-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-black">Prospect Name</th>
                                            <th scope="col" className="px-6 py-3 text-black">Company</th>
                                            <th scope="col" className="px-6 py-3 text-black">Sequence</th>
                                            <th scope="col" className="px-6 py-3 text-black">Stage</th>
                                            <th scope="col" className="px-6 py-3 text-black">Last Contacted</th>
                                            <th scope="col" className="px-6 py-3 text-black">LinkedIn</th>
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
        </div>
    );
}
