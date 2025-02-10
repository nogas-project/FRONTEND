export function Navbar() {
    return (
        <div className={'font-mono flex bg-gray-300'}>
                <h1 className={'font-bold text-2xl'}>
                    The Nogas Web Interface
                </h1>

                <div className={'font-bold text-2xl'}>
                    <a>home</a>
                    <a>about</a>
                    <a>profile</a>
                    <a>logout</a>
                </div>
        </div>
    )
}