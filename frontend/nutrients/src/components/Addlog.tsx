import './App.css'
import {useState,useEffect} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import Toast from './Toast'
import Github from './Github'
export default function addlog(){
    const [title,setTitle] = useState<string>('')
    const [imageData,setImageData] = useState<any>()
    const [toast,setToast] = useState<any>({message:'',ok:false})
    const [returnData,setReturnData] = useState<string[]>([])
    const [rawReturnData,setRawReturnData] = useState<string>("")
    const [imageType,setImageType] = useState<string>("")
    const [analysing,setAnalysing] = useState<boolean>(false)
    const par = useParams()
    const nav = useNavigate()
    async function promptAi(){
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/ai/analyseImage`,{
        method:"POST",
        credentials:'include',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({data:imageData,uuid:par.id,imagetype:imageType})
    })
    .then(res=>res.json())
    .then(data=>{
        let tmp = []
        for(let key in data){
            tmp.push(String(key) + ':' + String(data[key]) + '\n')
        }   
        setReturnData(tmp)
        setRawReturnData(JSON.stringify(data))
        setAnalysing(false)
        return data
    })
}
async function verify(){
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/verify`,{
      method:"POST",
      credentials:'include',
      body:JSON.stringify({uuid:par.id}),
      headers:{"Content-Type":"application/json"}
    })
    .then(res=>res.json())
    .then(data=>{
      if(data === false){
        nav('/login')
      }
    })
  }
  useEffect(()=>{
    verify()
  },[])
    return (
        <div className='flex justify-center items-center flex-col font-mono'>
            <div>
                <label htmlFor='imageinput'>Image: </label>
                <input className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300" type='file' id='imageinput' accept='image/png, image/jpeg, image/webp, image/heic, image/heif'
                onChange={(e:any)=>{
                    const file = e.target.files[0]
                    if(file){
                        const reader = new FileReader()
                                reader.onload = function(e:any){
                                    const result = e.target.result
                                    setImageData(result.split(',')[1])
                                }
                                reader.readAsDataURL(file)
                        setImageType(file.type)
                    }
                }}
                />
            </div>
            <div>
                <label htmlFor='title'>Title: </label>
                <input className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300" type='title' id='title' onChange={(e)=>setTitle(e.target.value)}/>
            </div>
            <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={async ()=>{
                setAnalysing(true)
                await promptAi()
            }}>Analyse Image</button>
            {analysing === true && (
                <p>Analysing...</p>
            )}
            {returnData.length > 0 && (
                <h1>Nutritional values:</h1>
            )}
            {returnData.map((val,idx)=>(
                <h1 key={idx}>{val}</h1>
            ))}
            <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md"
            onClick={async ()=>{
                await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/addLog`,{
                    method:"POST",
                    credentials:"include",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({uuid:par.id,data:rawReturnData,title:title,imagedata:imageData,imagetype:imageType})
                })
                .then(res=>res.json())
                .then(data=>{
                    if(data === 'Log added successfully'){
                        setToast({message:data + 'Redirecting...',ok:true})
                        setTimeout(()=>{
                            nav('/app/' + String(par.id))
                        },3000)
                    } else {
                        setToast({message:data,ok:false})
                        setTimeout(()=>{
              setToast({message:"",ok:false})
            },3000)
                    }
                })
            }}
            >Add</button>
                        <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>nav('/app/' + String(par.id))}>Back</button>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok = {toast.ok}/>
            )}
            <Github />
        </div>
    )
}