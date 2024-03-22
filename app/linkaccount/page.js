'use client'

import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display } from '@/app/ui/fonts';
import { libre_caslon_display_bold } from '@/app/ui/fonts';
import Navbar from "@/app/ui/Navbar";
import { useState } from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid'

export default function Home() {
    const [isConnected, setConnected] = useState(false); //will likely change this soon 

    if (!isConnected) {
        return (
            <div className="min-w-full">
                <Navbar url="Link Account" />
                <div className="mt-8 ml-8 w-[450px] h-[300px] shadow-2xl rounded-lg border-2 border-black">
                    <p className="m-4 font-semibold">Link Email Account</p>
                    <div className="w-full pt-8 justify-center items-center">
                        <div className="flex justify-center items-center">
                            <a
                                type="button"
                                href="/export_aproov.csv"
                                target="_blank"
                                rel="noreferrer"
                                className="flex justify-center border-2 w-40 border-black rounded-md bg-indigo-600 px-8 py-4 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Link Account
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="min-w-full">
                <Navbar url="Link Account" />
                <div className="mt-8 ml-8 w-[450px] h-[300px] shadow-2xl rounded-lg border-2 border-black">
                    <p className="m-4 font-semibold">Linked Account</p>
                    <div className="pt-8">
                        <div className="flex ml-4">
                                <CheckBadgeIcon className="h-10 w-10 text-green-600 mr-2" />
                                <div className="content-center text-xl font-semibold">
                                <p>hassansyed1029@gmail.com</p>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
