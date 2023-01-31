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
//Establecemos los valores de los sistemas y módulos como objetos
const sistemaNg = {
  sistema: "NG",
  precio: 20000,
  tablets: true,
  precioTablets: 5000,
  integracion: true,
  precioIntegracion: 5000,
  mensualidad: 3000,
  pcAdicional: 2000,
};
const sistemaG1 = {
  sistema: "G1",
  precio: 15000,
  tablets: "No disponible",
  precioTablets: 0,
  integracion: "No disponible",
  precioIntegracion: 0,
  mensualidad: 3000,
  pcAdicional: 1800,
};

//Creamos un array con el precio del abono mensual para 3 6 9 y 12 meses
const arrayAbono = [9000, 17000, 25000, 34000];
let arrayPresupuestos = [];

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
  if (localStorage.getItem("numeroPresupuesto")){
    presupuestoNro = parseInt(localStorage.getItem("numeroPresupuesto"));
  }
  presupuestoNro = presupuestoNro + 1;
  localStorage.setItem("numeroPresupuesto", presupuestoNro)
  //tomamos valores de los input
  nombre = document.getElementById("nombre");
  pcAdicional = document.getElementById("pcAd");
  abono = document.getElementById("mesAbono");
  sistema = document.getElementById("sistema");
  tablets = document.getElementById("tablets");
  integracion = document.getElementById("integracion");
  //revisamos si hay modulo de tablets e integración. Si no hay, guarda el valor 0 en el precio de cada una
  tablets.value == "1" ? valorDeTablet = 0 : valorDeTablet = sistemaNg.precioTablets;
  // if (tablets.value == "1") {
  //   valorDeTablet = 0;
  // } else {
  //   valorDeTablet = sistemaNg.precioTablets;
  // }
  
  integracion.value == "1" ? valorDeIntegracion = 0 : valorDeIntegracion = sistemaNg.precioIntegracion;
  // if (integracion.value == "1") {
  //   valorDeIntegracion = 0;
  // } else {
  //   valorDeIntegracion = sistemaNg.precioIntegracion;
  // }

  
  //revisamos que hayamos puesto un nombre
  if (nombre.value == "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debe ingresar un nombre.",
    });
    //acá ejecutamos todo el calculo
  } else if (sistema.value == "NG") {
    //Guardamos el presupuesto en un objeto y dentro de un array.
    const presupuesto1 = new presupuestar(
      presupuestoNro,
      nombre.value,
      sistema.value,
      sistemaNg.precio,
      tablets[tablets.value].innerText,
      valorDeTablet,
      integracion[integracion.value].innerText,
      valorDeIntegracion,
      abono[abono.value].innerText,
      arrayAbono[abono.value],
      pcAdicional.value,
      sistemaNg.pcAdicional
    );
    arrayPresupuestos.push(presupuesto1);
    //agregar funcion que muestre el presu
    mostrarPresupuesto(presupuesto1);
  } else {
    const presupuesto1 = new presupuestar(
      presupuestoNro,
      nombre.value,
      sistema.value,
      sistemaG1.precio,
      sistemaG1.tablets,
      sistemaG1.precioTablets,
      sistemaG1.integracion,
      sistemaG1.precioIntegracion,
      abono[abono.value].innerText,
      arrayAbono[abono.value],
      pcAdicional.value,
      sistemaG1.pcAdicional
    );
    arrayPresupuestos.push(presupuesto1);

    //agregar funcion que muestre el presu
    mostrarPresupuesto(presupuesto1);
  }
}

//buscamos el historial de presupuestos
let listar = document.getElementById("listar");
let historial = document.getElementById("historialPresupuestos");


//Capturamos para el botón Eliminar
let eliminar = document.getElementById("eliminar");
//evento para borrar presupuesto
eliminar.addEventListener("click", ()=>{
  console.log(arrayPresupuestos)
  console.log(historial.selectedIndex-1)
  eliminarPresupuesto(historial.selectedIndex-1, 1)
  console.log(arrayPresupuestos)
  mostrarHistorial(arrayPresupuestos)
})
//Capturamos para el botón VER
let ver = document.getElementById("ver");
//evento para mostrar presupuesto
ver.addEventListener("click", ()=>{

traerPresupuesto(arrayPresupuestos[historial.selectedIndex-1])
})

//capturamos boton restear para borrar todo
let reset = document.getElementById("resetear");
reset.addEventListener("click", ()=>{
  localStorage.clear()
  location. reload()
})


//mostramos el historial de presupuestos
listar.addEventListener("click", ()=>{
 //guardamos en el array el storage.
  if (localStorage.getItem("presupuestos")){
    arrayPresupuestos = JSON.parse(localStorage.getItem("presupuestos"));
  }
   
  mostrarHistorial(arrayPresupuestos)
})

function mostrarHistorial(arrayx) {
  //reseteamos para que no duplique
  historial.innerHTML = `<option value="0">Seleccionar...</option>`
  for (const histo of arrayx) {
    let presuhistorial = document.createElement("option");
    presuhistorial.innerHTML += `<option value="${histo.numero}">Presupuesto n°${histo.numero} - Nombre: ${histo.nombre}</option>`;
  historial.appendChild(presuhistorial);
  }
}

//función para eliminar presupuestos

function eliminarPresupuesto(presupuesto, numero){
  arrayPresupuestos.splice(presupuesto, numero)
  console.log(arrayPresupuestos)
  localStorage.setItem("presupuestos", JSON.stringify(arrayPresupuestos))
  mostrarHistorial(arrayPresupuestos)
 
}

//mostramos el presupuesto ya hecho anteriormente
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
  localStorage.setItem("presupuestos", JSON.stringify(arrayPresupuestos))
}
