var currentUser = null;


// Nos suscribimos al catalogo de juegos
Meteor.subscribe("all_games");
//Nos suscribimos al canal de los jugadores para los rankings
Meteor.subscribe("all_players");
//Nos suscribimos a las salas de juego para poder entrar
Meteor.subscribe("all_rooms");
//Nos suscribimos a joinplayers para ver la quien esta en cada sala
Meteor.subscribe("all_joinPlayers");

/***************************** ZONA REACTIVA ***********************/

//Reactivo para cambiar en el juego en el que estamos
Tracker.autorun(function(){
    var current_game = Session.get("current_game");
    Meteor.subscribe("current_scores", current_game);
    Meteor.subscribe("messages_current_game", current_game);
});

//Reactivo para mostrar o quitar el ranking
Tracker.autorun(function(){
    currentUser = Meteor.userId();
    if(currentUser==null){
      $("#rankingButton").hide();
    }else{
      $("#rankingButton").show();
    }
});

/*******************************************************************************
 *  Inicializacion del juego
 */
Meteor.startup(function() {
	//Variable de sesion para saber en que juego estamos
	Session.set("current_game", "none");
    // Ocultamos la seccion de minijuegos
   $("#minigames").hide()
   $("#container").hide();
   $("#gamecontainer").hide();
   $("#ranking").hide();
   $("#crs").hide();
   $("#inicrs").hide();
   $("#crpart").hide();
   $("#allSalas").hide();
   $("#allPlayers").hide();
   $("#unirspartida").hide();
   $("#jugadrspartida").hide();
   $("#contact").hide();
	
   //Boton para acceder al ranking
   $("#rankingButton").click(function(){
      $("#minigames").slideUp("slow")
      $("#principal").slideUp("slow")
      $("#myCarousel").hide("slow")
      $("#contact").slideUp("slow")
      $("#container").hide();
      $("#gamecontainer").hide();
      $("#ranking").slideDown("slow");
   })
   //Boton para acceder a la información de los creadores
   $("#contactButton").click(function(){
      $("#minigames").slideUp("slow")
      $("#principal").slideUp("slow")
      $("#myCarousel").hide("slow")
      $("#ranking").slideUp("slow");
      $("#container").hide();
      $("#gamecontainer").hide();
      $("#contact").show("slow");
   })
   //el boton del ranking solo debe ser visible si estas logueado
   
    if(currentUser==null){
      $("#rankingButton").hide();
    }else{
      $("#rankingButton").show();
    }
   
   //Si volvemos al home regresamos al estado original
   $("#home").click(function(){
   		$("#minigames").slideUp("slow")
      $("#ranking").slideUp("slow")
   	  $("#myCarousel").show("slow")
   	  $("#principal").slideDown("slow")
      $("#contact").slideUp("slow")
      $("#container").hide();
      $("#gamecontainer").hide();
	  $("#crs").hide();
	  $("#crpart").hide();
	  $("#allSalas").hide();
	  $("#jugadrspartida").hide();
	  $("#allPlayers").hide();
   })
   //EL DIV DEL RECUADRO DE LAS SALAS AHORA SE LLAMA "allSalas"
  $("#createPartida").click(function(){
	   $("#crpart").show();
       $("#allSalas").hide();
	   $("#allPlayers").hide();
	})

	$("#unirsePartida").click(function(){
		$("#allSalas").show();
		$("#crpart").hide();
		//$("#gcontainer").hide();
		//$("#allPlayers").hide();
		$("#allPlayers").show();
	})

	$(".toPlayers").click(function(){
		$("#allPlayers").show();
	})



  $(document).on("click", ".alert .close", function(e) {
      $(this).parent().hide();
  });


});

//Templates de presentacion de los juegos
Template.PrincipalGames.games = function (){
    return Games.find();
}

Template.BannerGames.games = function (){
    return Games.find();
}


//Templates de los minijuegos
Template.MiniGames.game=function(){
	game_id= Session.get("current_game")
	var game = Games.findOne({_id:game_id});
	return game.name
	
}

Template.MiniGames.tutorial=function(){
	game_id= Session.get("current_game")
	var game = Games.findOne({_id:game_id});
	return game.tutorial
	
}


//Templates de todos los rankings, de los minijuegos y de la info personal
Template.MiniGames.MiniRanking=function(){
    var matches =  Scores.find({}, {limit:4, sort: {points:-1}});

    var users_data = [];
    matches.forEach (function (m) {
        var user = Meteor.users.findOne({_id: m.user_id});
        if (user){
            var game = Games.findOne({_id: m.game_id});
            users_data.push({name: user.username, points: m.points});
        }
    });
    return users_data;
}

Template.Ranking.ByVictories=function(){
      var us= Players.find({}, {limit:4, sort: {victories:-1,derrotas:1}});
      var users_data = [];

      us.forEach (function (m) {
 
        users_data.push({name: m.name, victories: m.victories, derrotas: m.derrotas});
        
      });

    return users_data;
}


Template.Ranking.ByPoints=function(){
      var us= Players.find({}, {limit:4, sort: {points:-1}});
      var users_data = [];

      us.forEach (function (m) {
 
        users_data.push({name: m.name, points: m.points});
        
      });

    return users_data;
}

//Template para los mensajes de los chats de la plataforma
Template.messages.messages = function () {

    var messagesColl =  Messages.find({}, { sort: { time: -1 }});
    var messages = [];

    messagesColl.forEach(function(m){
        var userName = Meteor.users.findOne(m.user_id).username;
        messages.push({name: userName , message: m.message});
    });

    return messages;
}



Template.input.events = {
    'keydown input#message' : function (event) {
        if (event.which == 13) {
            if (Meteor.userId()){
                var user_id = Meteor.user()._id;
                var message = $('#message');
                if (message.value != '') {
                    Messages.insert({
                        user_id: user_id,
                        message: message.val(),
                        time: Date.now(),
                        game_id: Session.get("current_game")
                    });
                    message.val('')
                }
            }
            else {
                $("#login-error").show();
            }
        }
    } 
}

//Template para la creacion de una partida con el boton nueva partida

Template.crearpartida.events = {
    'submit': function (e, tmpl) {

        // Prevengo la acción por defecto (submit)
        
        var formularioIncompleto = false;

        e.preventDefault();
        
        if (Meteor.userId()){

          //Guardo en variables los campos obtenidos del formulario

          var nombrePartida = tmpl.find('#namePartida').value;
          var numeroJugadores = tmpl.find('#Jugadores').value;
          var jugador = Meteor.user().username;
          var numeroIA = tmpl.find('#ia').value;

          //Comprobación de errores

          if (numeroJugadores<2){
            if (numeroJugadores>5){
              formularioIncompleto=true;
              alert("El numero de jugadores no es el correcto. Minimo de 2 - Maximo de 5");
            }
          }

          if ((numeroIA)>(numeroJugadores)){
            formularioIncompleto=true;
            alert("El numero de IA debe ser inferior al numero de jugadores");
          }

          if (nombrePartida==""){
            formularioIncompleto=true;
            alert("Falta el nombre de la partida");
          }

          if (numeroJugadores==""){
            formularioIncompleto=true;
            alert("No has seleccionado numero de jugadores");
          }
          
          if (numeroIA==""){
            formularioIncompleto=true;
            alert("No has seleccionado numero de IA");
          }

          //Comprobacion en la consola de que se cogen correctamente los datos del formulario

          console.log(nombrePartida);
          console.log(numeroJugadores);
          console.log(numeroIA);
          console.log(jugador);

          if (!formularioIncompleto){
            if ((numeroJugadores<0)||(numeroIA)<0){
              alert("Campos incorrectos, los numeros deben ser positivos");
            }else{
              Rooms.insert({
                nombreHost: jugador,
                numJugadores: numeroJugadores,
                numIA: numeroIA,
                tiempoCreada: Date.now(),
                miembrosSala: 0
              });
              tmpl.find('#namePartida').value="";
              tmpl.find('#Jugadores').value="";
              tmpl.find('#ia').value="";

              //Comprobacion en la consola que guarda bien en la base de datos

              var rooms = Rooms.findOne({nombreHost:jugador});
              console.log(rooms);
            }
          }else{
            tmpl.find('#namePartida').value="";
            tmpl.find('#Jugadores').value="";
            tmpl.find('#ia').value="";
          }
          
        }else{
          alert("Debes estar logeado para crear una partida");
          tmpl.find('#namePartida').value="";
          tmpl.find('#Jugadores').value="";
          tmpl.find('#ia').value="";
        }
    } 
}; 

//Template para cambiar de juego
Template.PrincipalGames.events = {
    'click #AlienInvasion': function () {
    	$("#principal").slideUp("slow")
    	$("#minigames").show("slow")
    	$("#myCarousel").hide("slow")
      $("#container").show();
      var game = Games.findOne({name:"AlienInvasion"});
      Session.set("current_game", game._id);

    },
    'click #FrootWars': function () {
    	$("#principal").slideUp("slow")
    	$("#minigames").show("slow")
    	$("#myCarousel").hide("slow")
      $("#gamecontainer").show();
      var game = Games.findOne({name:"FrootWars"});
      Session.set("current_game", game._id);
    },
    'click #Carcassone': function () {
      var game = Games.findOne({name:"Carcassone"});
      $("#minigames").slideUp("slow")
      $("#principal").slideUp("slow")
      $("#myCarousel").hide("slow")
	  $("#crs").show();
      Session.set("current_game", game._id);
    },
}

// Templates de salas de juego

//--Template para que aparezcan las salas
Template.unirspartida.Salas= function(){
  var rom= Rooms.find({},{})

  console.log(rom)
  var rooms_data=[];

  rom.forEach(function (x){
    rooms_data.push({host:x.host,id:x._id,jugadores:x.jugadores,ia:x.ia,dentro:x.dentro})
  })
  console.log(rooms_data)
  return rooms_data;
}

//el listado de salas se debe ocultar y debe aparecer la sala donde te has metido
Template.unirspartida.events={
    'click #toPlay': function () {
      if (Meteor.userId()){
          var jugador = Meteor.user().username;
          var ingame= JoinPlayer.findOne({user_name:jugador},{})
          //un jugador solo puede entrar a 1 partida a la vez
          if(!ingame){
            var sala= this.id
            JoinPlayer.insert({
              id_host: sala,
              user_name: jugador
            });
            //aqui se muestra la sala, y se rellena con la plantilla de jugadrspartida
            $("#allPlayers").show();
            //La sala de partidas tambien debe desaparecer
            $("#allSalas").slideUp("slow")
          //en otro caso salta un alert
          }else{
            alert("Ya está en una partida en curso");
          }
      }else{
        alert("Debes estar logeado para jugar una partida");
      }

    }
}

//helper que muestra el nombre de cada jugador de la sala a la que te unes
Template.jugadrspartida.Jugador= function(){
  //falta filtrar jugadores por la sala en cuestion
  var players= JoinPlayer.find({},{})
  var players_name=[];

  players.forEach(function (x){
    players_name.push({nombre:x.user_name});
  })
  return players_name;
}

//Zona de registro 
Accounts.ui.config({
	passwordSignupFields:"USERNAME_AND_OPTIONAL_EMAIL"
});
