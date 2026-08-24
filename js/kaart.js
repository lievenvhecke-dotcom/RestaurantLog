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
        "<h3>" +
        t("kaartKiesLocatie") +
        "</h3>" +

        "<p>" +
        t("kaartKiesLocatieUitleg") +
        "</p>";


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
        t("straatHuisnummer");


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

        <h3>${t("locatieIngeven")}</h3>

        <p>
            ${t("adresRestaurant")}
        </p>

        <label>
            ${t("straat")}
        </label>

        <input
            id="locatieStraat"
            placeholder="${t("voorbeeldZeedijk")}"
        >

        <label>
            ${t("huisnummer")}
        </label>

        <input
            id="locatieHuisnummer"
            placeholder="${t("voorbeeldHuisnummer")}"
        >

        <label>
            ${t("gemeente")}
        </label>

        <input
            id="locatieGemeente"
            value="${huidigRestaurant.gemeente || ""}"
        >

        <button
            onclick="zoekHandmatigAdres()"
        >
            ${t("zoekAdres")}
        </button>

        <button
            onclick="locatieInstellen()"
        >
            ${t("zoekRestaurantOpnieuw")}
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
            t("vulAdresIn")
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
                t("adresNietGevonden")
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
            t("foutZoekenAdres")
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
        "<h3>" +
        t("adresGevonden") +
        "</h3>" +

        "<p>" +
        t("kiesJuisteAdres") +
        "</p>";


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

            t("locatieGebruiken") +
            "\n\n" +
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
        t("locatieOpgeslagen")
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
