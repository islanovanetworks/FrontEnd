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
  } else {
    alert("Login incorrecto");
  }
});

document.getElementById("clienteForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const cliente = {
    zona: parseInt(document.getElementById("zonaCliente").value),
    entrada: parseInt(document.getElementById("entrada").value),
    habitaciones: parseInt(document.getElementById("habitacionesCliente").value),
    banos: parseInt(document.getElementById("banosCliente").value),
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
  document.getElementById("resultArea").innerText = "Cliente registrado: " + JSON.stringify(result);
});

document.getElementById("pisoForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const piso = {
    zona: parseInt(document.getElementById("zona").value),
    precio: parseInt(document.getElementById("precio").value),
    habitaciones: parseInt(document.getElementById("habitaciones").value),
    banos: parseInt(document.getElementById("banos").value),
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
  document.getElementById("resultArea").innerText = "Piso registrado: " + JSON.stringify(result);
});

<button onclick="obtenerMatches()">Ver Matches</button>
<div id="matchResults"></div>

async function obtenerMatches() {
  const res = await fetch("https://matchingprops.onrender.com/match", {
    headers: {
      Authorization: "Bearer " + token
    }
  });
  const data = await res.json();
  let html = "<h3>Matches encontrados</h3><ul>";
  data.forEach(match => {
    html += `<li>Cliente ID: ${match.cliente_id} ↔ Piso ID: ${match.piso_id} (score: ${match.score})</li>`;
  });
  html += "</ul>";
  document.getElementById("matchResults").innerHTML = html;
}
