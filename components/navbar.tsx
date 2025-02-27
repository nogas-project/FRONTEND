"use client";
import {useRouter} from "next/navigation";
import {useState} from "react";
export function Navbar() {
    const router = useRouter();
    const [notifActivated, isNotifActivated] = useState(false);
    const logout = () => {
        document.cookie = `token=; path=/`
        router.push('/');
    }
    const notification = () => {
        isNotifActivated(!notifActivated);
        document.cookie = `notif=${notifActivated}; path=/`
        if(notifActivated){
            alert("Notification are activated");
        }else{
            alert("Notification are disabled");
        }
    }
    return (
        <div className={'font-mono flex justify-between pr-5 pl-5'}>
                <h1 className={'font-bold text-2xl'}>
                    The Nogas Web Interface
                </h1>

            <div className={'font-bold text-2xl flex gap-3'}>
                <a href={'/home'} rel="Home Page">
                    <p className={"underline text-center hover:cursor-pointer hover:text-green-400/60"}>Home</p>
                </a>
                <a href={'/about'} rel="About Page">
                    <p className={"underline text-center hover:cursor-pointer hover:text-green-400/60"}>About</p>
                </a>
                <a href={'/profile'} rel="Profile Page">
                    <p className={"underline text-center hover:cursor-pointer hover:text-green-400/60"}>Profile</p>
                </a>
                <button className={" underline text-center hover:cursor-pointer hover:text-green-400/60"}
                        onClick={logout}> Logout
                </button>
                <button className={" underline text-center hover:cursor-pointer hover:text-green-400/60"}
                        onClick={notification}> Notification
                </button>
            </div>
        </div>
    )
}