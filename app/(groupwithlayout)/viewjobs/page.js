'use server';

import Navbar from "@/app/ui/Navbar";
import JobsStatusTable from "@/app/ui/JobsStatusTable";
import grabDataFromJobName from '@/app/lib/query';
import { auth } from "@clerk/nextjs";

export default async function ViewJobs({ searchParams }) {

    console.log(searchParams.jobName)
    var create = []
    const { userId } = auth();
    create = await grabDataFromJobName(searchParams.jobName, userId)
    console.log("here  ->" + create)
    return (
        <div className="min-w-full min-h-screen flex flex-col">
            <Navbar url={`Email Jobs / Job Status / "inbound leads"`} />
            <div className="flex-grow overflow-hidden">
                <JobsStatusTable processedJobs={create} />
            </div>
        </div>
    );
}
