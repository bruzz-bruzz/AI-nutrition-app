import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import Register from './components/Register.tsx'
import Login from './components/Login.tsx'
import Addlog from './components/Addlog.tsx'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Account from './components/Account.tsx'
createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <Routes>
      <Route path='/app/:id' element={<App />}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/addLog/:id' element={<Addlog />}></Route>
      <Route path='/account/:id' element={<Account />}></Route>
    </Routes>
    </BrowserRouter>
)
