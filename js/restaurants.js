/* =====================================================
   RESTAURANTS
===================================================== */


function toonRestaurants(){

    let verborgenKnop =
        document.getElementById(
            "verborgenRestaurantsKnop"
        );

    if(verborgenKnop){
        verborgenKnop.style.display = "";

    }
    
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
    // Verborgen horecazaken worden niet getoond
    let gefilterdeRestaurants =
        restaurants.filter(
            function(r){

                if(r.verborgen === true){
                    return false;
                }


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


/* =====================================================
   RESTAURANT OPSLAAN
===================================================== */

function opslaan(){

    let restaurant = {

        naam:
            document.getElementById("naam").value,

        gemeente:
            document.getElementById("gemeente").value,

        keuken:
            keukenWaarde(),

        favoriet:
            false,

        verborgen:
            false

    };


    /* =================================================
       BESTAAND RESTAURANT AANPASSEN
    ================================================= */

    if(bewerkModus){

        restaurant.id =
            huidigRestaurant.id;


        // Bestaande locatie behouden
        restaurant.lat =
            huidigRestaurant.lat;

        restaurant.lng =
            huidigRestaurant.lng;


        // Bestaande favoriet behouden
        restaurant.favoriet =
            huidigRestaurant.favoriet || false;


        // Bestaande verborgen-status behouden
        restaurant.verborgen =
            huidigRestaurant.verborgen || false;


        restaurantAanpassen(
            restaurant
        );


        let index =
            restaurants.findIndex(
                r => r.id === restaurant.id
            );


        if(index !== -1){

            restaurants[index] =
                restaurant;

        }


        huidigRestaurant =
            restaurant;


        bewerkModus =
            false;

    }

    else{

        restaurantOpslaan(
            restaurant,
            function(nieuwRestaurant){

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


/* =====================================================
   RESTAURANT OPENEN
===================================================== */

function openRestaurant(id){

    let restaurant =
        restaurants.find(
            r => r.id === id
        );


    if(!restaurant){
        return;
    }


    huidigRestaurant =
        restaurant;

            // Meer opties altijd standaard dicht
    let meerOpties =
        document.querySelector(".meer-opties");

    if(meerOpties){
        meerOpties.removeAttribute("open");
    }

    huidigBezoek =
        null;

    bezoekBewerkModus =
        false;


    document
        .getElementById(
            "bezoekDatum"
        )
        .value =
        "";


    document
        .getElementById(
            "bezoekScore"
        )
        .value =
        "0";


    document
        .getElementById(
            "bezoekOpmerking"
        )
        .value =
        "";


    document
        .getElementById(
            "nieuwBezoekForm"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "detailNaam"
        )
        .innerHTML =
        restaurant.naam;


    document
        .getElementById(
            "detailGemeente"
        )
        .innerHTML =
        "📍 " + restaurant.gemeente;


    document
        .getElementById(
            "detailKeuken"
        )
        .innerHTML =
        restaurant.keuken
        ? "🍴 " + restaurant.keuken
        : "";


    updateFavorietKnop();

    updateVerbergenKnop();


    toonBezoeken();

    toonRestaurantFotos();


    toonPagina(
        "detailPage"
    );

}


/* =====================================================
   RESTAURANT VERWIJDEREN
===================================================== */

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
            r =>
                r.id !==
                huidigRestaurant.id
        );


    huidigRestaurant =
        null;


    toonRestaurants();


    toonPagina(
        "restaurantsPage"
    );

}


/* =====================================================
   RESTAURANT BEWERKEN
===================================================== */

function bewerken(){

    if(!huidigRestaurant){
        return;
    }


    bewerkModus =
        true;


    document
        .getElementById(
            "naam"
        )
        .value =
        huidigRestaurant.naam;


    document
        .getElementById(
            "gemeente"
        )
        .value =
        huidigRestaurant.gemeente;


    document
        .getElementById(
            "keuken"
        )
        .value =
        huidigRestaurant.keuken;


    toonPagina(
        "restaurantsPage"
    );

}


/* =====================================================
   FAVORIET KNOP BIJWERKEN
===================================================== */

function updateFavorietKnop(){

    let knop =
        document.getElementById(
            "favorietKnop"
        );


    if(!knop){
        return;
    }


    if(
        huidigRestaurant &&
        huidigRestaurant.favoriet
    ){

        knop.innerHTML =
            "❤️ Favoriet geselecteerd";

    }
    else{

        knop.innerHTML =
            "♡ Geen favoriet";

    }

}


/* =====================================================
   FAVORIET WISSELEN
===================================================== */

function favorietWisselen(){

    if(!huidigRestaurant){
        return;
    }


    huidigRestaurant.favoriet =
        !huidigRestaurant.favoriet;


    restaurantAanpassen(
        huidigRestaurant
    );


    let index =
        restaurants.findIndex(
            r =>
                r.id ===
                huidigRestaurant.id
        );


    if(index !== -1){

        restaurants[index] =
            huidigRestaurant;

    }


    updateFavorietKnop();

}


/* =====================================================
   VERBERGEN KNOP BIJWERKEN
===================================================== */

function updateVerbergenKnop(){

    let knop =
        document.getElementById(
            "verborgenKnop"
        );


    if(
        !knop ||
        !huidigRestaurant
    ){

        return;

    }


    if(
        huidigRestaurant.verborgen === true
    ){

        knop.innerHTML =
            "👁️ Opnieuw tonen in lijst";

    }
    else{

        knop.innerHTML =
            "👁️ Verbergen uit lijst";

    }

}

/* =====================================================
   HORECAZAAK VERBERGEN / OPNIEUW TONEN
===================================================== */

function verborgenWisselen(){

    if(!huidigRestaurant){
        return;
    }


    huidigRestaurant.verborgen =
        huidigRestaurant.verborgen !== true;


    restaurantAanpassen(
        huidigRestaurant
    );


    let index =
        restaurants.findIndex(
            r =>
                r.id ===
                huidigRestaurant.id
        );


    if(index !== -1){

        restaurants[index] =
            huidigRestaurant;

    }


    updateVerbergenKnop();


    // Normale lijst onmiddellijk verversen
    toonRestaurants();

}

/* =====================================================
   VERBORGEN HORECAZAKEN TONEN
===================================================== */

function toonVerborgenRestaurants(){

    let verborgenKnop =
        document.getElementById(
            "verborgenRestaurantsKnop"
        );

    if(verborgenKnop){
        verborgenKnop.style.display = "none";
    }

    let lijst =
        document.getElementById("lijst");


    lijst.innerHTML = "";


    let verborgenRestaurants =
        restaurants.filter(
            function(r){

                return r.verborgen === true;

            }
        );


    // Geen verborgen zaken
    if(
        verborgenRestaurants.length === 0
    ){

        lijst.innerHTML = `

            <p class="geen-resultaten">
                Geen verborgen horecazaken.
            </p>

            <button
                onclick="toonRestaurants()"
            >
                ← Terug naar alle horecazaken
            </button>

        `;

        return;

    }


    // Titel
    lijst.innerHTML = `

        <div class="verborgen-header">

            <h2>
                👁️ Verborgen horecazaken
            </h2>

            <p>
                Deze zaken staan niet in je gewone lijst,
                maar blijven wel beschikbaar op de kaart.
            </p>

        </div>

    `;


    // Alfabetisch sorteren
    verborgenRestaurants.sort(
        function(a, b){

            return a.naam.localeCompare(
                b.naam
            );

        }
    );


    verborgenRestaurants.forEach(
        function(r){

            lijst.innerHTML += `

                <div
                    class="restaurant-card"
                    onclick="openRestaurant(${r.id})"
                >

                    <h3>

                        👁️ ${r.naam}

                        <span class="gemeente">
                            ${r.gemeente}
                        </span>

                    </h3>

                </div>

            `;

        }
    );


    lijst.innerHTML += `

        <button
            onclick="toonRestaurants()"
        >
            ← Terug naar alle horecazaken
        </button>

    `;

}

/* =====================================================
   FAVORIETEN TONEN
===================================================== */

function toonFavorieten(){

    let lijst =
        document.getElementById(
            "favorietenLijst"
        );


    lijst.innerHTML = "";


    let favorieten =
        restaurants.filter(
            r =>
                r.favoriet === true &&
                r.verborgen !== true
        );


    if(favorieten.length === 0){

        lijst.innerHTML =
            "<p>Nog geen favoriete horecazaken.</p>";

        return;

    }


    favorieten.forEach(
        function(r){

            lijst.innerHTML += `

                <div
                    class="restaurant"
                    onclick="openRestaurant(${r.id})"
                >

                    <h3>
                        ❤️ ${r.naam}
                    </h3>


                    <b>
                        ${"⭐".repeat(
                            Number(r.score || 0)
                        )}
                    </b>


                    <p>
                        📍 ${r.gemeente}
                    </p>


                    <p>
                        🍴 ${r.keuken || ""}
                    </p>

                </div>

            `;

        }
    );

}


/* =====================================================
   GOOGLE MAPS
===================================================== */

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


/* =====================================================
   NIEUW RESTAURANT
===================================================== */

function nieuwRestaurant(){

    document
        .getElementById(
            "nieuwRestaurantForm"
        )
        .classList
        .remove("hidden");

}


/* =====================================================
   KEUKEN GEWIJZIGD
===================================================== */

function keukenGewijzigd(){

    let keuze =
        document
            .getElementById(
                "keukenSelect"
            )
            .value;


    let veld =
        document.getElementById(
            "andereKeuken"
        );


    if(
        keuze === "Andere"
    ){

        veld
            .classList
            .remove("hidden");

    }
    else{

        veld
            .classList
            .add("hidden");

        veld.value = "";

    }

}


/* =====================================================
   KEUKENWAARDE
===================================================== */

function keukenWaarde(){

    let keuze =
        document
            .getElementById(
                "keukenSelect"
            )
            .value;


    if(
        keuze === "Andere"
    ){

        return document
            .getElementById(
                "andereKeuken"
            )
            .value;

    }


    return keuze;

}


/* =====================================================
   RESTAURANTFOTO'S TOEVOEGEN
===================================================== */

function restaurantFotosToevoegen(
    event
){

    if(!huidigRestaurant){
        return;
    }


    let bestanden =
        event.target.files;


    Array.from(
        bestanden
    ).forEach(
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
                            new Date()
                                .toISOString()

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


/* =====================================================
   RESTAURANTFOTO'S TONEN
===================================================== */

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


/* =====================================================
   RESTAURANTFOTO VERWIJDEREN
===================================================== */

function restaurantFotoVerwijderen(
    id
){

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


/* =====================================================
   GROTE FOTO TONEN
===================================================== */

function toonGroteFoto(
    data
){

    let modal =
        document.getElementById(
            "fotoModal"
        );


    let groteFoto =
        document.getElementById(
            "groteFoto"
        );


    groteFoto.src =
        data;


    modal
        .classList
        .remove("hidden");

}


/* =====================================================
   GROTE FOTO SLUITEN
===================================================== */

function sluitGroteFoto(){

    let modal =
        document.getElementById(
            "fotoModal"
        );


    let groteFoto =
        document.getElementById(
            "groteFoto"
        );


    modal
        .classList
        .add("hidden");


    groteFoto.src =
        "";

}
