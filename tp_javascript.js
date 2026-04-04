const fs = require('fs').promises;

const URL = "https://thronesapi.com/api/v2/Characters";

//1)

// a) Obtener todos los personajes

async function obtenerPersonajes() {
    try {
        const res = await fetch(URL);
        const data = await res.json();

        console.log("Personajes obtenidos");
        return data;
    } catch (error) {
        console.error("Error al obtener personajes:", error);
        return [];
    }
}

// b) Agregar personaje

async function agregarPersonajeAPI(personaje) {
    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(personaje)
        });

        const data = await res.json();

        console.log(" Personaje enviado:", data);
    } catch (error) {
        console.error(" Error en POST:", error);
    }
}

// c) Buscar personaje por ID 

async function obtenerPersonajePorId(id) {
    try {
        const res = await fetch(URL);
        const data = await res.json();

        const personaje = data.find(p => p.id == id);

        if (!personaje) {
            console.log(" Personaje no encontrado");
            return null;
        }

        console.log(" Personaje encontrado:", personaje);
        return personaje;
    } catch (error) {
        console.error("Error al buscar personaje:", error);
    }
}

// d) Guardar en archivo JSON

async function guardarEnArchivo(data) {
    try {
        await fs.writeFile("personajes.json", JSON.stringify(data, null, 2));
        console.log("✔ Archivo personajes.json creado");
    } catch (error) {
        console.error("Error al guardar archivo:", error);
    }
}


// 2 - FILE SYSTEM + ARRAYS


// Leer archivo 

async function leerArchivo() {
    try {
        const data = await fs.readFile("personajes.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.warn("Archivo no existe, se usará array vacío");
        return [];
    }
}

// a) Agregar personaje al final

async function agregarAlFinal(personaje) {
    try {
        const data = await leerArchivo();

        data.push(personaje);

        await fs.writeFile("personajes.json", JSON.stringify(data, null, 2));

        console.log("Personaje agregado al final");
    } catch (error) {
        console.error(" Error:", error);
    }
}

// b) Agregar dos personajes al inicio

async function agregarAlInicio(p1, p2) {
    try {
        const data = await leerArchivo();

        data.unshift(p1, p2);

        await fs.writeFile("personajes.json", JSON.stringify(data, null, 2));

        console.log(" Personajes agregados al inicio");
    } catch (error) {
        console.error(" Error:", error);
    }
}

// c) Eliminar el primer personaje

async function eliminarPrimero() {
    try {
        const data = await leerArchivo();

        const eliminado = data.shift();

        await fs.writeFile("personajes.json", JSON.stringify(data, null, 2));

        console.log(" Eliminado:", eliminado);
    } catch (error) {
        console.error(" Error:", error);
    }
}

// d) Crear archivo con id y nombre

async function crearArchivoReducido() {
    try {
        const data = await leerArchivo();

        const reducido = data.map(p => ({
            id: p.id,
            nombre: p.fullName
        }));

        await fs.writeFile("personajes_reducido.json", JSON.stringify(reducido, null, 2));

        console.log(" Archivo reducido creado");
        return reducido;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

// e) Ordenar por nombre DESC

function ordenarPorNombreDesc(data) {
    const ordenado = data.sort((a, b) =>
        b.nombre.localeCompare(a.nombre)
    );

    console.log("Ordenados DESC:");
    console.log(ordenado);
}


// MAIN


async function main() {
    try {

        const personajes = await obtenerPersonajes();
        await guardarEnArchivo(personajes);

        await obtenerPersonajePorId(1);

        await agregarPersonajeAPI({
            "id": 101,
            "firstName": "Arianne",
            "lastName": "Martell",
            "fullName": "Arianne Martell",
            "title": "Princess of Dorne",
            "family": "House Martell"
        });

        await agregarAlFinal({
            "id": 57,
            "firstName": "Victarion",
            "lastName": "Greyjoy",
            "fullName": "Victarion Greyjoy",
            "title": "Lord Captian of the Iron Fleet",
            "family": "House Greyjoy"
        });

        await agregarAlInicio(
            { id: 1000, fullName: "Inicio 1" },
            { id: 1001, fullName: "Inicio 2" }
        );

        await eliminarPrimero();


        ordenarPorNombreDesc(reducido);

    } catch (error) {
        console.error(" Error en main:", error);
    }
}

main();