'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useImmerReducer } from 'use-immer';
import { useState, useEffect, useRef } from 'react';
import ErrorModal from "@/app/ui/ErrorModal";
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';

const MEMORY_KEY_SUBJECT_LINE = "example_information_subject_line"
const MEMORY_KEY_TEMPLATE = "example_information_body"

function getCurrentUnixTimeMs() {
    return new Date().getTime(); // This returns the Unix timestamp in milliseconds
}

function hasMoreThan100MsPassed(currentTimeMs, pastTimeMs) {
    console.log("TIME!")
    console.log("most recent type -> " + pastTimeMs)
    console.log(currentTimeMs - pastTimeMs);
    return (currentTimeMs - pastTimeMs) > 2000;
}

function reducer(draft, action) {
    switch (action.type) {
        case 'update_template': {
            draft.template = action.template
            draft.pointerPos = action.pointerPos
            draft.active = 0
            break;
        }
        case 'update_first_name': {
            if (draft.active == 0) {
                draft.template = draft.template.slice(0, draft.pointerPos) + "{{first_name}}" + draft.template.slice(draft.pointerPos);
                //still need to update pos
            } else if (draft.active == 1) {
                draft.subjectLine = draft.subjectLine.slice(0, draft.subjectLinePointerPos) + "{{first_name}}" + draft.subjectLine.slice(draft.subjectLinePointerPos);
            }
            break;
        }
        case 'update_last_name': {
            if (draft.active == 0) {
                draft.template = draft.template.slice(0, draft.pointerPos) + "{{last_name}}" + draft.template.slice(draft.pointerPos);
            } else if (draft.active == 1) {
                draft.subjectLine = draft.subjectLine.slice(0, draft.subjectLinePointerPos) + "{{last_name}}" + draft.subjectLine.slice(draft.subjectLinePointerPos);
            }
            break;
        }
        case 'update_company_name': {
            if (draft.active == 0) {
                draft.template = draft.template.slice(0, draft.pointerPos) + "{{company_name}}" + draft.template.slice(draft.pointerPos);
            } else if (draft.active == 1) {
                draft.subjectLine = draft.subjectLine.slice(0, draft.subjectLinePointerPos) + "{{company_name}}" + draft.subjectLine.slice(draft.subjectLinePointerPos);
            }
            break;
        }
        case 'update_full_name': {
            if (draft.active == 0) {
                draft.template = draft.template.slice(0, draft.pointerPos) + "{{full_name}}" + draft.template.slice(draft.pointerPos);
            } else if (draft.active == 1) {
                draft.subjectLine = draft.subjectLine.slice(0, draft.subjectLinePointerPos) + "{{full_name}}" + draft.subjectLine.slice(draft.subjectLinePointerPos);
            }
            break;
        }
        case 'ai_reference': {
            if (draft.active == 0) {
                draft.template = draft.template.slice(0, draft.pointerPos) + "@ai_reference" + draft.template.slice(draft.pointerPos);
            } else if (draft.active == 1) {
                draft.subjectLine = draft.subjectLine.slice(0, draft.subjectLinePointerPos) + "@ai_reference" + draft.subjectLine.slice(draft.subjectLinePointerPos);
            }
            break;
        }
        case 'update_pointer_pos': {
            draft.pointerPos = action.pointerPos
            draft.active = 0
            break;
        }
        case 'update_line': {
            draft.subjectLine = action.subjectLine
            draft.subjectLinePointerPos = action.subjectLinePointerPos
            draft.active = 1
            break;
        }
        case 'update_line_pointer_pos': {
            draft.subjectLinePointerPos = action.pointerPos
            draft.active = 1
            break;
        }
        case 'update_step_name': {
            draft.stepName = action.nextStepName;
            break;
        }
    }
}

export default function AddStep() {

    const initialState = { template: "", pointerPos: 0, subjectLine: "", subjectLinePointerPos: 0, active: -1, stepName: "" }
    const [state, dispatch] = useImmerReducer(reducer, initialState)
    const searchGrab = useSearchParams()

    //these HAVE to be in order, then execute in order of each other
    useEffect(() => {
        var tempPointerPos = localStorage.getItem("pointer_pos");
        var tempSubjectLine = localStorage.getItem("subject_line")
        var tempTemplate = localStorage.getItem("template")
        var tempSubjectLinePointerPos = localStorage.getItem("subject_line_pos")
        var tempStepName = localStorage.getItem("step_name")
        if (tempSubjectLine) {
            dispatch({
                type: "update_line",
                subjectLine: tempSubjectLine,
                subjectLinePointerPos: tempSubjectLinePointerPos
            })
        }
        if (tempTemplate) {
            dispatch({
                type: "update_template",
                template: tempTemplate,
                pointerPos: tempPointerPos
            })
        }
        if (tempStepName) {
            dispatch({
                type: "update_step_name",
                nextStepName: tempStepName
            })
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("active", state.active !== undefined ? state.active : -1)
        localStorage.setItem("pointer_pos", state.pointerPos !== undefined ? state.pointerPos : 0)
        localStorage.setItem("subject_line", state.subjectLine !== undefined ? state.subjectLine : "")
        localStorage.setItem("template", state.template !== undefined ? state.template : "")
        localStorage.setItem("subject_line_pos", state.subjectLinePointerPos !== undefined ? state.tempSubjectLinePointerPos : 0)
        localStorage.setItem("step_name", state.stepName !== undefined ? state.stepName : "")
    }, [state])

    //error modal handling
    const [showErrorModal, setErrorModal] = useState(false)
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //calculating if edit step
    var editStep = false;
    if (searchGrab.get("editStep") === "true") {
        editStep = true
    }
    const router = useRouter();

    return (
        <div className="min-w-full">
            <Navbar url={`AI Sequences / Edit Sequence / ${!editStep ? "Add" : "Edit"} Step`} />
            <ErrorModal onExit={setErrorModal} showSelf={showErrorModal} errorTitle={errorTitle} errorMessage={errorMessage} />
            <div className="flex flex-row">
                <div className="shadow-m rounded-lg border-2 border-black mb-20 p-2 m-4 w-1/2">
                    <label htmlFor="comment" className="block text-sm font-medium leading-6 ml-2 text-gray-900 ">
                        Subject line
                    </label>
                    <div className="m-2">
                        <input
                            style={{ fontSize: '12px' }}
                            onClick={(e) => {
                                console.log("START STATE!")
                                e.preventDefault()
                                dispatch({
                                    type: "update_line_pointer_pos",
                                    pointerPos: e.target.selectionStart
                                })
                            }}
                            onChange={(e) => {
                                e.preventDefault();
                                dispatch({
                                    type: "update_line",
                                    subjectLine: e.target.value,
                                    subjectLinePointerPos: e.target.selectionStart
                                })
                            }}
                            value={state.subjectLine}
                            className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Hi ...."
                        />
                    </div>
                    <div className="m-2">
                        <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                            Template
                        </label>
                        <div>
                            <textarea
                                rows={15}
                                onClick={(e) => {
                                    e.preventDefault()
                                    dispatch({
                                        type: "update_pointer_pos",
                                        pointerPos: e.target.selectionStart
                                    })
                                }}
                                style={{ fontSize: '12px' }}
                                className="w-full mt-2 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={(e) => {
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
                            <button
                                type="button"
                                onClick={(e) => {
                                    const isTemplateValid = localStorage.getItem("template") != null && localStorage.getItem("template").includes("@ai_reference");
                                    const isSubjectLineValid = localStorage.getItem("subject_line") != null && localStorage.getItem("subject_line").includes("@ai_reference");
                                    const finalCondition = isTemplateValid || isSubjectLineValid;

                                    console.log('isTemplateValid:', isTemplateValid);
                                    console.log('isSubjectLineValid:', isSubjectLineValid);
                                    console.log('Final Condition:', finalCondition);

                                    if (state.subjectLine === "" || state.template === "" || state.stepName === "") {
                                        console.log("Prevent navigation due to empty fields");
                                        e.preventDefault();
                                        setErrorTitle('Not all fields have been filled out!');
                                        setErrorMessage(`Please make sure to fill out the "Subject line", "Template", and "Step name"`);
                                        setErrorModal(true);
                                        return;
                                    }

                                    localStorage.removeItem(MEMORY_KEY_SUBJECT_LINE);
                                    localStorage.removeItem(MEMORY_KEY_TEMPLATE);

                                    const editStep = searchGrab.get("editStep") === "null" ? false : searchGrab.get("editStep")
                                    const position = searchGrab.get("position") === "null" ? '' : searchGrab.get("position")

                                    // Prepare the URL and query parameters
                                    const targetUrl = finalCondition ? '/aisequences/editsequence/addstep/example' : '/aisequences/editsequence/addstep/testtemplate';
                                    const query = finalCondition ? { name: 'Example #1', editStep: editStep, position: position } : {editStep: editStep, position: position};

                                    console.log('Navigating to:', targetUrl);
                                    console.log('With query:', query);

                                    // Ensure targetUrl is a string and query is an object
                                    if (typeof targetUrl === 'string' && typeof query === 'object') {
                                        router.push(targetUrl + "?" + new URLSearchParams(query).toString());
                                    } else {
                                        console.error('Invalid URL or query parameters:', targetUrl, query);
                                    }
                                }}
                                className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Next
                            </button>
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
                                    dispatch({
                                        type: "update_step_name",
                                        nextStepName: e.target.value
                                    })
                                }}
                                //edited to be gray at the last
                                className={clsx((editStep)
                                    ? "block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-slate-200" :
                                    "block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                )}
                                placeholder="Introduction email"
                                value={state.stepName}
                                disabled={editStep}
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
                            ai linkedin reference
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
