import { useState, useEffect } from "react";

import ScrollableDataTable from "../../components/scrollableTable";
import { FarmacoModal } from "./farmacoModal";
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { Button, ThemeProvider } from "@material-tailwind/react"; // Ensure ThemeProvider is imported if not in index.js

export default function FarmacosMenu (){
    const [data, setData] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFarmaco, setSelectedFarmaco] = useState(null)


    const columns = [
    {
        accessorKey: 'nombre',
        header: 'Nombre',
    },
    {
        accessorKey: 'instruccionesPorDefecto',
        header: 'Instrucciones',
    },
    {
        accessorKey: 'dosis',
        header: 'Dosis',
        cell: info => (info.getValue() || []).join(', ')
    },
    {
        accessorKey: 'controlado',
        header: 'Controlado',
        // Use the 'cell' property to customize rendering
        cell: info => (info.getValue() ? 'Sí' : 'No')
    }
];

    const onClick = (row) =>{
        // Fix for ScrollableDataTable: row.original is the full data object
        setSelectedFarmaco(row); 
        setModalOpen(true)
    }

    const addFarmaco = () =>{
        setSelectedFarmaco(null);
        setModalOpen(true)
    }
    // Function to fetch data from the API
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/farmacos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            setData(json);
        } catch (e) {
            console.error("Error fetching data: ", e);
        } 
    };

    // Initial data fetch on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) =>{
        try{
            await fetch(`http://localhost:8080/api/farmacos/${id}`,{
                method: "DELETE",
            })
            fetchData(); 
        }
        catch (error) {
            console.error("Error saving farmaco:", error);
    }
    }

    // Handler for saving changes from the modal
    const handleSaveFarmaco = async (updatedFarmaco) => {
        try {
            // Determine if it's an update (farmaco has an ID) or a new entry (if you add a "new" button later)
            const method = updatedFarmaco.idFarmaco ? 'PUT' : 'POST'; // Assuming PUT for update, POST for new

            const url = updatedFarmaco.idFarmaco 
                ? `http://localhost:8080/api/farmacos/${updatedFarmaco.idFarmaco}`
                : `http://localhost:8080/api/farmacos`; // Adjust for your new farmaco endpoint if needed

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFarmaco),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // After successful update, re-fetch data or update local state
            // Option 1: Re-fetch all data (simpler for now, ensures consistency)
            fetchData(); 

            // Option 2: Update local state (more efficient for large datasets)
            // setData(prevData => prevData.map(farmaco => 
            //     farmaco.id === updatedFarmaco.id ? updatedFarmaco : farmaco
            // ));

            console.log("Farmaco saved successfully:", updatedFarmaco);

        } catch (error) {
            console.error("Error saving farmaco:", error);
            // Optionally, show an error message to the user
        }
    };


    return(
        // Ensure ThemeProvider wraps the root if it's not already in index.js
        <ThemeProvider> 
            <div>
                <div className="sticky top-0 left-0 right-0 bg-white shadow-md z-10 py-3 px-6  flex items-center">

                 <h2 className="text-2xl ml-8 font-bold text-gray-900">Lista de Fármacos</h2>
                 
                </div>
                <ScrollableDataTable data={data} columns={columns} onClick = {onClick}/>
                <div className='flex justify-end mt-4 mr-6'>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-full" onClick={addFarmaco}> Agregar Fármaco</Button>
                </div>
                <FarmacoModal 
                    open={modalOpen} 
                    onClose={()=> setModalOpen(false)} 
                    farmaco={selectedFarmaco}
                    onSave={handleSaveFarmaco} // Pass the save handler
                    onDelete={handleDelete}
                />
            </div>
        </ThemeProvider>
    )
}