openDatabase();

let restaurants = [];
let huidigRestaurant = null;
let bewerkModus = false;
let huidigBezoek = null;
let bezoekBewerkModus = false;


wanneerDatabaseKlaar(function(){

    restaurantsOphalen(function(data){

        restaurants = data;

        toonRestaurants();

    });

});
