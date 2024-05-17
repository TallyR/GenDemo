'use client';

import { Inter } from "next/font/google";
import "@/app/globals.css";
import { libre_caslon_display_thin } from '@/app/ui/fonts';
import { HomeIcon } from '@heroicons/react/24/solid'
import { EnvelopeIcon } from '@heroicons/react/24/solid'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import { BoltIcon } from '@heroicons/react/24/solid'
import { LinkIcon } from '@heroicons/react/24/solid'
import Link from 'next/link';
import { ClerkProvider } from '@clerk/nextjs'
import { UserButton } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { Suspense } from "react";
import { Metadata } from 'next';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  const pathName = usePathname()

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="flex overflow-hidden h-screen">
            <div>
              <div className="h-40 w-48 bg-black flex items-center border-b-4 border-b-white padding-left-2 shadow-lg">
                <p className={`text-white text-3xl pl-8 ${libre_caslon_display_thin.className}`}>
                  Tally.ai
                </p>
              </div>
              <div className="absolute top-40 bottom-0 w-48 bg-black flex-col items-start shadow-lg">

                <div className="bg-black mt-8 flex">
                  {
                    ('/' === pathName) ?
                      <div className="bg-purple-700 h-6 w-1"></div> : <div className="bg-black h-6 w-1"></div>
                  }
                  <div className="flex bg-black absolute left-3 items-center">
                    <EnvelopeIcon className="h-5 w-5 text-white" />
                    <Link
                      href="/"
                      className="text-white pl-3 items-center"
                    >
                      Email Jobs
                    </Link>
                  </div>
                </div>

                <div className="bg-black mt-3 flex">
                  {
                    (pathName.includes('/aisequences')) ?
                      <div className="bg-purple-700 h-6 w-1"></div> : <div className="bg-black h-6 w-1"></div>
                  }
                  <div className="flex bg-black absolute left-3 items-center">
                    <Cog6ToothIcon className="h-5 w-5 text-white" />
                    <Link
                      href="/aisequences"
                      className="text-white pl-3 items-center"
                    >
                      AI Sequences
                    </Link>
                  </div>
                </div>

                <div className="bg-black mt-3 flex">
                  {
                    ('/linkaccount' === pathName) ?
                      <div className="bg-purple-700 h-6 w-1"></div> : <div className="bg-black h-6 w-1"></div>
                  }
                  <div className="flex bg-black absolute left-3 items-center">
                    <LinkIcon className="h-5 w-5 text-white" />
                    <Link
                      href="/linkaccount"
                      className="text-white pl-3 items-center"
                    >
                      Link Account
                    </Link>
                  </div>
                </div>

                <div className="bg-black mt-3 flex">
                  {
                    ('/newmailmerge' === pathName) ?
                      <div className="bg-purple-700 h-6 w-1"></div> : <div className="bg-black h-6 w-1"></div>
                  }
                  <div className="flex bg-black absolute left-3 items-center">
                    <BoltIcon className="h-5 w-5 text-white" />
                    <Link
                      href="/newmailmerge"
                      className="text-white pl-3 items-center"
                    >
                      AI Mail Merge
                    </Link>
                  </div>
                </div>

                <div className="ml-4 mb-4 absolute bottom-0 flex items-center">
                  <UserButton />
                  <p className="pl-2 text-white">Your Profile</p>
                </div>

              </div>
            </div>
            <div className="w-full max-h-full overflow-hidden">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
