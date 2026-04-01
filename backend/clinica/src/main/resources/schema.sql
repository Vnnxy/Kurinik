-- Table for paciente
CREATE table paciente(
    idPaciente INTEGER primary key autoincrement,
    nombre TEXT not null,
    apellido TEXT not null,
    fechaNacimiento TEXT not null,
    sexo TEXT ,
    calle TEXT ,
    colonia TEXT ,
    estado TEXT ,
    cp INTEGER 
);


-- Table for historialMedico
CREATE table historialMedico(
    idHistorial INTEGER PRIMARY KEY,
    idPaciente INTEGER not NULL unique,
    grupoSanguineo TEXT ,
    apPatologicos TEXT ,
    apNoPatologicos TEXT,
    apHeredoFam TEXT ,
    apQuirugicos TEXT ,
    apGinecoObstreticos TEXT ,
    exploracionFisica TEXT ,
    FOREIGN KEY(idPaciente)
        REFERENCES paciente(idPaciente)
            ON DELETE CASCADE
);

-- Table for farmaco
CREATE table farmaco(
    idFarmaco INTEGER primary key autoincrement,
    nombre TEXT not null,
    instruccionesPorDefecto TEXT,
    controlado INTEGER
);

CREATE TABLE farmaco_dosis (
    idDosis INTEGER PRIMARY KEY AUTOINCREMENT,
    idFarmaco INTEGER NOT NULL,
    dosis TEXT NOT NULL,
    FOREIGN KEY (idFarmaco) REFERENCES farmaco(idFarmaco) ON DELETE CASCADE
);

-- Table for cita
CREATE table cita(
    idCita INTEGER primary key autoincrement,
    idPaciente INTEGER not null,
    fecha TEXT not null,
    notas TEXT not null,
    FOREIGN KEY(idPaciente)
        REFERENCES paciente(idPaciente)
            ON DELETE CASCADE
);

-- Table for notaEvaluacion
CREATE table notaEvaluacion(
    idNota INTEGER primary key,
    idPaciente INTEGER not null,
    fechaHora TEXT not null,
    peso INTEGER ,
    altura INTEGER,
    signos TEXT,
    notas TEXT not null,
    motivo TEXT,
    FOREIGN KEY(idPaciente)
        REFERENCES paciente(idPaciente)
            ON DELETE CASCADE
);

-- Table for telefonoPaciente
CREATE table telefonoPaciente(
    telefono TEXT not null,
    idPaciente INTEGER not null,
    PRIMARY KEY(telefono, idPaciente),
    FOREIGN KEY(idPaciente)
        REFERENCES paciente(idPaciente)
            ON DELETE CASCADE
);

-- Table for correoPaciente
CREATE table correoPaciente(
    correo TEXT not null,
    idPaciente INTEGER not null,
    PRIMARY KEY(correo, idPaciente),
    FOREIGN KEY(idPaciente)
        REFERENCES paciente(idPaciente)
            ON DELETE CASCADE
);

-- Table for receta
CREATE table receta(
    idReceta INTEGER primary key, 
    idNota INTEGER not null,
    idPaciente INTEGER not null,
    archivo TEXT not null,
    FOREIGN KEY(idPaciente)
        REFERENCES paciente(idPaciente)
            ON DELETE CASCADE,
    FOREIGN KEY(idNota)
        REFERENCES notaEvaluacion(idNota)
            ON DELETE CASCADE
);

-- Table for contener
CREATE table contener(
    idFarmaco INTEGER not null,
    idNota INTEGER not null,
    idPaciente INTEGER not null,
    idReceta INTEGER not null, 
    FOREIGN KEY(idFarmaco)
        REFERENCES farmaco(idFarmaco)
            ON DELETE CASCADE,
    FOREIGN KEY(idPaciente)
        REFERENCES paciente(idPaciente)
            ON DELETE CASCADE,
    FOREIGN KEY(idNota)
        REFERENCES notaEvaluacion(idNota)
            ON DELETE CASCADE,
    FOREIGN KEY(idReceta)
        REFERENCES receta(idReceta)
            ON DELETE CASCADE
);