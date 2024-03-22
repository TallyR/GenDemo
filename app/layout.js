'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { libre_caslon_display } from '@/app/ui/fonts';
import { libre_caslon_display_thin } from '@/app/ui/fonts';
import { HomeIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { LinkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

/*
export const metadata = {
  title: "Tally.ai",
  description: "Generated by create next app",
};
*/

export default function RootLayout({ children }) {

  const [selected, setSelect] = useState(0);

  return (
    <html lang="en">
      <body>
        <div className="flex overflow-hidden max-h-full">
          <div>
            <div className="h-40 w-48 bg-black flex items-center border-b-4 border-b-white padding-left-2 shadow-lg">
              <p className={`text-white text-3xl pl-8 ${libre_caslon_display_thin.className}`}>
                Tally.ai
              </p>
            </div>
            <div className="absolute top-40 bottom-0 w-48 bg-black flex-col items-start shadow-lg">

              <div className="bg-black mt-8 flex">
                {
                  (selected == 0) ?
                    <div className="bg-purple-700 h-6 w-1"></div> : <div className="bg-black h-6 w-1"></div>
                }
                <div className="flex bg-black absolute left-3 items-center">
                  <HomeIcon className="h-5 w-5 text-white" />
                  <Link
                    href="/"
                    className="text-white pl-3 items-center"
                    onClick={(e) => setSelect(0)}
                  >
                    Home
                  </Link>
                </div>
              </div>

              <div className="bg-black mt-3 flex">
                {
                  (selected == 1) ?
                    <div className="bg-purple-700 h-6 w-1"></div> : <div className="bg-black h-6 w-1"></div>
                }
                <div className="flex bg-black absolute left-3 items-center">
                  <MagnifyingGlassCircleIcon className="h-5 w-5 text-white" />
                  <Link
                    href="/prospecting"
                    className="text-white pl-3 items-center"
                    onClick={(e) => setSelect(1)}
                  >
                    Prospecting
                  </Link>
                </div>
              </div>

              <div className="bg-black mt-3 flex">
                {
                  (selected == 2) ?
                    <div className="bg-purple-700 h-6 w-1"></div> : <div className="bg-black h-6 w-1"></div>
                }
                <div className="flex bg-black absolute left-3 items-center">
                  <Cog6ToothIcon className="h-5 w-5 text-white" />
                  <Link
                    href="/settings"
                    className="text-white pl-3 items-center"
                    onClick={(e) => setSelect(2)}
                  >
                    Settings
                  </Link>
                </div>
              </div>

              <div className="bg-black mt-3 flex">
                {
                  (selected == 3) ?
                    <div className="bg-purple-700 h-6 w-1"></div> : <div className="bg-black h-6 w-1"></div>
                }
                <div className="flex bg-black absolute left-3 items-center">
                  <XCircleIcon className="h-5 w-5 text-white" />
                  <Link
                    href="/"
                    className="text-white pl-3 items-center"
                    onClick={(e) => setSelect(3)}
                  >
                    Logout
                  </Link>
                </div>
              </div>

              <div className="bg-black mt-3 flex">
                {
                  (selected == 4) ?
                    <div className="bg-purple-700 h-6 w-1"></div> : <div className="bg-black h-6 w-1"></div>
                }
                <div className="flex bg-black absolute left-3 items-center">
                  <LinkIcon className="h-5 w-5 text-white" />
                  <Link
                    href="/linkaccount"
                    className="text-white pl-3 items-center"
                    onClick={(e) => setSelect(4)}
                  >
                    Link Account
                  </Link>
                </div>
              </div>

            </div>
          </div>
          <div className="w-full max-h-full overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  );
}
