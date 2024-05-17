'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useReducer } from 'react';
import { useImmerReducer } from 'use-immer';

const initialState = { sequenceName: "", subjectLine: "" }

function reducer(draft, action) {
    switch (action.type) {
        case 'update_sequence_name': {
            draft.sequenceName = action.nextSequenceName
            break;
        }
        case 'update_subject_line': {
            draft.subjectLine = action.nextSubjectLine
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

export default function NewSequence() {

    const [state, dispatch] = useImmerReducer(reducer, initialState)

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

    return (
        <div className="min-w-full">
            <Navbar url="AI Sequences / New Sequence" />
            <div className="flex">
                <div className="mt-4 ml-4 w-1/2 shadow-m rounded-lg border-2 border-black mb-20 p-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Sequence name
                    </label>
                    <div className="mt-2">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={state.sequenceName}
                            onChange={(e) => {
                                dispatch({
                                    type: "update_sequence_name",
                                    nextSequenceName: e.target.value
                                })
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder=""
                        />
                    </div>

                    <label className="block text-sm font-medium leading-6 text-gray-900 pt-4">
                        Subject line
                    </label>
                    <div className="mt-2">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={state.subjectLine}
                            onChange={(e) => {
                                e.preventDefault();
                                dispatch({
                                    type: "update_subject_line",
                                    nextSubjectLine: e.target.value
                                })
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder=""
                        />
                    </div>

                    <div className="flex mt-5 items-center">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Sequence Steps
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
                        <Link
                            type="button"
                            href="/aisequences/newsequence"
                            className="mt-4 ml-2 whitespace-nowrap rounded-lg bg-indigo-600 px-7 py-3 text-sm text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Save
                        </Link>
                    </div>
                </div>

                <div className="mt-4 ml-8 shadow-m rounded-lg border-2 border-black mb-20 p-2 flex max-h-[300px] flex-col items-start">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Insert variables
                    </label>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({
                                type: "update_first_name",
                            })
                        }}
                        type="button"
                        className="mt-4 whitespace-nowrap rounded-lg bg-green-600 px-3 py-3 text-xs text-white shadow-sm justify-center text-center hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        first name
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({
                                type: "update_last_name",
                            })
                        }}
                        type="button"
                        className="mt-4 whitespace-nowrap rounded-lg bg-green-600 px-3 py-3 text-xs text-white shadow-sm justify-center text-center hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        last name
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({
                                type: "update_company_name",
                            })
                        }}
                        type="button"
                        className="mt-4 whitespace-nowrap rounded-lg bg-green-600 px-3 py-3 text-xs text-white shadow-sm justify-center text-center hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        company name
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({
                                type: "update_full_name",
                            })
                        }}
                        type="button"
                        className="mt-4 whitespace-nowrap rounded-lg bg-green-600 px-3 py-3 text-xs text-white shadow-sm justify-center text-center hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        full name
                    </button>
                </div>
            </div>
        </div>
    );
}
