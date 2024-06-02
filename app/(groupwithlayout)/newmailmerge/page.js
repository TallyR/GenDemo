'use server'

import Navbar from "@/app/ui/Navbar";
import { grabEmailSequences } from '@/app/lib/actions';
import AIMailMerge from '@/app/ui/AiMailMerge'

export default async function NewMailMerge() {
    const data = await grabEmailSequences()
    return (
    <div className="min-w-full">
        <Navbar url="New AI Mail Merge" />
        <AIMailMerge className="bg-red-100"data={data}/>
    </div>
    );
}
