'use client';

import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display } from '@/app/ui/fonts';
import { libre_caslon_display_bold } from '@/app/ui/fonts';
import Navbar from "@/app/ui/Navbar";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import SequencesTable from "@/app/ui/SequencesTable";
import Toggle from "@/app/ui/Toggle";
import NewSequenceModal from "@/app/ui/NewSequenceModal";
import { useState, useEffect } from 'react';
import { grabEmailSequences } from '@/app/lib/actions'

//this can be a server component! (EVENTUALLY)

export default function CustomPrompt() {

    //error modal handling
    const [showErrorModal, setErrorModal] = useState(false)
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [jsxEntries, setEntries] = useState([])

    useEffect(() => {
        const grab = async () => {
            const data = await grabEmailSequences()
            
            
            const convertToJson = data.map(trav => {
                return (
                    { sequenceTitle: trav.sequenceName, length: trav.length }
                )
            })
            console.log("SMITHER")
            console.log(data)

            //return;

            setEntries(data)
            
        };
        grab()
    }, [])


    //this will eventually be grabbed from the backend
    /*
    const processedJobs = [
        { sequenceTitle: "InitialOeeeeutreachforVps23423", length: "6" },
        { sequenceTitle: "SecondReach234324", length: "12" },
        { sequenceTitle: "InitialOutreachforVps23432", length: "6" },
        { sequenceTitle: "SecondReach345435", length: "12" },
        { sequenceTitle: "InitialOutreachforVps234324", length: "6" },
        { sequenceTitle: "SecondReach23432", length: "12" },
        { sequenceTitle: "InitialOutreachforVps23432", length: "6" },
        { sequenceTitle: "SecondReach234324", length: "12" },]

    console.log(processedJobs);
    */

    //should probably move this to ProspectTable.js
    //  {trav.jobState}

    /*

    const jsxEntries = processedJobs.map(trav => {
        return (
            <tr className="border rounded-lg" key={trav.sequenceTitle}>
                <td scope="row" className="w-1/2 px-5 py-2 font-medium">
                    <div className="pl-1">{trav.sequenceTitle}</div>
                </td>
                <td className="w-1/4 px-5 py-2">
                    <div className="pl-1">{trav.length}</div>
                </td>
                <td className="w-1/4 px-5 py-2">
                    <button
                        type="button"
                        disabled={false}
                        className="rounded-md bg-indigo-600 px-6 py-2.5 w-1/2 text-sm text-white shadow-sm justify-center hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        )
    })
    */

    return (
        <div className="min-w-full">
            <Navbar url="Your Sequences" />
            <NewSequenceModal onExit={setErrorModal} showSelf={showErrorModal} errorTitle={errorTitle} errorMessage={errorMessage} />
            <SequencesTable jsxEntries={jsxEntries} triggerModal={setErrorModal} />
        </div>
    );
}
