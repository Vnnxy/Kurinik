import { useEffect, useState } from "react";
import {
  Button,
  Menu, 
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  IconButton
} from "@material-tailwind/react"; 
import { RecetaModal } from "../receta-page/recetaModal";
import { useParams } from "react-router-dom";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { generateDocx } from "../../utils/docxGen";


// Make sure to pass idPaciente as a prop
export default function RecetasDisplayer({ idPaciente, pacienteData, notaData }) { // Added pacienteData prop
  const [recetas, setRecetas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState(null);
  const {idNota} = useParams()
  // Function to fetch recipes for the specific patient
  const fetchRecetas = async () => {
    if (!idNota) {
      console.warn("No idNota provided to RecetasDisplayer.");
      setRecetas([]); 
      return;
    }
    try {

      const resRecetas = await fetch(`http://localhost:8080/api/recetas/${idNota}`);
      if (!resRecetas.ok) {
        throw new Error(`HTTP error! status: ${resRecetas.status}`);
      }
      const jsonReceta = await resRecetas.json();
      setRecetas(jsonReceta);
    } catch (e) {
      console.error("Error fetching recetas:", e);
      setRecetas([]); 
    }
  };

  useEffect(() => {
    fetchRecetas();
  }, [idNota]); 

  const handleOpenModal = (receta = null) => {
    setSelectedReceta(receta);
    setModalOpen(true);
  };

  const handleGenerateDocx = async (recetaData, pacienteData) => {
        let signos = {}
        try {
            signos = JSON.parse(notaData.signos);
        } catch (e) {
            console.error("Error parsing nota string:", e);
            signos = { fc: 'N/A', fr: 'N/A', ta: 'N/A' };
        }
        const allItems = JSON.parse(recetaData.archivo);
        const items = []
        const controlledItems = [];

        allItems.forEach(item => {
        if (item.type === 'farmaco') {
            const formattedItem = {
                text: `• ${item.farmacoName} (${item.dosis}) - ${item.instructions}`,
            };
            items.push(formattedItem)
            if(item.isControlado){
              const controlledFormattedItem = {
                    text: `• ${item.farmacoName} (${item.dosis}) - ${item.instructions}`,
                };
                controlledItems.push(controlledFormattedItem);
            }
            } 
            else if (item.type === 'instruction') {
                items.push({ text: `• ${item.text}`});
            }
         });
        
        const documentsToGenerate = [];

        documentsToGenerate.push({
        data: {
            nombre_completo: `${pacienteData.nombre} ${pacienteData.apellido}`,
            fecha: notaData.fecha,
            fc: signos.fc,
            fr: signos.fr,
            ta: signos.ta,
            peso: notaData.peso ? `${notaData.peso} kg` : 'N/E', 
            archivo: items // This DOCX will have all regular items
        },
        filename: `Receta_${pacienteData.nombre.replace(/\s/g, '')}_${pacienteData.apellido.replace(/\s/g, '')}_${recetaData.idReceta}_${notaData.fecha}.docx`
    });
        if (controlledItems.length > 0){
          let i = 1
          for (const controlledItem of controlledItems) {
            
            documentsToGenerate.push({
              data: {
                nombre_completo: `${pacienteData.nombre} ${pacienteData.apellido}`,
                fecha: notaData.fecha,
                fc: signos.fc,
                fr: signos.fr,
                ta: signos.ta,
                peso:notaData.peso + "kg",
                archivo: controlledItem
              }, filename: `RecetaControlada_${controlledItem.farmacoName}_${recetaData.idReceta}_${notaData.fecha}_${i}.docx`
            }
            )
            i+=1
          }
        }
        let allSuccess = true;
    const generatedFilenames = [];
    const errors = [];

    for (const docInfo of documentsToGenerate) {
        // 1. Generate the DOCX blob's ArrayBuffer in the renderer
        const generateResult = await generateDocx(docInfo.data); // generateDocx no longer takes filename
        if (!generateResult.success) {
            console.error(`Error generating DOCX for ${docInfo.filename}:`, generateResult.error);
            errors.push(generateResult.error);
            allSuccess = false;
            continue; // Move to the next document if generation failed
        }

        // 2. Send the ArrayBuffer to the main process to initiate a silent download
        const downloadResult = await window.electron.invoke('initiate-silent-download', {
            arrayBuffer: generateResult.arrayBuffer, // Pass the ArrayBuffer
            filename: docInfo.filename,
            mimeType: generateResult.mimeType
        });

        if (downloadResult.success) {
            console.log(downloadResult.message);
            generatedFilenames.push(docInfo.filename);
        } else {
            console.error(`Error initiating download for ${docInfo.filename}:`, downloadResult.message || downloadResult.error);
            errors.push(downloadResult.message || downloadResult.error);
            allSuccess = false;
        }
    }

    // --- Final alert for user feedback ---
    if (allSuccess) {
        alert(`Se inició la descarga de ${generatedFilenames.length} archivos: ${generatedFilenames.join(', ')}.\nRevise su carpeta de descargas.`);
    } else {
        alert(`Hubo errores al generar o descargar algunas recetas.\nErrores: ${errors.join('\n')}`);
    }

  };

  const handleSaveReceta = async (updatedReceta) => {
    try {
      const method = updatedReceta.idReceta ? 'PUT' : 'POST';
      const url = method==="POST" ? `http://localhost:8080/api/recetas` : `http://localhost:8080/api/recetas/${updatedReceta.idReceta}` 
      
      // Ensure idPaciente is set for new recipes
      if (method === 'POST' && !updatedReceta.idPaciente) {
        updatedReceta.idPaciente = idPaciente;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReceta),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
      }

      fetchRecetas(); // Refresh data after save
      console.log("Receta saved successfully:", updatedReceta);
    } catch (error) {
      console.error("Error saving receta:", error);
    } finally {
        setModalOpen(false); // Close modal after save attempt
    }
  };

  const handleDeleteReceta = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/recetas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      fetchRecetas(); // Refresh data after delete
      console.log(`Receta with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting receta:", error);
      // Implement user feedback for error
    } finally {
        setModalOpen(false); // Close modal after delete attempt
    }
  };

  const parseRecetaItems = (archivoString) => {
  try {
    const parsed = JSON.parse(archivoString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error parsing receta archivo JSON:", error);
    return [];
  }
  };



  return (
    <div className="relative"> 
      <Menu>
        <MenuHandler>
          <Button color="black" >
            Recetas del Paciente {pacienteData?.nombre || ''}
          </Button>
        </MenuHandler>
        <MenuList className="max-h-72 overflow-y-auto w-72">
          <MenuItem onClick={() => handleOpenModal(null)} className="flex items-center gap-2 font-bold text-blue-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Crear Nueva Receta
          </MenuItem>
          <hr className="my-2 border-black-50" /> {/* Separator */}
          {recetas.length > 0 ? (
            recetas.map((receta) => {
              // Perform item parsing, date formatting, and summary generation FOR EACH RECETA
              const items = parseRecetaItems(receta.archivo);

              const summary = items.length > 0
                ? items.map(item => {
                    if (item.type === 'farmaco') {
                      return `${item.farmacoName} (${item.dosis})`;
                    } else if (item.type === 'instruction') {
                      return item.text;
                    }
                    return '';
                  })
                  .filter(Boolean)
                  .join(', ')
                : ''; // If no items, summary should be empty to allow specific fallback message
                
              return (
                <MenuItem
                  key={receta.idReceta}
                  // These classes are crucial for flex alignment
                  className="flex items-center pr-2 gap-2"
                >
                  {/* Clickable div for opening the modal, takes available space */}
                  <div
                    onClick={() => handleOpenModal(receta)}
                    className="flex-grow min-w-0 py-2 cursor-pointer" // Added cursor-pointer for better UX
                  >
                    <Typography variant="small" className="font-semibold text-black">
                      Receta ID: {receta.idReceta}
                    </Typography>
                    <Typography variant="small" color="gray" className="truncate text-xs mt-0.5">
                      {summary || 'No hay detalles de ítems para mostrar.'}
                    </Typography>
                  </div>


                  {/* DOCX Generate Button - Aligned to the end */}
                  <IconButton
                    variant="text"
                    color="black"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent MenuItem's onClick from firing
                      handleGenerateDocx(receta, pacienteData);
                    }}
                    className="ml-2 flex-shrink-0 z-50" // flex-shrink-0 prevents it from shrinking
                    title="Generar Receta (DOCX)"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                  </IconButton>
                </MenuItem>
              );
            })
          ) : (
            <MenuItem disabled className="italic text-gray-500">
              No hay recetas para esta nota.
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <RecetaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        receta={selectedReceta}
        paciente={pacienteData} // Pass the full pacienteData object to the modal
        onSave={handleSaveReceta}
        onDelete={handleDeleteReceta}
        idNota={idNota}
      />
    </div>
  );
}