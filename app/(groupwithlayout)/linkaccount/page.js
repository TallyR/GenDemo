'use server'

import Navbar from "@/app/ui/Navbar";
import { getNewHostedAuthLink } from '@/app/lib/actions'
import { checkIfEmailConnected, checkIfGmailIsConnected } from '@/app/lib/actions'
import LinkAccountMenu from '@/app/ui/LinkAccountMenu';
import { Suspense } from "react";
//import { useSearchParams } from 'next/navigation'
import { generateAndSaveGmailCredentials } from '@/app/lib/actions'


export default async function Home({searchParams}) {
    //const { connected, emailAccount } = await checkIfEmailConnected(); // will likely change this soon
    const { connected, emailAccount, aliases } = await checkIfGmailIsConnected();

    //means we are linking accounts
    if (searchParams.code !== undefined) {
        await generateAndSaveGmailCredentials(searchParams.code) //save the stuff
    }

    return (
        <div className="min-w-full">
            <Navbar url="Link Account" />
            <LinkAccountMenu connected={connected} emailAddress={emailAccount} aliases={aliases} />
        </div>
    )
}
