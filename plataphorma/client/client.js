


// Nos suscribimos al catalogo de juegos
Meteor.subscribe("all_games");



/*******************************************************************************
 *  Inicializacion del juego
 */
Meteor.startup(function() {
    // Ocultamos la seccion de minijuegos
   $("#minigames").hide()
   $("#home").click(function(){
   		$("#minigames").slideUp("slow")
   		$("#myCarousel").show("slow")
   		$("#principal").slideDown("slow")
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
    },
    'click #FrootWars': function () {
    	$("#principal").slideUp("slow")
    	$("#minigames").show("slow")
    	$("#myCarousel").hide("slow")
    },
}


Accounts.ui.config({
	passwordSignupFields:"USERNAME_AND_OPTIONAL_EMAIL"
});
