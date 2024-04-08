'use client'

import { useState } from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { getNewHostedAuthLink, generateGmailAuthRedirect } from '@/app/lib/actions'
import { disconnectEmail, disconnectGmail, writeNewAlias } from '@/app/lib/actions'

export default async function LinkAccountMenu({ connected, emailAddress, aliases }) {

    //for loading screen
    const [buttonText, setButtonText] = useState('Connect')
    const [disconnectButtonText, setDisconnectButtonText] = useState('Disconnect')
    const [selectAliasText, setAliasText] = useState('Select an alias')

    if (!connected) {
        return (
            <div className="mt-8 ml-8 shadow-2xl rounded-lg border-2 auto border-black inline-flex flex-col items-center">
                <div className="m-2">
                    <p className="font-semibold">Link email account</p>
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
                                    //await getNewHostedAuthLink()
                                    await generateGmailAuthRedirect() //new API
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
            <div>
                {
                    aliases.length > 1 && <div className="mt-8 ml-8 mr-8 w-[450px]">
                        <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                            {selectAliasText}
                        </label>
                        <select
                            id="location"
                            name="location"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            defaultValue={emailAddress}
                            onChange={async (e) => {
                                e.preventDefault()
                                setAliasText('Changing...')
                                await writeNewAlias(e.target.value);
                                setAliasText('Select an alias')
                            }}
                        >
                            {
                                aliases.map((trav) => {
                                    return <option key={trav.emailAlias}>{trav.emailAlias}</option>
                                })
                            }
                        </select>
                    </div>
                }
                <button
                    type="button"
                    className="mt-8 ml-8 border-2 w-60 h-10 border-black rounded-md bg-indigo-600 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={
                        async (e) => {
                            e.preventDefault();
                            setDisconnectButtonText('Loading...')
                            await disconnectGmail()
                        }
                    }
                >
                    {disconnectButtonText}
                </button>

                <div className="mt-8 ml-8 mr-8 w-[450px] h-[200px] shadow-2xl rounded-lg border-2 border-black mb-20">
                    <p className="m-4 font-semibold">Linked account</p>
                    <div className="pt-8">
                        <div className="flex ml-4">
                            <CheckBadgeIcon className="h-10 w-10 text-green-600 mr-2" />
                            <div className="content-center text-xl font-semibold">
                                <p>{emailAddress}</p>
                            </div>
                            <div className="m-2">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
