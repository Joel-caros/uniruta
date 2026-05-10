const mapa = L.map('mapa', { zoomControl: false }).setView([-12.046, -77.042], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);

let dbUniRuta = [];
let trazoActivo = null;
let paraderosActivos = [];

async function cargarUniRuta() {
    try {
        const res = await fetch('datos_rutas.json');
        dbUniRuta = await res.json();
        renderizarUniRuta(dbUniRuta);
        console.log("UniRuta: Datos cargados correctamente");
    } catch (e) { 
        console.error("UniRuta Error: No se pudo conectar con la base de datos."); 
    }
}

function renderizarUniRuta(datos) {
    const contenedor = document.getElementById('lista-buses');
    contenedor.innerHTML = "";
    datos.forEach(r => {
        const item = document.createElement('div');
        item.className = "p-4 bg-slate-800/40 rounded-xl cursor-pointer hover:bg-slate-800 border-l-4 transition-all";
        item.style.borderLeftColor = r.color;
        item.onclick = () => visualizarTrayecto(r);
        item.innerHTML = `
            <div class="flex justify-between items-center">
                <b class="text-blue-400 text-lg">${r.codigo}</b>
                <span class="text-[9px] text-slate-500 font-mono">ID: ${r.id}</span>
            </div>
            <div class="text-[10px] text-slate-300 font-bold uppercase mt-1">${r.empresa}</div>
            <div class="text-[9px] text-slate-500 italic mt-1">${r.destino}</div>
        `;
        contenedor.appendChild(item);
    });
}

function visualizarTrayecto(r) {
    if (trazoActivo) mapa.removeLayer(trazoActivo);
    paraderosActivos.forEach(m => mapa.removeLayer(m));
    paraderosActivos = [];

    trazoActivo = L.polyline(r.puntos, {
        color: r.color,
        weight: 6,
        opacity: 0.85,
        lineCap: 'round'
    }).addTo(mapa);

    r.paraderos.forEach(p => {
        const marker = L.circleMarker(p.coord, {
            radius: 6,
            fillColor: "white",
            color: r.color,
            weight: 3,
            fillOpacity: 1
        }).addTo(mapa).bindTooltip(`<b>UniRuta Paradero:</b><br>${p.nombre}`, {direction: 'top'});
        paraderosActivos.push(marker);
    });

    mapa.fitBounds(trazoActivo.getBounds(), { padding: [50, 50] });

    const panel = document.getElementById('panel');
    panel.classList.remove('hidden');
    document.getElementById('p-titulo').innerText = r.codigo;
    document.getElementById('p-titulo').style.color = r.color;
    document.getElementById('p-desc').innerHTML = `${r.empresa}<br>${r.destino}`;
}

document.getElementById('buscador').addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase();
    const filtrados = dbUniRuta.filter(r => 
        r.codigo.toLowerCase().includes(busqueda) || 
        r.destino.toLowerCase().includes(busqueda) ||
        r.empresa.toLowerCase().includes(busqueda)
    );
    renderizarUniRuta(filtrados);
});

cargarUniRuta();