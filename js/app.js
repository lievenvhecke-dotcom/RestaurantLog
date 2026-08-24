const APP_VERSIE = "v10";

document.title = "HorecaLog " + APP_VERSIE;

console.log("HorecaLog geladen:", APP_VERSIE);

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


    // Ideeën opnieuw laden bij het openen
    toonIdeeen();

});
