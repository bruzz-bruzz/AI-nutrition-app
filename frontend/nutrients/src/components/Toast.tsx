import {useState,useEffect} from 'react'
import './App.css'

export default function Toast({message,ok}:{message:string,ok:boolean}){
    const [hide,setHide] = useState<boolean>(false)
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setHide(true)
        }, 3000)
        return () => clearTimeout(timer)
    },[])
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={`${hide === false ? 'block' : 'hidden'} ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-4 py-2 rounded-md mb-4 text-center font-mono shadow-md transition-opacity duration-300` }>
                {message} <br/> Closing in 3 seconds...
            </div>
        </div>
    )
}