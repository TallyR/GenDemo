'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';

/*
    Plan for dynamic state: 
        //just starts at 1000
        1. generate specific id
        2. on click function -> takes baked in id and uses it to update state
        3. that state is just a dictionary, this will naturally update as edits change
        4. save the state variable to memory => that will just be inline with the template that is saved and can be rebuilt on the back-end

    Problem -> subsequence runs can causes issues?
    Solution -> we pass in state that associate with each field????

    Key format
    example # - fixed number - pos (collison can happen still? :/)
        ^ this will help with rebuild on the backend

    If you keep on the backend
        -> subjectLine array 
        -> body array
*/

export default function Example({ searchParams }) {

    const [sLine, setSLine] = useState({})
    const [body, setBody] = useState({})
    const [process, setProcess] = useState('')
    const [stepName, setStepName] = useState('')
    const [subjectLine, setSubjectLine] = useState('')

    function replacePlaceholdersWithJSX(text, setObj, exampleNumber, body, numb) {
        var startPoint = -1;
        const lines = text.split('\n');
        const content = lines.map((line, lineIndex) => {
            // Split and replace placeholders within each line
            const parts = line.split(/({{first_name}}|{{last_name}}|{{company_name}}|{{full_name}}|@ai_reference)/); //change it to ai linkedin reference
            const lineContent = parts.map((part, index) => {
                var passRef = ""
                switch (part) {
                    case '{{first_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input key={`${exampleNumber}-${numb}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`] || ''} placeholder="first name" type="text" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '{{last_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input key={`${exampleNumber}-${numb}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`] || ''} placeholder="last name" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '{{company_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input key={`${exampleNumber}-${numb}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`] || ''} placeholder="company name" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '{{full_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input key={`${exampleNumber}-${numb}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`] || ''} placeholder="full name" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '@ai_reference':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input rows={1} key={`${exampleNumber}-${numb}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`] || ''} placeholder="example linkedin reference" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    default:
                        return part; // Return the text as is
                }
            });

            // Wrap the processed line in a <p> tag
            return <p className="m-1" key={lineIndex}>{lineContent}</p>;
        });
        return content;
    }

    useEffect(() => {
        var exampleNumber = 0;
        if (searchParams.name === 'Example #1') {
            exampleNumber = 0;
        } else if (searchParams.name === 'Example #2') {
            exampleNumber = 1;
        }
        var prevBody = localStorage.getItem('example_information_body') ? JSON.parse(localStorage.getItem('example_information_body')) : {}
        localStorage.setItem('example_information_body', JSON.stringify({ ...prevBody, ...body }))
        setProcess(replacePlaceholdersWithJSX(localStorage.getItem("template"), setBody, exampleNumber, body, 12))
        var prevSubjectLine = localStorage.getItem('example_information_subject_line') ? JSON.parse(localStorage.getItem('example_information_subject_line')) : {}
        localStorage.setItem('example_information_subject_line', JSON.stringify({ ...prevSubjectLine, ...sLine}))
        setSubjectLine(replacePlaceholdersWithJSX(localStorage.getItem("subject_line"), setSLine, exampleNumber, sLine, 13))

        console.log("Body status:")
        console.log(localStorage.getItem('example_information_body'))
        console.log("Subject line status:")
        console.log(localStorage.getItem('example_information_subject_line'))
    }, [body, sLine])

    useEffect(() => {
        setBody(JSON.parse(localStorage.getItem('example_information_body')))
        setSLine(JSON.parse(localStorage.getItem('example_information_subject_line')))
        setStepName(localStorage.getItem("step_name"))
    }, [searchParams.name]);

    return (
        <div className="min-w-full h-dvh" key={`${searchParams.name} main_app`}>
            <Navbar url={"AI Sequences / Edit Sequence / Add Step / " + searchParams.name} />
            <div className="shadow-m rounded-lg border-2 p-4 border-black m-2">
                <label className="block text-m leading-6 text-gray-900">
                    Fill in a "{stepName}" example to teach Tally
                </label>
                <label className="block text-sm font-semibold m-2 text-gray-900">
                    Subject line
                </label>
                <div className="text-sm shadow-m rounded-lg border p-4 border-black m-2 h-1/2" key={`${searchParams.name} subject_line`}>
                    {subjectLine}
                </div>
                <label className="block text-sm ml-2 font-semibold mt-4 text-gray-900">
                    Body
                </label>
                <div className="text-sm shadow-m rounded-lg border p-4 border-black m-2 h-1/2" key={searchParams.name}>
                    {process}
                </div>
                <div className="flex flex-row-reverse pt-2">
                    <Link
                        type="button"
                        href={{
                            pathname: searchParams.name !== 'Example #2' ? '/aisequences/editsequence/addstep/example' : '/aisequences/editsequence/addstep/testtemplate',
                            query: { name: 'Example #2' },
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
