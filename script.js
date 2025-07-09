let token = null;
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
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("mainApp").classList.remove("hidden");
        alert("Login correcto ✅");
    } else {
        alert("Error en login ❌");
    }
});

document.getElementById("clienteForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const data = {
        zona: parseInt(document.getElementById("zonaCliente").value),
        entrada: parseInt(document.getElementById("entrada").value),
        habitaciones: parseInt(document.getElementById("habitacionesCliente").value),
        banos: parseInt(document.getElementById("banosCliente").value),
        compania_id: 1
    };

    const response = await fetch(`${API_BASE}/clientes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById("resultArea").innerText = "Cliente registrado: " + JSON.stringify(result);
});

document.getElementById("pisoForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const data = {
        zona: parseInt(document.getElementById("zona").value),
        precio: parseInt(document.getElementById("precio").value),
        habitaciones: parseInt(document.getElementById("habitaciones").value),
        banos: parseInt(document.getElementById("banos").value),
        compania_id: 1
    };

    const response = await fetch(`${API_BASE}/pisos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById("resultArea").innerText = "Piso registrado: " + JSON.stringify(result);
});