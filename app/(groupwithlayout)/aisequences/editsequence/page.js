'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useReducer } from 'react';
import { useImmerReducer } from 'use-immer';
import { processSequences } from '@/app/lib/actions'
import { useFormState } from 'react-dom';
import ErrorModal from "@/app/ui/ErrorModal";
import { useEffect } from 'react';
import { useState } from 'react';
import { grabSequenceData, removeStep } from "@/app/lib/actions"
import { RingLoader } from "react-spinners"
import { useRouter, useSearchParams } from 'next/navigation';

const initialState = { sequenceName: "", subjectLine: "" }

function reducer(draft, action) {
    switch (action.type) {
        case 'update_sequence_name': {
            draft.sequenceName = action.nextSequenceName
            localStorage.setItem('sequence_name', action.nextSequenceName)
            break;
        }
        case 'update_subject_line': {
            draft.subjectLine = action.nextSubjectLine
            localStorage.setItem('subject_line', action.nextSubjectLine)
            break;
        }
        case 'update_first_name': {
            draft.subjectLine = draft.subjectLine + " {{first_name}}"
            break;
        }
        case 'update_last_name': {
            draft.subjectLine = draft.subjectLine + " {{last_name}}"
            break;
        }
        case 'update_company_name': {
            draft.subjectLine = draft.subjectLine + " {{company_name}}"
            break;
        }
        case 'update_full_name': {
            draft.subjectLine = draft.subjectLine + " {{full_name}}"
            break;
        }
    }
}


function extractStringBeforeLastAt(input) {
    // Find the index of the last occurrence of '@'
    const lastIndex = input.lastIndexOf('@');

    // Extract the substring before the last '@'
    const extractedString = input.substring(0, lastIndex);

    return extractedString;
}



function processSequenceSteps(stepsArray) {
    console.log("Print this:")
    console.log(stepsArray)
    return stepsArray.map((trav, index) => {
        return (
            <tr key={index+"KEYFORDAYS"}className="border rounded-lg">
                <td scope="row" className="w-1/2 px-3 py-3 font-small text">
                    <div className="pl-1">{trav.step_name}</div>
                </td>
                <td className="w-1/4 px-3 py-2">
                    <div className="pl-1">{0}</div>
                </td>
                <td className="w-1/4 px-3 py-2">
                    <div className="flex">
                        <Link
                            type="button"
                            href="/aisequences/editsequence"
                            className="ml-2 whitespace-nowrap rounded-lg bg-indigo-600 px-2 py-1 text-xs text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Edit
                        </Link>
                        <Link
                            type="button"
                            href="/aisequences/editsequence"
                            className="ml-2 whitespace-nowrap rounded-lg bg-red-600 px-2 py-1 text-xs text-white shadow-sm justify-center text-center hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            Remove
                        </Link>
                    </div>
                </td>
            </tr>
        )
    })
}


export default function NewSequence() {



    //probably will need to modify this (using a seprate reducer for this)
    const initialState = { parsedArray: null, error: null };
    const [stateForm, dispatchForm] = useFormState(processSequences, initialState);
    const [state, dispatch] = useImmerReducer(reducer, initialState)
    const [goal, setGoal] = useState('')
    const searchGrab = useSearchParams()


    console.log('here')
    console.log(stateForm)

    //this will eventually be grabbed from the backend
    const processedJobs = [
        { sequenceTitle: "Introduction", length: "1" },
        { sequenceTitle: "Follow-up", length: "2" },
        { sequenceTitle: "Testimonial", length: "3" },
        { sequenceTitle: "Call to action", length: "4" },
        { sequenceTitle: "2nd follow-up", length: "5" },
        { sequenceTitle: "Circling back", length: "6" },
        { sequenceTitle: "Brochure", length: "7" },
        { sequenceTitle: "Discount offer", length: "8" },
    ]

    console.log(processedJobs);

    //should probably move this to ProspectTable.js
    //  {trav.jobState}
    const jsxEntries = processedJobs.map(trav => {
        return (
            <tr className="border rounded-lg" key={trav.sequenceTitle}>
                <td scope="row" className="w-1/2 px-3 py-3 font-small text">
                    <div className="pl-1">{trav.sequenceTitle}</div>
                </td>
                <td className="w-1/4 px-3 py-2">
                    <div className="pl-1">{trav.length}</div>
                </td>
                <td className="w-1/4 px-3 py-2">
                    <div className="flex">
                        <Link
                            type="button"
                            href="/aisequences/editsequence"
                            className="ml-2 whitespace-nowrap rounded-lg bg-indigo-600 px-2 py-1 text-xs text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Edit
                        </Link>
                        <Link
                            type="button"
                            href="/aisequences/editsequence"
                            className="ml-2 whitespace-nowrap rounded-lg bg-red-600 px-2 py-1 text-xs text-white shadow-sm justify-center text-center hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            Remove
                        </Link>
                    </div>
                </td>
            </tr>
        )
    })

    //error checking
    const [showErrorModal, setErrorModal] = useState(false)
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successBadge, setSuccessBadge] = useState(false);

    useEffect(() => {
        console.log("ajsdklfjads")
        if (stateForm.error === 'NO_SEQUENCE_NAME') {
            console.log('sdfds')
            setErrorTitle("No sequence name")
            setErrorMessage("Please add a sequence name")
            setSuccessBadge(false)
            setErrorModal(true)
        }
        if (stateForm.error === 'NO_SUBJECT_LINE') {
            console.log('sdfds')
            setErrorTitle("No subject line")
            setErrorMessage("Please add a subject line")
            setSuccessBadge(false)
            setErrorModal(true)
        }
        if (stateForm.status === 'JUST_SAVED') {
            console.log('sdfds')
            setErrorTitle("Successfully saved!")
            setErrorMessage("")
            setSuccessBadge(true)
            setErrorModal(true)
        }
    }, [stateForm]);

    //for sequence name
    const [sequenceName, setSequenceName] = useState('')
    const [processSteps, setProcessedSteps] = useState([])
    const [processingRequest, setProcessRequest] = useState(true)

    const router = useRouter();

    useEffect(() => {
        const grab = localStorage.getItem('sequence_name')
        if (localStorage.getItem('sequence_name')) {
            setSequenceName(grab)
        }
        if (searchGrab.get('sequenceName') !== undefined) {
            localStorage.setItem('sequence_name', searchGrab.get('sequenceName'))
        }
        console.log("Grabbing")
        grabSequenceData(searchGrab.get('sequenceName')).then(e => {
            console.log(e)
            setSequenceName(e.sequenceName)
            console.log("steps:")
            console.log(e.steps)
            setProcessedSteps(e.steps)
            setProcessRequest(false)
            setGoal(e.goal)
        }).catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if (searchGrab.get('sequenceName') !== undefined) {
            localStorage.setItem('sequence_name', sequenceName)
        }
    }, [sequenceName])

    return (
        <div className="min-w-full" key="asjdfhsd">
            <Navbar url="AI Sequences / Edit Sequence" />
            <ErrorModal onExit={setErrorModal} showSelf={showErrorModal} errorTitle={errorTitle} errorMessage={errorMessage} success={successBadge} />
            {processingRequest ? <div className="m-24">
                <RingLoader size={150} />
            </div> :
                <div className="flex">
                    <form className="w-1/2" action={dispatchForm} key="unique">
                        <div className="mt-4 ml-4 w-full shadow-m rounded-lg border-2 border-black mb-20 p-2">
                            <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                Sequence name
                            </label>
                            <label className="text-lg font-semibold">
                                {extractStringBeforeLastAt(sequenceName)}
                            </label>
                            <label className="block text-sm font-medium text-gray-900 mb-2 mt-2">
                                Sequence Information
                            </label>
                            <div className="text-xs rounded-md border-0 p-2 max-h-36 bg-zinc-100 overflow-y-auto block ring-inset ring-gray-300">
                                {goal}
                            </div>
                            <div className="flex mt-2 items-center">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Sequence steps
                                </label>
                                <Link
                                    type="button"
                                    href={{
                                        pathname: "/aisequences/editsequence/addstep",
                                        query: { stepName: state.sequenceName },
                                    }}
                                    onClick={(e) => {
                                        localStorage.removeItem("example_information_body")
                                        localStorage.removeItem("example_information_subject_line")
                                        localStorage.removeItem("step_name")
                                        localStorage.removeItem("template")
                                        localStorage.removeItem("subject_line")

                                        //add the goal
                                        localStorage.setItem("goal", goal)
                                    }}
                                    className="ml-2 whitespace-nowrap rounded-lg bg-indigo-600 px-2 py-1 text-xs text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Add Step
                                </Link>
                            </div>
                            <div className="pt-2 pb-2">
                                <div className="min-w-full max-h-80 border-black-500/75 shadow-m rounded-lg border-2 overflow-y-scroll">
                                    <div className="relative overflow-x-auto">
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black ">
                                            <thead className="text-xs text-gray-700  dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-3 py-3 text-black">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="px-3 py-3 text-black">
                                                        Step #
                                                    </th>
                                                    <th scope="col" className="px-3 py-3 text-black"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {processSteps.map((trav, index) => {
                                                    return (
                                                        <tr className="border rounded-lg" key={trav.step_name}>
                                                            <td scope="row" className="w-1/2 px-3 py-3 font-small text">
                                                                <div className="pl-1">{trav.step_name}</div>
                                                            </td>
                                                            <td className="w-1/4 px-3 py-2">
                                                                <div className="pl-1">{index+1}</div>
                                                            </td>
                                                            <td className="w-1/4 px-3 py-2">
                                                                <div className="flex">
                                                                    <Link
                                                                        type="button"
                                                                        href={{ pathname: "/aisequences/editsequence/addstep", query: { editStep: true, position: index } }}
                                                                        onClick={(e) => {
                                                                            console.log("clicked")
                                                                            localStorage.setItem("template", trav.step_template)
                                                                            localStorage.setItem("step_name", trav.step_name)
                                                                            localStorage.setItem("subject_line", trav.step_subject_line)

                                                                            //add the goal
                                                                            localStorage.setItem("goal", goal)
                                                                        }}
                                                                        className="ml-2 whitespace-nowrap rounded-lg bg-indigo-600 px-2 py-1 text-xs text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <button
                                                                        type="button"
                                                                        onClick={async (e) => {
                                                                            await removeStep(searchGrab.get('sequenceName'), index)
                                                                            location.reload()
                                                                        }}
                                                                        className="ml-2 whitespace-nowrap rounded-lg bg-red-600 px-2 py-1 text-xs text-white shadow-sm justify-center text-center hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            }
        </div>
    );
}
