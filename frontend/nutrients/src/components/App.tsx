import { useState,useEffect } from 'react'
import {useNavigate,useParams} from 'react-router-dom'
import './App.css'
import Toast from './Toast'
import Card from './Card'
import Logcard from './Logcard'
import Github from './Github'
import Chart from './Chart'
export default function App() {
  const nav= useNavigate()
  const par = useParams()
  const [username,setUsername] = useState<string>('')
  const [calories,setCalories] = useState<Number>(0)
  const [protein,setProtein] = useState<Number>(0)
  const [carbohydrates,setCarbohydrates] = useState<Number>(0)
  const [fats,setFats] = useState<Number>(0)
  const [fiber,setFiber] = useState<Number>(0)
  const [sodium,setSodium] = useState<Number>(0)
  const [iron,setIron] = useState<Number>(0)
  const [calcium,setCalcium] = useState<Number>(0)
  const [vitaminD,setVitaminD] = useState<Number>(0)
  const [vitaminC,setVitaminC] = useState<Number>(0)
  const [vitaminE,setVitaminE] = useState<Number>(0)
  const [logs,setLogs] = useState<any[]>([])
  const [toast,setToast] = useState<{message:string,ok:boolean}>({message:'',ok:false})
  const [page,setPage] = useState<string>('main')
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
  async function getData(){
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/getLogs`,{
      method:"POST",
      body:JSON.stringify({uuid:par.id}),
      credentials:'include',
      headers:{"Content-Type":"application/json"}
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.length >= 0 ){
        setLogs(data)
      for(let i = 0; i < data.length; i++){
        const json = data[i].nutrientdata
        setCalories(calories=> Number(calories) + Number(json.calories.split(' ')[0]))
        setProtein(protein => Number(protein) + Number(json.protein.split(' ')[0]))
        setCarbohydrates(carbohydrates=>Number(carbohydrates) + Number(json.carbohydrates.split(' ')[0]))
        setFats(fats => Number(fats) + Number(json.fats.split(' ')[0]))
        setFiber(fiber => Number(fiber) + Number(json.fiber.split(' ')[0]))
        setSodium(sodium => Number(sodium) + Number(json.sodium.split(' ')[0]))
        setIron(iron => Number(iron) + Number(json.iron.split(' ')[0]))
        setCalcium(calcium => Number(calcium) + Number(json.calcium.split(' ')[0]))
        setVitaminD(vitaminD => Number(vitaminD) + Number(json.vitaminD.split(' ')[0]))
        setVitaminC(vitaminC => Number(vitaminC) + Number(json.vitaminC.split(' ')[0]))
        setVitaminE(vitaminE => Number(vitaminE) + Number(json.vitaminE.split(' ')[0]))
      }
      setToast({message:"Successfully fetched logs.",ok:true})
      setTimeout(()=>{
              setToast({message:"",ok:false})
            },3000)
      } else{
        setToast({message:"Error fetching logs.",ok:false})
        setTimeout(()=>{
              setToast({message:"",ok:false})
            },3000)
      }
    })
  }
  function constructChartData(){
    const labels = ['Protein','Carbohydrates','Fats','Fiber','Sodium','Iron','Calcium','Vitamin D','Vitamin C','Vitamin E']
    const values = [protein,carbohydrates,fats,fiber,Number(sodium)/1000,Number(iron)/1000,Number(calcium)/1000,Number(vitaminD)/1000,Number(vitaminC)/1000,Number(vitaminE)/1000]
    const palette = [
      'rgba(34,197,94,0.85)', // green
      'rgba(59,130,246,0.85)', // blue
      'rgba(234,88,12,0.85)',  // orange
      'rgba(14,165,233,0.85)', // cyan
      'rgba(236,72,153,0.85)', // pink
      'rgba(168,85,247,0.85)', // purple
      'rgba(249,115,22,0.85)', // amber
      'rgba(16,185,129,0.85)', // emerald
      'rgba(99,102,241,0.85)', // indigo
      'rgba(244,63,94,0.85)'   // rose
    ]
    const borderPalette = palette.map(c => c.replace('0.85','1'))

    let d = {
      labels: labels,
      datasets:[
        {
          data: values,
          borderColor: borderPalette,
          backgroundColor: palette
        }
      ]
    }
    return d
  }
  useEffect(()=>{
    verify()
    getData()
  },[])
  return (
    <div className='font-mono'>
      <div className='flex justify-center items-center flex-col bg-white p-4 rounded-2xl shadow absolute top-4 left-4'>
        <p>{username}#{par.id}</p>
        <div className="mt-4 text-center text-sm text-slate-600">
          <button onClick={()=>nav('/account/' + String(par.id))} className="text-indigo-600 hover:underline">Account details</button>
        </div>
      </div>
    <div className='flex justify-center items-center'>
      {page === 'main'&& (
        <div className='flex justify-center items-center flex-col'>
          <div className='flex justify-center items-center flex-col'>
              <div>
                <p className='text-sm text-slate-500 text-center'>Calories: {String(calories)} kCal</p>
                <p className='text-sm text-slate-500 text-center'>Measured in grams</p>
                <Chart data={constructChartData()}/>
              </div>
          </div>
          <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>nav('/addLog/' + String(par.id))}>Add log</button>
          <h2 className='text-sm text-slate-500'>Total intake</h2>
          <div className='grid grid-cols-3 gap-4'>
              <Card name={'Calories'} amount={Number(calories)} unit={'kCal'}/>
              <Card name={'Protein'} amount={Number(protein)} unit={'g'}/>
              <Card name={'Carbohydrates'} amount={Number(carbohydrates)} unit={'g'}/>
              <Card name={'Fats'} amount={Number(fats)} unit={'g'}/>
              <Card name={'Fiber'} amount={Number(fiber)} unit={'g'}/>
              <Card name={'Sodium'} amount={Number(sodium)} unit={'mg'}/>
              <Card name={'Iron'} amount={Number(iron)} unit={'mg'}/>
              <Card name={'Calcium'} amount={Number(calcium)} unit={'mg'}/>
              <Card name={'Vitamin D'} amount={Number(vitaminD)} unit={'mg'}/>
              <Card name={'Vitamin C'} amount={Number(vitaminC)} unit={'mg'}/>
              <Card name={'Vitamin E'} amount={Number(vitaminE)} unit={'mg'}/>
          </div>
          <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>setPage('logs')}>See full history</button>
        </div>
      )}
      {page === 'logs' && (
        <div className='flex justify-center items-center flex-col'>
        <div className='flex justify-center items-center flex-col'>
            {logs.map((val,idx)=>(
                <Logcard date={val.logdate} name={val.title} data={val.nutrientdata} imagedata={val.imagedata} imagetype={val.imagetype}/>
            ))}
        </div>
        <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md" onClick={()=>setPage('main')}>Back</button>
        </div>
      )}
      {toast.message.length > 0 && (
        <Toast message={toast.message} ok = {toast.ok}/>
      )}
    </div>
    <Github />
    </div>
  )
}