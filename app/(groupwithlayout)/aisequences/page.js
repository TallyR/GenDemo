'use server';

import Navbar from "@/app/ui/Navbar";
import SequencesTable from "@/app/ui/SequencesTable";
import { grabEmailSequences } from '@/app/lib/actions'

export default async function CustomPrompt() {
    const data = await grabEmailSequences()
    return (
        <div className="min-w-full">
            <Navbar url="Your Sequences" />
            <SequencesTable jsxEntries={data} />
        </div>
    );
}
