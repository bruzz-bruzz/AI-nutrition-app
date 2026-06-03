import './App.css'
import {useState,useEffect} from 'react'
type Data = {
    date:string;
    name:string;
    data:Record<string,string>;
    imagedata:string;
    imagetype:string;
}
export default function Logcard({date,name,data,imagedata,imagetype}:Data){
    const [arr,setArr] = useState<string[]>([])
    const [imgSrc,setImgSrc] = useState<string>('')
    function setData(){
        let tmp = []
        for(let key in data){
            tmp.push(String(key) + ':' + String(data[key]))
        }
        setArr(tmp)
    }
    function renderImage(){
        const imgSrc = `data:${imagetype};base64,${imagedata}`
        setImgSrc(imgSrc)
    }
    useEffect(()=>{
        setData()
        renderImage()
    },[])
    return (
        <div className='m-2 flex justify-center items-center font-mono'>
            <div className='bg-white p-4 rounded-2xl shadow flex-flex-col'>
                <div className="text-xl text-slate-500">{new Date(date).toLocaleDateString()}</div>
                <div className="text-2xl text-slate-500">{name}</div>
                {arr.map((val,idx)=>(
                    <div>
                        <p className='text-2xl text-slate-500'>{val.split(':')[0]}: {val.split(':')[1]}</p>
                    </div>
                ))}
                <p className='text-xl text-slate-500'>Image: </p>
                {imgSrc.length > 0 && (
                    <img src={imgSrc} alt='Image' className='w-100 h-100'/>
                )}
            </div>
        </div>
    )
}