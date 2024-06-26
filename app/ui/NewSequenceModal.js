"use client";

import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, CheckBadgeIcon, BoltIcon } from '@heroicons/react/24/outline'
import { Fragment, useState, useEffect } from 'react';
import clsx from 'clsx';
import { createNewSequence } from '@/app/lib/actions';
import { RingLoader } from "react-spinners"

export default function NewSequenceModal({ errorTitle, errorMessage, showSelf, onExit, success = false }) {
    const [sequence, setSequence] = useState('')
    const [goal, setGoal] = useState('')
    const [saving, setSaving] = useState(false)

    return (
        <Transition.Root show={showSelf} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onExit}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel className="rounded-lg bg-white p-5 text-left shadow-xl w-[800px] transition-all">
                                {saving ? <div className="flex flex-col justify-center items-center h-full"><RingLoader className="w-full" /><label className="pt-5">{`Creating "${sequence}"`}</label></div> :
                                    <div className="">
                                        <div>
                                            <div className={clsx((success === false) ? "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100" : "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100")}>
                                                <BoltIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-5">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                    {errorTitle}
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        {errorMessage}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Name your new sequence
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="Inbound leads"
                                                onChange={(e) => {
                                                    setSequence(e.target.value)
                                                }}
                                                value={sequence}
                                            />
                                        </div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mt-3">
                                            Describe your product, it's selling points and the goal of this email sequence
                                        </label>
                                        <div className="mt-2">
                                            <textarea
                                                className="block w-full urounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder={`##Product\nWe are selling an AI sequencer that offers way better personalization that Apollo or ZoomInfo\n\n##Selling Points\n1. Higher Deliverability due to AI writing custom messages and by passing spam filters.\n2. Higher Personalization === Higher Conversion Rates\n3. Automatically sends emails during recipients working hours.\n\n##Goal\nTo get people to take a discovery call with our sales team`}
                                                onChange={(e) => {
                                                    setGoal(e.target.value)
                                                }}
                                                value={goal}
                                                rows={12}
                                            />
                                        </div>
                                        <div className="mt-5 sm:mt-6">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                                onClick={async () => {
                                                    setSaving(true)
                                                    await createNewSequence(sequence, goal)
                                                }}
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </div> 
                                }
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}