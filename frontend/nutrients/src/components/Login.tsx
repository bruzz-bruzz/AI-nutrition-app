import './App.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Toast from './Toast'
import Github from './Github'
export default function Register(){
  const nav = useNavigate()
  const [password,setPassword] = useState<string>('')
  const [email,setEmail] = useState<string>('')
  const [toast,setToast] = useState({message:"",ok:false})
  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`,{
        method:"POST",
        body:JSON.stringify({email:email,password:password}),
        headers:{"Content-Type":"application/json"},
        credentials:"include"
    })
    .then(res=>res.json())
    .then(data=>{
        if(data !== 'Email does not exist' && data !== 'Incorrect password'){
            setToast({message:data+ '. Redirecting...',ok:true})
            setTimeout(()=>{
              setToast({message:"",ok:false})
              nav('/app/' + String(data))
            },3000)
        }else{
            setToast({message:data,ok:false})
            setTimeout(()=>{
              setToast({message:"",ok:false})
            },3000)
        }
    })
  }
  return (
    <div className='font-mono'>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-semibold text-slate-800 text-center mb-2">Login to your account</h2>
        <p className="text-sm text-slate-500 text-center mb-6">Sign in to your account to track nutrients and meals.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md shadow-sm transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          Don't have an account? <button onClick={()=>nav('/register')} className="text-indigo-600 hover:underline">Sign up</button>
        </div>
      </div>
      </div>
      {toast.message.length > 0 && (
          <Toast message={toast.message} ok={toast.ok}/>
    )}
    <Github />
    </div>
  )
}
