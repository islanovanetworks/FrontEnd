let token = null;
let compania_id = null;
const API_BASE = "https://matchingprops.onrender.com";

document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

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
    loadPisos();
    loadClientes();
  } else {
    alert("Login incorrecto");
  }
});

document.getElementById("clienteForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const cliente = {
    nombre: document.getElementById("nombreCliente").value,
    telefono: document.getElementById("telefonoCliente").value,
    zona: document.getElementById("zonaCliente").value,
    subzonas: document.getElementById("subzonasCliente").value,
    precio: parseFloat(document.getElementById("precioCliente").value) || 0,
    tipo_vivienda: document.getElementById("tipoViviendaCliente").value,
    finalidad: document.getElementById("finalidadCliente").value,
    habitaciones: parseInt(document.getElementById("habitacionesCliente").value),
    banos: document.getElementById("banosCliente").value,
    estado: document.getElementById("estadoCliente").value,
    ascensor: document.getElementById("ascensorCliente").value,
    // Add other fields
    caracteristicas_adicionales: document.getElementById("caracteristicasCliente").value,
    banco: document.getElementById("bancoCliente").value,
    ahorro: parseFloat(document.getElementById("ahorroCliente").value) || 0,
    compania_id: compania_id
  };

  const response = await fetch(`${API_BASE}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(cliente)
  });

  const result = await response.json();
  document.getElementById("clientesResult").innerText = "Cliente registrado: " + JSON.stringify(result);
  loadClientes();
});

document.getElementById("pisoForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const piso = {
    precio: parseFloat(document.getElementById("precio").value),
    tipo_vivienda: document.getElementById("tipoVivienda").value,
    habitaciones: parseInt(document.getElementById("habitaciones").value),
    banos: document.getElementById("banos").value,
    // Add other fields
    caracteristicas_adicionales: document.getElementById("caracteristicasPiso").value,
    compania_id: compania_id
  };

  const response = await fetch(`${API_BASE}/pisos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(piso)
  });

  const result = await response.json();
  document.getElementById("pisosResult").innerText = "Piso registrado: " + JSON.stringify(result);
  loadPisos();
});

async function loadPisos() {
  const response = await fetch(`${API_BASE}/pisos`, {
    headers: { "Authorization": "Bearer " + token }
  });
  const pisos = await response.json();
  const select = document.getElementById("selectPiso");
  select.innerHTML = '<option value="">Seleccionar un piso...</option>';
  pisos.forEach(piso => {
    select.innerHTML += `<option value="${piso.id}">Piso ${piso.id} - ${piso.zona} (${piso.precio}€)</option>`;
  });
}

async function loadClientes() {
  const response = await fetch(`${API_BASE}/clientes`, {
    headers: { "Authorization": "Bearer " + token }
  });
  const clientes = await response.json();
  const select = document.getElementById("selectCliente");
  select.innerHTML = '<option value="">Seleccionar un cliente...</option>';
  clientes.forEach(cliente => {
    select.innerHTML += `<option value="${cliente.id}">${cliente.nombre} - ${cliente.zona}</option>`;
  });
}

async function buscarClientes() {
  const pisoId = document.getElementById("selectPiso").value;
  if (!pisoId) {
    alert("Selecciona un piso");
    return;
  }
  const response = await fetch(`${API_BASE}/match?piso_id=${pisoId}`, {
    headers: { "Authorization": "Bearer " + token }
  });
  const matches = await response.json();
  let html = "<h3>Clientes compatibles</h3><ul>";
  matches.forEach(match => {
    html += `<li>Cliente ID: ${match.cliente_id} (Score: ${match.score})</li>`;
  });
  html += "</ul>";
  document.getElementById("clientesResult").innerHTML = html;
}

async function buscarPisos() {
  const clienteId = document.getElementById("selectCliente").value;
  if (!clienteId) {
    alert("Selecciona un cliente");
    return;
  }
  const response = await fetch(`${API_BASE}/match?cliente_id=${clienteId}`, {
    headers: { "Authorization": "Bearer " + token }
  });
  const matches = await response.json();
  let html = "<h3>Pisos compatibles</h3><ul>";
  matches.forEach(match => {
    html += `<li>Piso ID: ${match.piso_id} (Score: ${match.score})</li>`;
  });
  html += "</ul>";
  document.getElementById("pisosResult").innerHTML = html;
}
