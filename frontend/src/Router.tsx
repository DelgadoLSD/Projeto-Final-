import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Initial } from './pages/Initial'
import { Register } from './pages/Register'
import { Producer } from './pages/Produtor'
import Operator from './pages/Operador'
import { Mosaiqueiro } from './pages/Mosaiqueiro'
import { HeatMap } from './pages/Mapa_calor'
import FarmReport from './pages/Relatorio'

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Initial />} />
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Rotas principais de cada área */}
            <Route path="/area-produtor" element={<Producer />} />
            <Route path="/area-operador" element={<Operator />} />
            <Route path="/area-mosaiqueiro" element={<Mosaiqueiro />} />
            
            {/* Rota GENÉRICA para o mapa de calor */}
            <Route path="/heat-map/:farmId" element={<HeatMap />} />
            
            <Route path="/relatorio/:farmId" element={<FarmReport />} />
        </Routes>
    )
}