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

export default function NewSequence({ searchParams }) {

    //probably will need to modify this (using a seprate reducer for this)
    const initialState = { parsedArray: null, error: null };
    const [stateForm, dispatchForm] = useFormState(processSequences, initialState);
    const [state, dispatch] = useImmerReducer(reducer, initialState)

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
                            href="/aisequences/newsequence"
                            className="ml-2 whitespace-nowrap rounded-lg bg-indigo-600 px-2 py-1 text-xs text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Edit
                        </Link>
                        <Link
                            type="button"
                            href="/aisequences/newsequence"
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
    useEffect(() => {
        const grab = localStorage.getItem('sequence_name')
        if (localStorage.getItem('sequence_name')) {
            setSequenceName(grab)
        }
        console.log(searchParams.sequenceName)
        if (searchParams.sequenceName !== undefined) {
            localStorage.setItem('sequence_name', searchParams.sequenceName)
        }
    }, [])
    useEffect(() => {
        if (searchParams.sequenceName !== undefined) {
            localStorage.setItem('sequence_name', sequenceName)
        }
    }, [sequenceName])

    return (
        <div className="min-w-full" key="asjdfhsd">
            <Navbar url="AI Sequences / New Sequence" />
            <ErrorModal onExit={setErrorModal} showSelf={showErrorModal} errorTitle={errorTitle} errorMessage={errorMessage} success={successBadge} />
            <div className="flex">
                <form className="w-1/2" action={dispatchForm} key="unique">
                    <div className="mt-4 ml-4 w-full shadow-m rounded-lg border-2 border-black mb-20 p-2">
                        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            Sequence name
                        </label>
                        <label className="text-lg pl-1 font-semibold">
                            {searchParams.sequenceName}
                        </label>

                        <div className="flex mt-2 items-center">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Sequence steps
                            </label>
                            <Link
                                type="button"
                                href={{
                                    pathname: "/aisequences/newsequence/addstep",
                                    query: { stepName: state.sequenceName },
                                }}
                                className="ml-2 whitespace-nowrap rounded-lg bg-indigo-600 px-2 py-1 text-xs text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Add Step
                            </Link>
                        </div>

                        <div className="pt-2">
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
                                            {jsxEntries}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="justify-end items-end flex">
                            <button
                                href="/aisequences/newsequence"
                                type="submit"
                                className="mt-4 ml-2 whitespace-nowrap rounded-lg bg-indigo-600 px-7 py-3 text-sm text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
