'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useImmerReducer } from 'use-immer';
import { useState, useEffect } from 'react';
import { saveStep } from '@/app/lib/actions'

export default function TestTemplate() {

    const [stepName, setStepName] = useState('')
    useEffect(() => {
        setStepName(localStorage.getItem('step_name'))
    }, []);

    return (
        <div className="min-w-full h-dvh">
            <Navbar url={"AI Sequences / Edit Sequence / Add Step / Test"} />
            <div className="p-4">
                <label className="block text-xl font-medium leading-6 text-gray-900">
                    {`Paste a Linkedin URL to test your the “${stepName}” step`}
                </label>
                <div className="mt-4 flex items-center">
                    <input
                        className="block w-1/2 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="https://www.linkedin.com/in/bob/"
                    />
                    <Link
                        type="button"
                        href="/aisequences/editsequence"
                        className="ml-4 whitespace-nowrap rounded-lg bg-indigo-600 px-7 py-3 text-sm text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Test
                    </Link>
                    <button
                        type="button"
                        onClick={async (e) => {
                            await saveStep(localStorage.getItem('sequence_name'), localStorage.getItem("step_name"), localStorage.getItem("template"), JSON.parse(localStorage.getItem("example_information_subject_line")), JSON.parse(localStorage.getItem("example_information_body")))
                        }}
                        className="ml-4 whitespace-nowrap rounded-lg bg-green-600 px-7 py-3 text-sm text-white shadow-sm justify-center text-center hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        Save step
                    </button>
                </div>
            </div>
        </div>
    );
}
