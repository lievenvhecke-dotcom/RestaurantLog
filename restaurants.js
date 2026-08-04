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

        keuken: document.getElementById("keuken").value,
        
        favoriet: false

    };


   if(bewerkModus){

    restaurant.id =
        huidigRestaurant.id;

    restaurantAanpassen(
        restaurant
    );


    let index =
        restaurants.findIndex(
            r => r.id === restaurant.id
        );


    restaurants[index] =
        restaurant;


    bewerkModus = false;

}
else{

restaurantOpslaan(restaurant);

restaurants.push(restaurant);


let bezoek = {

    restaurantId: restaurant.id,

    datum: restaurant.datum,

    score: restaurant.score,

    opmerking: restaurant.opmerking

};


bezoekOpslaan(bezoek);

}


    toonRestaurants();


    document.querySelectorAll("input, textarea")
        .forEach(x => x.value="");

}

function openRestaurant(id){


    let restaurant =
        restaurants.find(
            r => r.id === id
        );


    huidigRestaurant = restaurant;


    document.getElementById("detailNaam")
        .innerHTML = restaurant.naam;


    document.getElementById("detailGemeente")
        .innerHTML =
        "📍 " + restaurant.gemeente;


    document.getElementById("detailKeuken")
        .innerHTML =
        "🍴 " + restaurant.keuken;


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
            "Restaurant verwijderen?"
        );


    if(bevestiging){

        restaurantVerwijderen(
            huidigRestaurant.id
        );


        restaurants =
            restaurants.filter(
                r => r.id !== huidigRestaurant.id
            );


        toonRestaurants();


        toonPagina(
            "restaurantsPage"
        );

    }

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


    document.getElementById("datum").value =
        huidigRestaurant.datum;


    document.getElementById("opmerking").value =
        huidigRestaurant.opmerking;


    document.getElementById("score").value =
        huidigRestaurant.score;


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