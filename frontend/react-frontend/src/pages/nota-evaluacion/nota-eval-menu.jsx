import { Link, useNavigate, useParams } from 'react-router-dom';
import ScrollableDataTable from '../../components/scrollableTable';
import { useState, useEffect } from 'react';

export default function NotaEvaluacionMenu(){
    const {idPaciente} = useParams()
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onClick =(idNota)=>{
        navigate(`/notas/${idPaciente}/info/${idNota.id}`)
    }

    const columns = [
        {
            accessorKey: 'motivo',
            header: 'Motivo'
        },
        {
            accessorKey: 'fechaHora',
            header: 'Fecha y Hora',
        },
        {
            accessorKey: 'peso',
            header: 'Peso (kg)',
        },
        {
            accessorKey: 'altura',
            header: 'Altura (cm)',
        },
        {
            accessorKey: 'signos',
            header: 'Signos',
            cell: info => {
                const signosJsonString = info.getValue();
                if (!signosJsonString) {
                    return ''; // Return empty string if no signos data
                }
                try {
                    const signos = JSON.parse(signosJsonString);
                    
                    let display = [];
                    if (signos.fc) display.push(`FC: ${signos.fc}`);
                    if (signos.fr) display.push(`FR: ${signos.fr}`);
                    if (signos.ta) display.push(`TA: ${signos.ta}`);
                    return display.join(', '); 
                } catch (e) {
                    console.error("Error parsing signos JSON for display:", e);
                    return 'Error de formato'; 
                }
            }
        
        },
    
    ];

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/notaEvaluacion/${idPaciente}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const json = await response.json();
                    setData(json);
                } catch (e) {
                    setError(e.message);
                    console.error("Error fetching data: ", e);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchData();
    }, [idPaciente]);
    const formattedData = data.map(item => ({...item,
    fechaHora: new Date(item.fechaHora).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }),
    }));
        if (loading) return (
            <div>
                <h2>Lista de Notas</h2>
                <div>Cargando datos de Notas...</div>
            </div>
        );
    
        if (error) return (
            <div>
                <h2>Lista de Notas de Evaluaciones</h2>
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    
    
        return (
            <div>
                <div className="sticky top-0 left-0 right-0 bg-white shadow-md z-10 py-3 px-6 flex items-center">
                    <button
                  type="button"
                  onClick={() => navigate(-1)} 
                  className="p-2 rounded-full hover:bg-gray-700 text-black"
                  aria-label="Go back"
                    >

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                    </button>
                    <h1 className="text-2xl ml-8 font-bold text-gray-900">Lista de Notas de Evaluación</h1>
                </div>
                <div className="flex-1 p-6 w-full">
                <ScrollableDataTable data={formattedData} columns={columns} onClick = {onClick}/>
                <div className='flex justify-end mt-4 mr-6'>
                <Link to={`/notas/${idPaciente}/add`} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
                     Nueva Nota
                </Link>
                </div>
                </div>
            </div>
        );
}