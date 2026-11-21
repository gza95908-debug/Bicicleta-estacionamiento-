// CONFIGURACIÓN: reemplazá estos dos valores por los de TU proyecto Supabase.
// Usá la URL del proyecto y la clave publishable/anon. Nunca uses service_role ni sb_secret.
const SUPABASE_URL = ""https://xhtdoxxzumohsvgqvqin.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_icatLQapk7Q2DDGeEkYkmA_m3kdfu5S";

const form = document.getElementById("parking-form");
const recordsElement = document.getElementById("records");
const statusElement = document.getElementById("status");
const filterElement = document.getElementById("filter");
let client = null;
let allRecords = [];

function setStatus(message, type = "") {
  statusElement.textContent = message;
  statusElement.className = type;
}

function connectSupabase() {
  if (!window.supabase) throw new Error("No se pudo cargar la biblioteca de Supabase. Revisá tu conexión a Internet.");
  if (SUPABASE_URL.includes("PEGAR_AQUI") || SUPABASE_ANON_KEY.includes("PEGAR_AQUI")) {
    throw new Error("Falta configurar la URL y la clave publicable de Supabase en app.js.");
  }
  client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const latText = document.getElementById("latitude").value.trim();
  const lonText = document.getElementById("longitude").value.trim();
  const lat = Number(latText);
  const lon = Number(lonText);
  const spacesText = document.getElementById("spaces").value.trim();
  const spaces = Number(spacesText);
  const property = document.getElementById("property").value.trim();
  const coverage = document.getElementById("coverage").value;

  if (!name || !latText || !lonText || !spacesText || !property || !coverage) {
    throw new Error("Completá todos los campos.");
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Latitud y longitud deben ser números.");
  }
  if (lat < -90 || lat > 90) throw new Error("Latitud inválida: debe estar entre -90 y 90. El valor 95 se rechaza porque supera 90°.");
  if (lon < -180 || lon > 180) throw new Error("Longitud inválida: debe estar entre -180 y 180.");
  if (!Number.isInteger(spaces) || spaces < 1) throw new Error("La cantidad de lugares debe ser un número entero mayor que cero.");

  return { nombre: name, latitud: lat, longitud: lon, cantidad_lugares: spaces, predio: property, cobertura: coverage };
}

async function loadRecords() {
  if (!client) return;
  recordsElement.innerHTML = '<p class="muted">Cargando registros…</p>';
  const { data, error } = await client.from("estacionamientos").select("*").order("id");
  if (error) {
    recordsElement.innerHTML = "";
    setStatus("Error al cargar desde Supabase: " + error.message, "error");
    return;
  }
  allRecords = data || [];
  renderRecords();
}

function renderRecords() {
  const selectedCoverage = filterElement.value;
  const shown = allRecords.filter(item => !selectedCoverage || item.cobertura === selectedCoverage);
  recordsElement.innerHTML = "";
  if (!shown.length) {
    recordsElement.innerHTML = '<p class="muted">No hay estacionamientos para mostrar. Registrá uno usando el formulario.</p>';
    return;
  }
  shown.forEach(item => {
    const card = document.createElement("article");
    card.className = "record";
    const title = document.createElement("h3");
    title.textContent = item.nombre;
    const details = document.createElement("p");
    details.textContent = `Latitud: ${item.latitud} · Longitud: ${item.longitud} · Lugares: ${item.cantidad_lugares} · Predio: ${item.predio} · Cobertura: ${item.cobertura}`;
    const actions = document.createElement("div");
    actions.className = "record-actions";
    const view = makeButton("Ver en el mapa", () => showOnMap(item));
    const edit = makeButton("Editar", () => startEdit(item), "secondary");
    const remove = makeButton("Eliminar", () => deleteRecord(item.id), "light");
    actions.append(view, edit, remove);
    card.append(title, details, actions);
    recordsElement.append(card);
  });
}

function makeButton(label, handler, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  if (className) button.className = className;
  button.addEventListener("click", handler);
  return button;
}

function showOnMap(item) {
  document.getElementById("selected-name").textContent = `${item.nombre} — ${item.latitud}, ${item.longitud}`;
  document.getElementById("map").src = `https://www.google.com/maps?q=${encodeURIComponent(item.latitud + "," + item.longitud)}&z=18&output=embed`;
}

function startEdit(item) {
  document.getElementById("record-id").value = item.id;
  document.getElementById("name").value = item.nombre;
  document.getElementById("latitude").value = item.latitud;
  document.getElementById("longitude").value = item.longitud;
  document.getElementById("spaces").value = item.cantidad_lugares;
  document.getElementById("property").value = item.predio;
  document.getElementById("coverage").value = item.cobertura;
  document.getElementById("form-title").textContent = "Editar estacionamiento";
  document.getElementById("save-button").textContent = "Guardar cambios";
  document.getElementById("cancel-edit").hidden = false;
  form.scrollIntoView({ behavior: "smooth" });
}

function resetForm() {
  form.reset();
  document.getElementById("record-id").value = "";
  document.getElementById("form-title").textContent = "Registrar estacionamiento";
  document.getElementById("save-button").textContent = "Guardar estacionamiento";
  document.getElementById("cancel-edit").hidden = true;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  setStatus("");
  try {
    const record = validateForm();
    const id = document.getElementById("record-id").value;
    const result = id
      ? await client.from("estacionamientos").update(record).eq("id", id)
      : await client.from("estacionamientos").insert([record]);
    if (result.error) throw result.error;
    setStatus(id ? "Cambios guardados correctamente." : "Estacionamiento guardado correctamente.", "success");
    resetForm();
    await loadRecords();
  } catch (error) {
    setStatus(error.message || "Ocurrió un error al guardar.", "error");
  }
});

async function deleteRecord(id) {
  if (!confirm("¿Seguro que querés eliminar este estacionamiento?")) return;
  const { error } = await client.from("estacionamientos").delete().eq("id", id);
  if (error) {
    setStatus("No se pudo eliminar: " + error.message, "error");
    return;
  }
  setStatus("Registro eliminado.", "success");
  await loadRecords();
}

document.getElementById("cancel-edit").addEventListener("click", resetForm);
document.getElementById("clear-button").addEventListener("click", () => setStatus(""));
filterElement.addEventListener("change", renderRecords);

try {
  connectSupabase();
  loadRecords();
} catch (error) {
  setStatus(error.message, "error");
  recordsElement.innerHTML = '<p class="muted">Configurá Supabase para comenzar.</p>';
}
