
// Lós metodos van dentro de Meteor.methods ya que utilizamos Meteor para desarrollar el juego

var ArrPartidas = {} // En esta coleccion guardamos las id de todas las partidas


Meteor.methods({
	//Crea una nueva partida, devuelve true si se consiguio false si no
	nuevaPartida: function(id_game){
		if(ArrPartidas[id_game]== undefined){
			Partida = new Tablero(id_game);
			ArrPartidas[id_game]= Partida;
			return true;
		}else{
			console.log("Esa id ya pertenece a una partida creada");
			return false;
		}
	},

	//Los jugadores se añaden de uno en 1 y solo se podran meter en partidas ya creadas devuelve true si se consiguio, false si no
	nuevoJugador: function(id_game,id_jugador,nombre){
		if(ArrPartidas[id_game]){
			Partida = ArrPartidas[id_game];
			Partida.listaJugadores.push(new Jugador(id_jugador,nombre));
			return true;
		}else{
			return false;
		}
	},
	/*Se comprueba que la partida tiene menos de 5 jugadores entre las IAS y los jugadores reales, se devuelve false si
	  el numero excede el maximo. Se devuelve la lista de jugadores si es correcto. Ademas elige aleatoriamente quien
	  comienza el juego */
	comenzar: function(id_game,nIAs){
		if(ArrPartidas[id_game]){
			Partida= ArrPartidas[id_game];
			if(Partida.listaJugadores.length+nIAs<=5){
				for(i=1;i<=nIAs;i++){
					Partida.listaJugadores.push(new Jugador(-i,"IA"+i)); 
					Partida.listaJugadores[Partida.listaJugadores.length + i].IA = true;//Añado el Nuevo ID DE LA IA, para ello agregamos el .IA a true en los ultimos que hemos añadido
				}
				Partida.turno = Math.floor(Math.random()*(Partida.listaJugadores.length-1));
				return Partida.listaJugadores;
			}else{
				console.log("Excede el numero maximo de jugadores");
				return false;
			}
		}
	},


	//Roba una ficha, si id = id_game es un juego existente, devuelve la ficha
	// y las posicones donde se pueden colocar, si no devuelve false, si no quedan piezas que extraer devuelve undefined
	robarFicha: function(id_game){
		if(ArrPartidas[id_game]){
			Partida = ArrPartidas[id_game];
			ficha = Partida.saca_pieza();
			lugares = Partida.posiblelugar(ficha);
			var resultado = [ficha,lugares];
			return resultado;
		}else{
			return false;
		}
	},
	

	//Devuelve el turno en el que se encuentra la partida con id = id_game, si no existe devuelve undefined
	turnoActual: function(id_game){
		if(ArrPartidas[id_game]){
			return ArrPartidas[id_game].turno
		}else{
			return undefined;
		}
	},
	
	//Pasa al siguiente turno de la partida id = id_game, devuelve el turno siguiente y si no existe esa partida devuelve undefined
	cambiarTurno: function(id_game){
		if(ArrPartidas[id_game]){
			Partida = ArrPartidas[id_game];
			if(Partida.turno===Partida.listaJugadores.length-1){
				Partida.turno=0;
			}else{
				Partida.turno++;
			}
			return Partida.turno;
		}else{
			return undefined;
		}
	},

	//Coloca una ficha en una posición, devuelve true si se ha conseguido false si no
	colocarFicha: function(id_game,pieza,posicion,giros){
		if(ArrPartidas[id_game]){
			Partida = ArrPartidas[id_game];
			//giro la pieza
			for(i=0;i<giros;i++){
				pieza= pieza.girar();
			}
			//El if comprueba que la posicion este dentro de las posibles posicones donde podemos colocar
			if(Partida.posiblelugar(pieza).indexof(posicion)<=0){
				Partida.coloco(pieza);
			}
			return true;
		}else{
			return undefined;
		}
	},
	
	eliminarPartida: function(id_game){
		if(ArrPartidas[id_game]){
			delete ArrPartidas[id_game];
		}else{
			console.log("Partida no encontrada");
		}
	},

    JugadorArtificial: function(id_partida,id_jugador){
        Tablero = ArrPartidas[id_partida];
        
        var ColocoFicha = false;
        while (ColocoFicha == false)
        { //Bucle en el cual probamos a colocar las fichas, Robamos con la clase JUGADORIA, y la colocamos, no podemos, tendremos que volver a robar otra ficha y realziar el mismo proceso.
            var Jugador = jugadorIA(id_jugador);
            var Piezanueva = new Pieza(0, 0, 0, x[0]);
            for (var i = 0; i < Jugador[1].giros; i++) {
                Piezanueva = Piezanueva.girar()
            }
            ColocoFicha = Tablero.coloco(Piezanueva, Jugador[1].coorx, Jugador[1].coory);
            console.log("¿Ha sido Colocada?", ColocoFicha);
        }
    
    }
});

