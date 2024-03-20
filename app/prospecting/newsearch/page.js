import Navbar from "@/app/ui/Navbar";
import Toggle from "@/app/ui/Toggle";

export default function NewSearch() {
    return (
        <div className="min-w-full">
            <Navbar url="Prospecting / New Search" />
            <div className="pt-8 pl-8 pr-96">
                <div className="min-w-full h-[750px] border-2 border-black-500/75 shadow-2xl rounded-lg pl-8 pr-8">
                    <div className="sm:col-span-4 pt-6">
                        <label htmlFor="email" className="text-sm font-medium leading-6 text-gray-900">
                            Search name
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    autoComplete="username"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-full pt-4">
                        <label className="text-sm font-medium leading-6 text-gray-900">
                            Describe the company you want to reach
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="about"
                                name="about"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={''}
                            />
                        </div>
                    </div>

                    <div className="col-span-full pt-4">
                        <label className="text-sm font-medium leading-6 text-gray-900">
                            Describe the person you want to reach
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="about"
                                name="about"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={''}
                            />
                        </div>
                    </div>

                    <p className="pt-4 pb-4 text-sm font-medium leading-6 text-gray-900">Do not include entries from</p>
                    <div className="pb-8 pt-4">
                        <Toggle image_url="/hubspot.svg" />
                    </div>
                    <div>
                        <Toggle image_url="/salesforce.svg" />
                    </div>

                    <div className="pt-8">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            How many new prospects
                        </label>
                        <div className="mt-2 flex">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />

                        </div>

                        <div className="flex grow flex-row-reverse">
                            <button
                                type="button"
                                className="rounded-md bg-indigo-600 px-16 py-5 text-sm border border-black text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
