'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useImmerReducer } from 'use-immer';
import { useState, useEffect } from 'react';
import { saveStep } from '@/app/lib/actions'
import { testEmail } from '@/app/lib/teststep'

function wrapTextWithParagraphs(text) {
    // Normalize the text to handle back-to-back newlines by replacing them with a placeholder newline plus double space
    const normalizedText = text.replace(/\n\n/g, '\n  \n');

    // Split the normalized text into an array of lines based on newlines
    const lines = normalizedText.split('\n');

    // Map each line into a paragraph; if the line is empty (representing back-to-back newlines), add an extra space
    const wrappedText = lines.map(line => {
        if (line === '  ') { // Check for the double space which indicates original consecutive newlines
            return <p>&nbsp;</p>; // Insert an HTML entity for space to ensure the space is visible
        }
        return <p>{line}</p>;
    });

    // Return the entire array of paragraphs wrapped in a single containing paragraph (if needed) or a fragment/div
    return <div>{wrappedText}</div>; // Using <div> instead of <p> for proper nesting
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

    useEffect(() => {
        setStepName(localStorage.getItem('step_name'))
    }, []);

    return (
        <div className="min-w-full h-dvh">
            <Navbar url={`AI Sequences / Edit Sequence / ${editStep ? "Edit" : "Add"} Step / Test`} />
            <div className="p-4">
                <label className="block text-xl font-medium leading-6 text-gray-900">
                    {`Paste a Linkedin URL to test your “${stepName}” step`}
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

                            //Testing harness
                            var stepData = {
                                step_subject_line: localStorage.getItem("subject_line"),
                                step_template: localStorage.getItem("template"),
                                step_example_subject_lines: JSON.parse(localStorage.getItem("example_information_subject_line")),
                                step_example_bodys: JSON.parse(localStorage.getItem("example_information_body")),
                                goal: localStorage.getItem("subject_line")
                            }
                            const tt = await testEmail(linkedinUrl, stepData)
                            setTestEmail(tt.body)

                        }}
                    >
                        Test
                    </button>
                    <button
                        type="button"
                        onClick={async (e) => {
                            e.preventDefault()
                            console.log("CALLING HERE")
                            console.log(localStorage.getItem('sequence_name'));
                            if (searchParams.position == '') {
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
                <div className="mt-4">
                    {wrapTextWithParagraphs(testEmailRet)}
                </div>
            </div>
        </div>
    );
}
