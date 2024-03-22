import Link from 'next/link';

export default function ProspectTable() {
    return (
        <div className="min-w-full h-[500px] border-2 border-black-500/75 shadow-2xl rounded-lg ">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black">
                    <thead className="text-xs text-gray-700  dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-black">
                                Search name
                            </th>
                            <th scope="col" className="px-6 py-3 text-black">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-black">
                                View Results
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border rounded-lg">
                            <th scope="row" className="px-6 py-4 font-medium">
                                Approov Security
                            </th>
                            <td className="px-6 py-4">
                                2/19/24
                            </td>
                            <td className="px-6 py-4">
                                <Link
                                    type="button"
                                    href="/prospecting/aproov/view"
                                    className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                                >
                                    Results
                                </Link>
                            </td>
                        </tr>
                        <tr className="border rounded-lg">
                            <th scope="row" className="px-6 py-4 font-medium">
                                Google
                            </th>
                            <td className="px-6 py-4">
                                2/21/24
                            </td>
                            <td className="px-6 py-4">
                                <Link
                                    type="button"
                                    href="/prospecting/aproov/view"
                                    className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                                >
                                    Results
                                </Link>
                            </td>
                        </tr>
                        <tr className="border rounded-lg">
                            <th scope="row" className="px-6 py-4 font-medium">
                                Vanta
                            </th>
                            <td className="px-6 py-4">
                                2/23/24
                            </td>
                            <td className="px-6 py-4">
                                <Link
                                    type="button"
                                    href="/prospecting/aproov/view"
                                    className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                                >
                                    Results
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
