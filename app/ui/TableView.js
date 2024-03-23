export default function TableView({ Linkedinandemails }) {

    const processedList = Linkedinandemails.map((e) => {
        return (
        <tr className="border rounded-lg">
            <th scope="row" className="px-6 py-4 font-medium">
                {e.email}
            </th>
            <td className="px-6 py-4">
                {e.linkedin}
            </td>
        </tr>
        )
    });

    return (
        <div className="border-2 border-black-500/75 shadow-2xl rounded-lg">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black">
                    <thead className="text-xs text-gray-700  dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-black">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-black">
                                Linkedin
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedList}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
