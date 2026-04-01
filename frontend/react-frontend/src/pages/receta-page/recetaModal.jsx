import { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  Checkbox,
  Dialog,
  Textarea,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon, PlusIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"; 

export function RecetaModal({ open, onClose, receta, paciente, onSave, onDelete, idNota }) {
  // State for the main receta details
  const [editableReceta, setEditableReceta] = useState({
    idReceta: null,
    idNota: idNota,
    idPaciente: paciente?.idPaciente || "", 
    archivo: "", 
    items: [], 
  });

  // State for farmacos fetched from API
  const [availableFarmacos, setAvailableFarmacos] = useState([]);
  const [filteredFarmacos, setFilteredFarmacos] = useState([]);
  // State for managing new item input
  const [newItemType, setNewItemType] = useState(null); // 'instruction' or 'farmaco'
  const [farmacoInputText, setFarmacoInputText] = useState(""); 
  const [newInstructionText, setNewInstructionText] = useState("");
  const [newFarmacoDosis, setNewFarmacoDosis] = useState("");
  const [dosisList, setDosisList] = useState([])
  const [instruccionesPorDefecto, setInstuccionesPorDefecto] = useState("")
  const [selectedFarmacoObject, setSelectedFarmacoObject] = useState(null);
  const suggestionsRef = useRef(null);
  const [controlado, setControlado] = useState(false)

  //Editing states
  const [editingItemIndex, setEditingItemIndex] = useState(null); // Index of the item being edited
  const [editingItemType, setEditingItemType] = useState(null); // 'instruction' or 'farmaco' for the item being edited

  // --- Effects ---

  // Effect to fetch available farmacos
  useEffect(() => {
    const fetchFarmacos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/farmacos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setAvailableFarmacos(json);
        setFilteredFarmacos(json);
      } catch (e) {
        console.error("Error fetching farmacos: ", e);
      }
    };
    fetchFarmacos();
  }, []);

  const parseRecetaItems = (archivoString) => {
    try {
      const parsed = JSON.parse(archivoString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing receta archivo JSON:", error);
      return [];
    }
  };

  // Effect to initialize/reset modal state when 'receta' prop changes
  useEffect(() => {
    if (receta) {
      const itemsData = parseRecetaItems(receta.archivo)
      setEditableReceta({
        idReceta: receta.idReceta || null,
        idNota: receta.idNota,
        idPaciente: receta.idPaciente || paciente?.idPaciente || "",
        archivo: receta.archivo || "",
        items: itemsData || [], 
      });
    } else {
      // new receta
      setEditableReceta({
        idReceta: null,
        idNota : idNota,
        idPaciente: paciente?.idPaciente || "",
        archivo: "",
        items: [],
      });
    }
    //new item input fields
    setNewItemType(null);
    setNewInstructionText("");
    setNewFarmacoDosis("");
    setFarmacoInputText("");
    setDosisList([]);
    setInstuccionesPorDefecto("")
    setSelectedFarmacoObject(null);
    setEditingItemIndex(null); 
    setEditingItemType(null);
    setControlado(false)
  }, [receta, paciente, idNota]); 
  //Effect for matching suggestions
  useEffect(() => {
    if (farmacoInputText.trim() === "") {
      setFilteredFarmacos([]); // No suggestions if input is empty
    } else {
      const lowerCaseInput = farmacoInputText.toLowerCase();
      const newFiltered = availableFarmacos.filter(f =>
        f.nombre.toLowerCase().includes(lowerCaseInput)
      );
      setFilteredFarmacos(newFiltered);
      const exactMatch = availableFarmacos.find(f => f.nombre.toLowerCase() === lowerCaseInput);
      if (exactMatch && !selectedFarmacoObject) { 
        setSelectedFarmacoObject(exactMatch);
      } else if (!exactMatch && selectedFarmacoObject && selectedFarmacoObject.nombre.toLowerCase() !== lowerCaseInput) {
        setSelectedFarmacoObject(null);
      }
    }
  }, [farmacoInputText, availableFarmacos, selectedFarmacoObject]);

   useEffect(() => {
    if (selectedFarmacoObject) {
      setInstuccionesPorDefecto(selectedFarmacoObject.instruccionesPorDefecto || "");
      setDosisList(selectedFarmacoObject.dosis || []);
      setControlado(selectedFarmacoObject.controlado || false);
    } else {
      setInstuccionesPorDefecto("");
      setDosisList([]);      
    }
  }, [selectedFarmacoObject]); 

  // --- Handlers ---

  const handleSelectSuggestion = (farmaco) => {
    setFarmacoInputText(farmaco.nombre); // Fill input with selected name
    setSelectedFarmacoObject(farmaco); // Set the full farmaco object
    setFilteredFarmacos([]); // Hide suggestions
    setInstuccionesPorDefecto(farmaco.instruccionesPorDefecto || "");
    setDosisList(farmaco.dosis || []);
    setControlado(farmaco.controlado || false);
  };

  const handleEditItem = (itemToEdit, index) => {
    setEditingItemIndex(index);
    setEditingItemType(itemToEdit.type); // Set the type of item being edited

    if (itemToEdit.type === 'instruction') {
      setNewInstructionText(itemToEdit.text);
      setNewItemType('instruction'); // Show the instruction input section
    } else if (itemToEdit.type === 'farmaco') {
      setFarmacoInputText(itemToEdit.farmacoName);
      setNewFarmacoDosis(itemToEdit.dosis);
      setInstuccionesPorDefecto(itemToEdit.instructions || ""); // Populate instructions
      // Attempt to pre-select the farmaco object if its ID exists
      const foundFarmaco = availableFarmacos.find(f => f.idFarmaco === itemToEdit.farmacoId);
      setSelectedFarmacoObject(foundFarmaco || null);
      setControlado(itemToEdit.isControlado || false);
      if (foundFarmaco) {
        setDosisList(foundFarmaco.dosis || []); // Populate dosis list if found
      } else {
        setDosisList([]); // Clear dosis list if custom farmaco
      }
      setNewItemType('farmaco'); // Show the farmaco input section
    }
  };
  
  const handleAddOrUpdateItem = () => {
    if(editingItemIndex!== null &&editingItemType!== null){
      setEditableReceta((prev)=>{
        const updatedItems = [...prev.items]
        if(editingItemType === "instruction"){
          updatedItems[editingItemIndex] = {
            type: 'instruction',
            text: newInstructionText.trim(),
          }
        }
         else if (editingItemType === 'farmaco') {
          let finalFarmacoId = selectedFarmacoObject ? selectedFarmacoObject.idFarmaco : null;
          updatedItems[editingItemIndex] = {
            type: 'farmaco',
            farmacoId: finalFarmacoId,
            farmacoName: farmacoInputText.trim(),
            dosis: newFarmacoDosis.trim(),
            instructions: instruccionesPorDefecto,
            isControlado : controlado,
          };
        }
        return { ...prev, items: updatedItems };
      })
    }
    else{
    if (newItemType === 'instruction' && newInstructionText.trim()) {
      setEditableReceta((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          { type: 'instruction', text: newInstructionText.trim() },
        ],
      }));
      setNewInstructionText(""); // Clear input
      setNewItemType(null); // Hide input
    } else if (newItemType === 'farmaco') {
      let finalFarmacoName = farmacoInputText.trim();
      let finalFarmacoId = null;
      
      if(selectedFarmacoObject){
        finalFarmacoId = selectedFarmacoObject.idFarmaco
      }
       if (finalFarmacoName && newFarmacoDosis.trim()) { // Ensure both name and dose are present
        setEditableReceta((prev) => ({
          ...prev,
          items: [
            ...prev.items,
            {
              type: 'farmaco',
              farmacoId: finalFarmacoId, // Will be null for custom farmacos
              farmacoName: finalFarmacoName,
              dosis: newFarmacoDosis.trim(),
              instructions: instruccionesPorDefecto, // Use the instructions from the input
              isControlado: controlado
            },
          ],
        }));
        setFarmacoInputText("");
        setSelectedFarmacoObject(null);
        setNewFarmacoDosis("");
        setInstuccionesPorDefecto("");
        setDosisList([]);
        setNewItemType(null);
        setControlado(false)
      }else {
        alert("Por favor, introduce el nombre del fármaco y la dosis.");
      }
    };
  }
  handleCancelAddOrEdit();
  }

  const handleRemoveItem = (index) => {
    
    if (editingItemIndex === index) {
      handleCancelAddOrEdit();
    }
    setEditableReceta((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const { items, ...restOfReceta } = editableReceta;
    const recetaToSave = {
        ...restOfReceta, 
        archivo: JSON.stringify(items) 
    };
    onSave(recetaToSave); 
    onClose();
};

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta receta?")) {
      onDelete(editableReceta.idReceta);
      onClose();
    }
  };

  const handleCancelAddOrEdit = () => {
    setNewItemType(null);
    setNewInstructionText("");
    setNewFarmacoDosis("");
    setFarmacoInputText("");
    setDosisList([]);
    setInstuccionesPorDefecto("");
    setSelectedFarmacoObject(null);
    setEditingItemIndex(null);
    setEditingItemType(null);
    setControlado(false)
  };

  return (
    <Dialog size="lg" open={open} handler={onClose} className="p-4 max-w-4xl w-full">
      <DialogHeader className="relative m-0 block text-center">
        <Typography variant="h4" color="black">
          {receta ? "Editar Receta" : "Crear Nueva Receta"}
        </Typography>
        {paciente && (
          <Typography className="mt-1 font-normal text-gray-800">
            Paciente: {paciente.nombre} {paciente.apellido}
          </Typography>
        )}
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={onClose}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>

      <DialogBody className="space-y-6 pb-6 overflow-y-auto max-h-[60vh]">
        <div className="border p-4 rounded-lg bg-gray-50">
          <Typography variant="h6" color="black" className="mb-4">
            Instrucciones de la Receta
          </Typography>
          <div className="space-y-3">
            {editableReceta.items.length === 0 && (
              <Typography className="text-gray-600 italic">No hay elementos en esta receta. Agrega uno.</Typography>
            )}
            {editableReceta.items.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 border rounded-md shadow-sm ${editingItemIndex === index ? 'bg-blue-100 border-gray-800' : 'bg-white'}`}>
                {item.type === 'instruction' ? (
                  <Typography className="text-gray-800">
                    <span className="font-semibold">Instrucción:</span> {item.text}
                  </Typography>
                ) : (
                  <Typography className="text-gray-800">
                    <span className="font-semibold">Fármaco:</span> {item.farmacoName} - Dosis: {item.dosis} - Instrucciones: {item.instructions}
                  </Typography>
                )}
                <div className="flex gap-2">
                  <IconButton
                    size="sm"
                    variant="text"
                    color="black"
                    onClick={() => handleEditItem(item, index)}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="text"
                    color="red"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outlined"
              color="black"
              onClick={() => {
                setNewItemType('instruction');
                setEditingItemIndex(null); // Clear editing when adding new
                setEditingItemType(null);
                setNewInstructionText(""); // Clear previous text
              }}
              className="flex items-center gap-2"
              disabled={newItemType === 'instruction' && editingItemIndex === null} // Disable if already adding this type
            >
              <PlusIcon className="h-4 w-4" /> Añadir Instrucción
            </Button>
            <Button
              variant="outlined"
              color="black"
              onClick={() => {
                setNewItemType('farmaco');
                setEditingItemIndex(null); // Clear editing when adding new
                setEditingItemType(null);
                setFarmacoInputText(""); // Clear previous text
                setNewFarmacoDosis("");
                setInstuccionesPorDefecto("");
                setSelectedFarmacoObject(null);
              }}
              className="flex items-center gap-2"
              disabled={newItemType === 'farmaco' && editingItemIndex === null} // Disable if already adding this type
            >
              <PlusIcon className="h-4 w-4" /> Añadir Fármaco
            </Button>
          </div>

          {(newItemType || editingItemIndex !== null) && ( // Show input section if adding or editing
            <div className="mt-4 p-4 border rounded-lg bg-white flex flex-col gap-3">
              <Typography variant="small" color="black" className="font-medium">
                {editingItemIndex !== null
                  ? `Editar ${editingItemType === 'instruction' ? 'Instrucción' : 'Fármaco'}`
                  : `${newItemType === 'instruction' ? 'Instrucción Personalizada' : 'Fármaco'}`}
              </Typography>

              {editingItemType === 'instruction' || newItemType === 'instruction' ? (
                <>
                  <Textarea
                    value={newInstructionText}
                    onChange={(e) => setNewInstructionText(e.target.value)}
                    placeholder="Escribe la instrucción aquí..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddOrUpdateItem} disabled={!newInstructionText.trim()}>
                      {editingItemIndex !== null ? "Actualizar Instrucción" : "Agregar Instrucción"}
                    </Button>
                    {editingItemIndex !== null && ( // Show cancel button only when editing
                      <Button size="sm" variant="outlined" color="black" onClick={handleCancelAddOrEdit}>
                        Cancelar Edición
                      </Button>
                    )}
                  </div>
                </>
              ) : (editingItemType === 'farmaco' || newItemType === 'farmaco') && (
                <>
                  <div className="relative w-full">
                    <Input
                      label="Nombre del Fármaco (escribe o selecciona)"
                      value={farmacoInputText}
                      onChange={(e) => {
                        setFarmacoInputText(e.target.value);
                      }}
                      placeholder="Ej: Ibuprofeno, Paracetamol"
                      className="w-full"
                    />
                    <div className="gap-2 mt-2 items-center flex">
                      <Typography variant="small" color="black" className="font-medium" >Controlado</Typography>
                      <Checkbox
                        ripple={true}
                        checked={controlado}
                        onChange={(e) => setControlado(e.target.checked)}
                        className="text-gray-800 rounded focus:ring-gray-400"
                      />
                    </div>
                    

                    {farmacoInputText.trim() !== "" && filteredFarmacos.length > 0 && !selectedFarmacoObject && (
                      <div
                        ref={suggestionsRef}
                        className="absolute z-50 bg-white border border-black-200 rounded-md shadow-lg mt-1 w-full max-h-60 overflow-y-auto"
                        style={{ top: '100%' }}
                      >
                        <ul className="py-1">
                          {filteredFarmacos.map((f) => (
                            <li
                              key={f.idFarmaco}
                              className="px-4 py-2 hover:bg-black-50 cursor-pointer"
                              onClick={() => handleSelectSuggestion(f)}
                            >
                              {f.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Input
                    label="Dosis:"
                    type="text"
                    list="dosis-options"
                    value={newFarmacoDosis}
                    onChange={(e) => setNewFarmacoDosis(e.target.value)}
                    placeholder="Seleccione o escriba la dosis"
                  />

                  <datalist id="dosis-options">
                    {dosisList.map((d, idx) => (
                      <option key={idx} value={d} />
                    ))}
                  </datalist>
                  <Input
                    label="Indicaciones: "
                    value={instruccionesPorDefecto}
                    onChange={(e) => setInstuccionesPorDefecto(e.target.value)}
                    placeholder="Ej: Tomar cada 12 horas con alimento."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddOrUpdateItem} disabled={!farmacoInputText.trim() || !newFarmacoDosis.trim()}>
                      {editingItemIndex !== null ? "Actualizar Fármaco" : "Agregar Fármaco"}
                    </Button>
                    {editingItemIndex !== null && ( // Show cancel button only when editing
                      <Button size="sm" variant="outlined" color="black" onClick={handleCancelAddOrEdit}>
                        Cancelar Edición
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-between items-center gap-2">
        <div>
          {receta && receta.idReceta && (
            <Button
              variant="gradient"
              color="red"
              onClick={handleDelete}
            >
              Eliminar Receta
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="text"
            color="black"
            onClick={onClose}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="black" onClick={handleSave}>
            <span>Guardar Receta</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}