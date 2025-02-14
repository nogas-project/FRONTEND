import Link from 'next/link';
export function Navbar() {
    return (
        <div className={'font-mono flex bg-zinc-950 justify-between'}>
                <h1 className={'font-bold text-2xl'}>
                    The Nogas Web Interface
                </h1>

            <div className={'font-bold text-2xl flex space-y-6'}>
                <Link href={"/home"} className={"underline text-center hover:cursor-pointer"}>
                    Home
                </Link>
                <a className={" underline text-center hover:cursor-pointer"} href={'/about'} rel="About Page">About</a>
                <a className={" underline text-center hover:cursor-pointer"} href={'/profile'} rel="Profile Page"> Profile</a>
                <a className={"underline text-center hover:cursor-pointer"} href={'/'} rel="Logout Page"> Logout </a>
            </div>
        </div>
    )
}