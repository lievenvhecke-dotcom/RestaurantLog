function toonRestaurants(){

    let lijst =
        document.getElementById("lijst");


    lijst.innerHTML = "";


    // Zoekterm ophalen
    let zoekveld =
        document.getElementById("zoekRestaurant");


    let zoekterm =
        zoekveld
        ? zoekveld.value
            .toLowerCase()
            .trim()
        : "";


    // Filteren op naam of gemeente
    let gefilterdeRestaurants =
        restaurants.filter(
            function(r){

                let naam =
                    (r.naam || "")
                    .toLowerCase();


                let gemeente =
                    (r.gemeente || "")
                    .toLowerCase();


                return (
                    naam.includes(zoekterm) ||
                    gemeente.includes(zoekterm)
                );

            }
        );


    // Alfabetisch sorteren
    let gesorteerdeRestaurants =
        [...gefilterdeRestaurants].sort(
            (a, b) =>
                a.naam.localeCompare(
                    b.naam
                )
        );


    // Geen resultaten
    if(
        gesorteerdeRestaurants.length === 0
    ){

        lijst.innerHTML =
            "<p class='geen-resultaten'>" +
            "Geen horecazaken gevonden." +
            "</p>";

        return;

    }


    // Restaurants tonen
    gesorteerdeRestaurants.forEach(
        function(r){

            lijst.innerHTML += `

                <div
                    class="restaurant-card"
                    onclick="openRestaurant(${r.id})"
                >

                    <h3>

                        ${r.favoriet ? "❤️ " : ""}

                        ${r.naam}

                        <span class="gemeente">
                            ${r.gemeente}
                        </span>

                    </h3>

                </div>

            `;

        }
    );

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
document.getElementById("bezoekScore").value = "0";
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
        toonRestaurantFotos();


    toonPagina("detailPage");

}

function verwijderen(){

    if(!huidigRestaurant){
        return;
    }


    let bevestiging =
        confirm(
            "Horecazaak verwijderen?\n\n" +
"De horecazaak én alle bijhorende bezoeken " +
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
            "<p>Nog geen favoriete horecazaken.</p>";

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

function restaurantFotosToevoegen(event){

    if(!huidigRestaurant){
        return;
    }


    let bestanden =
        event.target.files;


    Array.from(bestanden).forEach(
        function(bestand){

            let reader =
                new FileReader();


            reader.onload =
                function(e){

                    let foto = {

                        restaurantId:
                            huidigRestaurant.id,

                        data:
                            e.target.result,

                        datum:
                            new Date().toISOString()

                    };


                    fotoRestaurantOpslaan(
                        foto,
                        function(){

                            toonRestaurantFotos();

                        }
                    );

                };


            reader.readAsDataURL(
                bestand
            );

        }
    );


    // Input leegmaken zodat
    // dezelfde foto opnieuw gekozen kan worden

    event.target.value = "";

}


function toonRestaurantFotos(){

    if(!huidigRestaurant){
        return;
    }


    let container =
        document.getElementById(
            "restaurantFotos"
        );


    container.innerHTML = "";


    fotosRestaurantOphalen(
        huidigRestaurant.id,
        function(fotos){

            fotos.forEach(
                function(foto){

                    container.innerHTML += `

                        <div
                            class="foto-item"
                            onclick="toonGroteFoto('${foto.data}')"
                        >

                            <img
                                src="${foto.data}"
                            >

                            <button
                                class="foto-verwijder"
                                onclick="event.stopPropagation(); restaurantFotoVerwijderen(${foto.id})"
                            >
                                🗑
                            </button>

                        </div>

                    `;

                }
            );

        }
    );

}


function restaurantFotoVerwijderen(id){

    let bevestiging =
        confirm(
            "Deze foto verwijderen?"
        );


    if(!bevestiging){
        return;
    }


    fotoRestaurantVerwijderen(
        id
    );


    setTimeout(
        function(){

            toonRestaurantFotos();

        },
        100
    );

}


function toonGroteFoto(data){

    let venster =
        window.open(
            ""
        );


    venster.document.write(
        `
        <html>

        <head>

            <title>Foto</title>

            <style>

                body{
                    margin:0;
                    background:black;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    height:100vh;
                }

                img{
                    max-width:100%;
                    max-height:100%;
                    object-fit:contain;
                }

            </style>

        </head>

        <body>

            <img src="${data}">

        </body>

        </html>
        `
    );

}
