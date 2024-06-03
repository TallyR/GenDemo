'use client'

import Navbar from "@/app/ui/Navbar";
import { processFile } from '@/app/lib/actions'
import { useFormState } from 'react-dom';
import Link from "next/link";
import TableView from '@/app/ui/TableView';
import { useState } from 'react';
import { testWrite } from '@/app/lib/actions';
import clsx from 'clsx';
import ErrorModal from "@/app/ui/ErrorModal";
import { useEffect } from 'react';
import LoadingModal from '@/app/ui/LoadingModal'

function extractStringBeforeLastAt(input) {
    if (input === undefined) {
        return
    }
    // Find the index of the last occurrence of '@'
    const lastIndex = input.lastIndexOf('@');
    if (lastIndex === -1) {
        return input
    }
    // Extract the substring before the last '@'
    const extractedString = input.substring(0, lastIndex);
    return extractedString;
}

export default function AIMailMerge({ data }) {
    const initialState = { parsedArray: null, error: null };
    const [state, dispatch] = useFormState(processFile, initialState);
    const [jobTitle, setTitleState] = useState('')
    const [submitting, setSubmit] = useState(false);
    const [buttonMessage, setButtonMessage] = useState('Submit')
    const [jsxEntries, setEntries] = useState([{ name: "Loading" }])
    const [loading, setLoading] = useState(false)
    const [chosenSequence, setChosenSequence] = useState('No sequences created')
    //error modal handling
    const [showErrorModal, setErrorModal] = useState(false)
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    //set initializations and data
    useEffect(() => {
        if (data.length !== 0) {
            setEntries(data);
            setChosenSequence(data[0].sequenceName);
        } else {
            console.log("EMPTY");
            setEntries([{ sequenceName: 'No sequences created', size: 0 }]);
            setChosenSequence('No sequences created');
        }
    }, [data]);
    //initialization
    useEffect(() => {
        if (state.error === 'no_email_connected') {
            setErrorTitle('No email linked')
            setErrorMessage("Please navigate to the 'Link Account' tab and connect your email account before starting a mail merge.")
            setErrorModal(true)
            setButtonMessage('Submit')
        } else if (state.error === 'no_file_upload') {
            //console.log('no file upload!!!!!')
            setErrorTitle('No file')
            setErrorMessage("Please upload a .csv file")
            setErrorModal(true)
            setButtonMessage('Submit')
        } else if (state.error === 'not_csv_or_no_columns') {
            //console.log('bad file upload!!!!!')
            setErrorTitle('Bad File')
            setErrorMessage("Requires a .csv file with columns titled 'Email' and 'Person Linkedin Url'.")
            setErrorModal(true)
            setButtonMessage('Submit')
        } else if (state.error === "too_many_entries") {
            setErrorTitle('Too large')
            setErrorMessage("Due to concerns about email reputation safety, email sequences must not exceed 200 entries.")
            setErrorModal(true)
            setButtonMessage('Submit')
        } else if (state.error === "no_sequence_created") {
            setErrorTitle('No email sequences created')
            setErrorMessage(`You haven't created any email sequences yet, please visit the "AI Sequences" tab`)
            setErrorModal(true)
            setButtonMessage('Submit')
        } else if (state.error === "file_failed_parse") {
            setErrorTitle('Bad CSV File')
            setErrorMessage(`There is something wrong with your CSV file`)
            setErrorModal(true)
            setButtonMessage('Submit')
        }
    }, [state]);
    // Function to reset the state
    const handleReset = (e) => {
        e.preventDefault(); // Prevent form submission or any default action
        dispatch({ type: 'RESET', payload: initialState }); // Assuming your processFile reducer can handle a RESET action
        setButtonMessage('Submit')
    };
    // Function to submit job to database for processing, marked as started
    function submitToDatabase() {
        var timestamp = new Date().getTime();
        setSubmit(true);
        testWrite({ jobDataArray: state.parsedArray, jobTitle: jobTitle + "@" + timestamp, status: 'started', sequenceName: chosenSequence })
    }
    var list = jsxEntries.map(e => {
        console.log(e.sequenceName)
        return <option key={e.sequenceName} value={e.sequenceName}>{extractStringBeforeLastAt(e.sequenceName)}</option>
    })
    if (state.parsedArray === null) {
        return (
            <div className="min-w-full min-h-full">
                <ErrorModal onExit={setErrorModal} showSelf={showErrorModal} errorTitle={errorTitle} errorMessage={errorMessage} />
                <LoadingModal showSelf={loading} />
                <div className="flex">
                    <div className="mt-8 ml-8 w-[400px] shadow-2xl rounded-lg border-2 border-black mb-20">
                        <div className="w-full pt-4 justify-center items-center">
                            <form action={dispatch} onSubmit={() => {
                                setButtonMessage('Loading...')
                            }} key="unique">
                                <p className="ml-4 mb-2 font-semibold">Upload CSV File</p>
                                <input type="file" name="file" className="mb-3 ml-4" id="file" onChange={(e) => console.log(e)} />
                                {/*If user doesn't have an AI sequence, make them choose one with the button!*/}
                                {true &&
                                    <p className="ml-4 mb-2 font-semibold">Choose your email sequence</p>
                                }
                                {true &&
                                    <select
                                        id="sequence"
                                        name="sequence"
                                        onChange={e => setChosenSequence(e.target.value)}
                                        className="mt-2 ml-4 mr-4 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    >
                                        {
                                            list
                                        }
                                    </select>
                                }
                                <button type="submit" disabled={buttonMessage === 'Loading...'} className={clsx(
                                    (buttonMessage !== 'Loading...') ? "ml-4 mb-4 mt-4 flex justify-center w-40 rounded-md bg-indigo-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" : "ml-4 mt-4 mb-4 flex justify-center w-40 rounded-md bg-gray-600 px-2 py-1 text-sm text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                )}>
                                    {buttonMessage}
                                </button>
                            </form>
                        </div>
                    </div>
                    <Link
                        href="/aisequences"
                        className="m-8 rounded-lg max-h-[50px] bg-green-600 px-4 py-4 text-sm text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 flex items-center justify-center"
                    >
                        Create email sequences
                    </Link>
                </div>

            </div>
        )
    } else {
        // a table to show the user parsed data -> then can submit the job to the back-end (fill out job name and stuff)
        // needs to have a back button to reset state and reupload file
        return (
            <div className="min-w-full h-full">
                <div className="pt-8 pl-8 pr-96">
                    <div className="min-w-full h-full border-2 border-black-500/75 shadow-xl rounded-lg pl-8 pr-8 mb-8 border-black">
                        <div className="sm:col-span-4 pt-6">
                            <label htmlFor="email" className="text-lg font-medium leading-6 text-gray-900">
                                Using "{extractStringBeforeLastAt(chosenSequence)}" sequence
                            </label>
                            <div className="mt-2 mb-2">

                            </div>
                            <label htmlFor="email" className="text-sm font-medium leading-6 text-gray-900">
                                Name your mail merge
                            </label>
                            <div className="mt-1 mb-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setTitleState(e.target.value)}
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <label htmlFor="email" className="text-sm mb-4 font-medium leading-6 text-gray-900">
                            Your data
                        </label>
                        <div className="mt-1"><TableView Linkedinandemails={state.parsedArray}></TableView></div>
                        <div className="mt-3 mb-3 flex grow flex-row-reverse">
                            <button
                                onClick={submitToDatabase}
                                disabled={jobTitle === '' || submitting}
                                className={clsx(
                                    (jobTitle !== '' && !submitting) ? 'rounded-md px-16 py-3 text-sm border border-black text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-indigo-600 hover:bg-indigo-500' : 'rounded-md px-16 py-3 text-sm border border-black text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-gray-500'
                                )}
                            >
                                {submitting ? 'Loading...' : 'Submit'}
                            </button>
                            <button
                                onClick={handleReset}
                                href="/newmailmerge"
                                className="rounded-md  bg-red-500 mr-2 px-16 py-3 text-sm border border-black text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}