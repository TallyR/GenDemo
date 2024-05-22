'use client';

import Link from 'next/link';
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

export default function ProspectTable({ jsxEntries, triggerModal }) {
    const [searchTerm, setSearchTerm] = useState('');
    jsxEntries = jsxEntries.filter(trav => {
        return isSubset(trav.sequenceName, searchTerm)
    })
    
    console.log("I HATE JAVASCRIPT")
    console.log(jsxEntries)
    var filteredJsxEntries = jsxEntries.map(trav => {
        return (
            <tr className="border rounded-lg" key={trav.sequenceName}>
                <td scope="row" className="w-1/2 px-5 py-2 font-medium">
                    <div className="pl-1">{trav.sequenceName}</div>
                </td>
                <td className="w-1/4 px-5 py-2">
                    <div className="pl-1">{trav.size}</div>
                </td>
                <td className="w-1/4 px-5 py-2">
                    <Link
                        type="button"
                        disabled={false}
                        href={{ pathname: "/aisequences/editsequence", query: { sequenceName: trav.sequenceName } }}
                        className="flex items-center justify-center rounded-md bg-indigo-600 px-6 py-2.5 w-1/2 text-sm text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Edit
                    </Link>
                </td>
            </tr>
        )
    })

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
                        placeholder="Find past sequences..."
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                <div className="flex flex-row-reverse pr-16 pl-20">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault()
                            triggerModal(true)
                        }}
                        className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-4 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        New Sequence
                    </button>
                </div>
            </div>
            <div className="pr-2">
                <div className="pl-16 pt-8 pr-16">
                    <div className="min-w-full max-h-80 border-black-500/75 shadow-m rounded-lg border-2 border-black overflow-y-scroll">
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black ">
                                <thead className="text-xs text-gray-700  dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-black">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-black">
                                            Length
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-black">
                                            Edit Steps
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