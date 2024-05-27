'use client';

import Navbar from "@/app/ui/Navbar";
import { useState, useEffect } from 'react';
import { saveStep } from '@/app/lib/actions'
import { testEmail } from '@/app/lib/teststep'
import { RingLoader } from "react-spinners"
import ErrorModal from "@/app/ui/ErrorModal.js"
import LoadingModal from "@/app/ui/LoadingModal.js"

function wrapTextWithParagraphs(text) {
    // Normalize the text to handle back-to-back newlines by replacing them with a placeholder newline plus double space
    const normalizedText = text.replace(/\n\n/g, '\n  \n');

    // Split the normalized text into an array of lines based on newlines
    const lines = normalizedText.split('\n');

    // Regular expression to match URLs, excluding .ai unless prefixed by http, https, or www
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.(?!ai\b)[a-z]{2,}(?:\/[^\s]*)?)/gi;

    // Map each line into a paragraph; if the line is empty (representing back-to-back newlines), add an extra space
    const wrappedText = lines.map((line, index) => {
        if (line === '  ') { // Check for the double space which indicates original consecutive newlines
            return <p key={index}>&nbsp;</p>; // Insert an HTML entity for space to ensure the space is visible
        }

        // Replace URLs with anchor tags
        const lineWithLinks = line.split(urlRegex).map((part, i) => {
            if (urlRegex.test(part)) {
                const href = part.startsWith('www.') ? `http://${part}` : (part.startsWith('http') ? part : `https://${part}`);
                return (
                    <a key={`${index}-${i}`} href={href} target="_blank" style={{ color: 'blue' }}>
                        {part}
                    </a>
                );
            }
            return part;
        });

        return <p key={index}>{lineWithLinks}</p>;
    });

    // Return the entire array of paragraphs wrapped in a single containing paragraph (if needed) or a fragment/div
    return <div>{wrappedText}</div>; // Using <div> instead of <p> for proper nesting
}

function isLinkedInProfile(url) {
    const pattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_À-ÖØ-öø-ÿ%C4%87]+\/?$/;
    return pattern.test(url);
}

export default function TestTemplate({ searchParams }) {
    //calculating if edit step
    var editStep = false;
    if (searchParams.editStep === "true") {
        editStep = true
    }

    const [testEmailRet, setTestEmail] = useState('')
    const [stepName, setStepName] = useState('')
    const [linkedinUrl, setLinkedinURl] = useState('')
    const [loading, setLoading] = useState(false)

    //error modal handling
    const [showErrorModal, setErrorModal] = useState(false)
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //loading modal handling
    const [showLoadingModal, setLoadingModal] = useState(false)

    useEffect(() => {
        setStepName(localStorage.getItem('step_name'))
    }, []);

    console.log(searchParams.position == '' || searchParams.position === undefined)

    return (
        <div className="min-w-full h-dvh">
            <Navbar url={`AI Sequences / Edit Sequence / ${editStep ? "Edit" : "Add"} Step / Test`} />
            <ErrorModal onExit={setErrorModal} showSelf={showErrorModal} errorTitle={errorTitle} errorMessage={errorMessage} />
            <LoadingModal showSelf={showLoadingModal} />
            <div className="p-4">
                <label className="block text-xl font-medium leading-6 text-gray-900">
                    {`Paste a Linkedin URL to test your “${stepName}” step`}
                </label>
                <label className="mt-2 mb-2 block text-sm leading-6 text-gray-900">
                    {`Takes ~30 seconds to process, be patient!`}
                </label>
                <div className="mt-4 flex items-center">
                    <input
                        className="block w-1/2 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="https://www.linkedin.com/in/bob/"
                        value={linkedinUrl}
                        onChange={(e) => {
                            setLinkedinURl(e.target.value)
                        }}
                    />
                    <button
                        type="button"
                        className="ml-4 whitespace-nowrap rounded-lg bg-indigo-600 px-7 py-3 text-sm text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={async (e) => {
                            if(!isLinkedInProfile(linkedinUrl)) {
                                //not a linkedin url
                                setErrorTitle("Not valid LinkedIn URL")
                                setErrorMessage("Please past a valid LinkedIn URL")
                                setErrorModal(true)
                                return;
                            }
                            var stepData = {
                                step_subject_line: localStorage.getItem("subject_line"),
                                step_template: localStorage.getItem("template"),
                                step_example_subject_lines: JSON.parse(localStorage.getItem("example_information_subject_line")),
                                step_example_bodys: JSON.parse(localStorage.getItem("example_information_body")),
                                goal: localStorage.getItem("subject_line")
                            }
                            setLoading(true)
                            const tt = await testEmail(linkedinUrl, stepData)
                            if(tt.error === true) {
                                setErrorTitle("Something went wrong")
                                setErrorMessage("Tally's models are confused right now, try a different LinkedIn profile?")
                                setErrorModal(true)
                                setLoading(false)
                                return
                            } else {
                                setTestEmail(tt.message.subjectLine + "\n\n\n\n" + tt.message.body)
                                setLoading(false)
                            }
                        }}
                    >
                        Test
                    </button>
                    <button
                        type="button"
                        onClick={async (e) => {
                            e.preventDefault()
                            setLoadingModal(true)
                            console.log("CALLING HERE")
                            console.log(localStorage.getItem('sequence_name'));
                            if (searchParams.position == '' || searchParams.position === undefined) {
                                await saveStep(localStorage.getItem('sequence_name'), localStorage.getItem("step_name"), localStorage.getItem("template"), JSON.parse(localStorage.getItem("example_information_subject_line")), JSON.parse(localStorage.getItem("example_information_body")), localStorage.getItem("subject_line"))
                            }
                            else {
                                await saveStep(localStorage.getItem('sequence_name'), localStorage.getItem("step_name"), localStorage.getItem("template"), JSON.parse(localStorage.getItem("example_information_subject_line")), JSON.parse(localStorage.getItem("example_information_body")), localStorage.getItem("subject_line"), searchParams.position)
                            }
                        }}
                        className="ml-4 whitespace-nowrap rounded-lg bg-green-600 px-7 py-3 text-sm text-white shadow-sm justify-center text-center hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        Save step
                    </button>
                </div>
                {
                    loading &&
                    <div className="mt-4 p-10 text-sm font-medium inline-block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                        <RingLoader />
                    </div>
                }
                {
                    !loading && testEmailRet !== '' &&
                    <div className="mt-4 p-10 text-xs font-medium inline-block w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                        {<div>{wrapTextWithParagraphs(testEmailRet)}</div>}
                    </div>
                }
            </div>
        </div>
    );
}
