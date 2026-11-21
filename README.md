# 🚲 Estacionamientos para bicicletas

Aplicación web para registrar, consultar, editar y eliminar bicicleteros, filtrar por cobertura y mostrar sus coordenadas en Google Maps.

## Tecnologías
- HTML, CSS y JavaScript
- Supabase (base de datos)
- Google Maps (mapa insertado por coordenadas)
- GitHub y Render Static Site

## Configuración

1. En Supabase, crear un proyecto.
2. Abrir **SQL Editor**, pegar el contenido de `supabase.sql` y ejecutar.
3. En Supabase, copiar la **Project URL** y la clave **publishable** (o `anon` heredada).
4. En `app.js`, reemplazar `PEGAR_AQUI_URL_DEL_PROYECTO` y `PEGAR_AQUI_CLAVE_PUBLICABLE`.
5. Subir `index.html`, `style.css`, `app.js`, `supabase.sql` y `README.md` al repositorio de GitHub.
6. En Render crear un **Static Site** conectado al repositorio. Dejar Build Command vacío y usar `.` como Publish Directory.

> Nunca colocar una clave `service_role` ni `sb_secret` en el navegador. La política SQL abierta es únicamente para una demostración escolar; permite que cualquier persona con acceso a la web pública pueda modificar los registros.

## Campos de la tabla
`id`, `nombre`, `latitud`, `longitud`, `cantidad_lugares`, `predio`, `cobertura`.

## Pruebas solicitadas por el examen
- Registrar tres puntos distintos.
- Filtrar por `Techado` y `Al aire libre`.
- Seleccionar dos registros y comparar sus ubicaciones.
- Editar las coordenadas de uno, guardar, recargar y volver a seleccionarlo.
- Intentar guardar latitud `95`: debe rechazarse porque la latitud permitida está entre -90 y 90 grados.
- Verificar que se rechacen coordenadas vacías, no numéricas o fuera de rango.
- Probar edición, eliminación y persistencia al recargar.

## Gemini Google AI Studio — completar después de realizar la consulta
El examen pide incluir una consulta propia hecha a Gemini, la sugerencia aplicada o corregida y la prueba que verificó el resultado. No afirmar que se realizó una consulta hasta ejecutarla realmente.

**Consulta sugerida para ejecutar en Google AI Studio:**

> Revisá este proyecto web de estacionamientos para bicicletas hecho con HTML, CSS, JavaScript y Supabase. Comprobá que permita crear, listar, editar y eliminar registros; filtrar por cobertura Techado y Al aire libre; validar latitud entre -90 y 90 y longitud entre -180 y 180; guardar y recuperar datos de Supabase; y mostrar en Google Maps las coordenadas del registro seleccionado. Señalá un error concreto si lo encontrás y proponé una corrección.

**Respuesta obtenida:** completar después de ejecutar la consulta.

**Sugerencia aplicada o corregida:** completar con la sugerencia real que se haya aplicado.

**Prueba realizada y resultado:** completar con la prueba real (por ejemplo, intento de latitud 95 y mensaje de rechazo).

## Enlaces de entrega
- Render: completar con la URL publicada.
- GitHub: completar con la URL del repositorio.
