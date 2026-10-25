# La Rana Snacks — Producción

La app de producción y limpieza de Rojas Company. Es **una sola página**, sin
servidor propio: habla directo con Supabase desde el navegador.

Aquí vive **nada más la app**. El resto del proyecto (el modelo de operación,
el esquema de la base, el reporte de la inspección) se queda en el repositorio
privado, porque ahí sí hay cosas que no son para cualquiera.

## Por qué está aparte

Un artifact de claude.ai no deja que la página hable con Supabase: la petición
ni siquiera sale del navegador. Para que la app trabaje de verdad tiene que
vivir en una dirección normal.

## La llave que trae el código

Es la `publishable` de Supabase, hecha para andar a la vista. Lo que cuida los
datos no es esconderla: son los permisos (RLS) de la base y la cuenta de cada
quien.
