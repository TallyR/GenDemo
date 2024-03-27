'use server'

import Navbar from "@/app/ui/Navbar";
import { getNewHostedAuthLink } from '@/app/lib/actions'
import { checkIfEmailConnected } from '@/app/lib/actions'
import LinkAccountMenu from '@/app/ui/LinkAccountMenu';
import { Suspense } from "react";

export default async function Home() {
    const { connected, emailAccount } = await checkIfEmailConnected(); // will likely change this soon
    return (
        <div className="min-w-full">
            <Navbar url="Link Account" />
            <LinkAccountMenu connected={connected} emailAddress={emailAccount}/>
        </div>
    )
}
