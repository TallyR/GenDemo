export default function TableView({ Linkedinandemails }) {

    const tt = [
        {
            email: 'hassansyed1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/lila-neuberger/3'
        },
        {
            email: 'syedhassan1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/heidi-korando-951661245/1'
        }, {
            email: 'hassansyed1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/lila-neuberger/'
        },
        {
            email: 'syedhassan1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/heidi-korando-951661245/4'
        },
        {
            email: 'hassansyed1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/lila-neuberger/5'
        },
        {
            email: 'syedhassan1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/heidi-korando-951661245/6'
        },
        {
            email: 'hassansyed1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/lila-neuberger/5'
        },
        {
            email: 'syedhassan1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/heidi-korando-951661245/6'
        },
        {
            email: 'hassansyed1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/lila-neuberger/5'
        },
        {
            email: 'syedhassan1029@gmail.com',
            linkedin: 'https://www.linkedin.com/in/heidi-korando-951661245/6'
        }
    ]

    const processedList = Linkedinandemails.map((e) => {
        return (
            <tr className="border rounded-lg" key={e.linkedin}>
                <th scope="row" className="px-6 py-4 font-medium">
                    {e.email}
                </th>
                <td className="px-6 py-4 font-medium">
                    {e.linkedin}
                </td>
            </tr>
        )
    });

    return (
        <div className="border-2 border-black-500/75 rounded-lg">
            <div className="relative overflow-x-auto overflow-y-scroll max-h-48">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black max-h-2">
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
