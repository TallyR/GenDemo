'use server';

import Link from 'next/link';
import { grabUserJobs } from '@/app/lib/actions';

function parseAndConvertDate(input) {
    // Split the input string by '@'
    const parts = input.split('@');

    // Extract the timestamp part and convert it to a number
    const timestamp = parseInt(parts[parts.length - 1]);

    // Create a new Date object using the timestamp
    const date = new Date(timestamp);

    // Extract individual date components
    const month = date.getMonth() + 1; // Month is zero-indexed, so add 1
    const day = date.getDate();
    const year = date.getFullYear();

    // Format the date as MM/DD/YYYY
    const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

    return formattedDate;
}

function extractStringBeforeLastAt(input) {
    // Find the index of the last occurrence of '@'
    const lastIndex = input.lastIndexOf('@');

    // Extract the substring before the last '@'
    const extractedString = input.substring(0, lastIndex);

    return extractedString;
}

export default async function ProspectTable() {

    //process job data from the backend
    const res = await grabUserJobs();
    const processedJobs = res.map(trav => {
        return {
            jobTitle: extractStringBeforeLastAt(trav.jobTitle),
            jobState: trav.status,
            jobDate: parseAndConvertDate(trav.jobTitle),
            jobKey: trav.jobTitle
        }
    })

    console.log(processedJobs);

    const jsxEntries = processedJobs.map(trav => {
        return (
            <tr className="border rounded-lg" key={trav.jobKey}>
                <th scope="row" className="px-6 py-4 font-medium">
                    {trav.jobTitle}
                </th>
                <td className="px-6 py-4">
                    {trav.jobDate}
                </td>
                <td className="px-6 py-4">
                    <Link
                        type="button"
                        href="/prospecting/aproov/view"
                        className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                    >
                        {trav.jobState}
                    </Link>
                </td>
            </tr>
        )
    })
    /*
        This could def live on the server
    */

    // const jsxTableEntries = jobData.map(jobData)
    return (
        <div className="min-w-full h-[500px] border-black-500/75 shadow-2xl rounded-lg border-2 border-black overflow-y-scroll">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black ">
                    <thead className="text-xs text-gray-700  dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-black">
                                Search name
                            </th>
                            <th scope="col" className="px-6 py-3 text-black">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-black">
                                View Results
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {jsxEntries}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
