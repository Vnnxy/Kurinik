import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Dialog,
  Textarea,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Checkbox, // Make sure Checkbox is imported
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function FarmacoModal({open, onClose, farmaco, onSave, onDelete}) {
  // Local state for the editable fields
  const [editableFarmaco, setEditableFarmaco] = useState({
    idFarmaco: null,
    nombre: "",
    controlado: false, // Ensure this defaults to false for new farmacos
    instruccionesPorDefecto: "",
    dosis: [],
  });

  // Effect to update local state when the 'farmaco' prop changes
  useEffect(() => {
    if (farmaco) {
      setEditableFarmaco({
        idFarmaco: farmaco.idFarmaco,
        nombre: farmaco.nombre || "",
        instruccionesPorDefecto: farmaco.instruccionesPorDefecto || "",
        // Ensure 'controlado' is correctly set based on the prop, defaulting to false if undefined
        controlado: farmaco.controlado || false,
        // Convert array of dosis back to a comma-separated string for editing
        dosis: (farmaco.dosis || []).join(", "),
      });
    } else {
      // Reset when no farmaco is selected (e.g., modal is for creating a new farmaco)
      setEditableFarmaco({
        idFarmaco: null,
        nombre: "",
        instruccionesPorDefecto: "",
        controlado: false, // Reset to false for new entries
        dosis: "", // Reset to empty string for the textarea
      });
    }
  }, [farmaco]);

  // Handler for text input changes (nombre, instruccionesPorDefecto, dosis)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableFarmaco((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for checkbox change
  const handleCheckboxChange = (e) => {
    setEditableFarmaco((prev) => ({
      ...prev,
      // Checkboxes use e.target.checked to get their boolean state
      controlado: e.target.checked,
    }));
  };

  // Handler for the Save button
  const handleSave = () => {
    // Before saving, convert the dosis string back into an array
    const farmacoToSave = {
      ...editableFarmaco,
      // Split by comma, trim whitespace, and filter out any empty strings
      dosis: editableFarmaco.dosis
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d !== ""),
    };
    onSave(farmacoToSave); // Call the onSave prop passed from the parent
    onClose(); // Close the modal after saving
  };

  // Handler for the Delete button
  const handleDelete = () => {
    // Confirm deletion with the user
    if (window.confirm("¿Estás seguro de que quieres eliminar este fármaco?")) {
      onDelete(editableFarmaco.idFarmaco); // Call the onDelete prop
      onClose(); // Close the modal after deletion
    }
  };

  return (
    <Dialog size="sm" open={open} handler={onClose} className="p-4">
      <DialogHeader className="relative m-0 block text-center">
        <Typography variant="h4" color="blue-gray">
          {editableFarmaco.idFarmaco ? "Editar Fármaco" : "Crear Nuevo Fármaco"}
        </Typography>
        <Typography className="mt-1 font-normal text-gray-800">
          {editableFarmaco.idFarmaco ? "Modifica los detalles del fármaco." : "Introduce los detalles del nuevo fármaco."}
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={onClose}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-4 pb-6">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
            Nombre
          </Typography>
          <Input
            name="nombre"
            value={editableFarmaco.nombre}
            onChange={handleChange}
            placeholder="Ej: Ibuprofeno"
          />
        </div>

        {/* Checkbox for 'controlado' status */}
        <div className="flex items-center gap-2"> {/* Use flex to align label and checkbox */}
          <Checkbox
            label="Medicamento Controlado" // Material Tailwind checkbox takes a label prop
            checked={editableFarmaco.controlado} // Controlled component: value comes from state
            onChange={handleCheckboxChange} // Handler for state update
            name="controlado" // Good practice to include name
            color="light-blue" // Optional: color for the checkbox
          />
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
            Instrucciones Por Defecto
          </Typography>
          <Textarea
            name="instruccionesPorDefecto"
            value={editableFarmaco.instruccionesPorDefecto}
            onChange={handleChange}
            placeholder="Ej: Tomar con alimentos, cada 8 horas."
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
            Dosis (separadas por comas)
          </Typography>
          <Textarea
            name="dosis"
            value={editableFarmaco.dosis}
            onChange={handleChange}
            rows={3}
            placeholder="Ej: 500mg,1000mg,250mg"
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between items-center">
        {/* Delete button only appears if editing an existing farmaco */}
        {editableFarmaco.idFarmaco && (
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Eliminar
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            variant="text"
            color="blue-gray"
            onClick={onClose}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="gray" onClick={handleSave}> {/* Changed color to gray for Save */}
            <span>Guardar</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}