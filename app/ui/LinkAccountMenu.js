'use client'

import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display } from '@/app/ui/fonts';
import { libre_caslon_display_bold } from '@/app/ui/fonts';
import Navbar from "@/app/ui/Navbar";
import { useState } from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { getNewHostedAuthLink } from '@/app/lib/actions'
import { checkIfEmailConnected } from '@/app/lib/actions'

export default async function LinkAccountMenu({ connected, emailAddress }) {

    //for loading screen
    const [buttonText, setButtonText] = useState('Connect')

    if (!connected) {
        return (
            <div className="mt-8 ml-8 shadow-2xl rounded-lg border-2 auto border-black inline-flex flex-col items-center">
                <div className="m-2">
                    <p className="font-semibold">Link Email Account</p>
                </div>
                <div className="flex justify-center items-center">
                    <div className="m-2">
                        <button
                            type="button"
                            className="border-2 w-40 border-black rounded-md bg-indigo-600 px-8 py-4 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={
                                async (e) => {
                                    e.preventDefault();
                                    setButtonText('Loading...')
                                    await getNewHostedAuthLink()
                                }
                            }
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="mt-8 ml-8 w-[450px] h-[200px] shadow-2xl rounded-lg border-2 border-black mb-20">
                <p className="m-4 font-semibold">Linked Account</p>
                <div className="pt-8">
                    <div className="flex ml-4">
                        <CheckBadgeIcon className="h-10 w-10 text-green-600 mr-2" />
                        <div className="content-center text-xl font-semibold">
                            <p>{emailAddress}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
