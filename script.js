let token = null;
let compania_id = null;
const API_BASE = "https://matchingprops.onrender.com";

document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password: password })
    });

    const data = await response.json();
    if (response.ok) {
      token = data.access_token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      compania_id = payload.compania_id;

      document.getElementById("loginSection").classList.add("hidden");
      document.getElementById("mainApp").classList.remove("hidden");
      alert("Login correcto");
      await Promise.all([loadPisos(), loadClientes()]);
    } else {
      alert("Login incorrecto: " + data.detail);
    }
  } catch (error) {
    alert("Error en el login: " + error.message);
  }
});

document.getElementById("clienteForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const cliente = {
    nombre: document.getElementById("nombreCliente").value,
    telefono: document.getElementById("telefonoCliente").value,
    zona: document.getElementById("zonaCliente").value,
    subzonas: document.getElementById("subzonasCliente").value,
    entrada: parseFloat(document.getElementById("entrada").value) || 0,
    precio: parseFloat(document.getElementById("precioCliente").value) || 0,
    tipo_vivienda: document.getElementById("tipoViviendaCliente").value,
    finalidad: document.getElementById("finalidadCliente").value,
    habitaciones: parseInt(document.getElementById("habitacionesCliente").value) || 0,
    banos: document.getElementById("banosCliente").value,
    estado: document.getElementById("estadoCliente").value,
    ascensor: document.getElementById("ascensorCliente").value,
    bajos: document.getElementById("bajosCliente").value,
    entreplanta: document.getElementById("entreplantaCliente").value,
    m2: parseInt(document.getElementById("m2Cliente").value) || 0,
    altura: document.getElementById("alturaCliente").value,
    cercania_metro: document.getElementById("cercaniaMetroCliente").value,
    orientacion: document.getElementById("orientacionCliente").value,
    edificio_semi_nuevo: document.getElementById("edificioSemiNuevoCliente").value,
    adaptado_movilidad: document.getElementById("adaptadoMovilidadCliente").value,
    balcon: document.getElementById("balconCliente").value,
    patio: document.getElementById("patioCliente").value,
    terraza: document.getElementById("terrazaCliente").value,
    garaje: document.getElementById("garajeCliente").value,
    trastero: document.getElementById("trasteroCliente").value,
    interior: document.getElementById("interiorCliente").value,
    piscina: document.getElementById("piscinaCliente").value,
    urbanizacion: document.getElementById("urbanizacionCliente").value,
    vistas: document.getElementById("vistasCliente").value,
    caracteristicas_adicionales: document.getElementById("caracteristicasCliente").value,
    banco: document.getElementById("bancoCliente").value,
    ahorro: parseFloat(document.getElementById("ahorroCliente").value) || 0,
    compania_id: compania_id
  };

  try {
    const response = await fetch(`${API_BASE}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(cliente)
    });

    const result = await response.json();
    if (response.ok) {
      document.getElementById("clientesResult").innerHTML = `<p>Cliente registrado: ${result.nombre}</p>`;
      await loadClientes();
    } else {
      alert("Error al registrar cliente: " + result.detail);
    }
  } catch (error) {
    alert("Error al registrar cliente: " + error.message);
  }
});

document.getElementById("pisoForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const piso = {
    precio: parseFloat(document.getElementById("precio").value) || 0,
    tipo_vivienda: document.getElementById("tipoVivienda").value,
    habitaciones: parseInt(document.getElementById("habitaciones").value) || 0,
    banos: document.getElementById("banos").value,
    estado: document.getElementById("estado").value,
    ascensor: document.getElementById("ascensor").value,
    bajos: document.getElementById("bajos").value,
    entreplanta: document.getElementById("entreplanta").value,
    m2: parseInt(document.getElementById("m2").value) || 0,
    altura: document.getElementById("altura").value,
    cercania_metro: document.getElementById("cercaniaMetro").value,
    orientacion: document.getElementById("orientacion").value,
    edificio_semi_nuevo: document.getElementById("edificioSemiNuevo").value,
    adaptado_movilidad: document.getElementById("adaptadoMovilidad").value,
    balcon: document.getElementById("balcon").value,
    patio: document.getElementById("patio").value,
    terraza: document.getElementById("terraza").value,
    garaje: document.getElementById("garaje").value,
    trastero: document.getElementById("trastero").value,
    interior: document.getElementById("interior").value,
    piscina: document.getElementById("piscina").value,
    urbanizacion: document.getElementById("urbanizacion").value,
    vistas: document.getElementById("vistas").value,
    caracteristicas_adicionales: document.getElementById("caracteristicasPiso").value,
    compania_id: compania_id
  };

  try {
    const response = await fetch(`${API_BASE}/pisos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(piso)
    });

    const result = await response.json();
    if (response.ok) {
      document.getElementById("pisosResult").innerHTML = `<p>Piso registrado: ${result.id}</p>`;
      await loadPisos();
    } else {
      alert("Error al registrar piso: " + result.detail);
    }
  } catch (error) {
    alert("Error al registrar piso: " + error.message);
  }
});

async function loadPisos() {
  try {
    const response = await fetch(`${API_BASE}/pisos`, {
      headers: { "Authorization": "Bearer " + token }
    });
    const pisos = await response.json();
    const select = document.getElementById("selectPiso");
    select.innerHTML = '<option value="">Seleccionar un piso...</option>';
    pisos.forEach(piso => {
      select.innerHTML += `<option value="${piso.id}">Piso ${piso.id} - ${piso.zona} (${piso.precio}€)</option>`;
    });
  } catch (error) {
    alert("Error al cargar pisos: " + error.message);
  }
}

async function loadClientes() {
  try {
    const response = await fetch(`${API_BASE}/clientes`, {
      headers: { "Authorization": "Bearer " + token }
    });
    const clientes = await response.json();
    const select = document.getElementById("selectCliente");
    select.innerHTML = '<option value="">Seleccionar un cliente...</option>';
    clientes.forEach(cliente => {
      select.innerHTML += `<option value="${cliente.id}">${cliente.nombre || 'Cliente ' + cliente.id} - ${cliente.zona}</option>`;
    });
  } catch (error) {
    alert("Error al cargar clientes: " + error.message);
  }
}

async function buscarClientes() {
  const pisoId = document.getElementById("selectPiso").value;
  if (!pisoId) {
    alert("Selecciona un piso");
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/match?piso_id=${pisoId}`, {
      headers: { "Authorization": "Bearer " + token }
    });
    const matches = await response.json();
    let html = "<h3>Clientes compatibles</h3><ul>";
    matches.forEach(match => {
      html += `<li>Cliente ID: ${match.cliente_id} (Score: ${match.score}%)</li>`;
    });
    html += "</ul>";
    document.getElementById("clientesResult").innerHTML = html;
  } catch (error) {
    alert("Error al buscar clientes: " + error.message);
  }
}

async function buscarPisos() {
  const clienteId = document.getElementById("selectCliente").value;
  if (!clienteId) {
    alert("Selecciona un cliente");
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/match?cliente_id=${clienteId}`, {
      headers: { "Authorization": "Bearer " + token }
    });
    const matches = await response.json();
    let html = "<h3>Pisos compatibles</h3><ul>";
    matches.forEach(match => {
      html += `<li>Piso ID: ${match.piso_id} (Score: ${match.score}%)</li>`;
    });
    html += "</ul>";
    document.getElementById("pisosResult").innerHTML = html;
  } catch (error) {
    alert("Error al buscar pisos: " + error.message);
  }
}
