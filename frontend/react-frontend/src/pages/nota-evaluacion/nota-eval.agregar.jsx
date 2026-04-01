import { Field, Input, Label } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactiveTextArea from '../../components/reactiveTextArea';
import CustomDropdown from '../../components/customDropdown';
import DateTimeInput from '../../components/dateTimeInput';


export default function NotaEvaluacionAdd(){
    const navigate = useNavigate();
    const [dataPaciente, setDataPaciente] = useState({
        nombre:"",
        apellido:"",
        sexo : "",
        fechaNacimiento: "",
        calle: "",
        colonia: "",
        estado: "",
        cp: 0,
        telefonos:[] ,
        correos:[]
    })
    const [historialMedico, setHistorialMedico] = useState([])
    const { idPaciente } = useParams();
    const opciones = ["Revisión", "Primera Consulta", "Procedimiento"]

    const [fc, setFc] = useState('');
    const [fr, setFr] = useState('');
    const [ta, setTa] = useState('');


    useEffect(() => {
        const fetchData = async () => {
          try {
            const responsePaciente = await fetch(`http://localhost:8080/api/pacientes/${idPaciente}`);
            if (!responsePaciente.ok) {
              throw new Error(`HTTP error! status: ${responsePaciente.status}`);
            }
            const jsonPaciente = await responsePaciente.json();
            setDataPaciente(jsonPaciente);
          
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
        idPaciente: idPaciente,
        fechaHora : formData.get("fechaHora"),
        peso: formData.get("peso"),
        altura: formData.get("altura"),
        signos: signosJson,
        notas: formData.get("notas"),
        motivo: formData.get("motivo")
      }

      try{
        const resNota = await fetch('http://localhost:8080/api/notaEvaluacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nota),
      });
      if (!resNota.ok) throw new Error('Error creando nota');
      const newNotaId = await resNota.json();

      navigate(`/notas/${idPaciente}/info/${newNotaId}`);
      }
      catch (err) {
      console.error(err);
      alert('Error guardando la nota');
      return false
    }
    }

    return (
      <div >

        {/* Sticky Header */}
        <div className="sticky top-0 left-0 right-0 bg-white shadow-md z-10 py-3 px-6 flex items-center justify-between">
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
          <h1 className="text-2xl font-bold text-gray-800">Nueva Nota de Evaluación</h1>
          <button
            type="button"
            onClick={() => document.getElementById('pacienteForm')?.requestSubmit()}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Guardar
          </button>
        </div>

        <div className="flex-1 p-12 mx-auto w-full">
        {/* Flex container for two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: Formulario */}
          <form id="pacienteForm" onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
            <section>
              <Field className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-800">Motivo de la Consulta</Label>
                <CustomDropdown className="border rounded p-2" name = "motivo" options={opciones}></CustomDropdown>
              </Field>

              <Field className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-800">Fecha y Hora</Label>
                <DateTimeInput name="fechaHora"></DateTimeInput>
              </Field>

              <Field className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-800">Peso (kg)</Label>
                <Input type="number" name="peso" className="border rounded p-2" />
              </Field>

              <Field className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-800">Altura (cm)</Label>
                <Input type="number" name="altura" className="border rounded p-2" />
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
                      className="border rounded p-2 flex-grow" // flex-grow makes input take available space
                      value={fc}
                      onChange={(e) => setFc(e.target.value)}
                      placeholder="Ej: 72 lpm" // Added placeholder for clarity
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
                      onChange={(e) => setTa(e.target.value)}
                      placeholder="Ej: 120/80 mmHg"
                    />
                  </div>
                </div>
              </Field>

              <Field className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-800">Notas</Label>
                <ReactiveTextArea name="notas" value="" />
              </Field>
            </section>
          </form>

          {/* Right: Información del Paciente */}
          <div className="w-full lg:w-2/5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-6 mt-6 h-fit">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
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
