import { Link, useNavigate } from 'react-router-dom';
import ScrollableDataTable from '../../components/scrollableTable';
import { useState, useEffect } from 'react';

export default function Home() {
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onClick =(id)=>{
        navigate(`/paciente/${id.id}`)
    }

    const columns = [
        {
            accessorKey: 'nombre',
            header: 'Nombre',
        },
        {
            accessorKey: 'apellido',
            header: 'Apellido',
        },
        {
            accessorKey: 'sexo',
            header: 'Sexo',
        },
        {
            accessorKey: 'edad',
            header: 'Edad',
        },
        {
            accessorKey: 'direccion',
            header: 'Dirección'
        },
        {
            accessorKey: 'fechaNacimiento',
            header: 'Fecha Nacimiento',
            cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A'
        },
        {
            accessorKey: 'telefonos',
            header: 'Teléfonos',
            cell: info => info.getValue() ? info.getValue().join(', ') : 'N/A'
        },
        {
            accessorKey: 'correos',
            header: 'Correos',
            cell: info => info.getValue() ? info.getValue().join(', ') : 'N/A'
        }
    ];

    const checkBackendHealth = async () => {
    try {
        const res = await fetch('http://localhost:8080/api/health');
        if (res.ok) {
            const json = await res.json();
            if (json.status === "ok") return true;
        }
    } catch (err) {
        console.warn("Backend not ready yet...");
    }
    return false;
};

const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/pacientes');
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

useEffect(() => {
    const waitUntilReady = async () => {
        let ready = false;
        let tries = 0;
        while (!ready && tries < 10) {
            ready = await checkBackendHealth();
            if (!ready) {
                await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
                tries++;
            }
        }

        if (ready) {
            // Now safe to call /api/pacientes
            fetchData();
        } else {
            setError("Backend not responding");
            setLoading(false);
        }
    };

    waitUntilReady();
}, []);


    if (loading) return (
        <div>
            <h2>Lista de Pacientes</h2>
            <div>Cargando datos de pacientes...</div>
        </div>
    );

    if (error) return (
        <div>
            <h2>Lista de Pacientes</h2>
            <div className="text-red-500">Error: {error}</div>
        </div>
    );


    return (
        <div>
            <div className='align-center, justify-center py-3 px-6'>
                <h2 className='text-gray-900 mb-10 px-6 text-2xl font-bold '>Lista de Pacientes</h2>
            </div>
            <ScrollableDataTable data={data} columns={columns} onClick = {onClick}/>
            <div className='flex justify-end mt-4 mr-6'> {/* Added 'flex' and 'justify-end' */}
                <Link to="/paciente/add" className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full">
                    Agregar Paciente
                </Link>
            </div>
            
        </div>
    );
}

