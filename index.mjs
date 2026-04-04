import fs from 'fs/promises';


//API Fecth – File System
//1 - Utilizando el API https://thronesapi.com/ realizar las siguientes tareas:
// 1) a) Obtener todos los personajes

const url = "https://thronesapi.com/api/v2/Characters";

async function obtenerPersonajes() {
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        console.log(" Punto 1.a) Listado Completo");
        console.table(datos, ["firstName", "lastName", "fullName", "title", "family"]);
        return datos;
    } catch (error) {
        console.error("Error en punto a:", error.message);
    }
}

//b) Agregar un nuevo personaje (POST).

async function agregarPersonaje() {
    try {
        const nuevo = { firstName: "Lionel", lastName: "Messi" };
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
        });
        if (respuesta.ok) console.log("Personaje agregado con éxito.");
    } catch (error) {
        console.error("Error en crear personaje", error.message);
    }
}

//c) Buscar la información de un determinado personaje, utilizando un “id” como parámetro
//(GET)

async function buscarPorId(id) {
    try {
        const respuesta = await fetch(`${url}/${id}`);
        const personaje = await respuesta.json();
        console.log(`Personaje encontrado (ID: ${id})`);
        console.log(personaje);
    } catch (error) {
        console.error("Error en punto c:", error.message);
    }
}

//d) Persistir los datos de la primer consulta en un archivo local JSON.

async function guardarEnArchivo(datos) {
    try {
        await fs.writeFile('personajes.json', JSON.stringify(datos, null, 2));
        console.log("Datos guardados en 'personajes.json'");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Métodos comunes y avanzados – File System
//2 - Utilizando el archivo creado en el punto anterior:

async function leerArchivoLocal() {
    const contenido = await fs.readFile('personajes.json', 'utf-8');
    return JSON.parse(contenido);
}

async function procesarArchivoLocal() {
    try {
        let personajes = await leerArchivoLocal();

        // a) Agregar un personaje al final del archivo.

        personajes.push({ id: 99, fullName: "Personaje Final", family: "Grupo AC" });

        //b) Agregar dos personajes al inicio del archivo.

        personajes.unshift(
            { id: 100, fullName: "Primero Inicio" },
            { id: 101, fullName: "Segundo Inicio" }
        );

        //c) Eliminar el primer personaje, mostrar en consola el elemento eliminado.

        const eliminado = personajes.shift();
        console.log("Elemento eliminado: ", eliminado);

        // Guardamos los cambios en el archivo original

        await fs.writeFile('personajes.json', JSON.stringify(personajes, null, 2));

        //d) Crear un nuevo archivo que solo contenga los: id y nombres de los personajes

        const reducido = personajes.map(p => ({ id: p.id, nombre: p.fullName }));
        await fs.writeFile('personajes_reducidos.json', JSON.stringify(reducido, null, 2));
        console.log(" Archivo 'personajes_reducidos.json' creado");

        //e) Para los datos anteriores ordenar por nombre y de forma decreciente, luego mostrar por
        //consola (investigar método sort()).

        reducido.sort((a, b) => b.nombre.localeCompare(a.nombre));
        console.log("Lista reducida ordenada (Z-A)");
        console.table(reducido);

    } catch (error) {
        console.error("Error:", error.message);
    }
}

//EJECUCIÓN PRINCIPAL 

async function main() {
    console.log("Iniciando TP...");
    const lista = await obtenerPersonajes();
    await agregarPersonaje();
    await buscarPorId(2);
    if (lista) {
        await guardarEnArchivo(lista);
        await procesarArchivoLocal();
    }
    console.log("TP Finalizado.");
}

main();
