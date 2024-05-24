'use client';

import Navbar from "@/app/ui/Navbar";
import SequencesTable from "@/app/ui/SequencesTable";
import NewSequenceModal from "@/app/ui/NewSequenceModal";
import { useState, useEffect } from 'react';
import { grabEmailSequences } from '@/app/lib/actions'
import LoadingModal from "@/app/ui/LoadingModal.js"

//this can be a server component! (EVENTUALLY)

export default function CustomPrompt() {
    //error modal handling
    const [showErrorModal, setErrorModal] = useState(false)
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [jsxEntries, setEntries] = useState([])

    //show loading screen
    const [load, setLoading] = useState(true)

    useEffect(() => {
        const grab = async () => {
            const data = await grabEmailSequences()
            const convertToJson = data.map(trav => {
                return (
                    { sequenceTitle: trav.sequenceName, length: trav.length }
                )
            })
            console.log(data)
            setEntries(data)
        };
        grab().then(e => setLoading(false))
    }, [])

    return (
        <div className="min-w-full">
            <Navbar url="Your Sequences" />
            <NewSequenceModal onExit={setErrorModal} showSelf={showErrorModal} errorTitle={errorTitle} errorMessage={errorMessage} />
            <LoadingModal showSelf={load} />
            <SequencesTable jsxEntries={jsxEntries} triggerModal={setErrorModal} />
        </div>
    );
}
