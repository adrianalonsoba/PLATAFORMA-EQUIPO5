/*******************************************************************************
 *  Publish collections
 */

Meteor.publish("all_games", function () {
    // publish every field of every game
    return Games.find();
});


/*******************************************************************************
 *  Inicializacion del juego
 */
Meteor.startup(function() {
    // Miramos si la coleccion de objetos esta vacia, y en caso de estarlo añadimos los juegos
    if (Games.find().count() == 0) {
		Games.insert({name: "Carcassone",banner: "http://domneuve.com/img/Carcassone%20banner.jpg",tutorial:"¡Conviertete en el mas poderoso señor feudal de todos los reinos existentes! Comanda a tus caballeros, apoya el poder del clero y contrata a mercenarios y bandidos para que hagan el trabajo sucio."});
		Games.insert({name: "AlienInvasion",banner: "http://ccchuntersville.com/wp-content/uploads/2012/04/Aliens-Banner.jpg",tutorial:"Emocionante juego de naves espaciales. Se el piloto de la nave Karsis y embarcate en la defensa del sistema solar contra la amenaza de Andromeda. El futuro de la raza humana esta en tus manos"});
		Games.insert({name: "FrootWars",banner: "http://www.viralvideopalace.com/wp-content/uploads/mvbthumbs/img_14457_annoying-orange-monster-burger.jpg",tutorial:"¡La batalla ha comenzado! Comida hipercalorífica contra fruta sana... nunca antes en la historia se había visto una batalla tan sangrienta... . Gore en estado puro."});

	};
});
