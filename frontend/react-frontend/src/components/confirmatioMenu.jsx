import { useState } from "react";

export default function ConfirmationMenu(){
    const [showConfirm, setShowConfirm] = useState(false);

    // JSX
    {showConfirm && (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded">
        <p>¿Estás seguro de que deseas eliminar este paciente?</p>
        <div className="flex gap-4 mt-4">
            <button onClick={() => setShowConfirm(false)}>Cancelar</button>
            <button onClick={() => { deletePaciente(); setShowConfirm(false); }}>Eliminar</button>
        </div>
        </div>
    </div>
    )}
}

