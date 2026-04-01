import { useState, useEffect } from "react";
import {useParams } from "react-router-dom";
import ReactiveTextArea from "../../components/reactiveTextArea";
import { Field, Input, Label } from '@headlessui/react';
import { useNavigate } from "react-router-dom";
import { useNavigationBlock } from "../../context/NavigationBlockerContext";


export default function InfoPaciente() {
  const[dataPaciente, setDataPaciente] = useState({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const isRequired = (name) => ['nombre', 'apellido', 'fechaNacimiento'].includes(name);
  const [isEditing, setEditing] = useState(false)
  const [buttonText, setButtonText] = useState("Editar");
  const {id} = useParams()
  const { setIsBlocking, shouldBlock } = useNavigationBlock();


  const handleNavigation= ()=>{
    if(shouldBlock(`/notas/${id}`)){
      navigate(`/notas/${id}`)
    }
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

  useEffect(() => {
    setButtonText(isEditing ? "Guardar" : "Editar");
    setIsBlocking(isEditing)
  }, [isEditing]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePaciente = await fetch(`http://localhost:8080/api/pacientes/${id}`);
        if (!responsePaciente.ok) {
          throw new Error(`HTTP error! status: ${responsePaciente.status}`);
        }
        const jsonPaciente = await responsePaciente.json();
        setDataPaciente(jsonPaciente);
      
        const responseHistorial = await fetch(`http://localhost:8080/api/historialMedicos/${id}`);
        if (!responseHistorial.ok) {
          throw new Error(`HTTP error! status: ${responseHistorial.status}`);
        }
        const jsonHistorial = await responseHistorial.json();
        setHistorialMedico(jsonHistorial);
      } catch (e) {
        setError(e.message);
        console.error("Error fetching data: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cp' && value === '') {
    setDataPaciente((prevData) => ({
      ...prevData,
      [name]: 0,  
    }));
  } else {
    setDataPaciente(prevData => ({ ...prevData, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); 
  }
  };

  const validateField = (name, value) => {
    if (isRequired(name) && !value) {
      return 'Este campo es requerido';
    }

    if (name === 'cp') {
      if (!value) value = '0'; 
      if (!/^\d+$/.test(value)) return 'Solo se permiten números';
  }

  if (name === 'telefonos') {
    // Allow empty input or only numeric values
    if (value && !/^\d+$/.test(value)) return 'Solo se permiten números';
  }


  if (name === 'correos') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Allow empty input or valid email format
    if (value && !emailRegex.test(value)) return 'Correo no válido';
  }


    return '';
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, e.target.value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    let isValid = true;
    const newErrors = {};

    // Validate required fields
    ['nombre', 'apellido', 'fechaNacimiento', 'cp'].forEach((name) => {
      const value = formData.get(name);
      const error = validateField(name, value);
      if (error) {
        newErrors[name] = error;
        isValid = false;
        setTouched((prev) => ({ ...prev, [name]: true })); 
      }
    });
    const telefonos = formData.getAll('telefonos');
    const correos = formData.getAll('correos');

    telefonos.forEach((tel) => {
      const error = validateField('telefonos', tel);
      if (error) {
        newErrors[`telefonos`] = error;
        isValid = false;
      }
    });

    correos.forEach((correo) => {
      const error = validateField('correos', correo);
      if (error) {
        newErrors[`correos`] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);

    if (!isValid) {
      alert('Por favor, complete los campos requeridos.');
      return false;
    }

    // Extract values
    const paciente = {
      nombre: formData.get('nombre'),
      apellido: formData.get('apellido'),
      sexo: formData.get('sexo'),
      fechaNacimiento: formData.get('fechaNacimiento'),
      calle: formData.get('calle') || null,
      colonia: formData.get('colonia') || null,
      estado: formData.get('estado') || null,
      cp: formData.get('cp') || null,
      telefonos: dataPaciente.telefonos.filter(tel => tel) || null, // 
      correos: dataPaciente.correos.filter(correo => correo) || null,   
    };

    try {
      // put to /api/pacientes
      const resPaciente = await fetch(`http://localhost:8080/api/pacientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paciente),
      });

      if (!resPaciente.ok) throw new Error('Error creando paciente');
   
      // Prepare historial data
      const historial = {
        grupoSanguineo: formData.get('rh') || null,
        apPatologicos: formData.get('antecedentesPatologicos') || null,
        apNoPatologicos: formData.get('antecedentesNoPatologicos') || null,
        apHeredoFam: formData.get('heredoFamiliares') || null,
        apQuirugicos: formData.get('quirurgicos') || null,
        apGinecoObstreticos: formData.get('ginecoObstetricos') || null,
        exploracionFisica: formData.get('exploracionFisica') || null,
      };

      // POST to /api/historialMedicos
      const resHistorial = await fetch(`http://localhost:8080/api/historialMedicos/${historialMedico?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historial),
      });

      if (!resHistorial.ok){
        console.log("Error en historial")
        throw new Error('Error creando historial médico');
        
      } 
      // Redirect
      return true

    } catch (err) {
      console.error(err);
      alert('Error guardando el paciente');
      return false
    }
  };

  const deleteHandler = async () =>{
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar al paciente? Sus datos y archivos asociados se perderán para siempre.")
    if(confirmed){
      try{
        await fetch(`http://localhost:8080/api/pacientes/${dataPaciente?.id}`, {
          method: 'DELETE',
        });
        alert("Paciente eliminado correctamente.");
        navigate(`/`);
      }
      catch (error) {
        alert("Ocurrió un error al eliminar el paciente.");
    }
    }
    
  }

  const addTelefono = () => {setDataPaciente({...dataPaciente,telefonos:[...dataPaciente.telefonos,""],})}
  const updateTelefono = (i, val) => {
    const copy = [...dataPaciente.telefonos];
    copy[i] = val;
    setDataPaciente({...dataPaciente, telefonos:copy});
  };

  const addCorreo = () => {setDataPaciente({...dataPaciente,correos:[...dataPaciente.correos,""],})}
  const updateCorreo = (i, val) => {
    const copy = [...dataPaciente.correos];
    copy[i] = val;
    setDataPaciente({...dataPaciente, correos:copy});
  };

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

 
  if (loading) {
    return (
      <div>
        <h2>Información del paciente</h2>
        <div>Cargando datos del paciente.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Información del paciente</h2>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="">
    
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
                
                <h1 className="text-2xl font-bold text-gray-900 ">Info de un paciente</h1>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  hidden={false}
                  id="edit-save"
                  onClick={editDataHandler}
                >
                  {buttonText}
                </button>
                <button type="button" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400" id="delete"
                  onClick={deleteHandler} >
                  Eliminar
                </button>
              </div>
            
            <div className="justify-end space-x-4 mr-10">
              
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={handleNavigation}
              >
                Notas Evaluación
              </button>
              
            </div>
            
          </div>
    
    
          
          <div className="flex-1 p-6 mx-auto w-full">
          {/* Información General */}
          <form id="pacienteForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
            <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-10">Información General del Paciente</h2>
    
            
                <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Nombre</Label>
                    <Input
                      disabled={!isEditing}
                      value={dataPaciente.nombre}
                      name="nombre"
                      className={`border rounded p-2 ${errors.nombre && touched.nombre ? 'border-red-500' : ''}`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                {errors.nombre && touched.nombre && <p className="text-red-500 text-xs italic">{errors.nombre}</p>}
                </Field>
    
                <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Apellidos</Label>
                    <Input
                      disabled={!isEditing}
                      value={dataPaciente.apellido}
                      name="apellido"
                      className={`border rounded p-2 ${errors.apellido && touched.apellido ? 'border-red-500' : ''}`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {errors.apellido && touched.apellido && <p className="text-red-500 text-xs italic">{errors.apellido}</p>}
                </Field>
    
                <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-700">Sexo</Label>
                    <select name="sexo" className="border rounded p-2" value={dataPaciente.sexo} onChange={(e) => setDataPaciente({ ...dataPaciente, sexo: e.target.value })} disabled={!isEditing}>
                    <option value="">Seleccione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                    </select>
                </Field>
    
                <Field className="flex flex-col gap-1">
 

                <div className="flex gap-4">
                  {/* Fecha de Nacimiento */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label className="text-sm font-medium text-gray-800">Fecha de Nacimiento</Label>
                    <Input
                      disabled={!isEditing}
                      value={dataPaciente.fechaNacimiento}
                      type="date"
                      name="fechaNacimiento"
                      className={`border rounded p-2 ${
                        errors.fechaNacimiento && touched.fechaNacimiento ? 'border-red-500' : ''
                      }`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {errors.fechaNacimiento && touched.fechaNacimiento && (
                      <p className="text-red-500 text-xs italic">{errors.fechaNacimiento}</p>
                    )}
                  </div>

                  {/* Edad */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label className="text-sm font-medium text-gray-800">Edad</Label>
                    <Input
                      type="text"
                      value={dataPaciente.edad}
                      disabled
                      className="border rounded p-2 bg-gray-100 text-gray-800"
                    />
                  </div>
                </div>
              </Field>
    
                {/* Dirección */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Calle</Label>
                    <Input name="calle" className="border rounded p-2" disabled={!isEditing} value={dataPaciente.calle} onChange={handleChange}/>
                    </Field>
                    <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Colonia</Label>
                    <Input name="colonia" className="border rounded p-2" disabled={!isEditing} value={dataPaciente.colonia} onChange={handleChange}/>
                    </Field>
                    <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Estado</Label>
                    <Input name="estado" className="border rounded p-2" disabled={!isEditing} value={dataPaciente.estado} onChange={handleChange}/>
                    </Field>
                    <Field className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Código Postal</Label>
                    <Input name="cp" className={`border rounded p-2 ${errors.cp && touched.cp ? 'border-red-500' : ''}`} disabled={!isEditing} value={dataPaciente.cp} onChange={handleChange} onBlur={handleBlur}/>
                    {errors.cp && touched.cp && (
                      <p className="text-red-500 text-xs italic">{errors.cp}</p>
                    )}
                    </Field>
                </div>
    
                {/* Teléfonos */}
                <div className="md:col-span-2">
                    <h1 className="text-sm font-medium text-gray-800">Teléfonos</h1>
                    {dataPaciente.telefonos.map((tel, i) => (
                    <Input
                        name="telefonos"
                        key={i}
                        value={tel}
                        onChange={(e) => updateTelefono(i, e.target.value)}
                        className={`border rounded p-2 my-1 w-full ${errors.telefonos && touched.telefonos ? 'border-red-500' : ''}`}
                        disabled={!isEditing} 
                        onBlur={handleBlur}
                    />
                    ))}
                     {errors.telefonos && touched.telefonos && (
                      <p className="text-red-500 text-xs italic">{errors.telefonos}</p>
                    )}
                    <button
                    type="button"
                    onClick={addTelefono}
                    className="text-sm text-gray-600 hover:underline mt-1"
                    hidden={!isEditing}
                    >
                    + Añadir teléfono
                    </button>
                </div>
    
                {/* Correos */}
                <div className="md:col-span-2">
                    <h1 className="text-sm font-medium text-gray-800">Correos</h1>
                    {dataPaciente.correos.map((correo, i) => (
                    <Input
                        name="correos"
                        key={i}
                        value={correo}
                        onChange={(e) => updateCorreo(i, e.target.value)}
                        type="email"
                        className={`border rounded p-2 my-1 w-full ${errors.correos && touched.correos ? 'border-red-500' : ''}`}
                        disabled={!isEditing}
                        onBlur={handleBlur}
         
                    />
                    ))}
                    {errors.correos && touched.correos && (
                      <p className="text-red-500 text-xs italic">{errors.correos}</p>
                    )}
                    <button
                    type="button"
                    onClick={addCorreo}
                    className="text-sm text-gray-600 hover:underline mt-1"
                    hidden={!isEditing}
                    >
                    + Añadir correo
                    </button>
                </div>
    
            </section>
    
                {/* Historial Médico */}
            <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial Médico</h2>
    
                {/* RH */}
                <Field className="md:col-span-2 flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-800">Rh</Label>
                    <select name="rh" className="border rounded p-2 w-full" value={historialMedico.grupoSanguineo} onChange={(e) => setHistorialMedico({ ...historialMedico, grupoSanguineo: e.target.value })} disabled={!isEditing}>
                    <option value="">Seleccione</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    </select>
                </Field>
    
                {/* Antecedentes */}
                    <Field className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-800">A.p Patológicos</Label>
                    <ReactiveTextArea name="antecedentesPatologicos" disabled={!isEditing} value={historialMedico.apPatologicos}/>
                    </Field>
    
                    <Field className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-800">A.p No Patológicos</Label>
                    <ReactiveTextArea name="antecedentesNoPatologicos"disabled={!isEditing} value={historialMedico.apNoPatologicos}/>
                    </Field>
    
                    <Field className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-800">Heredo Familiares</Label>
                    <ReactiveTextArea name="heredoFamiliares" disabled={!isEditing} value={historialMedico.apHeredoFam} />
                    </Field>
    
                    <Field className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-800">Quirúrgicos</Label>
                    <ReactiveTextArea name="quirurgicos" disabled={!isEditing} value={historialMedico.apQuirugicos} />
                    </Field>
    
                    <Field className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-800">Gineco-Obstétricos</Label>
                    <ReactiveTextArea name="ginecoObstetricos" disabled={!isEditing} value={historialMedico.apGinecoObstreticos}/>
                    </Field>
    
                    <Field className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-800">Exploración Física</Label>
                    <ReactiveTextArea name="exploracionFisica" disabled={!isEditing} value={historialMedico.exploracionFisica} />
                    </Field>
    
            
            </section>
            
          </form>
        </div>
        </div>
  );
}
