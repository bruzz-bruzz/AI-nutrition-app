import './App.css'
import Toast from './Toast'
import {useState,useEffect} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
export default function Account(){
    const par = useParams()
    const nav = useNavigate()
    const [username,setUsername] = useState<string>("")
    const [email,setEmail] = useState<string>("")
    const [currPassword,setCurrPassword] = useState<string>("")
    const [newEmail,setNewEmail] = useState<string>("")
    const [newPassword,setNewPassword] = useState<string>("")
    const [newUsername,setNewUsername] = useState<string>("")
    const [page,setPage] = useState<string>("main")
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
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
      } else{
        setUsername(data)
      }
    })
  }
    async function getUserData(){
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/getData`,{
            method:"POST",
            credentials:"include",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({uuid:par.id})
        })
        .then(res=>res.json())
        .then(data=>{
            setUsername(data.username)
            setEmail(data.email)
        })
    }
    async function changeCredentials(type:string){
        if(type === 'username'){
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/changeUsername`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials:'include',
                body:JSON.stringify({email:email,password:currPassword,newUsername:newUsername,uuid:par.id})
            })
            .then(res=>res.json())
            .then(data=>{
                if(data === 'Username changed successfully'){
                    setToast({message:data,ok:true})
                    setTimeout(()=>{
                        nav('/login')
                    },3000)
                }else{
                    setToast({message:data,ok:true})
                    setTimeout(()=>{
                        setToast({message:"",ok:false})
                    },3000)
                }
            })
        }
        else if(type === 'password'){
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/changePassword`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials:'include',
                body:JSON.stringify({email:email,uuid:par.id,password:currPassword,newPassword:newPassword})
            })
            .then(res=>res.json())
            .then(data=>{
                if(data === 'Passowrd changed successfully'){
                    setToast({message:data,ok:true})
                    setTimeout(()=>{
                        nav('/login')
                    },3000)
                }else{
                    setToast({message:data,ok:true})
                    setTimeout(()=>{
                        setToast({message:"",ok:false})
                    },3000)
                }
            })
        }
        else if(type === 'email'){
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/changeEmail`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials:'include',
                body:JSON.stringify({email:email,password:currPassword,newUsername:newUsername,uuid:par.id})
            })
            .then(res=>res.json())
            .then(data=>{
                if(data === 'Email changed successfully'){
                    setToast({message:data,ok:true})
                    setTimeout(()=>{
                        nav('/login')
                    },3000)
                } else{
                    setToast({message:data,ok:true})
                    setTimeout(()=>{
                        setToast({message:"",ok:false})
                    },3000)
                }
            })
        }
    }
    useEffect(()=>{
        verify()
        getUserData()
    },[])
    return (
        <div className='font-mono'>
            <div className='flex justify-center items-center flex-col'>
                <h1 className='text-2xl font-bold mb-4'>Account Details</h1>
                <p className='text-lg'>Username: {username}</p>
                <p className='text-lg'>UUID: {par.id}</p>
                <p className='text-lg'>Email: {email}</p>
                <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={async ()=>{
                    await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/logout`,{
                            method:"POST",
                            credentials:"include",
                            headers:{"Content-Type":"application/json"}
                        })
                        .then(res=>res.json())
                        .then(data=>{
                            nav('/login')
                        })
                }}>Logout</button>
                {page === 'main' && (
                    <div className='grid grid-cols-3 m-4 p-4'>
                    <button className="m-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>setPage('username')}>Change username</button>
                    <button className="m-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>setPage("password")}>Change password</button>
                    <button className="m-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>setPage('email')}>Change email</button>
                </div>
                )}    
                {page === 'username' && (
<div className='flex justify-center items-center flex-col p-4 m-4 bg-white shadow rounded-2xl'>
                        <p className='text-lg'>Change username</p>
                        <label htmlFor='newUsername' className='text-md font-semibold'>New username: </label>
                        <input
                            type='text'
                            id='newUsername'
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <label htmlFor='currPassword' className='text-md font-semibold'>Password:</label>
                        <input
                            type='password'
                            id='currPassword'
                            value={currPassword}
                            onChange={(e) => setCurrPassword(e.target.value)}
                            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>{
                            changeCredentials('username')
                        }}>Confirm</button>
                        <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>{
                            setPage('main')
                            setCurrPassword('')
                            setNewUsername('')
                        }}>Cancel</button>
                    </div>
                )}  
                    {page === 'password' && (
<div className='flex justify-center items-center flex-col p-4 m-4 bg-white shadow rounded-2xl'>
                        <p className='text-lg'>Change password</p>
                        <label htmlFor='currPassword' className='text-md font-semibold'>Current password:</label>
                        <input
                            type='password'
                            id='currPassword'
                            value={currPassword}
                            onChange={(e) => setCurrPassword(e.target.value)}
                            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <label htmlFor='newPassword' className='text-md font-semibold'>New password: </label>
                        <input
                            type='password'
                            id='newPassword'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>{
                            changeCredentials('password')
                        }}>Confirm</button>
                        <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>{
                            setPage('main')
                            setNewPassword('')
                            setCurrPassword('')
                        }}>Cancel</button>
                    </div>
                    )}
                    {page === 'email' && (
<div className='flex justify-center items-center flex-col p-4 m-4 bg-white shadow rounded-2xl'>
                        <p className='text-lg'>Change email</p>
                        <label htmlFor='newEmail' className='text-md font-semibold'>New email: </label>
                        <input
                            type='email'
                            id='newEmail'
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <label htmlFor='currPassword' className='text-md font-semibold'>Password:</label>
                        <input
                            type='password'
                            id='currPassword'
                            value={currPassword}
                            onChange={(e) => setCurrPassword(e.target.value)}
                            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>{
                            changeCredentials('email')
                        }}>Confirm</button>
                        <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>{
                            setPage('main')
                            setCurrPassword('')
                            setNewEmail('')
                        }}>Cancel</button>
                    </div>
                    )}
            </div>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok}/>
            )}
        </div>
    )
}