import {Navbar} from "../../../components/navbar";

export default function Home() {

    return (
        <div>
            <Navbar />
            <main className={'flex flex-row min-h-svh'}>

                {/* realtime */}
                <div className={'bg-gray-400 flex flex-col w-full items-center'}>
                    <h1 className={'text-3xl pt-5'}>Realtime</h1>
                </div>

                {/* history */}
                <div className={'bg-gray-500 flex flex-col w-full items-center'}>
                    <h1 className={'text-3xl pt-5'}>History</h1>

                </div>

            </main>
        </div>


    )
}