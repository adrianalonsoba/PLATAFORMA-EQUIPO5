var currentUser = null;


// Nos suscribimos al catalogo de juegos
Meteor.subscribe("all_games");
Meteor.subscribe("all_players");
//Zona reactiva para las puntuaciones y los mensajes
Tracker.autorun(function(){
    var current_game = Session.get("current_game");
    Meteor.subscribe("current_scores", current_game);
    Meteor.subscribe("messages_current_game", current_game);
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
   $("#crearpartida").hide();
   //Boton para acceder al ranking
   $("#rankingButton").click(function(){
      $("#minigames").slideUp("slow")
      $("#principal").slideUp("slow")
      $("#myCarousel").hide("slow")
      $("#container").hide();
      $("#gamecontainer").hide();
      $("#ranking").slideDown("slow");
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
        $("#container").hide();
        $("#gamecontainer").hide();
	    $("#crs").hide();
   })

    $(document).on("click", ".alert .close", function(e) {
        $(this).parent().hide();
    });


});

Template.PrincipalGames.games = function (){
    return Games.find();
}

Template.BannerGames.games = function (){
    return Games.find();
}


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


Tracker.autorun(function(){
    currentUser = Meteor.userId();
    if(currentUser==null){
      $("#rankingButton").hide();
    }else{
      $("#rankingButton").show();
    }
});


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

Template.crearpartida.events = {
    'submit': function (e, tmpl) {
        // Prevengo la acción por defecto (submit)
        e.preventDefault();
        
        if (Meteor.userId()){

          var nombrePartida = tmpl.find('#namePartida').value;
          var numeroJugadores = tmpl.find('#Jugadores').value;
          var numeroIA = tmpl.find('#ia').value;
          var jugador = Meteor.user().username;

          console.log(nombrePartida);
          console.log(numeroJugadores);
          console.log(numeroIA);
          console.log(jugador);

          if ((numeroJugadores<0)||(numeroIA)<0){
            alert("Campos incorrectos, los numeros deben ser positivos");
          }else{
            Rooms.insert({
              nombreHost: jugador,
              numJugadores: numeroJugadores,
              tiempoCreada: Date.now(),
              miembrosSala: 0
            });
            tmpl.find('#namePartida').value="";
            tmpl.find('#Jugadores').value="";
            tmpl.find('#ia').value="";
          }
        }else{
          alert("Debes estar logeado para crear una partida");
        }
    } 
}; 

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


Accounts.ui.config({
	passwordSignupFields:"USERNAME_AND_OPTIONAL_EMAIL"
});
