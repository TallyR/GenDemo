"use client";

import { useState } from 'react'
import { Switch } from '@headlessui/react'
import Image from 'next/image';
import clsx from 'clsx'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Toggle({ image_url, settings }) {
    const [enabled, setEnabled] = useState(settings)

    return (
        <div>
            <Switch.Group as="div" className="flex items-center">
                <Image
                    src={image_url}
                    width={settings? 125: 100}
                    height={settings? 80: 70}
                    className={clsx("mr-8",
                        {
                            'mr-32': settings
                        },
                    )}
                    alt="Screenshots of the dashboard project showing desktop version"
                />
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={classNames(
                        enabled ? 'bg-indigo-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                    )}
                >
                    <span
                        aria-hidden="true"
                        className={classNames(
                            enabled ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                    />
                </Switch>
            </Switch.Group>
        </div>
    )
}
