//Declaramos variables globales
let arrayPresupuestos = [];
let arraySistemas = [];
let sistema = document.getElementById("sistema");
let tablets = document.getElementById("tablets");
let integracion = document.getElementById("integracion");
let pcAdicional = document.getElementById("pcAd");
let abono = document.getElementById("mesAbono");
let nombre = document.getElementById("nombre");
let calcular = document.getElementById("calcular");
let presupuestoNro = 0;
let valorDeTablet = 0;
let valorDeIntegracion = 0;
//Buscamos el historial de presupuestos
let listar = document.getElementById("listar");
let historial = document.getElementById("historialPresupuestos");
//Capturamos para el botón Eliminar
let eliminar = document.getElementById("eliminar");
//Capturamos para el botón VER
let ver = document.getElementById("ver");
//Capturamos boton restear para borrar todo
let reset = document.getElementById("resetear");

//Si hay presupuestos en el LocalStorage, los traemos, sino, la dejamos vacía
if (localStorage.getItem("presupuestos")) {
  arrayPresupuestos = JSON.parse(localStorage.getItem("presupuestos"));
}

//Creamos un array con el precio del abono mensual para 3 6 9 y 12 meses
const arrayAbono = [9000, 17000, 25000, 34000];

//Agregamos un Pop-up "publicitario"

setTimeout(()=>{
  Swal.fire('¡Recordá que podés recibir atención personalizada comunicándote con nosotros vía telefónica!')
}, 10000)

//Constructor de objetos(presupuestos)
class presupuestar {
  constructor(
    numero,
    nombre,
    sistema,
    precio,
    tablet,
    precioTablets,
    integracion,
    precioIntegracion,
    meses,
    mensualidad,
    cantPc,
    pcAdicional
  ) {
    this.numero = numero;
    this.nombre = nombre;
    this.sistema = sistema;
    this.precio = precio;
    this.tablet = tablet;
    this.precioTablets = precioTablets;
    this.integracion = integracion;
    this.precioIntegracion = precioIntegracion;
    this.meses = meses;
    this.mensualidad = mensualidad;
    this.cantPc = cantPc;
    this.pcAdicional = pcAdicional;
  }
}
//Constructor de objetos(sistemas)
class generarSistema {
  constructor(
    sistema,
    precio,
    tablets,
    precioTablets,
    integracion,
    precioIntegracion,
    mensualidad,
    pcAdicional
  ) {
    this.sistema = sistema;
    this.precio = precio;
    this.tablets = tablets;
    this.precioTablets = precioTablets;
    this.integracion = integracion;
    this.precioIntegracion = precioIntegracion;
    this.mensualidad = mensualidad;
    this.pcAdicional = pcAdicional;
  }
}
//Traemos la información de los sistemas del json
const generarSistemas = async () => {
  const response = await fetch("../sistemas.json")
  const data = await response.json()
  //Los creamos como objetos y guardamos en un Array
  for(let sistem of data){
    let agregarSistema = new generarSistema(sistem.sistema, sistem.precio, sistem.tablets, sistem.precioTablets, sistem.integracion, sistem.precioIntegracion, sistem.mensualidad, sistem.pcAdicional)
    arraySistemas.push(agregarSistema)
  }
}
generarSistemas()

//Si elegimos G1, se deshabilitan los select de los módulos que el G1 no tiene
sistema.addEventListener("click", () => {
  if (sistema.value == "NG") {
    tablets[0].innerText = "Si";
    tablets[1].innerText = "No";
    integracion[0].innerText = "Si";
    integracion[1].innerText = "No";
    tablets.removeAttribute("disabled", "");
    integracion.removeAttribute("disabled", "");
  } else if (sistema.value == "G1") {
    tablets[0].innerText = "No disponible";
    tablets[1].innerText = "No disponible";
    integracion[0].innerText = "No disponible";
    integracion[1].innerText = "No disponible";
    tablets.setAttribute("disabled", "");
    integracion.setAttribute("disabled", "");
  }
});

calcular.addEventListener("click", () => {
  calcularPresupuesto();
});

function calcularPresupuesto() {
  //Establecemos el número del presupuesto
  if (localStorage.getItem("numeroPresupuesto")) {
    presupuestoNro = parseInt(localStorage.getItem("numeroPresupuesto"));
  }
  presupuestoNro = presupuestoNro + 1;
  localStorage.setItem("numeroPresupuesto", presupuestoNro);
  //Tomamos valores de los input
  nombre = document.getElementById("nombre");
  pcAdicional = document.getElementById("pcAd");
  abono = document.getElementById("mesAbono");
  sistema = document.getElementById("sistema");
  tablets = document.getElementById("tablets");
  integracion = document.getElementById("integracion");

  //Revisamos si hay modulo de tablets e integración. Si no hay, guarda el valor 0 en el precio de cada una

  tablets.value == "1"
    ? (valorDeTablet = 0)
    : (valorDeTablet = arraySistemas[0].precioTablets);
  integracion.value == "1"
    ? (valorDeIntegracion = 0)
    : (valorDeIntegracion = arraySistemas[0].precioIntegracion);

  //Revisamos que hayamos puesto un nombre
  if (nombre.value == "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debe ingresar un nombre.",
    });

    //Acá ejecutamos todo el calculo
  } else if (sistema.value == "NG") {
    //Guardamos el presupuesto en un objeto y dentro de un array.
    const presupuesto1 = new presupuestar(
      presupuestoNro,
      nombre.value,
      sistema.value,
      arraySistemas[0].precio,
      tablets[tablets.value].innerText,
      valorDeTablet,
      integracion[integracion.value].innerText,
      valorDeIntegracion,
      abono[abono.value].innerText,
      arrayAbono[abono.value],
      pcAdicional.value,
      arraySistemas[0].pcAdicional
    );
    arrayPresupuestos.push(presupuesto1);
    //Mostramos el presupuesto
    mostrarPresupuesto(presupuesto1);
  } else {
    const presupuesto1 = new presupuestar(
      presupuestoNro,
      nombre.value,
      sistema.value,
      arraySistemas[1].precio,
      arraySistemas[1].tablets,
      arraySistemas[1].precioTablets,
      arraySistemas[1].integracion,
      arraySistemas[1].precioIntegracion,
      abono[abono.value].innerText,
      arrayAbono[abono.value],
      pcAdicional.value,
      arraySistemas[1].pcAdicional
    );
    arrayPresupuestos.push(presupuesto1);

    //Mostramos el presupuesto
    mostrarPresupuesto(presupuesto1);
  }
}

//Evento para borrar presupuesto
eliminar.addEventListener("click", () => {
  eliminarPresupuesto(historial.selectedIndex - 1, 1);
  mostrarHistorial(arrayPresupuestos);
});

//Evento para mostrar presupuesto
ver.addEventListener("click", () => {
  traerPresupuesto(arrayPresupuestos[historial.selectedIndex - 1]);
});

//Evento para resetear todo
reset.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

//Mostramos el historial de presupuestos
listar.addEventListener("click", () => {
  //Guardamos en el array lo que haya en el storage, si es que hay algo.
  if (localStorage.getItem("presupuestos")) {
    arrayPresupuestos = JSON.parse(localStorage.getItem("presupuestos"));
  }

  mostrarHistorial(arrayPresupuestos);
});

function mostrarHistorial(arrayx) {
  //Reseteamos para que no duplique
  historial.innerHTML = `<option value="0">Seleccionar...</option>`;
  for (const histo of arrayx) {
    let presuhistorial = document.createElement("option");
    presuhistorial.innerHTML += `<option value="${histo.numero}">Presupuesto n°${histo.numero} - Nombre: ${histo.nombre}</option>`;
    historial.appendChild(presuhistorial);
  }
}

//función para eliminar presupuestos
function eliminarPresupuesto(presupuesto, numero) {
  arrayPresupuestos.splice(presupuesto, numero);
  localStorage.setItem("presupuestos", JSON.stringify(arrayPresupuestos));
  mostrarHistorial(arrayPresupuestos);
}

//Mostramos el presupuesto ya hecho anteriormente
function traerPresupuesto(presupuesto) {
  let presu = document.getElementById("divPresupuesto");
  let subTotal =
    presupuesto.precio +
    presupuesto.precioTablets +
    presupuesto.precioIntegracion +
    presupuesto.cantPc * presupuesto.pcAdicional +
    presupuesto.mensualidad;
  let total = subTotal * 1.21;
  presu.innerHTML = `<p>Presupuesto n°: ${presupuesto.numero}</p>\n<p>Nombre: ${presupuesto.nombre}</p>\n<p>Sistema: ${presupuesto.sistema}</p>\n<p>Tablets: ${presupuesto.tablet}</p>\n<p>Integración: ${presupuesto.integracion}</p>\n<p>PC adicionales: ${presupuesto.cantPc}</p>\n<p>Meses de abono: ${presupuesto.meses}</p>\n<p>Subtotal: $${subTotal} (Sin IVA)</p>\n<p>Total: $${total} (IVA incluído)</p>`;
}
//Calculamos, mostramos y guardamos el presupuesto
function mostrarPresupuesto(presupuesto) {
  let presu = document.getElementById("divPresupuesto");
  let subTotal =
    presupuesto.precio +
    presupuesto.precioTablets +
    presupuesto.precioIntegracion +
    presupuesto.cantPc * presupuesto.pcAdicional +
    presupuesto.mensualidad;
  let total = subTotal * 1.21;
  presu.innerHTML = `<p>Presupuesto n°: ${presupuestoNro}</p>\n<p>Nombre: ${presupuesto.nombre}</p>\n<p>Sistema: ${presupuesto.sistema}</p>\n<p>Tablets: ${presupuesto.tablet}</p>\n<p>Integración: ${presupuesto.integracion}</p>\n<p>PC adicionales: ${presupuesto.cantPc}</p>\n<p>Meses de abono: ${presupuesto.meses}</p>\n<p>Subtotal: $${subTotal} (Sin IVA)</p>\n<p>Total: $${total} (IVA incluído)</p>`;
  localStorage.setItem("presupuestos", JSON.stringify(arrayPresupuestos));
}
