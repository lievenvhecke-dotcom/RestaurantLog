let map;
let kaartMarkers = [];


/* =====================================================
   GROTE RESTAURANTKAART
   ===================================================== */

function toonKaart() {

    if (map) {

        setTimeout(function () {

            map.invalidateSize();

        }, 100);

        return;
    }


    // Kaart opent standaard rond België
    map = L.map("map").setView(
        [50.85, 4.35],
        8
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap"
        }
    ).addTo(map);


    laadRestaurantsOpKaart();

}


/* =====================================================
   RESTAURANTS OP DE KAART
   ===================================================== */

async function laadRestaurantsOpKaart() {

    // Bestaande markers verwijderen

    kaartMarkers.forEach(
        function(marker) {

            map.removeLayer(marker);

        }
    );


    kaartMarkers = [];


    alleRestaurantsOphalen(
        function(restaurants) {

            restaurants.forEach(
                function(restaurant) {

                    // Alleen restaurants met
                    // een bekende locatie tonen

                    if (
                        restaurant.lat &&
                        restaurant.lng
                    ) {

                        plaatsMarker(
                            restaurant
                        );

                    }

                }
            );

        }
    );

}


/* =====================================================
   MARKER PLAATSEN
   ===================================================== */

function plaatsMarker(restaurant) {

    let marker =
        L.marker(
            [
                restaurant.lat,
                restaurant.lng
            ]
        ).addTo(map);


    marker.bindPopup(

        "<b>" +
        restaurant.naam +
        "</b><br>" +
        restaurant.gemeente

    );


    kaartMarkers.push(
        marker
    );

}


/* =====================================================
   LOCATIE INSTELLEN
   ===================================================== */

async function locatieInstellen() {

    if (!huidigRestaurant) {

        return;

    }


    let zoekterm =
        huidigRestaurant.naam +
        " " +
        huidigRestaurant.gemeente;


    let url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=json" +
        "&limit=5" +
        "&q=" +
        encodeURIComponent(
            zoekterm
        );


    try {

        let response =
            await fetch(url);


        let resultaten =
            await response.json();


        if (
            resultaten.length === 0
        ) {

            toonHandmatigAdres();

            return;

        }


        toonLocatieResultaten(
            resultaten
        );


    }
    catch(error) {

        console.error(
            "Fout bij zoeken locatie:",
            error
        );


        toonHandmatigAdres();

    }

}


/* =====================================================
   GEVONDEN LOCATIES TONEN
   ===================================================== */

function toonLocatieResultaten(
    resultaten
) {

    verwijderLocatieBlok();


    let blok =
        document.createElement(
            "div"
        );


    blok.id =
        "locatieResultaten";


    blok.className =
        "card";


    blok.innerHTML =
        "<h3>🗺️ Kies de juiste locatie</h3>" +
        "<p>Kies hieronder de juiste locatie.</p>";


    resultaten.forEach(
        function(resultaat) {

            let knop =
                document.createElement(
                    "button"
                );


            knop.innerHTML =
                "📍 " +
                resultaat.display_name;


            knop.onclick =
                function() {

                    bevestigLocatie(
                        resultaat
                    );

                };


            blok.appendChild(
                knop
            );

        }
    );


    // Mogelijkheid om zelf een adres in te geven

    let handmatig =
        document.createElement(
            "button"
        );


    handmatig.innerHTML =
        "✏️ Straat en huisnummer ingeven";


    handmatig.onclick =
        function() {

            toonHandmatigAdres();

        };


    blok.appendChild(
        handmatig
    );


    voegLocatieBlokToe(
        blok
    );

}


/* =====================================================
   HANDMATIG ADRES INGEVEN
   ===================================================== */

function toonHandmatigAdres() {

    verwijderLocatieBlok();


    let blok =
        document.createElement(
            "div"
        );


    blok.id =
        "locatieResultaten";


    blok.className =
        "card";


    blok.innerHTML = `

        <h3>📍 Locatie ingeven</h3>

        <p>
            Geef het adres van het restaurant in.
        </p>

        <label>
            Straat
        </label>

        <input
            id="locatieStraat"
            placeholder="Bijvoorbeeld Zeedijk"
        >

        <label>
            Huisnummer
        </label>

        <input
            id="locatieHuisnummer"
            placeholder="Bijvoorbeeld 123"
        >

        <label>
            Gemeente
        </label>

        <input
            id="locatieGemeente"
            value="${huidigRestaurant.gemeente || ""}"
        >

        <button
            onclick="zoekHandmatigAdres()"
        >
            📍 Zoek adres
        </button>

        <button
            onclick="locatieInstellen()"
        >
            🔍 Zoek restaurant opnieuw
        </button>

    `;


    voegLocatieBlokToe(
        blok
    );

}


/* =====================================================
   HANDMATIG ADRES ZOEKEN
   ===================================================== */

async function zoekHandmatigAdres() {

    let straat =
        document.getElementById(
            "locatieStraat"
        ).value.trim();


    let huisnummer =
        document.getElementById(
            "locatieHuisnummer"
        ).value.trim();


    let gemeente =
        document.getElementById(
            "locatieGemeente"
        ).value.trim();


    if (
        straat === "" ||
        huisnummer === "" ||
        gemeente === ""
    ) {

        alert(
            "Vul straat, huisnummer en gemeente in."
        );

        return;

    }


    let zoekterm =
        straat +
        " " +
        huisnummer +
        ", " +
        gemeente;


    let url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=json" +
        "&limit=5" +
        "&q=" +
        encodeURIComponent(
            zoekterm
        );


    try {

        let response =
            await fetch(url);


        let resultaten =
            await response.json();


        if (
            resultaten.length === 0
        ) {

            alert(
                "Dit adres kon niet gevonden worden."
            );

            return;

        }


        toonAdresResultaten(
            resultaten
        );

    }
    catch(error) {

        console.error(
            "Fout bij zoeken adres:",
            error
        );


        alert(
            "Er ging iets mis bij het zoeken van het adres."
        );

    }

}


/* =====================================================
   ADRESRESULTATEN TONEN
   ===================================================== */

function toonAdresResultaten(
    resultaten
) {

    verwijderLocatieBlok();


    let blok =
        document.createElement(
            "div"
        );


    blok.id =
        "locatieResultaten";


    blok.className =
        "card";


    blok.innerHTML =
        "<h3>📍 Adres gevonden</h3>" +
        "<p>Kies het juiste adres.</p>";


    resultaten.forEach(
        function(resultaat) {

            let knop =
                document.createElement(
                    "button"
                );


            knop.innerHTML =
                "📍 " +
                resultaat.display_name;


            knop.onclick =
                function() {

                    bevestigLocatie(
                        resultaat
                    );

                };


            blok.appendChild(
                knop
            );

        }
    );


    voegLocatieBlokToe(
        blok
    );

}


/* =====================================================
   LOCATIE BEVESTIGEN
   ===================================================== */

function bevestigLocatie(
    resultaat
) {

    if (!huidigRestaurant) {

        return;

    }


    let bevestiging =
        confirm(

            "Deze locatie gebruiken?\n\n" +
            resultaat.display_name

        );


    if (!bevestiging) {

        return;

    }


    huidigRestaurant.lat =
        parseFloat(
            resultaat.lat
        );


    huidigRestaurant.lng =
        parseFloat(
            resultaat.lon
        );


    restaurantAanpassen(
        huidigRestaurant
    );


    let index =
        restaurants.findIndex(
            function(r) {

                return (
                    r.id ===
                    huidigRestaurant.id
                );

            }
        );


    if (index !== -1) {

        restaurants[index] =
            huidigRestaurant;

    }


    verwijderLocatieBlok();


    alert(
        "Locatie opgeslagen."
    );

}


/* =====================================================
   HULPFUNCTIES
   ===================================================== */

function voegLocatieBlokToe(
    blok
) {

    let detail =
        document.getElementById(
            "detailPage"
        );


    let detailCard =
        detail.querySelector(
            ".detail-card"
        );


    detailCard.appendChild(
        blok
    );

}


function verwijderLocatieBlok() {

    let bestaand =
        document.getElementById(
            "locatieResultaten"
        );


    if (bestaand) {

        bestaand.remove();

    }

}
