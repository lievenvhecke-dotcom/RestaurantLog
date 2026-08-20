/* =====================================================
   DATUM
   ===================================================== */

function datumFormaat(datum){

    let d =
        new Date(datum);


    return d.toLocaleDateString(
        "nl-BE",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =====================================================
   BEZOEKEN TONEN
   ===================================================== */

function toonBezoeken(){

    let lijst =
        document.getElementById(
            "bezoekenLijst"
        );


    lijst.innerHTML = "";


    bezoekenOphalen(
        huidigRestaurant.id,

        function(bezoeken){

            bezoeken.sort(
                (a,b) =>
                    b.datum.localeCompare(
                        a.datum
                    )
            );


            bezoeken.forEach(
                function(b){

                    lijst.innerHTML += `

<div class="bezoek-card">

    <div class="bezoek-header">

        <span
            class="bezoek-datum"
            onclick="openBezoek(${b.id})"
        >

            ${datumFormaat(b.datum)}

        </span>


        <span class="bezoek-score">

            ${
                Number(b.score) === 0
                    ? "☆"
                    : "⭐".repeat(
                        Number(b.score)
                    )
            }

        </span>


        <button
            class="verwijder-bezoek"
            onclick="event.stopPropagation(); bezoekVerwijderen(${b.id})"
        >
            🗑
        </button>

    </div>


    <div class="opmerking-tekst">

        ${b.opmerking || ""}

    </div>


    <!-- Bestaande foto's -->

    <div
        id="fotoBezoek_${b.id}"
        class="foto-grid"
    ></div>


</div>

`;


                    /*
                     * Foto's van dit bezoek laden
                     */

                    toonBezoekFotos(
                        b.id
                    );

                }
            );

        }
    );

}


/* =====================================================
   NIEUW BEZOEK
   ===================================================== */

function nieuwBezoek(){

    bezoekBewerkModus =
        false;


    huidigBezoek =
        null;


    /*
     * Foto toevoegen verbergen
     */

    document
        .getElementById(
            "bezoekFotoKnop"
        )
        .classList
        .add("hidden");


    /*
     * Formulier tonen
     */

    document
        .getElementById(
            "nieuwBezoekForm"
        )
        .classList
        .remove("hidden");


    /*
     * Datum vandaag
     */

    document.getElementById(
        "bezoekDatum"
    ).value =

        new Date()
            .toISOString()
            .split("T")[0];


    /*
     * Score
     */

    document.getElementById(
        "bezoekScore"
    ).value =
        "0";


    /*
     * Opmerking
     */

    document.getElementById(
        "bezoekOpmerking"
    ).value =
        "";

}


/* =====================================================
   BEZOEK OPSLAAN
   ===================================================== */

function bezoekOpslaanNieuw(){

    /*
     * Bestaand bezoek aanpassen
     */

    if(bezoekBewerkModus){

        huidigBezoek.datum =
            document.getElementById(
                "bezoekDatum"
            ).value;


        huidigBezoek.score =
            document.getElementById(
                "bezoekScore"
            ).value;


        huidigBezoek.opmerking =
            document.getElementById(
                "bezoekOpmerking"
            ).value;


        bezoekAanpassen(
            huidigBezoek
        );


        bezoekBewerkModus =
            false;


        document
            .getElementById(
                "nieuwBezoekForm"
            )
            .classList
            .add("hidden");


        /*
         * Foto toevoegen opnieuw verbergen
         */

        document
            .getElementById(
                "bezoekFotoKnop"
            )
            .classList
            .add("hidden");


        toonBezoeken();


        return;

    }


    /*
     * Nieuw bezoek
     */

    let bezoek = {

        restaurantId:
            huidigRestaurant.id,


        datum:
            document.getElementById(
                "bezoekDatum"
            ).value,


        score:
            document.getElementById(
                "bezoekScore"
            ).value,


        opmerking:
            document.getElementById(
                "bezoekOpmerking"
            ).value

    };


    bezoekOpslaan(

        bezoek,

        function(opgeslagenBezoek){

            /*
             * Nieuwe bezoek bewaren
             */

            huidigBezoek =
                opgeslagenBezoek;


            /*
             * Formulier sluiten
             */

            document
                .getElementById(
                    "nieuwBezoekForm"
                )
                .classList
                .add("hidden");


            /*
             * Foto toevoegen verbergen
             *
             * Het bezoek is nieuw aangemaakt.
             * De gebruiker kan het daarna
             * opnieuw openen om foto's toe te voegen.
             */

            document
                .getElementById(
                    "bezoekFotoKnop"
                )
                .classList
                .add("hidden");


            toonBezoeken();


            alert(
                "Bezoek toegevoegd ✅"
            );

        }
    );

}


/* =====================================================
   BESTAAND BEZOEK OPENEN
   ===================================================== */

function openBezoek(id){

    bezoekenOphalen(

        huidigRestaurant.id,

        function(bezoeken){

            huidigBezoek =
                bezoeken.find(
                    b =>
                        b.id === id
                );


            if(!huidigBezoek){

                return;

            }


            /*
             * Datum
             */

            document.getElementById(
                "bezoekDatum"
            ).value =
                huidigBezoek.datum;


            /*
             * Score
             */

            document.getElementById(
                "bezoekScore"
            ).value =
                huidigBezoek.score;


            /*
             * Opmerking
             */

            document.getElementById(
                "bezoekOpmerking"
            ).value =
                huidigBezoek.opmerking || "";


            /*
             * Bewerkmodus
             */

            bezoekBewerkModus =
                true;


            /*
             * Foto toevoegen TONEN
             */

            document
                .getElementById(
                    "bezoekFotoKnop"
                )
                .classList
                .remove("hidden");


            /*
             * Formulier tonen
             */

            document
                .getElementById(
                    "nieuwBezoekForm"
                )
                .classList
                .remove("hidden");

        }
    );

}


/* =====================================================
   BEZOEK BEWERKEN
   ===================================================== */

function bezoekBewerken(){

    if(!huidigBezoek){

        return;

    }


    document.getElementById(
        "bezoekDatum"
    ).value =
        huidigBezoek.datum;


    document.getElementById(
        "bezoekScore"
    ).value =
        huidigBezoek.score;


    document.getElementById(
        "bezoekOpmerking"
    ).value =
        huidigBezoek.opmerking || "";


    bezoekBewerkModus =
        true;


    /*
     * Foto toevoegen tonen
     */

    document
        .getElementById(
            "bezoekFotoKnop"
        )
        .classList
        .remove("hidden");


    document
        .getElementById(
            "nieuwBezoekForm"
        )
        .classList
        .remove("hidden");

}


/* =====================================================
   BEZOEK VERWIJDEREN
   ===================================================== */

function bezoekVerwijderen(id){

    let bevestiging =
        confirm(
            "Dit bezoek verwijderen?"
        );


    if(!bevestiging){

        return;

    }


    let transaction =
        db.transaction(
            ["bezoeken"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "bezoeken"
        );


    store.delete(
        id
    );


    transaction.oncomplete =
        function(){

            /*
             * Als het verwijderde bezoek
             * het huidige bezoek was
             */

            if(
                huidigBezoek &&
                huidigBezoek.id === id
            ){

                huidigBezoek =
                    null;

            }


            toonBezoeken();

        };

}


/* =====================================================
   FOTO'S PER BEZOEK
   ===================================================== */

function bezoekFotoInput(
    bezoekId,
    event
){

    /*
     * Het juiste bezoek actief maken
     */

    huidigBezoek = {

        id:
            bezoekId

    };


    bezoekFotosToevoegen(
        event
    );

}


/* =====================================================
   FOTO'S TOEVOEGEN
   ===================================================== */

function bezoekFotosToevoegen(
    event
){

    if(!huidigBezoek){

        return;

    }


    let bestanden =
        event.target.files;


    if(
        !bestanden ||
        bestanden.length === 0
    ){

        return;

    }


    Array.from(
        bestanden
    ).forEach(

        function(bestand){

            let reader =
                new FileReader();


            reader.onload =
                function(e){

                    let foto = {

                        bezoekId:
                            huidigBezoek.id,


                        data:
                            e.target.result,


                        datum:
                            new Date()
                                .toISOString()

                    };


                    fotoBezoekOpslaan(

                        foto,

                        function(){

                            /*
                             * Foto onmiddellijk tonen
                             */

                            toonBezoekFotos(
                                huidigBezoek.id
                            );

                        }
                    );

                };


            reader.readAsDataURL(
                bestand
            );

        }
    );


    /*
     * Input leegmaken zodat dezelfde
     * foto opnieuw gekozen kan worden
     */

    event.target.value = "";

}


/* =====================================================
   FOTO'S TONEN
   ===================================================== */

function toonBezoekFotos(
    bezoekId
){

    let container =
        document.getElementById(
            "fotoBezoek_" +
            bezoekId
        );


    if(!container){

        return;

    }


    container.innerHTML =
        "";


    fotosBezoekOphalen(

        bezoekId,

        function(fotos){

            fotos.forEach(

                function(foto){

                    container.innerHTML += `

                        <div
                            class="foto-item"
                        >

                            <img
                                src="${foto.data}"
                                onclick="toonGroteFoto('${foto.data}')"
                            >

                        </div>

                    `;

                }
            );

        }
    );

}
