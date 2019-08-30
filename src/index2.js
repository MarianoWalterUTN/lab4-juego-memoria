/**
 * @typedef { HTMLSpanElement } Celda
 */

let UI = {
	tabla: document.getElementById('tabla'),
	celdas: [],

	// Elementos de la versión 2
	v2: document.getElementsByClassName('v2'),

	/** @type { HTMLButtonElement } */
	btnReiniciar: document.getElementById('btn-reiniciar'),

	resetTabla: function() {
		UI.tabla.innerHTML = '';
		UI.celdas = [];
	},

	reset: function() {
		// Para mostrar los elementos de la v2
		document.querySelectorAll('.v2').forEach(x => x.removeAttribute('hidden'));

		UI.resetTabla();

		// Crea las celdas en el HTML
		for (let i = 0; i < Juego.dimensiones.alto; i++) {
			let fila = UI.crearFila();

			for (let j = 0; j < Juego.dimensiones.ancho; j++) {
				let celda = UI.crearCelda(fila);
				UI.celdas.push(celda);
			}

			UI.tabla.append(fila);
		}
	},

	crearFila: function() {
		let fila = document.createElement('span');
		fila.classList.add('row');

		return fila;
	},

	crearCelda: function(fila) {
		let celda = document.createElement('span');
		celda.classList.add('cell');

		let img = document.createElement('img');

		celda.append(img);
		fila && fila.append(celda);

		return celda;
	},
};

let Juego = {

	dimensiones: {
		alto: 4,
		ancho: 4,
	},

	// No permitir click mientras se muestra que 2 cartas no son iguales, o al finalizar
	pausa: false,

	maximoIntentos: 10,
	intentos: 10,

	/** @type { Carta[] } */
	cartas: [],
	/** @type { Carta } */
	cartaSeleccionada: null,

	/** @param { Carta } carta */
	seleccionarCarta: function(carta) {
		if (!Juego.cartaSeleccionada) {

			Juego.cartaSeleccionada = carta;
			carta.setSeleccionada(true);

		} else if (Juego.cartaSeleccionada !== carta) {

			Juego.verificarIguales(Juego.cartaSeleccionada, carta);

		}
	},

	setCartas: function() {
		let { alto, ancho } = this.dimensiones;
		let valores = Array(alto * ancho)
			.fill(0)
			.map((_, index) => parseInt(index / 2)) // Genera pares. EJ: [0, 0, 1, 1, 2, 2]
			.sort(() => Math.random() - 0.5); // Ordenar aleatoriamente

		this.cartas = valores.map((val, index) => {
			let carta = new Carta(val);
			carta.setCelda(UI.celdas[index]);
			return carta;
		});
	},

	reiniciar: function() {
		UI.reset();

		this.intentos = 0;
		this.setCartas();
	},

	/**
	 * @param { Carta } carta1
	 * @param { Carta } carta2
	 */
	verificarIguales: function(carta1, carta2) {
		if (carta1 === carta2) {
			return;
		}

		Juego.cartaSeleccionada.setSeleccionada(false);
		Juego.cartaSeleccionada = null;

		if (carta1.valor !== carta2.valor) {
			// TODO sumar intento
			return;
		}

		for (let carta of [carta1, carta2]) {
			carta.setSeleccionada(false);
			carta.adivinada = true;
			carta.celda.classList.add('adivinada');
		}

	},

};

/** @param { number } valor */
function Carta(valor) {

	/** @type { Carta } */
	let carta = this;

	/** @type {number} */
	this.valor = valor;

	// Si ya se encontró el otro par de esta carta
	this.adivinada = false;
	this.setAdivinada = function() {
		carta.adivinada = true;
		carta.celda.classList.add('adivinada');
	};

	// Si fue seleccionada para comparar con otra
	this.seleccionada = false;
	this.setSeleccionada = function(val) {
		carta.seleccionada = val;
		if (val) {
			carta.celda.classList.add('seleccionada');
		} else {
			carta.celda.classList.remove('seleccionada');
		}
	};

	this.getUrl = function() {
		return `./img/${ carta.valor }.svg`;
	};

	/** @type { Celda } */
	this.celda = null;
	/** @type {(c: Celda) => void} */
	this.setCelda = function(celda) {
		function clickEnCelda() {
			console.info({ celda, carta }); // TODO borrar
			if (Juego.pausa || carta.adivinada || Juego.cartaSeleccionada === carta) {
				return;
			}

			Juego.seleccionarCarta(carta);
		}

		celda.querySelector('img').src = carta.getUrl();
		celda.onclick = clickEnCelda;

		carta.celda = celda;
	};

}


// UI.reset();
Juego.reiniciar();
