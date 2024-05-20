'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useImmerReducer } from 'use-immer';
import { useState } from 'react';
import { useEffect } from 'react';
//import { JSDOM } from 'jsdom';
import JSXParser from 'jsx-parser'
import React from 'react';
import { useRouter } from 'next/navigation'

function extractInputValuesFromJSX(element) {
    let values = [];

    // Function to recursively traverse the React element tree
    function traverse(node) {
        // React.Children provides utilities for dealing with children in React elements
        React.Children.forEach(node.props.children, (child) => {
            if (React.isValidElement(child)) {
                if (child.type === 'input') {
                    // Collect input values or placeholders
                    const value = child.props.value || child.props.placeholder || '';
                    //console.log(JSXParser(element))
                    if (value) values.push(value);
                } else if (child.props && child.props.children) {
                    // Recurse if the child has its own children
                    traverse(child);
                }
            }
        });
    }

    if (React.isValidElement(element) && element.props.children) {
        traverse(element);
    }

    return values;
}

function getUniqueRandom() {
    const min = 1;
    const max = 100000000; // Very high number to reduce the chance of collisions
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    example # - random number - pos (collison can happen still? :/)
        ^ this will help with rebuild on the backend

    If you keep on the backend
        -> subjectLine array 
        -> body array
*/

export default function Example({ searchParams }) {

    const router = useRouter();
    const [process, setProcess] = useState('')
    const [stepName, setStepName] = useState('')
    const [subjectLine, setSubjectLine] = useState('')

    //for input fields
    const [sLine, setSLine] = useState({})
    const [body, setBody] = useState({})
    //const [exampleNumber, setExampleNumber] = useState(0)

    //var exampleNumber = -1;


    function replacePlaceholdersWithJSX(text, setObj, exampleNumber) {
        var startPoint = -1;
        //console.log('start point: ')
        //console.log(startPoint)
        // Split the entire text by new lines to handle each line as a paragraph
        const lines = text.split('\n');

       

        // Process each line to replace placeholders and wrap in <p> tags
        console.log("Start")
        const content = lines.map((line, lineIndex) => {
            // Split and replace placeholders within each line
            const parts = line.split(/({{first_name}}|{{last_name}}|{{company_name}}|{{full_name}}|@ai_reference)/); //change it to ai linkedin reference
            const lineContent = parts.map((part, index) => {
                const rand = (getUniqueRandom())
                var passRef = ""
                switch (part) {
                    case '{{first_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input key={`${exampleNumber}-${rand}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`]} placeholder="first name" type="text" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '{{last_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input key={`${exampleNumber}-${rand}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`]} placeholder="last name" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '{{company_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input key={`${exampleNumber}-${rand}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`]} placeholder="company name" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '{{full_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input key={`${exampleNumber}-${rand}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`]} placeholder="full name" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '@ai_reference':
                        startPoint += 1;
                        passRef = String(startPoint)
                        return <input rows={1} key={`${exampleNumber}-${rand}-${startPoint}`} value={body[`${exampleNumber}-${passRef}`]} placeholder="example linkedin reference" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    default:
                        return part; // Return the text as is
                }
            });

            // Wrap the processed line in a <p> tag
            const rand = (getUniqueRandom())
            return <p className="m-1" key={rand}>{lineContent}</p>;
        });

        return content;
    }

    //TESTING PURPOSES
    useEffect(() => {
        console.log("Body")
        console.log(body)
    }, [body])
    useEffect(() => {
        console.log("Subject line")
        console.log(sLine)
    }, [sLine])
    //TESTING PURPOSES

    useEffect(() => {
        var exampleNumber = 0;
        if (searchParams.name === 'Example #1') {
            exampleNumber = 0;
        } else if (searchParams.name === 'Example #2') {
            exampleNumber = 1;
        }
        setProcess(prevState => replacePlaceholdersWithJSX(localStorage.getItem("template"), setBody, exampleNumber))
        setStepName(localStorage.getItem("step_name"))
        setSubjectLine(prevState => replacePlaceholdersWithJSX(localStorage.getItem("subject_line"), setSLine, exampleNumber))
    }, [router.pathname, router.query, searchParams.name]);

    return (
        <div className="min-w-full h-dvh" key={`${searchParams.name} main_app`}>
            <Navbar url={"AI Sequences / New Sequence / Add Step / " + searchParams.name} />
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
                            pathname: searchParams.name !== 'Example #2' ? '/aisequences/newsequence/addstep/example' : '/aisequences/newsequence/addstep/testtemplate',
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
