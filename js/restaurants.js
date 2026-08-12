function toonRestaurants(){

    let lijst = document.getElementById("lijst");

    lijst.innerHTML="";


    let gesorteerdeRestaurants =
    [...restaurants].sort(
        (a, b) =>
            a.naam.localeCompare(
                b.naam
            )
    );


    gesorteerdeRestaurants.forEach(r => {

    lijst.innerHTML += `

    <div class="restaurant-card"
     onclick="openRestaurant(${r.id})">


    <h3>
        ${r.favoriet ? "❤️ " : ""}
        ${r.naam}
        <span class="gemeente">
            ${r.gemeente}
        </span>
    </h3>

</div>

    `;

});

}

function opslaan() {

    let restaurant = {

        naam: document.getElementById("naam").value,

        gemeente: document.getElementById("gemeente").value,

        keuken: keukenWaarde(),

        favoriet: false

    };


    if (bewerkModus) {

        restaurant.id =
            huidigRestaurant.id;

        // Bestaande locatie behouden
        restaurant.lat =
            huidigRestaurant.lat;

        restaurant.lng =
            huidigRestaurant.lng;

        restaurantAanpassen(
            restaurant
        );


        let index =
            restaurants.findIndex(
                r => r.id === restaurant.id
            );


        restaurants[index] =
            restaurant;


        huidigRestaurant =
            restaurant;


        bewerkModus = false;

    }

    else {

        restaurantOpslaan(
            restaurant,
            function(nieuwRestaurant) {

                restaurants.push(
                    nieuwRestaurant
                );

                toonRestaurants();

                document
                    .getElementById(
                        "nieuwRestaurantForm"
                    )
                    .classList
                    .add("hidden");

            }
        );

    }


    toonRestaurants();


    document
        .querySelectorAll(
            "input, textarea"
        )
        .forEach(
            x => x.value = ""
        );

}

function openRestaurant(id){


    let restaurant =
        restaurants.find(
            r => r.id === id
        );


    huidigRestaurant = restaurant;

    huidigBezoek = null;
bezoekBewerkModus = false;

document.getElementById("bezoekDatum").value = "";
document.getElementById("bezoekScore").value = "5";
document.getElementById("bezoekOpmerking").value = "";

document
    .getElementById("nieuwBezoekForm")
    .classList.add("hidden");


    document.getElementById("detailNaam")
        .innerHTML = restaurant.naam;


    document.getElementById("detailGemeente")
        .innerHTML =
        "📍 " + restaurant.gemeente;

    document.getElementById("detailKeuken")
        .innerHTML =
        restaurant.keuken
        ? "🍴 " + restaurant.keuken
        : "";


        updateFavorietKnop();

        toonBezoeken();


    toonPagina("detailPage");

}

function verwijderen(){

    if(!huidigRestaurant){
        return;
    }


    let bevestiging =
        confirm(
            "Restaurant verwijderen?\n\n" +
            "Het restaurant én alle bijhorende bezoeken " +
            "worden verwijderd."
        );


    if(!bevestiging){
        return;
    }


    restaurantVerwijderen(
        huidigRestaurant.id
    );


    restaurants =
        restaurants.filter(
            r => r.id !== huidigRestaurant.id
        );


    huidigRestaurant = null;


    toonRestaurants();


    toonPagina(
        "restaurantsPage"
    );

}

function bewerken(){

    if(!huidigRestaurant){
        return;
    }

    bewerkModus = true;

    document.getElementById("naam").value =
        huidigRestaurant.naam;


    document.getElementById("gemeente").value =
        huidigRestaurant.gemeente;


    document.getElementById("keuken").value =
        huidigRestaurant.keuken;


    toonPagina(
        "restaurantsPage"
    );

}

function updateFavorietKnop(){

    let knop =
        document.getElementById(
            "favorietKnop"
        );


    if(huidigRestaurant.favoriet){

        knop.innerHTML =
            "❤️ Favoriet geselecteerd";

    }
    else{

        knop.innerHTML =
            "♡ Geen favoriet";

    }

}

function favorietWisselen(){

    huidigRestaurant.favoriet =
        !huidigRestaurant.favoriet;


    restaurantAanpassen(
        huidigRestaurant
    );


    let index =
        restaurants.findIndex(
            r => r.id === huidigRestaurant.id
        );


    restaurants[index] =
        huidigRestaurant;


    updateFavorietKnop();

}

function toonFavorieten(){

    let lijst =
        document.getElementById(
            "favorietenLijst"
        );


    lijst.innerHTML = "";


    let favorieten =
        restaurants.filter(
            r => r.favoriet === true
        );


    if(favorieten.length === 0){

        lijst.innerHTML =
            "<p>Nog geen favoriete restaurants.</p>";

        return;

    }


    favorieten.forEach(r => {


        lijst.innerHTML += `

        <div class="restaurant"
             onclick="openRestaurant(${r.id})">


            <h3>
                ❤️ ${r.naam}
            </h3>


            <b>
                ${"⭐".repeat(Number(r.score))}
            </b>


            <p>
                📍 ${r.gemeente}
            </p>


            <p>
                🍴 ${r.keuken}
            </p>


        </div>

        `;


    });

}

document.getElementById("datum").value =
    new Date().toISOString().split("T")[0];

    function openGoogleMaps(){

    if(!huidigRestaurant){
        return;
    }


    let zoekterm =
        huidigRestaurant.naam +
        " " +
        huidigRestaurant.gemeente;


    let url =
        "https://www.google.com/maps/search/?api=1&query="
        +
        encodeURIComponent(
            zoekterm
        );


    window.open(
        url,
        "_blank"
    );

}

function nieuwRestaurant(){

    document
    .getElementById("nieuwRestaurantForm")
    .classList
    .remove("hidden");

}

function keukenGewijzigd(){

    let keuze =
        document.getElementById("keukenSelect").value;


    let veld =
        document.getElementById("andereKeuken");


    if(keuze === "Andere"){

        veld.classList.remove("hidden");

    }
    else{

        veld.classList.add("hidden");
        veld.value = "";

    }

}

function keukenWaarde(){

    let keuze =
        document.getElementById("keukenSelect").value;


    if(keuze === "Andere"){

        return document.getElementById("andereKeuken").value;

    }


    return keuze;

}
