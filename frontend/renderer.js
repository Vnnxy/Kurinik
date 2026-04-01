document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8080/api/pacientes')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched pacientes:', data);
        const list = document.getElementById('pacientes-list');
        data.forEach(paciente => {
          const li = document.createElement('li');
          li.innerText = `${paciente.id} - ${paciente.nombre}`;
          list.appendChild(li);
        });
      })
      .catch(err => {
        console.error('Error fetching pacientes:', err);
      });
  });
  