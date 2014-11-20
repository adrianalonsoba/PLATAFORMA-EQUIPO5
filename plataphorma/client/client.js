


// Nos suscribimos al catalogo de juegos
Meteor.subscribe("all_games");



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
   //Boton para acceder al ranking
   $("#rankingButton").click(function(){
      $("#minigames").slideUp("slow")
      $("#principal").slideUp("slow")
      $("#myCarousel").hide("slow")
      $("#container").hide();
      $("#gamecontainer").hide();
      $("#ranking").slideDown("slow");
   })
   //Si volvemos al home regresamos al estado original
   $("#home").click(function(){
   		$("#minigames").slideUp("slow")
      $("#ranking").slideUp("slow")
   		$("#myCarousel").show("slow")
   		$("#principal").slideDown("slow")
      $("#container").hide();
      $("#gamecontainer").hide();
   })
});

Template.PrincipalGames.games = function (){
    return Games.find();
}

Template.BannerGames.games = function (){
    return Games.find();
}

Template.PrincipalGames.events = {
    'click #AlienInvasion': function () {
    	$("#principal").slideUp("slow")
    	$("#minigames").show("slow")
    	$("#myCarousel").hide("slow")
      $("#container").show();
      var game = Games.findOne({name:"Alien Invasion"});
    },
    'click #FrootWars': function () {
    	$("#principal").slideUp("slow")
    	$("#minigames").show("slow")
    	$("#myCarousel").hide("slow")
      $("#gamecontainer").show();
      var game = Games.findOne({name:"AlienInvasion"});
    },
}


Accounts.ui.config({
	passwordSignupFields:"USERNAME_AND_OPTIONAL_EMAIL"
});
