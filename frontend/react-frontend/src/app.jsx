import { Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import Sidebar from './components/sidebar';
import AgregarPaciente from './pages/paciente-info/agregar-paciente';
import InfoPaciente from './pages/paciente-info/info-paciente';
import NotaEvaluacionMenu from './pages/nota-evaluacion/nota-eval-menu';
import NotaEvaluacionAdd from './pages/nota-evaluacion/nota-eval.agregar';
import NotaInfo from './pages/nota-evaluacion/nota-eval-info';
import { NavigationBlockerProvider } from './context/NavigationBlockerContext';
import FarmacosMenu from './pages/farmacos-page/farmacosMenu';
import Settings from './pages/home/settings';

export default function App() {
  return (

      <NavigationBlockerProvider>
      <Sidebar>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/farmacos" element={<FarmacosMenu />} />
          <Route path="/paciente/add" element={<AgregarPaciente />} />
          <Route path="/paciente/:id" element={<InfoPaciente/>} />
          <Route path="/notas/:idPaciente" element={<NotaEvaluacionMenu/>} />
          <Route path="/notas/:idPaciente/add" element={<NotaEvaluacionAdd/>} />
          <Route path="/notas/:idPaciente/info/:idNota" element={<NotaInfo/>} />

        </Routes>
      </Sidebar>
      </NavigationBlockerProvider>

    

  );
}