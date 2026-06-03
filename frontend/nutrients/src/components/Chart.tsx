import './App.css'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import type {ChartOptions} from 'chart.js'
ChartJS.register(ArcElement,CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function Chart({data}:any){
    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true } }
        }
    }

    return (
        <div className="chart-canvas w-100 h-100">
            <Doughnut data={data} options={options} />
        </div>
    )
}