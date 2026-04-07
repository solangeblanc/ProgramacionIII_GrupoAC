import fs from 'fs/promises';

/** Modelos definidos con JSDoc para facilitar typados en JavaScript 
 * Se utilizan para tipar los datos que se reciben y se envían a la API. 
 * Basado en lo descrito en los schemas de Swagger de la API V2. (https://thronesapi.com/swagger/v2/swagger.json)
 * 
 * @typedef {Object} CharacterModel
 * @property {number} id - A unique number that identifies this character.
 * @property {string} [firstName] - The character's first name.
 * @property {string} [lastName] - The character's last name.
 * @property {string} [fullName] - The First + Last name of the character.
 * @property {string} [title] - The character's formal title.
 * @property {string} [family] - The character's family name.
 * @property {string} [image] - The character's picture filename.
 * @property {string} [imageUrl] - The chaelo Continente de Game of Thrones
 * 

 * @typedef {Object} ContinentModel
 * @property {number} id - A unique number that identifies this continent.
 * @property {string} [name] - TheHTTPServices name.
 */

//API Fecth – File System
//1 - Utilizando el API https://thronesapi.com/ realizar las siguientes tareas:
// 1) a) Obtener todos los personajes

const url = "https://thronesapi.com/api/v2/Characters";

/**
 * Obtiene todos los personajes de la API.
 * @returns {Promise<CharacterModel[]>} Una promesa que resuelve a un array de personajes.
 */
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

/**
 * Agrega un nuevo personaje a la API.
 * @returns {Promise<void>}
 */
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

/**
 * Busca un personaje por su ID.
 * @param {number} id - El ID del personaje a buscar.
 * @returns {Promise<CharacterModel>} Una promesa que resuelve al personaje encontrado.
 */
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

/**
 * Guarda los datos en un archivo local JSON.
 * @param {CharacterModel[]} datos - Los datos a guardar.
 * @returns {Promise<void>}
 */
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

/**
 * Lee el archivo local JSON.
 * @returns {Promise<CharacterModel[]>} Una promesa que resuelve a un array de personajes.
 */
async function leerArchivoLocal() {
    const contenido = await fs.readFile('personajes.json', 'utf-8');
    return JSON.parse(contenido);
}

/**
 * Modifica el archivo local JSON utilizando un callback para alterar los datos.
 * @param {(personajes: CharacterModel[]) => CharacterModel[]} callback - Función que recibe el array de personajes y lo modifica.
 * @returns {Promise<void>}
 */
async function modificarArchivoLocal(callback) {
    const datos = await leerArchivoLocal();
    const personajes = callback(datos);
    await fs.writeFile('personajes.json', JSON.stringify(personajes, null, 2));
}

/**
 * Procesa el archivo local JSON.
 * @returns {Promise<void>}
 */
async function procesarArchivoLocal() {
    try {
        // a) Agregar un personaje al final del archivo.
        await modificarArchivoLocal((personajes) => {
            personajes.push({ id: 99, fullName: "Personaje Final", family: "Grupo AC" });
            return personajes;
        });

        //b) Agregar dos personajes al inicio del archivo.
        await modificarArchivoLocal((personajes) => {
            personajes.unshift(
                { id: 100, fullName: "Primero Inicio" },
                { id: 101, fullName: "Segundo Inicio" }
            );
            return personajes;
        });

        //c) Eliminar el primer personaje, mostrar en consola el elemento eliminado.
        await modificarArchivoLocal((personajes) => {
            const eliminado = personajes.shift();
            console.log("Elemento eliminado: ", eliminado);
            return personajes;
        });

        // Leemos nuevamente los personajes guardados para los pasos siguientes
        let personajes = await leerArchivoLocal();

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
    console.log("Iniciando TP grupo AC");
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
