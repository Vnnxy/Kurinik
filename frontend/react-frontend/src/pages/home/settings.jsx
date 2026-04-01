import React, { useState } from "react";
import {
  Typography,
  Input, 
  Button,
} from "@material-tailwind/react";

export default function Settings() {
  const [logoFile, setLogoFile] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);

  const handleLogoChange = (event) => {
    setLogoFile(event.target.files[0]);
  };

  const handleTemplateChange = (event) => {
    setTemplateFile(event.target.files[0]);
  };

  const saveLogo = async () => {
    if (logoFile) {
      try{
        const arrayBuffer = await logoFile.arrayBuffer()
        const result = await window.electron.invoke('save-file',{
          type:'logo',
          filename:'logoFile.name',
          data: arrayBuffer,
          //overrite
        })
        if(result.success){
          alert(`Logotipo "${logoFile.name}" guardado correctamente en: ${result.filePath}`);
        }else {
          alert(`Error al guardar el logotipo: ${result.error}`);
        }
      }
        catch(e){
          console.error("Error saving logo:", e);
          alert(`Error inesperado al guardar el logotipo: ${e.message}`);
        }
    } else {
      alert("Por favor, selecciona un archivo de logo primero.");
    }
  };

   const saveTemplate = async () => {
    if (templateFile) {
      try {
        // Read file content as ArrayBuffer to send over IPC
        const arrayBuffer = await templateFile.arrayBuffer();

        // Call Electron main process to save the file
        const result = await window.electron.invoke('save-file', {
          type: 'template',
          filename: templateFile.name,
          data: arrayBuffer,
        });

        if (result.success) {
          alert(`Plantilla "${templateFile.name}" guardada correctamente en: ${result.filePath}`);
          // For template, you might store this path in an Electron config store
          // so your DOCX generation logic knows where to look for the custom template.
        } else {
          alert(`Error al guardar la plantilla: ${result.error}`);
        }
      } catch (error) {
        console.error("Error saving template:", error);
        alert(`Error inesperado al guardar la plantilla: ${error.message}`);
      }
    } else {
      alert("Por favor, selecciona un archivo de plantilla primero.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md mt-8">
      <Typography variant="h4" color="blue-gray" className="mb-6 text-center">
        Ajustes
      </Typography>

      {/* Logo Section */}
      <div className="mb-8">
        <Typography variant="h6" color="blue-gray" className="mb-2">
          Logotipo
        </Typography>
        <Input
          type="file"
          id="logo_file_input"
          label="Seleccionar archivo de logo"
          accept=".png, .jpg, .jpeg" // Specify accepted file types
          onChange={handleLogoChange}
          className="mb-2"
        />
        <Typography variant="small" color="gray" className="mt-1">
          Formatos permitidos: PNG, JPG.
        </Typography>
        {logoFile && (
          <Typography variant="small" color="blue-gray" className="mt-1">
            Archivo seleccionado: <span className="font-semibold">{logoFile.name}</span>
          </Typography>
        )}
        <Button
          className="mt-4"
          color="gray"
          onClick={saveLogo}
          disabled={!logoFile}
        >
          Guardar Logotipo
        </Button>
      </div>

      <hr className="my-6 border-blue-gray-100" />

      {/* Template Section */}
      <div className="mb-8">
        <Typography variant="h6" color="blue-gray" className="mb-2">
          Plantilla de Receta (DOCX)
        </Typography>
        <Input
          type="file"
          id="template_file_input"
          label="Seleccionar archivo de plantilla"
          accept=".docx" // Specify accepted file types
          onChange={handleTemplateChange}
          className="mb-2"
        />
        <Typography variant="small" color="gray" className="mt-1">
          Formato permitido: .docx
        </Typography>
        {templateFile && (
          <Typography variant="small" color="blue-gray" className="mt-1">
            Archivo seleccionado: <span className="font-semibold">{templateFile.name}</span>
          </Typography>
        )}
        <Button
          className="mt-4"
          color="gray"
          onClick={saveTemplate}
          disabled={!templateFile}
        >
          Guardar Plantilla
        </Button>
      </div>
    </div>
  );
}