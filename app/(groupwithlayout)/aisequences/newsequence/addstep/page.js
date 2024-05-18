'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useImmerReducer } from 'use-immer';
import { useState } from 'react';

const initialState = { template: "", pointerPos: 0 }

function reducer(draft, action) {
    switch (action.type) {
        case 'update_template': {
            draft.template = action.template
            draft.pointerPos = action.pointerPos
            //console.log("pointer pos: " + action.template.length)
            break;
        }
        case 'update_first_name': {
            draft.template = draft.template.slice(0, draft.pointerPos) + "{{first_name}}" + draft.template.slice(draft.pointerPos);
            break;
        }
        case 'update_last_name': {
            draft.template = draft.template.slice(0, draft.pointerPos) + "{{last_name}}" + draft.template.slice(draft.pointerPos);
            break;
        }
        case 'update_company_name': {
            draft.template = draft.template.slice(0, draft.pointerPos) + "{{company_name}}" + draft.template.slice(draft.pointerPos);
            break;
        }
        case 'update_full_name': {
            draft.template = draft.template.slice(0, draft.pointerPos) + "{{full_name}}" + draft.template.slice(draft.pointerPos);
            break;
        }
        case 'ai_reference': {
            draft.template = draft.template.slice(0, draft.pointerPos) + "@ai_reference" + draft.template.slice(draft.pointerPos);
            break;
        }
        case 'update_pointer_pos': {
            draft.pointerPos = action.pointerPos
            console.log("pointer pos: " + action.pointerPos)
            break;
        }
    }
}

export default function AddStep({ searchParams }) {

    const [state, dispatch] = useImmerReducer(reducer, initialState)
    const [stepName, setStepName] = useState('')

    console.log(searchParams.stepName)


    return (
        <div className="min-w-full">
            <Navbar url="AI Sequences / New Sequence / Add Step" />
            <div className="flex flex-row">
                <div className="shadow-m rounded-lg border-2 border-black mb-20 p-2 m-4 w-1/2">
                    <div className="m-2">
                        <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                            Template
                        </label>
                        <div>
                            <textarea
                                rows={20}
                                onClick={(e) => {
                                    e.preventDefault()
                                    dispatch({
                                        type: "update_pointer_pos",
                                        pointerPos: e.target.selectionStart
                                    })
                                }}
                                className="w-full mt-2 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={(e) => {
                                    e.preventDefault();
                                    dispatch({
                                        type: "update_template",
                                        template: e.target.value,
                                        pointerPos: e.target.selectionStart
                                    })
                                }}
                                value={state.template}
                            />
                        </div>
                        <div className="flex flex-row-reverse pt-2">
                            <Link
                                type="button"
                                href={{
                                    pathname: '/aisequences/newsequence/addstep/example',
                                    query: { name: 'Example #1', template: state.template, stepName: searchParams.stepName },
                                }}
                                onClick={(e) => {
                                    //can prevent default to make it not submit to the next page
                                    localStorage.setItem("step_name", stepName)
                                    localStorage.setItem('template', state.template)
                                }}
                                className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Next
                            </Link>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mt-4 ml-8 shadow-m rounded-lg border-2 border-black p-2 flex flex-col items-start w-full">
                        <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900 ">
                            Step name
                        </label>
                        <div className="mt-2 w-full">
                            <input
                                style={{ fontSize: '12px' }}
                                onChange={(e) => {
                                    e.preventDefault(); 
                                    setStepName(e.target.value)
                                }}
                                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Introduction email"
                            />
                        </div>
                    </div>
                    <div className="mt-4 ml-8 shadow-m rounded-lg border-2 border-black p-2 flex flex-col items-start h-1/2">
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
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch({
                                    type: "ai_reference",
                                })
                            }}
                            type="button"
                            className="mt-4 whitespace-nowrap rounded-lg bg-green-600 px-3 py-3 text-xs text-white shadow-sm justify-center text-center hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        >
                            ai reference
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
