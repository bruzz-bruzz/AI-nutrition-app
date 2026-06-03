import './App.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Toast from './Toast'
import Github from './Github'
export default function Register(){
  const nav = useNavigate()
  const [username,setUsername] = useState<string>('')
  const [password,setPassword] = useState<string>('')
  const [confirmPassword,setConfirmPassword] = useState<string>('')
  const [email,setEmail] = useState<string>('')
  const [toast,setToast] = useState({message:"",ok:false})
  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setToast({message:"",ok:false})
    if (!username.trim() || !email.trim() || !password) {
        setToast({message:"Please fill out all required fields.",ok:false})
        setTimeout(()=>{
              setToast({message:"",ok:false})
            },3000)
    }
    if (password !== confirmPassword) {
        setToast({message:"Passwords do not match",ok:false})
        setTimeout(()=>{
              setToast({message:"",ok:false})
            },3000)
    }
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username:username,
        email:email,
        password:password
      }),
      credentials:"include"
    })
    .then(res=>res.json())
    .then(data=>{
        if(data === 'User registered successfully'){
            setToast({message:data +'. Please go login.',ok:true})
            setTimeout(()=>{
              setToast({message:"",ok:false})
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
        <h2 className="text-2xl font-semibold text-slate-800 text-center mb-2">Create an account</h2>
        <p className="text-sm text-slate-500 text-center mb-6">Create your free account to track nutrients and meals.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md shadow-sm transition-colors"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <button onClick={()=>nav('/login')} className="text-indigo-600 hover:underline">Sign in</button>
        </div>
      </div>
      </div>
      {toast.message.length > 0 && (
        <Toast message={toast.message} ok={toast.ok}/>
      )}
      <Github/>
    </div>
  )
}
