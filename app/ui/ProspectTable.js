
export default function ProspectTable({ url, button = false }) {
    return (
        <div className="min-w-full h-[500px] border-2 border-black-500/75 shadow-2xl rounded-lg ">
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black">
                    <thead class="text-xs text-gray-700  dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-black">
                                Search name
                            </th>
                            <th scope="col" class="px-6 py-3 text-black">
                                Date
                            </th>
                            <th scope="col" class="px-6 py-3 text-black">
                                View Results
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border rounded-lg">
                            <th scope="row" class="px-6 py-4 font-medium">
                                Approov Security
                            </th>
                            <td class="px-6 py-4">
                                2/19/24
                            </td>
                            <td class="px-6 py-4">
                                <button
                                    type="button"
                                    className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                                >
                                    Results
                                </button>
                            </td>
                        </tr>
                        <tr class="border rounded-lg">
                            <th scope="row" class="px-6 py-4 font-medium">
                                Google
                            </th>
                            <td class="px-6 py-4">
                                2/21/24
                            </td>
                            <td class="px-6 py-4">
                                <button
                                    type="button"
                                    className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                                >
                                    Results
                                </button>
                            </td>
                        </tr>
                        <tr class="border rounded-lg">
                            <th scope="row" class="px-6 py-4 font-medium">
                                Vanta
                            </th>
                            <td class="px-6 py-4">
                                2/23/24
                            </td>
                            <td class="px-6 py-4">
                                <button
                                    type="button"
                                    className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                                >
                                    Results
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    );
}
