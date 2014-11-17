


// Nos suscribimos al catalogo de juegos
Meteor.subscribe("all_games");



/*******************************************************************************
 *  Inicializacion del juego
 */
Meteor.startup(function() {
    // Miramos si la coleccion de objetos esta vacia, y en caso de estarlo añadimos los juegos
   
});

Template.PrincipalGames.games = function (){
    return Games.find();
}

Template.BannerGames.games = function (){
    return Games.find();
}


Accounts.ui.config({
	passwordSignupFields:"USERNAME_AND_OPTIONAL_EMAIL"
});
