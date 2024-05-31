'use server';

import Navbar from "@/app/ui/Navbar";
import ProspectTable from "@/app/ui/ProspectTable";
import { grabUserJobs } from '@/app/lib/actions';
import Link from 'next/link';

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


export default async function Prospecting() {
    var res = await grabUserJobs();
    console.log(res)
    if(!res) {
        res = [] //bad request
    }
    const reversed = res.reverse()

    const processedJobs = reversed.map(trav => {
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
                <th scope="row" className="px-5 py-2 font-medium">
                    {trav.jobTitle}
                </th>
                <td className="px-5 py-2">
                    {trav.jobDate}
                </td>
                <td className="px-6 py-2">
                    <button
                        type="button"
                        disabled={true}
                        className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm"
                    >
                        {trav.jobState}
                    </button>
                </td>
                <td className="px-6 py-2">
                    <Link
                        type="button"
                        href="/viewjobs"
                        className="whitespace-nowrap rounded-lg bg-indigo-600 px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        results
                    </Link>
                </td>
            </tr>
        )
    })

    return (
        <div className="min-w-full">
            <Navbar url="Email Jobs" />
            <ProspectTable jsxEntries={jsxEntries} />
        </div>
    );
}