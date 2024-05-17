'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useImmerReducer } from 'use-immer';

function replacePlaceholdersWithJSX(text) {
    // Split the entire text by new lines to handle each line as a paragraph
    const lines = text.split('\n');

    // Process each line to replace placeholders and wrap in <p> tags
    const content = lines.map((line, lineIndex) => {
        // Split and replace placeholders within each line
        const parts = line.split(/({{first_name}}|{{last_name}}|{{company_name}}|{{full_name}}|@ai_reference)/); //change it to ai linkedin reference
        const lineContent = parts.map((part, index) => {
            switch (part) {
                case '{{first_name}}':
                    return <input key={`${lineIndex}-${index}`} placeholder="first name" type="text" style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                case '{{last_name}}':
                    return <input key={`${lineIndex}-${index}`} placeholder="last name" style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                case '{{company_name}}':
                    return <input key={`${lineIndex}-${index}`} placeholder="company name" style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                case '{{full_name}}':
                    return <input key={`${lineIndex}-${index}`} placeholder="full name" style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                case '@ai_reference':
                    return <input rows={1} key={`${lineIndex}-${index}`} placeholder="example linkedin reference" style={{ fontSize: '12px' }} className="w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                default:
                    return part; // Return the text as is
            }
        });

        // Wrap the processed line in a <p> tag
        return <p key={lineIndex}>{lineContent}<br></br></p>;
    });

    return content;
}

export default function Example({ searchParams }) {

    console.log(replacePlaceholdersWithJSX(searchParams.template))

    var process = replacePlaceholdersWithJSX(searchParams.template)

    return (
        <div className="min-w-full h-dvh">
            <Navbar url={"AI Sequences / New Sequence / Add Step / " + searchParams.name} />
            <div className="shadow-m rounded-lg border-2 p-4 border-black m-2">
                <label className="block text-m font-medium leading-6 text-gray-900">
                    Fill in {searchParams.name.toLowerCase()}
                </label>
                <div className="text-sm shadow-m rounded-lg border p-4 border-black m-2 h-1/2">
                    {process}
                </div>
                <div className="flex flex-row-reverse pt-2">
                    <Link
                        type="button"
                        href={{
                            pathname: searchParams.name !== 'Example #2' ? '/aisequences/newsequence/addstep/example' : '/aisequences/newsequence/addstep/testtemplate',
                            query: { name: 'Example #2', template: searchParams.template, stepName: searchParams.stepName},
                        }}
                        className="whitespace-nowrap rounded-lg bg-indigo-600 px-6 py-3 text-m text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Next
                    </Link>
                </div>
            </div>
        </div>
    );
}
