var currentUser = null;
var currentRoom= null;


// Nos suscribimos al catalogo de juegos
Meteor.subscribe("all_games");
//Nos suscribimos al canal de los jugadores para los rankings
Meteor.subscribe("all_players");
//Nos suscribimos a las salas de juego para poder entrar
Meteor.subscribe("all_rooms");
//Nos suscribimos a joinplayers para ver la quien esta en cada sala
Meteor.subscribe("all_joinPlayers");
//Nos suscribimos a joinplayers para ver la quien esta en cada sala
Meteor.subscribe("users");

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
    currentRoom= Session.get("currentRoom");
    if(currentUser==null){
      $("#rankingButton").hide();
      $("#allPlayers").hide();
      Session.set("currentRoom",null)
    }else{
      $("#rankingButton").show();

      //Inicializacion de los jugadores, compruebo si ya he creado el usuario en la base de datos.
      if(Meteor.userId()){
	      var juego=JoinPlayer.findOne({originalID:Meteor.userId()})
	      if(juego!=undefined){
		      console.log(juego.id_room)
		      currentRoom=juego.id_room;
          Session.set("currentRoom",currentRoom)
	      }else{
	      	currentRoom=null;
          console.log("no esta en partida")
	      }
      }
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
    //ALBERTO, HE AÑADIDO AQUI UNAS LINEAS PARA QUE APAREZCA LA SALA SOLO CUANDO ESTES DENTRO DE ESTA
    //ESTABA HACIENDO EL AVANDONAR Y ME ESTABA LIANDO
    var jugador = Meteor.user().username;
    var sala= JoinPlayer.findOne({user_name:jugador});
    if(sala){
		  $("#allPlayers").show();
      $("#allSalas").hide();
    }else{
      $("#allPlayers").hide();
      $("#allSalas").show();
    }
	})

  $(document).on("click", ".alert .close", function(e) {
      $(this).parent().hide();
  });


});

//******************************* TEMPLATES DE DATOS***********************
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
      var us= Players.find({}, {limit:4, sort: {victories:-1,defeats:1}});
      var users_data = [];

      us.forEach (function (m) {
        user=Meteor.users.findOne({_id:m.originalID})
        users_data.push({name: user.username, victories: m.victories, derrotas: m.defeats});
        
      });

    return users_data;
}


Template.Ranking.ByPoints=function(){
      var us= Players.find({}, {limit:4, sort: {points:-1}});
      var users_data = [];
      var user;
      us.forEach (function (m) {
        user=Meteor.users.findOne({_id:m.originalID})
        users_data.push({name: user.username, points: m.total_points});
        
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

//helper que muestra el nombre de cada jugador de la sala a la que te unes
Template.jugadrspartida.Jugador= function(){
  //falta filtrar jugadores por la sala en cuestion
  console.log(Session.get("currentRoom"))
  var players= JoinPlayer.find({id_room:currentRoom},{})
  console.log(players);
  var players_name=[];

  players.forEach(function (x){
    players_name.push({nombre:x.user_name});
  })
  return players_name;
}

// Templates de salas de juego
Template.unirspartida.Salas= function(){

  var rom= Rooms.find({},{})

  console.log(rom)
  var rooms_data=[];

  rom.forEach(function (x){
    rooms_data.push({host:x.user_name,id:x._id,jugadores:x.max_players,ia:x.max_IAs,dentro:x.in_players})
  })
  console.log(rooms_data)
  return rooms_data;
}

//************************************** TEMPLATE DE EVENTOS ****************************

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

          var numeroJugadores = parseInt(tmpl.find('#Jugadores').value);
          var jugador = Meteor.user().username;
          var numeroIA = parseInt(tmpl.find('#ia').value);

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

          if (numeroJugadores==""){
            formularioIncompleto=true;
            alert("No has seleccionado numero de jugadores");
          }
          
          if (numeroIA==""){
            formularioIncompleto=true;
            alert("No has seleccionado numero de IA");
          }

          //Comprobacion en la consola de que se cogen correctamente los datos del formulario

          console.log(numeroJugadores);
          console.log(numeroIA);
          console.log(jugador);

 	        var yaCreada = Rooms.findOne({user_name:jugador});
        	console.log(yaCreada);

          if (!formularioIncompleto){
            if ((numeroJugadores<0)||(numeroIA)<0){
              alert("Campos incorrectos, los numeros deben ser positivos");
            }else{
  	          if(yaCreada==null){

                   //Insertamos la sala con los datos introducidos, en la coleccion rooms

                   Rooms.insert({
                     user_name: jugador,
                     max_players: numeroJugadores,
                     max_IAs: numeroIA,
                     date: Date.now(),
                     in_players: numeroIA+1 //Como jugadores en la sala estan el creador de la partida y el numero de IA seleccionada
                   });

              }else{
  		            alert("Ya tienes una partida en curso creada");
              }
	          }

            tmpl.find('#Jugadores').value="";
            tmpl.find('#ia').value="";

            //Comprobacion en la consola que guarda bien en la base de datos

            var rooms = Rooms.findOne({user_name:jugador});
	      
            console.log(rooms);
            console.log(rooms._id);

            if(yaCreada==null){

            //Insertamos como jugador asociado a una sala al creador de la partida.

              JoinPlayer.insert({
              	originalID: Meteor.userId(),
                id_room:rooms._id,
                user_name: jugador
              });

            Session.set("currentRoom",rooms._id)

            var yaCreado = Players.findOne({originalID:Meteor.userId()})
            if (yaCreado==null){
              Players.insert({
                originalID: Meteor.userId() ,
                total_points: 0,
                victories: 0,
                defeats: 0,
                dropouts:0
              });
            }

            //Insertamos como jugadores a tantas IA como nos hayan pasado

              if(numeroIA>0){
                for(i=0;i<numeroIA;i++){
                  JoinPlayer.insert({
                    id_room:rooms._id,
                    user_name: "IA"
                  });
                }
              }
            }

            
          }else{

            tmpl.find('#Jugadores').value="";
            tmpl.find('#ia').value="";
          }
          
        }else{
          alert("Debes estar logeado para crear una partida");

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
    'click #Carcassone': function () { //ESTA PARTE HAY QUE TOCARLA PARA VER SI HAY UNA PARTIDA EN LA QUE
      //ESTOY Y ADEMAS ESTA EMPEZADA
      var game = Games.findOne({name:"Carcassone"});
      $("#minigames").slideUp("slow")
      $("#principal").slideUp("slow")
      $("#myCarousel").hide("slow")
	    $("#crs").show();
      var jugador = Meteor.user().username;
      var sala= JoinPlayer.findOne({user_name:jugador});
      if(sala){
        $("#allPlayers").show();
      }
      Session.set("current_game", game._id);
    },
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
              originalID: Meteor.userId(),
              id_room: sala,
              user_name: jugador
            });
            currentRoom=sala;
            Session.set("currentRoom",sala)
            //Inicializacion del usuario cuando vamos a usar la base de datos para el
            var yaCreado = Players.findOne({originalID:Meteor.userId()})
            if (yaCreado==null){
              Players.insert({
                originalID: Meteor.userId() ,
                total_points: 0,
                victories: 0,
                defeats: 0,
                dropouts:0
              });
            }
            //actualizamos la sala
            Rooms.update({_id:sala},{ $inc: {in_players:+1} });
            //miramos si a sala cumple el cupo para iniciar la partida, si no mostramos solo la sala
            var room=Rooms.findOne({_id:sala},{})
            console.log(room)
            if(room.max_players==room.in_players){
              alert("QUE COMIENCE LA PARTIDA!!!!!");
              //**************************************************************************\\
              //Esto lo pongo como auxiliar, pero hay que quitarlo y usar un tracker autorun
              $("#allPlayers").show();
              $("#allSalas").slideUp("slow")
            }else{
              //aqui se muestra la sala, y se rellena con la plantilla de jugadrspartida
              $("#allPlayers").show();
              //La sala de partidas tambien debe desaparecer
              $("#allSalas").slideUp("slow")
            }
          //en otro caso salta un alert
          }else{
            alert("Ya está en una partida en curso");
          }
      }else{
        alert("Debes estar logeado para jugar una partida");
      }

    },

    'click #toPlayers': function () {
      if(Meteor.userId()){
        $("#allPlayers").show();
      }else{
       alert("Debes loguearte para poder ver las salas");
      }
    }
}

//Evento de borrado de un jugador de una sala, en caso de existir
//0 jugadores tras el borrado, borramos la sala entera. Si el jugador que sale
//era el host, cambiamos por un host nuevo.

Template.jugadrspartida.events={

  'click #dropOutGame': function () {
    
      var jugador = Meteor.user().username;
      var ensala= JoinPlayer.findOne({user_name:jugador});
      var sala= Rooms.findOne({_id:ensala.id_room})
      Rooms.update({_id:ensala.id_room},{ $inc: {in_players:-1} });
      sala= Rooms.findOne({_id:ensala.id_room})
      console.log(sala.in_players)
      if(ensala){
        JoinPlayer.remove(ensala._id)
        $("#allPlayers").slideUp("slow");
      }
      currentRoom=null;
      if(sala.in_players-sala.max_IAs==0){
        var ias= JoinPlayer.find({id_room:sala._id})
        ias.forEach(function(m){
          JoinPlayer.remove(m._id);
        })
        Rooms.remove(sala._id)
      }else if(sala.user_name==ensala.user_name){
        ensala= JoinPlayer.findOne({id_room:sala._id},{user_name:{$ne: "IA"}});
        Rooms.update({_id:ensala.id_room},{ $set: {user_name:ensala.user_name} });
      }
      Session.set("currentRoom",null)
  }
}

//Zona de registro 
Accounts.ui.config({
	passwordSignupFields:"USERNAME_AND_OPTIONAL_EMAIL"
});
