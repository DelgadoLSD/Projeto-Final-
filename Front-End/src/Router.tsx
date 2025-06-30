import { Routes, Route }from 'react-router-dom'
import { Login } from './pages/Login'
import { Initial } from './pages/Initial'
import { Register } from './pages/Register'
import { Producer } from './pages/Produtor'
import Operator from './pages/Operador'
import { Mosaiqueiro } from './pages/Mosaiqueiro'


export function Router(){
    return(
        <Routes>
            <Route path="/" element={<Initial/>}/>
            <Route path="/login" element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path="/cadastro-produtor" element={<Producer/>}/>
            <Route path="/area-produtor" element={<Producer />} />
            <Route path="/cadastro-operador" element={<Operator />} />
            <Route path="/area-operador" element={<Operator />} />
            <Route path="/cadastro-mosaiqueiro" element={<Mosaiqueiro />} />
            <Route path="/area-mosaiqueiro" element={<Mosaiqueiro />} />
        </Routes>
    )
}