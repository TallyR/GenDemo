'use server';

import Navbar from "@/app/ui/Navbar";
import JobsStatusTable from "@/app/ui/JobsStatusTable"
import grabDataFromJobName from '@/app/lib/query';

export default async function ViewJobs() {
    var create = []
    create = await grabDataFromJobName("cache layer gang@1717104725565", "user_2exb4kICgWwUqF5A5Ghh7gZtUpU")
    console.log("here  ->" + create)
    return (
        <div className="min-w-full">
            <Navbar url={`Email Jobs / Job Status / "inbound leads"`} />
            <JobsStatusTable processedJobs={create}/>
        </div>
    );
}