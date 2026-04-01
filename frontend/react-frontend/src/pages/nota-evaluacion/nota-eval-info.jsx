import { useParams } from "react-router-dom"
import { Field, Input, Label } from '@headlessui/react';
import CustomDropdown from "../../components/customDropdown";
import DateTimeInput from "../../components/dateTimeInput";
import ReactiveTextArea from "../../components/reactiveTextArea";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationBlock } from "../../context/NavigationBlockerContext";
import RecetasDisplayer from "./recetas-displayer";
import Breadcrumbs from "../../components/breadcrumbs";


export default function NotaInfo(){
    const {idNota} = useParams("idNota")
    const {idPaciente} = useParams("idPaciente")
    const opciones = ["Revisión", "Primera Consulta", "Procedimiento"]

    const [fc, setFc] = useState('');
    const [fr, setFr] = useState('');
    const [ta, setTa] = useState('');

    const [notaData,setNotaData] = useState({
        motivo: "",
        fechaHora: "",
        peso: "",
        altura: "",
        signos: "",
        notas: "",
        id: "",
        idPaciente: ""
    })
    const [isEditing, setEditing] = useState(false)
    const [buttonText, setButtonText] = useState("Editar");
    const navigate = useNavigate()
    const [historialMedico, setHistorialMedico] = useState([])
    const [dataPaciente, setPaciente] = useState([])
    

    useEffect(() => {
        const fetchData = async () => {
          try {
            const responsePaciente = await fetch(`http://localhost:8080/api/pacientes/${idPaciente}`);
            if (!responsePaciente.ok) {
              throw new Error(`HTTP error! status: ${responsePaciente.status}`);
            }
            const jsonPaciente = await responsePaciente.json();
            setPaciente(jsonPaciente);
          
            const responseHistorial = await fetch(`http://localhost:8080/api/historialMedicos/${idPaciente}`);
            if (!responseHistorial.ok) {
              throw new Error(`HTTP error! status: ${responseHistorial.status}`);
            }
            const jsonHistorial = await responseHistorial.json();
            setHistorialMedico(jsonHistorial);
          } catch (e) {
            console.error("Error fetching data: ", e);
          } 
        };
    
        fetchData();
      }, [idPaciente]);

    const handleChange = (e) => {
        const { name, value } = e.target;
            setNotaData(prevData => ({ ...prevData, [name]: value }));
    }

    useEffect(()=>{
        const handleBeforeUnload = (e)=>{
          if(isEditing){
            e.preventDefault()
            e.returnValue = ""
          }
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return()=> window.removeEventListener("beforeunload", handleBeforeUnload)
      },[isEditing])

    const handleSubmit = async (e) =>{
      e.preventDefault()
      const form = e.target;
      const formData = new FormData(form);
      const signosData = {
            fc: fc,
            fr: fr,
            ta: ta
        };
      const signosJson = JSON.stringify(signosData);
      const nota = {
        idPaciente : notaData.idPaciente,
        fechaHora : formData.get("fechaHora"),
        peso: formData.get("peso"),
        altura: formData.get("altura"),
        signos: signosJson,
        notas: formData.get("notas"),
        motivo: formData.get("motivo")
      }

      try{
        const resNota = await fetch(`http://localhost:8080/api/notaEvaluacion/${notaData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nota),
      });
      if (!resNota.ok) throw new Error('Error creando nota');
      return true

      }
      catch (err) {
      console.error(err);
      alert('Error guardando la nota');
      return false
    }
    }

    const deleteHandler = async () =>{
        const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta nota? Los datos y recetas asociadas se perderán para siempre")
        if(confirmed){
        try{
            await fetch(`http://localhost:8080/api/notaEvaluacion/${notaData?.id}`, {
            method: 'DELETE',
            });
            alert("Nota eliminada correctamente.");
            navigate(`/notas/${notaData.idPaciente}`);
        }
            catch (error) {
                alert("Ocurrió un error al eliminar la nota.");
            }
            }
    
    }

    const editDataHandler = async() => {
    if (isEditing) {
      const form = document.getElementById('pacienteForm');
      if (form) {
        const result = await handleSubmit({ preventDefault: () => {} , target: form });
        if (result) {
          setEditing(false); 
        }
      }
    } else {
      setEditing(true);
    }
  };

    useEffect(() => {
    const fetchData = async () => {
      try {
        const responseNota = await fetch(`http://localhost:8080/api/notaEvaluacion/nota/${idNota}`);
        if (!responseNota.ok) {
          throw new Error(`HTTP error! status: ${responseNota.status}`);
        }
        const jsonNota = await responseNota.json();
        setNotaData(jsonNota);
        if (jsonNota.signos) {
                    try {
                        const parsedSignos = JSON.parse(jsonNota.signos);
                        setFc(parsedSignos.fc || '');
                        setFr(parsedSignos.fr || '');
                        setTa(parsedSignos.ta || '');
                    } catch (parseError) {
                        console.error("Error parsing signos JSON:", parseError);
                        // Optionally, set default empty values if parsing fails
                        setFc('');
                        setFr('');
                        setTa('');
                    }
                } else {
                    // Reset if signos field is empty or null
                    setFc('');
                    setFr('');
                    setTa('');
                }
      } catch (e) {

        console.error("Error fetching data: ", e);
      } 
    };

    fetchData();
  }, [idNota]);


  useEffect(() => {
    setButtonText(isEditing ? "Guardar" : "Editar");
  }, [isEditing]);

    return(
        <div className="">
            {/* Sticky Header */}
            <div className="sticky top-0 left-0 right-0 bg-white shadow-md z-10 py-3 px-6 flex items-center justify-between">
                <div className="flex justify-start space-x-8 content-center items-center">
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
                    <h1 className="text-2xl font-bold text-gray-800">Nota de Evaluación</h1>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            hidden={false}
                            id="edit-save"
                            onClick={editDataHandler}
                        >
                        {buttonText}
                        </button>
                        <button type="button" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400" id="delete" onClick={deleteHandler} >
                        Eliminar
                        </button>
                </div>
            
                <div className="justify-end space-x-4">
              
              {idPaciente && (
                <RecetasDisplayer
                    idPaciente={idPaciente}
                    pacienteData={dataPaciente}
                    notaData = {notaData}
                />
            )}
            </div>

            </div>

            <div className="flex-1 p-12 mx-auto w-full">
            {/* Flex container for two-column layout */}
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left: Formulario */}
              <form id="pacienteForm" onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                <section>                
                  <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Motivo de la Consulta</Label>
                    <CustomDropdown className="border rounded p-2" name = "motivo" options={opciones} value={notaData.motivo} disabled={!isEditing}></CustomDropdown>
                  </Field>
        
                  <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Fecha y Hora</Label>
                    <DateTimeInput name="fechaHora" value={notaData.fechaHora} disabled={!isEditing}></DateTimeInput>
                  </Field>
        
                  <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Peso (kg)</Label>
                    <Input type="number" name="peso" className="border rounded p-2" value={notaData.peso} disabled={!isEditing} onChange={handleChange} />
                  </Field>
        
                  <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Altura (cm)</Label>
                    <Input type="number" name="altura" className="border rounded p-2" value={notaData.altura} disabled={!isEditing} onChange={handleChange}/>
                  </Field>
        
                   <Field className="flex flex-col gap-1">

                <Label className="text-sm font-medium text-gray-800">Signos</Label>
                <div className="flex flex-wrap gap-4"> {/* Use flex-wrap to allow items to wrap on smaller screens */}
                  {/* FC */}
                  <div className='flex items-center gap-2 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33%-0.67rem)]'> {/* Adjusted width and gap */}
                    <Label className='flex-shrink-0 text-gray-700 text-sm font-medium'>FC:</Label> {/* flex-shrink-0 keeps label from shrinking */}
                    <Input
                      name="fc"
                      type="text"
                      className="border rounded p-2 flex-grow"
                      value={fc}
                      disabled={!isEditing}
                      onChange={(e) => setFc(e.target.value)}
                      placeholder="Ej: 72 lpm" 
                    />
                  </div>

                  {/* FR */}
                  <div className='flex items-center gap-2 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33%-0.67rem)]'>
                    <Label className='flex-shrink-0 text-gray-700 text-sm font-medium'>FR:</Label>
                    <Input
                      name="fr"
                      type="text"
                      className="border rounded p-2 flex-grow"
                      value={fr}
                      disabled={!isEditing}
                      onChange={(e) => setFr(e.target.value)}
                      placeholder="Ej: 16 rpm"
                    />
                  </div>

                  {/* TA */}
                  <div className='flex items-center gap-2 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33%-0.67rem)]'>
                    <Label className='flex-shrink-0 text-gray-700 text-sm font-medium'>TA:</Label>
                    <Input
                      name="ta"
                      type="text"
                      className="border rounded p-2 flex-grow"
                      value={ta}
                      disabled={!isEditing}
                      onChange={(e) => setTa(e.target.value)}
                      placeholder="Ej: 120/80 mmHg"
                    />
                  </div>
                </div>
              </Field>
        
                  <Field className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-800">Notas</Label>
                    <ReactiveTextArea name="notas" value={notaData.notas} disabled={!isEditing}/>
                  </Field>
                </section>
              </form>
                {/* Right: Información del Paciente */}
              <div className="w-full lg:w-2/5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-6 mt-6 h-fit">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Información General del Paciente
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">Nombre:</span>
                  <span className="text-gray-900">{dataPaciente.nombre} {dataPaciente.apellido}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">Edad:</span>
                  <span className="text-gray-900">{dataPaciente.edad}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">Rh:</span>
                  <span className="text-gray-900">{historialMedico.grupoSanguineo}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">A.p Patológicos:</span>
                  <span className="text-gray-900">{historialMedico.apPatologicos}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">A.p No Patológicos:</span>
                  <span className="text-gray-900">{historialMedico.apNoPatologicos}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">Heredo Familiares:</span>
                  <span className="text-gray-900">{historialMedico.apHeredoFam}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">Quirúrgicos:</span>
                  <span className="text-gray-900">{historialMedico.apQuirugicos}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">Gineco-Obstétricos:</span>
                  <span className="text-gray-900">{historialMedico.apGinecoObstreticos}</span>
                </div>
                
                <div className="flex justify-between pb-2">
                  <span className="font-medium text-gray-800">Exploración Física:</span>
                  <span className="text-gray-900">{historialMedico.exploracionFisica}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
        
    )
}