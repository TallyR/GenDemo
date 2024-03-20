
import Navbar from "@/app/ui/Navbar";

const items = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
]

export default function ProspectView() {
    return (
        <div className="min-w-full h-screen">
            <Navbar url="Prospecting / Approov Security" button={{ title: "Export List" }} />
            <div className="flex m-8 shadow-2xl rounded-lg border-2 border-black">
                <div className="overflow-auto h-screen w-1/4 m-8 rounded-lg border-black bourder">
                    <ul role="list" className="space-y-3 max-h-full">
                        {items.map((item) => (
                            <li key={item.id} className="border rounded-lg bg-white px-3 py-2 shadow">
                                <p>Vivian Thompson - VP of Sales</p>
                                <p>Whatnot</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="m-8 flex-col grow border-2 rounded-lg border-neutral-300 shadow-xl">
                    <div className="m-8">
                        <p className="text-2xl font-small">Vivian Thompson</p>
                        <p>Whatnot</p>
                    </div>
                    <div className="m-8">
                        <p className="text-xl font-small">Reasons</p>
                        <div className="m-4">
                            <p>1. She's the VP of Sales, this matches your ICP description</p>
                            <p>2. Whatnot is an iOS company with north of 1 million downloads</p>
                            <p>3. They have a 10+ security team</p>
                        </div>
                    </div>
                    <div className="m-8">
                        <p className="text-xl font-small">Contact Information</p>
                        <div className="m-8">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black">
                                <tbody>
                                    <tr className="border rounded-lg">
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            LinkedIn
                                        </th>
                                        <td className="px-6 py-4">
                                            <a href="https://www.linkedin.com/in/hassan-s-215726187/" target="_blank" rel="noreferrer" className="text-blue-600">
                                                linkedin.com/in/hassan-s-215726187/
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border rounded-lg">
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            Phone number
                                        </th>
                                        <td className="px-6 py-4">
                                            832-334-6991
                                        </td>
                                    </tr>
                                    <tr className="border rounded-lg">
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            Email
                                        </th>
                                        <td className="px-6 py-4">
                                            vt@whatnot.com
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
