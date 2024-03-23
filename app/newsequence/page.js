'use client'


import Navbar from "@/app/ui/Navbar";
import { processFile } from '@/app/lib/actions'
import { useFormState } from 'react-dom';

export default async function Newsequence() {
    const initialState = { parsedArray: null, errors: {} };
    const [state, dispatch] = useFormState(processFile, initialState);

    if (state.parsedArray === null) {
        return (
            <div className="min-w-full">
                <Navbar url="New Mail Merge" />

                
                <div className="mt-8 ml-8 w-[400px] h-[200px] shadow-2xl rounded-lg border-2 border-black">
                    <p className="m-4 font-semibold">Upload CSV File</p>
                    <div className="w-full pt-4 justify-center items-center">
                        <form action={dispatch}>
                            <input type="file" name="file" className="mb-3 ml-4" id="file" />
                            <button type="submit" className="ml-4 flex justify-center border-2 w-40 border-black rounded-md bg-indigo-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" id="upload">Submit</button>
                        </form>
                    </div>

                </div>
            </div>
        )
    } else {
        // a table to show the user parsed data -> then can submit the job to the back-end (fill out job name and stuff)
        return (
            <div className="min-w-full">
                <Navbar url="New Mail Merge" />
                <p>{state.parsedArray[0].email}</p>
                <p>{state.parsedArray[0].linkedin}</p>
            </div>
        );
    }
}

