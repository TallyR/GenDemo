'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';
import ErrorModal from "@/app/ui/ErrorModal";

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

const TEMPLATE_CONSTANT = 12
const SUBJECT_LINE_CONSTANT = 13
const MEMORY_KEY_SUBJECT_LINE = "example_information_subject_line"
const MEMORY_KEY_TEMPLATE = "example_information_body"

function grabVal(exampleNumber, passRef, subOrTemp) {
    var retVal = ''
    if (subOrTemp === SUBJECT_LINE_CONSTANT) {
        retVal = JSON.parse(localStorage.getItem(MEMORY_KEY_SUBJECT_LINE))[`${exampleNumber}-${passRef}`]
    } else if (subOrTemp === TEMPLATE_CONSTANT) {
        retVal = JSON.parse(localStorage.getItem(MEMORY_KEY_TEMPLATE))[`${exampleNumber}-${passRef}`]
    }
    return retVal === undefined ? '' : retVal
}

function hasEmptyStringValue(obj, targetKeys, exampleNumber) {
    var keyCount = 0;
    for (let key in obj) {
        //only checks on specific example
        if (key.startsWith(exampleNumber)) {
            keyCount++;
            if (obj.hasOwnProperty(key) && obj[key] === '') {
                return true;
            }
        }
    }

    //user may have back tracked, so a multiple is valid too!
    if (targetKeys !== keyCount) {
        return true;
    }

    if(exampleNumber == 0) {
        return false;
    } else {
        //check all previous examples are filled too!
        return hasEmptyStringValue(obj, targetKeys, exampleNumber-1)
    }
}

//object to keep track of fields
var trackOfFields = { template: 0, subjectLine: 0 }

export default function Example({ searchParams }) {
    //calculating if edit step
    var editStep = false;
    if (searchParams.editStep === "true") {
        editStep = true
    }
    const [sLine, setSLine] = useState({})
    const [body, setBody] = useState({})
    const [process, setProcess] = useState('')
    const [stepName, setStepName] = useState('')
    const [subjectLine, setSubjectLine] = useState('')
    //error modal handling
    const [showErrorModal, setErrorModal] = useState(false)
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    function replacePlaceholdersWithJSX(text, setObj, exampleNumber, body, numb) {
        if (numb === SUBJECT_LINE_CONSTANT) {
            trackOfFields.subjectLine = 0
        } else if (numb === TEMPLATE_CONSTANT) {
            trackOfFields.template = 0
        }
        var startPoint = -1;
        var startState = {}
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
                        //keeping track of values
                        if (numb === SUBJECT_LINE_CONSTANT) {
                            trackOfFields.subjectLine += 1;
                        } else if (numb === TEMPLATE_CONSTANT) {
                            trackOfFields.template += 1;
                        }
                        startState[`${exampleNumber}-${passRef}`] = grabVal(exampleNumber, passRef, numb)
                        return <input key={`${exampleNumber}-${numb}-${startPoint}`} defaultValue={body[`${exampleNumber}-${passRef}`] || ''} placeholder="first name" type="text" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '{{last_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        //keeping track of values
                        if (numb === SUBJECT_LINE_CONSTANT) {
                            trackOfFields.subjectLine += 1;
                        } else if (numb === TEMPLATE_CONSTANT) {
                            trackOfFields.template += 1;
                        }
                        return <input key={`${exampleNumber}-${numb}-${startPoint}`} defaultValue={body[`${exampleNumber}-${passRef}`] || ''} placeholder="last name" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '{{company_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        //keeping track of values
                        if (numb === SUBJECT_LINE_CONSTANT) {
                            trackOfFields.subjectLine += 1;
                        } else if (numb === TEMPLATE_CONSTANT) {
                            trackOfFields.template += 1;
                        }
                        return <input key={`${exampleNumber}-${numb}-${startPoint}`} defaultValue={body[`${exampleNumber}-${passRef}`] || ''} placeholder="company name" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '{{full_name}}':
                        startPoint += 1;
                        passRef = String(startPoint)
                        //keeping track of values
                        if (numb === SUBJECT_LINE_CONSTANT) {
                            trackOfFields.subjectLine += 1;
                        } else if (numb === TEMPLATE_CONSTANT) {
                            trackOfFields.template += 1;
                        }
                        return <input key={`${exampleNumber}-${numb}-${startPoint}`} defaultValue={body[`${exampleNumber}-${passRef}`] || ''} placeholder="full name" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    case '@ai_reference':
                        startPoint += 1;
                        passRef = String(startPoint)
                        //keeping track of values
                        if (numb === SUBJECT_LINE_CONSTANT) {
                            trackOfFields.subjectLine += 1;
                        } else if (numb === TEMPLATE_CONSTANT) {
                            trackOfFields.template += 1;
                        }
                        return <input rows={1} key={`${exampleNumber}-${numb}-${startPoint}`} defaultValue={body[`${exampleNumber}-${passRef}`] || ''} placeholder="example linkedin reference" onChange={(e) => {
                            setObj(prevBody => {
                                return { ...prevBody, [`${exampleNumber}-${passRef}`]: e.target.value };
                            })
                        }} style={{ fontSize: '12px' }} className="w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />;
                    default:
                        return part; // Return the text as is
                }
            });

            // Wrap the processed line in a <p> tag
            if(lineContent == '') {
              return <br key={lineIndex}/>
            }
            return <p key={lineIndex}>{lineContent}</p>;
        });
        //init memory
        if (numb === TEMPLATE_CONSTANT) {
            console.log("START STATE!")
            console.log(startState)
            //localStorage.setItem(MEMORY_KEY_TEMPLATE, JSON.stringify(startState))
        } else if (numb === SUBJECT_LINE_CONSTANT) {
            console.log("START STATE!")
            console.log(startState)
            //localStorage.setItem(MEMORY_KEY_SUBJECT_LINE, JSON.stringify(startState)) 
        }
        return content;
    }
    useEffect(() => {
        var exampleNumber = 0;
        if (searchParams.name === 'Example #1') {
            exampleNumber = 0;
        } else if (searchParams.name === 'Example #2') {
            exampleNumber = 1;
        }
        var prevBody = localStorage.getItem(MEMORY_KEY_TEMPLATE) ? JSON.parse(localStorage.getItem(MEMORY_KEY_TEMPLATE)) : {}
        localStorage.setItem(MEMORY_KEY_TEMPLATE, JSON.stringify({ ...prevBody, ...body }))
        setProcess(replacePlaceholdersWithJSX(localStorage.getItem("template"), setBody, exampleNumber, body, 12))
        var prevSubjectLine = localStorage.getItem(MEMORY_KEY_SUBJECT_LINE) ? JSON.parse(localStorage.getItem(MEMORY_KEY_SUBJECT_LINE)) : {}
        localStorage.setItem(MEMORY_KEY_SUBJECT_LINE, JSON.stringify({ ...prevSubjectLine, ...sLine }))
        setSubjectLine(replacePlaceholdersWithJSX(localStorage.getItem("subject_line"), setSLine, exampleNumber, sLine, 13))

        console.log("Body status:")
        console.log(localStorage.getItem(MEMORY_KEY_TEMPLATE))
        console.log("Subject line status:")
        console.log(localStorage.getItem(MEMORY_KEY_SUBJECT_LINE))
    }, [body, sLine])

    useEffect(() => {
        trackOfFields = { template: 0, subjectLine: 0 }
        setBody(JSON.parse(localStorage.getItem(MEMORY_KEY_TEMPLATE)))
        setSLine(JSON.parse(localStorage.getItem(MEMORY_KEY_SUBJECT_LINE)))
        setStepName(localStorage.getItem("step_name"))
    }, [searchParams.name]);

    return (
        <div className="min-w-full h-dvh" key={`${searchParams.name} main_app`}>
            <Navbar url={`AI Sequences / Edit Sequence / ${!editStep ? "Add" : "Edit"} Step / ${searchParams.name}`} />
            <ErrorModal onExit={setErrorModal} showSelf={showErrorModal} errorTitle={errorTitle} errorMessage={errorMessage} />
            <div className="shadow-m rounded-lg border-2 p-4 border-black m-2">
                <label className="block text-m leading-6 text-gray-900">
                    Fill in a "{stepName}" example to teach Tally
                </label>
                <label className="block text-sm font-semibold m-2 text-gray-900">
                    Subject line
                </label>
                <div className="text-xs shadow-m rounded-lg border p-4 border-black m-2 h-1/2" key={`${searchParams.name} subject_line`}>
                    {subjectLine}
                </div>
                <label className="block text-sm ml-2 font-semibold mt-4 text-gray-900">
                    Body
                </label>
                <div className="text-xs shadow-m max-h-[350px] rounded-lg border p-4 border-black m-2 h-1/2 overflow-y-auto" key={searchParams.name}>
                    {process}
                </div>
                <div className="flex flex-row-reverse pt-2">
                    <Link
                        type="button"
                        href={{
                            pathname: searchParams.name !== 'Example #2' ? '/aisequences/editsequence/addstep/example' : '/aisequences/editsequence/addstep/testtemplate',
                            query: { name: 'Example #2', editStep: searchParams.editStep, position: searchParams.position },
                        }}
                        onClick={(e) => {
                            var subFields = JSON.parse(localStorage.getItem(MEMORY_KEY_SUBJECT_LINE));
                            var bodyFields = JSON.parse(localStorage.getItem(MEMORY_KEY_TEMPLATE));
                            var exampleNumber = 0;
                            if (searchParams.name === 'Example #1') {
                                exampleNumber = 0;
                            } else if (searchParams.name === 'Example #2') {
                                exampleNumber = 1;
                            }
                            //e.preventDefault()
                            //console.log(localStorage.getItem("subject_line")) 
                            console.log("Subject line targeted fields " + trackOfFields.subjectLine)
                            console.log("here")
                            var test1 = hasEmptyStringValue(subFields, trackOfFields.subjectLine, exampleNumber)
                            console.log("here")
                            console.log("Template targeted fields " + trackOfFields.template)
                            var test2 = hasEmptyStringValue(bodyFields, trackOfFields.template, exampleNumber)
                            console.log(test1)
                            console.log(test2)
                            console.log(false || false)
                            if (hasEmptyStringValue(subFields, trackOfFields.subjectLine, exampleNumber) === true || hasEmptyStringValue(bodyFields, trackOfFields.template, exampleNumber) === true) {
                                e.preventDefault();
                                console.log("Not all fields are full!")
                                setErrorTitle("Not all fields completed")
                                setErrorMessage("Please fill in all blanks, Tally is trying to learn how you write :)")
                                setErrorModal(true)
                            }
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
