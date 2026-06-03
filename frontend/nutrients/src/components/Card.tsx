import './App.css'
type Data = {
    name:string;
    amount:number;
    unit:string;
}
export default function Card({name,amount,unit}:Data){
    return (
        <div className='flex justify-center items-center'>
            <div className="min-w-75 bg-white p-4 rounded-2xl shadow flex flex-col">
                <div className="text-xl text-slate-500">{name}</div>
                <div className="text-xl text-slate-500">{amount}</div>
                <div className="text-sm text-slate-500">{unit}</div>
            </div>
        </div>
    )
}