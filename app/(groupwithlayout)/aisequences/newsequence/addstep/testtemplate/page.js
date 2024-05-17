'use client';

import Navbar from "@/app/ui/Navbar";
import Link from 'next/link';
import { useImmerReducer } from 'use-immer';

export default function TestTemplate({ searchParams }) {

    return (
        <div className="min-w-full h-dvh">
            <Navbar url={"AI Sequences / New Sequence / Add Step / Test"} />
            <div className="p-4">
                <label className="block text-xl font-medium leading-6 text-gray-900">
                    {`Paste a Linkedin URL to test your the “${searchParams.stepName}” step`}
                </label>
                <div className="mt-4 flex items-center">
                    <input
                        className="block w-1/2 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="https://www.linkedin.com/in/bob/"
                    />
                    <Link
                        type="button"
                        href="/aisequences/newsequence"
                        className="ml-4 whitespace-nowrap rounded-lg bg-indigo-600 px-7 py-3 text-sm text-white shadow-sm justify-center text-center hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Test
                    </Link>
                    <Link
                        type="button"
                        href="/aisequences/newsequence"
                        className="ml-4 whitespace-nowrap rounded-lg bg-green-600 px-7 py-3 text-sm text-white shadow-sm justify-center text-center hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        Save step
                    </Link>
                </div>
            </div>
        </div>
    );
}
