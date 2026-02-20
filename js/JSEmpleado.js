// Configuración de Firebase
 const firebaseConfig = {
  apiKey: "AIzaSyCwt9dyCf5iF13R2nhar6F2pKIUkT3Om7Q",
  authDomain: "paguinasweb-14611.firebaseapp.com",
  projectId: "paguinasweb-14611",
  storageBucket: "paguinasweb-14611.firebasestorage.app",
  messagingSenderId: "1083919701171",
  appId: "1:1083919701171:web:89d0063a1f9e6e357c4cc6"
};

firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    function mostrarSeccion(id) {
      document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
      document.getElementById(id).style.display = 'block';
   if (id === 'aplicaciones') {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  const fechaActual = `${yyyy}-${mm}-${dd}`;

  cargarVentasPorFecha(fechaActual);
  calcularVentasHoyPorMetodo();
}// 👇 Si se abre trampolín, recargar cronómetros desde localStorage
  if (id === 'trampolin') {
    const contenedor = document.getElementById('trampolin-cronometros');
    contenedor.innerHTML = ''; // limpiar antes de volver a cargar

    for (let key in localStorage) {
  if (key.startsWith('trampolin_')) {
    if (!document.getElementById(key.replace('trampolin_', 'trampolin-'))) {
      const datos = JSON.parse(localStorage.getItem(key));
      if (datos && datos.fin > Date.now()) {
        renderizarCronometroTrampolin(datos);
      }
    }
  }
}

  }
}

const multiplicadores = {}; // { vehiculoId: 1, 2, 3 }

function setMultiplicador(vehiculoId, valor) {
  multiplicadores[vehiculoId] = valor;

  // Estilo visual: marcar botón activo
  const botones = document.querySelectorAll(`.btn-multi[data-id="${vehiculoId}"]`);
  botones.forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.dataset.valor) === valor) {
      btn.classList.add('active');
    }
  });
}
    
    function logout() {
      auth.signOut().then(() => {
        window.location.href = 'index.html';
      });
    }

   
// Card animacion para Formulario de Pago
function mostrarFormularioPago(vehiculoId, minutos, precio, nombreVehiculo) {

  // Crear modal
  const modal = document.createElement('div');
  modal.className = 'modal-bg';

  modal.innerHTML = `
    <div class="modal-content">
      <div class="brs">
        <div class="br"></div>
       </div>
      <h3>Método de pago</h3>
      <div class="metodo-pago-opciones">
        <label class="opcion-pago">
          <div class="yape-content">
            <img class="yape-logo" src="https://marketingperu.beglobal.biz/wp-content/uploads/2024/11/logo-yape-sin-fondo-png.png" alt="Yape" class="yape-logo">
            <span class="yape-label">Yape</span>
          </div>
          <input class="yape-input" type="radio" name="metodo-pago" value="yape">
        </label>
        <label class="opcion-pago">
          <div class="yape-content">
            <img width="38" height="38" src="https://cdn-icons-png.flaticon.com/512/7448/7448246.png" alt="money-bag"/>
            <span class="yape-label">Yape</span>
          </div>
          <input type="radio" name="metodo-pago" value="efectivo">
        </label>
      </div>
      <br>
      <button class="btn-primary" id="confirmar-pago-modal">Confirmar</button>
      <br>
      <button class="btn-secondary" id="cerrar-modal" style="margin-top:1em;">Cancelar</button>
    </div>
  `;

  // Insertar primero en el DOM
  document.body.appendChild(modal);

  // Activar animación (sube desde abajo)
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  // Confirmar pago
  modal.querySelector('#confirmar-pago-modal').onclick = function () {
    const metodoPago = modal.querySelector('input[name="metodo-pago"]:checked')?.value;

    if (!metodoPago) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    // Animación de salida
    modal.classList.remove('show');
    modal.classList.add('hide');

    setTimeout(() => {
      modal.remove();

      // Obtener multiplicador seleccionado
      const multi = multiplicadores[vehiculoId] || 1;
      const minutosMultiplicados = minutos * multi;
      const precioMultiplicado = precio * multi;

      mostrarCronometro(
        vehiculoId,
        minutosMultiplicados,
        precioMultiplicado,
        nombreVehiculo,
        metodoPago
      );

    }, 400);
  };

  // Cerrar modal
  modal.querySelector('#cerrar-modal').onclick = function () {
    modal.classList.remove('show');
    modal.classList.add('hide');

    setTimeout(() => {
      modal.remove();
    }, 400);
  };
}
    function mostrarCronometro(vehiculoId, minutos, precio, nombreVehiculo, metodoPago) {
      const cronometroDiv = document.getElementById(`cronometro-container-${vehiculoId}`);
      let tiempo = minutos * 60;
      const ahora = Date.now();
      const fin = ahora + tiempo * 1000;

      // Guardar en localStorage
      localStorage.setItem(`cronometro_${vehiculoId}`, JSON.stringify({
        fin, vehiculoId, minutos, precio, nombreVehiculo, metodoPago
      }));

      iniciarCronometro(vehiculoId);
    }

    function iniciarCronometro(vehiculoId) {
      const cronometroDiv = document.getElementById(`cronometro-container-${vehiculoId}`);
      const data = JSON.parse(localStorage.getItem(`cronometro_${vehiculoId}`));
      if (!data) return;

      cronometroDiv.style.display = 'block';

      function tick() {
  const ahora = Date.now();
  let tiempoRestante = Math.floor((data.fin - ahora) / 1000);
  if (tiempoRestante < 0) tiempoRestante = 0;

  const tiempoTotal = data.minutos * 60;
  const porcentaje = (tiempoRestante / tiempoTotal) * 100;

  const min = Math.floor(tiempoRestante / 60);
  const seg = tiempoRestante % 60;
  cronometroDiv.textContent = ` ${min}:${seg < 10 ? '0' : ''}${seg}`;

  // Cambiar color y aplicar efecto glow según el porcentaje
if (porcentaje >= 70) {
  cronometroDiv.style.color = '#2196F3'; // Azul
  cronometroDiv.style.textShadow = '0 0 10px #2196F3, 0 0 20px #2196F3, 0 0 30px #2196F3';
} else if (porcentaje >= 30) {
  cronometroDiv.style.color = '#FFEB3B'; // Amarillo
  cronometroDiv.style.textShadow = '0 0 10px #FFEB3B, 0 0 20px #FFEB3B, 0 0 30px #FFEB3B';
} else {
  cronometroDiv.style.color = '#f44336'; // Rojo
  cronometroDiv.style.textShadow = '0 0 10px #f44336, 0 0 20px #f44336, 0 0 30px #f44336';
}


  if (tiempoRestante <= 0) {
    clearInterval(window[`intervalo_${vehiculoId}`]);
    cronometroDiv.textContent = "¡Alquiler finalizado!";
    cronometroDiv.style.color = "#4CAF50"; // Verde al finalizar
    guardarVenta(data.vehiculoId, data.metodoPago, data.precio, data.nombreVehiculo, data.minutos);
    localStorage.removeItem(`cronometro_${vehiculoId}`);

    setTimeout(() => {
      cronometroDiv.textContent = '';
      cronometroDiv.style.display = 'none';
    }, 2000);
  }
}


      if (window[`intervalo_${vehiculoId}`]) clearInterval(window[`intervalo_${vehiculoId}`]);
      window[`intervalo_${vehiculoId}`] = setInterval(tick, 1000);
      tick();
    }

    function guardarVenta(vehiculoId, metodoPago, precio, nombreVehiculo, minutos) {
      db.collection('ventas').add({
        vehiculoId,
        nombreVehiculo,
        metodoPago,
        precio,
        minutos,
        fecha: new Date()
      }).then(() => {
        alert('Venta guardada correctamente');
      }).catch(err => {
        alert('Error al guardar la venta: ' + err.message);
      });
    }

function cargarVentasPorFecha(fechaStr) {
  const contenedorVentas = document.getElementById('ventas-dia-lista');
  const totalTexto = document.getElementById('ventas-dia-total');
  contenedorVentas.innerHTML = 'Cargando ventas...';
  totalTexto.textContent = 'Total vendido ese día: S/ 0.00';

  const [anio, mes, dia] = fechaStr.split('-').map(Number);

  // Creamos rangos de la fecha seleccionada (00:00 a 23:59)
  const desde = new Date(anio, mes - 1, dia, 0, 0, 0);
  const hasta = new Date(anio, mes - 1, dia, 23, 59, 59);

  // Convertimos a Timestamp de Firebase
  const Timestamp = firebase.firestore.Timestamp;
  const desdeTS = Timestamp.fromDate(desde);
  const hastaTS = Timestamp.fromDate(hasta);

  db.collection('ventas')
    .where('fecha', '>=', desdeTS)
    .where('fecha', '<=', hastaTS)
    .orderBy('fecha', 'asc')
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        contenedorVentas.innerHTML = '<p>No hay ventas en esa fecha.</p>';
        return;
      }

      let html = '<ul style="list-style:none; padding:0;">';
      let total = 0;

      snapshot.forEach(doc => {
        const venta = doc.data();
        const fecha = new Date(venta.fecha.seconds * 1000);
        total += parseFloat(venta.precio);

       html += `
  <div class="venta-card">
    <div class="venta-item">
      <p><strong>Vehículo:</strong> ${venta.nombreVehiculo}</p>
      <span class="venta-metodo ${venta.metodoPago.toLowerCase()}">${venta.metodoPago}</span></p>
    </div>
    <div class="venta-itemm">
    <p><strong>Precio:</strong> S/ ${venta.precio}</p>
    <p><strong>Fecha:</strong> ${fecha.toLocaleString()}</p>
    </div>
  </div>
`;

      });

      html += '</ul>';
      contenedorVentas.innerHTML = html;
      totalTexto.textContent = `Total Generado (Hoy): S/ ${total.toFixed(2)}`;
    })
    .catch(err => {
      contenedorVentas.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}

let graficoMetodoHoy;

function calcularVentasHoyPorMetodo() {
  const yapeTexto = document.getElementById('total-yape-hoy');
  const efectivoTexto = document.getElementById('total-efectivo-hoy');

  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  const [anio, mes, dia] = [`${yyyy}`, `${mm}`, `${dd}`];

  const desde = new Date(anio, mes - 1, dia, 0, 0, 0);
  const hasta = new Date(anio, mes - 1, dia, 23, 59, 59);

  const desdeTS = firebase.firestore.Timestamp.fromDate(desde);
  const hastaTS = firebase.firestore.Timestamp.fromDate(hasta);

  db.collection('ventas')
    .where('fecha', '>=', desdeTS)
    .where('fecha', '<=', hastaTS)
    .get()
    .then(snapshot => {
      let totalYape = 0;
      let totalEfectivo = 0;

      snapshot.forEach(doc => {
        const venta = doc.data();
        const metodo = venta.metodoPago.toLowerCase();
        const monto = parseFloat(venta.precio);
        if (metodo === 'yape') totalYape += monto;
        else if (metodo === 'efectivo') totalEfectivo += monto;
      });

      yapeTexto.textContent = `Ventas en Yape: S/ ${totalYape.toFixed(2)}`;
      yapeTexto.style.color = '#690083'; // Color Yape
      yapeTexto.style.marginBottom = '10px';
      efectivoTexto.textContent = `Ventas en Efectivo: S/ ${totalEfectivo.toFixed(2)}`;
      efectivoTexto.style.color = '#009614'; // Color Efectivo

      const ctx = document.getElementById('grafico-metodo-hoy').getContext('2d');
      if (graficoMetodoHoy) graficoMetodoHoy.destroy();

      graficoMetodoHoy = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Yape', 'Efectivo'],
          datasets: [{
            label: 'Ventas',
            data: [totalYape, totalEfectivo],
            backgroundColor: ['#690083', '#009614'],
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 14
                },
                color: '#333'
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: S/ ${value.toFixed(2)}`;
                }
              }
            }
          }
        }
      });
    })
    .catch(err => {
      yapeTexto.textContent = 'Error al cargar Yape';
      efectivoTexto.textContent = 'Error al cargar Efectivo';
      console.error('Error al cargar ventas por método hoy:', err);
    });
}

    function cargarVehiculos() {
      const lista = document.getElementById('lista-vehiculos');
      lista.innerHTML = 'Cargando...';

      db.collection('vehiculos').where("status", "==", "available").get()
        .then(snapshot => {
          if (snapshot.empty) {
            lista.innerHTML = '<p>No hay vehículos disponibles.</p>';
            return;
          }

          let html = '';
          snapshot.forEach(doc => {
            const vehiculo = doc.data();
            html += `
  <div class="vehiculo">
    <img class="img-producto" src="${vehiculo.imageUrl}" alt="${vehiculo.name}" />
    <div class="info-vehiculo">
      <h3 class="nombre-vehiculo">${vehiculo.name}</h3>
      <p class="descripcion-vehiculo">${vehiculo.description}</p>
      <p class="precio-vehiculo">Precio: S/ ${vehiculo.precio} / ${vehiculo.minutos} min</p>
      
      <div class="cronometro-container" id="cronometro-container-${doc.id}" style="display:none;"></div>


      <div class="multiplicador-container" style="display: flex; gap: 10px; margin: 8px 0;">
        <button class="btn-multi active" data-id="${doc.id}" data-valor="1" onclick="setMultiplicador('${doc.id}', 1)">x1</button>
        <button class="btn-multi" data-id="${doc.id}" data-valor="2" onclick="setMultiplicador('${doc.id}', 2)">x2</button>
        <button class="btn-multi" data-id="${doc.id}" data-valor="3" onclick="setMultiplicador('${doc.id}', 3)">x3</button>
      </div>

      <button class="btn-primary" onclick="mostrarFormularioPago('${doc.id}', ${vehiculo.minutos}, ${vehiculo.precio}, '${vehiculo.name}')"><i class='bx bxs-hot'></i>Alquilar</button>
    </div>
  </div>
`;

          });

          lista.innerHTML = html;

          // Reanudar cronómetros activos
          snapshot.forEach(doc => {
            if (localStorage.getItem(`cronometro_${doc.id}`)) {
              iniciarCronometro(doc.id);
            }
          });
        })
        .catch(error => {
          lista.innerHTML = `<p>Error cargando vehículos: ${error.message}</p>`;
        });
    }
    cargarVehiculos();
    auth.onAuthStateChanged(user => {
      if (!user) {
        window.location.href = 'index.html';
      } else {
        cargarVehiculos();
      }
    });

    function mostrarFormularioTrampolin() {
  const modal = document.createElement('div');
  modal.className = 'modal-bg';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Agregar niño al trampolín</h3>
      <input type="text" id="nombre-nino" placeholder="Nombre del niño" />
      <br>
      <select id="metodo-pago-trampolin">
        <option value="yape">Yape</option>
        <option value="efectivo">Efectivo</option>
      </select>
      <br>
      <button class="btn-primary" onclick="iniciarTrampolin()">Iniciar</button>
      <br>
      <button class="btn-secondary" onclick="document.body.removeChild(this.parentNode.parentNode)">Cancelar</button>
    </div>
  `;
  modal.classList.add('show'); // Mostrar el modal con animación

  document.body.appendChild(modal);
}

function iniciarTrampolin() {
  const nombre = document.getElementById('nombre-nino').value.trim();
  const metodoPago = document.getElementById('metodo-pago-trampolin').value;

  if (!nombre) return alert('Ingresa el nombre del niño');

  const id = Date.now(); // ID único
  const minutos = 20;
  const precio = 5;
  const fin = Date.now() + minutos * 60 * 1000;

  const datos = { id, nombre, metodoPago, fin, minutos, precio };
  localStorage.setItem(`trampolin_${id}`, JSON.stringify(datos));

  document.body.removeChild(document.querySelector('.modal-bg'));
  renderizarCronometroTrampolin(datos);
}

function renderizarCronometroTrampolin(datos) {
  const contenedor = document.getElementById('trampolin-cronometros');

  const div = document.createElement('div');
  div.id = `trampolin-${datos.id}`;
  div.style = `
    background: #fff; padding: 1em; border-radius: 10px; 
    margin-bottom: 10px; text-align: left;
  `;

  const tiempoText = document.createElement('p');
  const nombreText = document.createElement('p');
  nombreText.textContent = `👦 Niño: ${datos.nombre}`;
  div.appendChild(nombreText);
  div.appendChild(tiempoText);
  contenedor.appendChild(div);

  function tick() {
    const ahora = Date.now();
    let restante = Math.floor((datos.fin - ahora) / 1000);
    if (restante < 0) restante = 0;

    const min = Math.floor(restante / 60);
    const seg = restante % 60;
    tiempoText.textContent = `⏱ Tiempo restante: ${min}:${seg < 10 ? '0' : ''}${seg}`;

    if (restante <= 0) {
      clearInterval(intervalo);
      tiempoText.textContent = "⏰ Tiempo terminado";
      guardarVenta('trampolin', datos.metodoPago, datos.precio, `Trampolín - ${datos.nombre}`, datos.minutos);
      localStorage.removeItem(`trampolin_${datos.id}`);
      setTimeout(() => div.remove(), 3000);
    }
  }

  const intervalo = setInterval(tick, 1000);
  tick();
}

 
document.getElementById('filtro-fecha').addEventListener('change', function () {
  const nuevaFecha = this.value;
  if (nuevaFecha) {
    cargarVentasPorFecha(nuevaFecha);
  }
});

