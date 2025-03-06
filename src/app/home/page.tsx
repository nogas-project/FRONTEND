"use client";
import {Navbar} from "../../../components/navbar";
import {jwtDecode} from "jwt-decode";
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import { Toaster, toast } from "sonner";
import {validateToken} from "../../../lib/auth.lib";
import ClipLoader from "react-spinners/ClipLoader";
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });
export default function Home() {
    let token: any;
    let userId: any;
    let [loading1, setLoading1] = useState(false);
    const [co, setCo] = useState(0.000);
    const [history, setHistory] = useState([{
        co2_amount: 0,
        timestamp: 0
    }]);
    function getToken() {
        let token;
        token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token"))
            ?.split("=")[1];

        return token
    }
    function getNotication() {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("notif"))
            ?.split("=")[1];
    }
    async function getLatestData() {
        token = getToken()!;
        if (token) {
            const decoded = await validateToken(token);
            userId = decoded.id
            const response = await fetch(`http://localhost:3001/latest/${userId}`, {
                method: "GET",
                headers: {
                    contentType: "application/json",
                    authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json();
            if (data) {
                return data;
            }
        } else {
            throw new Error("Unable to load profile data.")
        }
    }
    async function getDataHistory() {
        token = getToken()!;
        if (token) {
            const decoded = await validateToken(token);
            userId = decoded.id

            const response = await fetch(`http://localhost:3001/history/${userId}`, {
                method: "GET",
                headers: {
                    contentType: "application/json",
                    authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json();
            if (data) {
                return data;
            }
        } else {
            throw new Error("Unable to load profile data.")
        }
    }
    async function sendEmailToContact(){
        token = getToken()!;

        if (token) {
            const decoded = await validateToken(token)

            // @ts-ignore
            userId = decoded.id

            const response = await fetch(`http://localhost:3001/sendEmail/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                }
            })
            const data = await response.json();
            if (data) {
                return data;
            }
        } else {
            throw new Error("Unable to send email to contact")
        }
    }
    useEffect(() => {
        setLoading1(true)
        const interval0 = setInterval(async () => {
            const res = await getLatestData();
            setCo(res.co2_amount);
            toast.info('Data retrieved')
        }, 30000);
        const interval1 = setInterval(async () => {
            const res = await getDataHistory();
            if (Array.isArray(res))setHistory(res);
        }, 60000);
        return () => {clearInterval(interval0);clearInterval(interval1); setLoading1(false)};
    }, []);
    useEffect(() => {
        const interval = setInterval(async () => {
            if(co > 200){
                if(getNotication() == 'true'){
                    toast.error("Email has been sent to your contact !\n You should go disable the alarm !");
                    await sendEmailToContact();
                }
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [co]);
    const handleRefresh = () => {
        setLoading1(true);
        getLatestData().then(data =>setCo(data.co2_amount))
        getDataHistory().then(data => {if(Array.isArray(data)) setHistory(data)});
        toast.info('Data retrieved')
        setLoading1(false);
    }
    const message = (value: number) => {
        if(value < 100)return "No danger !"
        else if(value < 200) return "Normal"
        else if(value  < 400) return "Be careful, danger !"
        else if(value  < 800) return "Evacuate immediately !"
        else if (value  < 1600) return "Death in couple hours !"
        else if (value  > 3200) return "Imminent death !"
    }
    return (
        <div>
            <Toaster />
            <Navbar />
            <div className={'justify-center'}>
                <button className="hover:cursor-pointer" onClick={handleRefresh}> Refresh </button>
                <ClipLoader loading={loading1} aria-label="Loading Spinner" data-testid="loader" size={20} color="#FF0000"/>
            </div>
            
            <main className={'flex md:flex-row min-h-svh text-white sm:flex-col sm:gap-5 sm:mt-5'}>
                    
                    {/* realtime */}
                    <div className={' flex flex-col w-full items-center justify-center' }>
                    <div className={"bg-zinc-900/60 border-zinc-900 rounded-lg m-10 flex flex-col gap-5 m-px "}>
                        <h3 className={'text-3xl text-center mb-10'}> == {message(co)} ==</h3>
                        <div data-testid="gauge">
                        <GaugeComponent
                            style={{width: '500px'}}
                            maxValue={3000}
                            value={co}
                            labels={{
                                valueLabel: {
                                    style: {fontSize: 30},
                                    formatTextValue: (value: number) => {
                                        return value + " ppm"
                                    },
                                },
                                tickLabels: {
                                    type: "outer",
                                    ticks: [
                                        {value: 200},
                                        {value: 400},
                                        {value: 800},
                                        {value: 1600},
                                        {value: 3200}
                                    ],
                                    defaultTickValueConfig: {
                                        formatTextValue: (value: number) => {
                                            return value + " ppm"
                                        },
                                    }
                                }
                            }}
                            arc={{
                                nbSubArcs: 150,
                                colorArray: ['#5BE12C', '#F5CD19', '#EA4228'],
                                width: 0.3,
                                padding: 0.007
                            }}
                            pointer={{
                                elastic: true,
                                animationDelay: 0
                            }}
                        />
                        </div>
                    </div>

                    </div>

                    {/* history */}
                    <div className={' flex flex-col w-full items-center justify-center' }>
                    <div className={"bg-zinc-900/60 border-zinc-900 rounded-lg m-10 flex flex-col gap-5 m-px w-1/2 text-center"}>
                        <h1 className={'text-3xl pt-5'}> == History == </h1>
                        <div className="max-h-72 overflow-y-auto">
                        <table className="min-w-full border border-gray-300 shadow-lg rounded-lg scroll-smooth">
                            <thead className="sticky top-0">
                            <tr className="bg-gray-800 ">
                                <th className="px-4 py-2 ">ID </th>
                                <th className="px-4 py-2"> CO amount</th>
                                <th className="px-4 py-2"> TimeStamp</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100 hover:text-green-500 ">
                                    <td className="px-4 py-2 ">{index}</td>
                                    <td className="px-4 py-2">{item.co2_amount}</td>
                                    <td className="px-4 py-2">{item.timestamp}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>

                    </div>
                    </div>

                    
            
            </main>
        </div>


    )
}