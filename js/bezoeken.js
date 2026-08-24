
/* =====================================================
   BEZOEKEN
   ===================================================== */

let uploadBezig = {};


/* =====================================================
   DATUMFORMAAT
   ===================================================== */

function datumFormaat(datum){

    let d =
        new Date(datum);

    let taalCode =
        huidigeTaal === "fr"
            ? "fr-BE"
            : huidigeTaal === "en"
                ? "en-GB"
                : "nl-BE";

    return d.toLocaleDateString(
        taalCode,
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

/* =====================================================
   SCORE STERREN
   ===================================================== */

function scoreKiezen(score){

    let veld =
        document.getElementById(
            "bezoekScore"
        );

    if(!veld){
        return;
    }


    veld.value =
        score;


    scoreSterrenTonen(
        score
    );

}

function scoreSterKiezen(event, sterNummer){

    let rect =
        event.currentTarget.getBoundingClientRect();


    let klikX =
        event.clientX -
        rect.left;


    let helft =
        rect.width / 2;


    let score;


    if(klikX < helft){

        score =
            sterNummer - 0.5;

    }
    else{

        score =
            sterNummer;

    }


    scoreKiezen(
        score
    );

}


/* =====================================================
   SCORE STERREN TONEN
   ===================================================== */

function scoreSterrenTonen(score){

    let sterren =
        document.querySelectorAll(
            ".score-ster"
        );


    sterren.forEach(
        function(ster){

            let sterScore =
                Number(
                    ster.dataset.score
                );


            /*
             * Volledige ster
             */

            if(score >= sterScore){

                ster.innerHTML =
                    "⭐";

            }


            /*
             * Halve ster
             */

            else if(
                score >=
                sterScore - 0.5
            ){

                ster.innerHTML =
                    "⭐";

            }


            /*
             * Lege ster
             */

            else{

                ster.innerHTML =
                    "☆";

            }

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

    if(!lijst){
        return;
    }

    if(!huidigRestaurant){
        lijst.innerHTML = "";
        return;
    }

    bezoekenOphalen(
        huidigRestaurant.id,
        function(bezoeken){

            /* Nieuwste bezoek eerst */

            bezoeken.sort(
                function(a, b){

                    return b.datum.localeCompare(
                        a.datum
                    );

                }
            );


            lijst.innerHTML = "";


            if(bezoeken.length === 0){

                lijst.innerHTML =
                    "<p class='geen-resultaten'>" +
                    t("geenBezoeken") +
                    "</p>";

                return;

            }


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
            title="${t("bezoekVerwijderen")}"
        >
            🗑
        </button>

    </div>


    <div class="opmerking-tekst">
        ${b.opmerking || ""}
    </div>


    <div
        id="fotoActie_${b.id}"
    ></div>


    <div
        id="fotoBezoek_${b.id}"
        class="foto-grid"
    ></div>

</div>

`;

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


    document
        .getElementById(
            "nieuwBezoekForm"
        )
        .classList
        .remove(
            "hidden"
        );


    document
        .getElementById(
            "bezoekDatum"
        )
        .value =
        new Date()
            .toISOString()
            .split("T")[0];


    document
        .getElementById(
            "bezoekScore"
        )
        .value =
        "0";

        scoreSterrenTonen(0);


    document
        .getElementById(
            "bezoekOpmerking"
        )
        .value =
        "";


    /*
     * Bij een nieuw bezoek blijft de
     * bestaande lijst zichtbaar.
     */

    document
        .getElementById(
            "bezoekenLijst"
        )
        .classList
        .remove(
            "hidden"
        );


    /*
     * Oude fotoknop uit formulier verwijderen.
     */

    let oudeFotoActie =
        document.getElementById(
            "fotoActieFormulier"
        );

    if(oudeFotoActie){
        oudeFotoActie.remove();
    }

}


/* =====================================================
   BEZOEK OPSLAAN
   ===================================================== */

function bezoekOpslaanNieuw(){

    let datum =
        document.getElementById(
            "bezoekDatum"
        ).value;


    let score =
        document.getElementById(
            "bezoekScore"
        ).value;


    let opmerking =
        document.getElementById(
            "bezoekOpmerking"
        ).value;


    /* =============================================
       BESTAAND BEZOEK AANPASSEN
       ============================================= */

    if(bezoekBewerkModus){

        if(!huidigBezoek){
            return;
        }


        /*
         * BELANGRIJK:
         * We maken eerst een nieuw object.
         *
         * Zo vermijden we dat het object dat
         * momenteel in de interface zit
         * onverwacht wordt gewijzigd.
         */

        let aangepastBezoek = {

            id:
                huidigBezoek.id,

            restaurantId:
                huidigBezoek.restaurantId,

            datum:
                datum,

            score:
                score,

            opmerking:
                opmerking

        };


        /*
         * Opslaan in IndexedDB.
         */

        let transaction =
            db.transaction(
                ["bezoeken"],
                "readwrite"
            );


        let store =
            transaction.objectStore(
                "bezoeken"
            );


        let request =
            store.put(
                aangepastBezoek
            );


        request.onsuccess =
            function(){

                console.log(
                    "Bezoek aangepast:",
                    aangepastBezoek
                );


                /*
                 * Huidig bezoek bijwerken.
                 */

                huidigBezoek =
                    aangepastBezoek;


                bezoekBewerkModus =
                    false;


                /*
                 * Formulier sluiten.
                 */

                document
                    .getElementById(
                        "nieuwBezoekForm"
                    )
                    .classList
                    .add(
                        "hidden"
                    );


                /*
                 * Andere bezoeken opnieuw tonen.
                 */

                document
                    .getElementById(
                        "bezoekenLijst"
                    )
                    .classList
                    .remove(
                        "hidden"
                    );


                /*
                 * Fotoknop uit het formulier verwijderen.
                 */

                let fotoActie =
                    document.getElementById(
                        "fotoActieFormulier"
                    );

                if(fotoActie){
                    fotoActie.remove();
                }


                /*
                 * Lijst opnieuw uit IndexedDB ophalen.
                 *
                 * Dit raakt GEEN andere bezoeken aan.
                 */

                toonBezoeken();
                toonRestaurants();

            };


        request.onerror =
            function(event){

                console.error(
                    "Fout bij aanpassen bezoek:",
                    event.target.error
                );


alert(
    t("bezoekAanpassenFout")
);

            };


        return;

    }


    /* =============================================
       NIEUW BEZOEK
       ============================================= */

    if(!huidigRestaurant){
        return;
    }


    let bezoek = {

        restaurantId:
            huidigRestaurant.id,

        datum:
            datum,

        score:
            score,

        opmerking:
            opmerking

    };


    bezoekOpslaan(
        bezoek,
        function(opgeslagenBezoek){

            huidigBezoek =
                opgeslagenBezoek;


            bezoekBewerkModus =
                false;


            document
                .getElementById(
                    "nieuwBezoekForm"
                )
                .classList
                .add(
                    "hidden"
                );


            toonBezoeken();

            toonRestaurants();


alert(
    t("bezoekToegevoegd")
);

        }
    );

}


/* =====================================================
   BEZOEK OPENEN / BEWERKEN
   ===================================================== */

function openBezoek(id){

    if(!huidigRestaurant){
        return;
    }


    bezoekenOphalen(
        huidigRestaurant.id,
        function(bezoeken){

            let bezoek =
                bezoeken.find(
                    function(b){

                        return Number(b.id) ===
                               Number(id);

                    }
                );


            if(!bezoek){

                console.error(
                    "Bezoek niet gevonden:",
                    id
                );

                return;

            }


            huidigBezoek =
                bezoek;


            console.log(
                "Bezoek geopend:",
                huidigBezoek
            );


            document
                .getElementById(
                    "bezoekDatum"
                )
                .value =
                huidigBezoek.datum || "";


document
    .getElementById(
        "bezoekScore"
    )
    .value =
    huidigBezoek.score || "0";

scoreSterrenTonen(
    Number(huidigBezoek.score) || 0
);

            document
                .getElementById(
                    "bezoekOpmerking"
                )
                .value =
                huidigBezoek.opmerking || "";


            bezoekBewerkModus =
                true;


            /*
             * Formulier tonen.
             */

            document
                .getElementById(
                    "nieuwBezoekForm"
                )
                .classList
                .remove(
                    "hidden"
                );


            /*
             * Andere bezoeken verbergen.
             */

            document
                .getElementById(
                    "bezoekenLijst"
                )
                .classList
                .add(
                    "hidden"
                );


            /*
             * Fotoknop tonen.
             */

            toonFotoToevoegenKnop(
                huidigBezoek.id
            );


            /*
             * Foto's van dit bezoek tonen.
             *
             * Als de kaart verborgen is, wordt
             * hiervoor de fotocontainer in het
             * formulier gebruikt.
             */

            toonFotoFormulier(
                huidigBezoek.id
            );

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


    bezoekBewerkModus =
        true;


    document
        .getElementById(
            "bezoekDatum"
        )
        .value =
        huidigBezoek.datum || "";


document
    .getElementById(
        "bezoekScore"
    )
    .value =
    huidigBezoek.score || "0";

scoreSterrenTonen(
    Number(huidigBezoek.score) || 0
);


    document
        .getElementById(
            "bezoekOpmerking"
        )
        .value =
        huidigBezoek.opmerking || "";


    document
        .getElementById(
            "nieuwBezoekForm"
        )
        .classList
        .remove(
            "hidden"
        );


    document
        .getElementById(
            "bezoekenLijst"
        )
        .classList
        .add(
            "hidden"
        );


    toonFotoToevoegenKnop(
        huidigBezoek.id
    );


    toonFotoFormulier(
        huidigBezoek.id
    );

}


/* =====================================================
   FOTO TOEVOEGEN KNOP
   ===================================================== */

function toonFotoToevoegenKnop(bezoekId){

    /*
     * Oude knoppen uit bezoekkaarten verwijderen.
     */

    document
        .querySelectorAll(
            "[id^='fotoActie_']"
        )
        .forEach(
            function(container){

                container.innerHTML = "";

            }
        );


    /*
     * Als de bezoeklijst verborgen is,
     * gebruiken we het formulier.
     */

    let formulier =
        document.getElementById(
            "nieuwBezoekForm"
        );


    if(!formulier){
        return;
    }


    let oude =
        document.getElementById(
            "fotoActieFormulier"
        );


    if(oude){
        oude.remove();
    }


    formulier.insertAdjacentHTML(
        "beforeend",
        `

        <div
            id="fotoActieFormulier"
            class="foto-formulier-actie"
        >

           <label
    for="fotoBezoekInput_${bezoekId}"
    class="foto-toevoegen"
>
    ${t("fotoToevoegen")}
</label>


            <input
                type="file"
                id="fotoBezoekInput_${bezoekId}"
                accept="image/*"
                multiple
                hidden
                onchange="bezoekFotoInput(${bezoekId}, event)"
            >

            <div
                id="fotoFormulier_${bezoekId}"
                class="foto-grid"
            ></div>

        </div>

        `
    );

}


/* =====================================================
   FOTO'S IN FORMULIER TONEN
   ===================================================== */

function toonFotoFormulier(bezoekId){

    let container =
        document.getElementById(
            "fotoFormulier_" + bezoekId
        );


    if(!container){
        return;
    }


    container.innerHTML = "";


    fotosBezoekOphalen(
        bezoekId,
        function(fotos){

            fotos.forEach(
                function(foto){

                    let fotoItem =
                        document.createElement(
                            "div"
                        );


                    fotoItem.className =
                        "foto-item";


                    let afbeelding =
                        document.createElement(
                            "img"
                        );


                    afbeelding.src =
                        foto.data;


afbeelding.alt =
    t("fotoVanBezoek");


                    afbeelding.onclick =
                        function(){

                            toonGroteFoto(
                                foto.data
                            );

                        };


                    let verwijderKnop =
                        document.createElement(
                            "button"
                        );


                    verwijderKnop.className =
                        "foto-verwijder";


                    verwijderKnop.innerHTML =
                        "🗑";


verwijderKnop.title =
    t("fotoVerwijderen");


                    verwijderKnop.onclick =
                        function(event){

                            event.stopPropagation();


                            bezoekFotoVerwijderen(
                                foto.id,
                                bezoekId
                            );

                        };


                    fotoItem.appendChild(
                        afbeelding
                    );


                    fotoItem.appendChild(
                        verwijderKnop
                    );


                    container.appendChild(
                        fotoItem
                    );

                }
            );

        }
    );

}


/* =====================================================
   BEZOEK VERWIJDEREN
   ===================================================== */

function bezoekVerwijderen(id){

let bevestiging =
    confirm(
        t("bezoekVerwijderenBevestiging")
    );


    if(!bevestiging){
        return;
    }


    let transaction =
        db.transaction(
            [
                "bezoeken",
                "fotosBezoek"
            ],
            "readwrite"
        );


    let bezoekenStore =
        transaction.objectStore(
            "bezoeken"
        );


    let fotosStore =
        transaction.objectStore(
            "fotosBezoek"
        );


    let index =
        fotosStore.index(
            "bezoekId"
        );


    let request =
        index.openCursor(
            IDBKeyRange.only(id)
        );


    request.onsuccess =
        function(event){

            let cursor =
                event.target.result;


            if(cursor){

                cursor.delete();

                cursor.continue();

            }

        };


    bezoekenStore.delete(
        id
    );


    transaction.oncomplete =
        function(){

            if(
                huidigBezoek &&
                Number(huidigBezoek.id) ===
                Number(id)
            ){

                huidigBezoek =
                    null;

                bezoekBewerkModus =
                    false;

            }


            toonBezoeken();
            toonRestaurants();

        };


    transaction.onerror =
        function(event){

            console.error(
                "Fout bij verwijderen bezoek:",
                event.target.error
            );


alert(
    t("bezoekVerwijderenFout")
);

        };

}


/* =====================================================
   FOTO INPUT
   ===================================================== */

function bezoekFotoInput(
    bezoekId,
    event
){

    let bestanden =
        event.target.files;


    if(
        !bestanden ||
        bestanden.length === 0
    ){
        return;
    }


    if(uploadBezig[bezoekId]){

        event.target.value = "";

        return;

    }


    uploadBezig[bezoekId] =
        true;


    let container =
        document.getElementById(
            "fotoActieFormulier"
        );


    if(container){

        container.insertAdjacentHTML(
            "afterbegin",
            `
<div class="foto-laden">
    ${t("fotoWordtToegevoegd")}
</div>
            `
        );

    }


    let bestandenArray =
        Array.from(
            bestanden
        );


    event.target.value = "";


    bezoekFotosOpslaan(
        bezoekId,
        bestandenArray,
        0
    );

}


/* =====================================================
   FOTO'S EEN VOOR EEN OPSLAAN
   ===================================================== */

function bezoekFotosOpslaan(
    bezoekId,
    bestanden,
    positie
){

    if(
        positie >= bestanden.length
    ){

        uploadBezig[bezoekId] =
            false;


        toonFotoFormulier(
            bezoekId
        );


        return;

    }


    let bestand =
        bestanden[positie];


    let reader =
        new FileReader();


    reader.onload =
        function(e){

            let foto = {

                bezoekId:
                    bezoekId,

                data:
                    e.target.result,

                datum:
                    new Date()
                        .toISOString()

            };


            fotoBezoekOpslaan(
                foto,
                function(){

                    bezoekFotosOpslaan(
                        bezoekId,
                        bestanden,
                        positie + 1
                    );

                }
            );

        };


    reader.onerror =
        function(){

            console.error(
                "Foto kon niet worden gelezen."
            );


            bezoekFotosOpslaan(
                bezoekId,
                bestanden,
                positie + 1
            );

        };


    reader.readAsDataURL(
        bestand
    );

}


/* =====================================================
   FOTO'S VAN BEZOEK TONEN
   ===================================================== */

function toonBezoekFotos(bezoekId){

    let container =
        document.getElementById(
            "fotoBezoek_" + bezoekId
        );


    if(!container){
        return;
    }


    container.innerHTML = "";


    fotosBezoekOphalen(
        bezoekId,
        function(fotos){

            fotos.forEach(
                function(foto){

                    let fotoItem =
                        document.createElement(
                            "div"
                        );


                    fotoItem.className =
                        "foto-item";


                    let afbeelding =
                        document.createElement(
                            "img"
                        );


                    afbeelding.src =
                        foto.data;


                    afbeelding.alt =
                        "Foto van bezoek";


                    afbeelding.onclick =
                        function(){

                            toonGroteFoto(
                                foto.data
                            );

                        };


                    let verwijderKnop =
                        document.createElement(
                            "button"
                        );


                    verwijderKnop.className =
                        "foto-verwijder";


                    verwijderKnop.innerHTML =
                        "🗑";


                    verwijderKnop.title =
                        "Foto verwijderen";


                    verwijderKnop.onclick =
                        function(event){

                            event.stopPropagation();


                            bezoekFotoVerwijderen(
                                foto.id,
                                bezoekId
                            );

                        };


                    fotoItem.appendChild(
                        afbeelding
                    );


                    fotoItem.appendChild(
                        verwijderKnop
                    );


                    container.appendChild(
                        fotoItem
                    );

                }
            );

        }
    );

}


/* =====================================================
   BEZOEKFOTO VERWIJDEREN
   ===================================================== */

function bezoekFotoVerwijderen(
    fotoId,
    bezoekId
){

    let bevestiging =
        confirm(
            "Deze foto verwijderen?"
        );


    if(!bevestiging){
        return;
    }


    let transaction =
        db.transaction(
            ["fotosBezoek"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "fotosBezoek"
        );


    store.delete(
        fotoId
    );


    transaction.oncomplete =
        function(){

            /*
             * Als we aan het bewerken zijn,
             * de foto's in het formulier opnieuw laden.
             */

            if(bezoekBewerkModus){

                toonFotoFormulier(
                    bezoekId
                );

            }
            else{

                toonBezoekFotos(
                    bezoekId
                );

            }

        };


    transaction.onerror =
        function(){

alert(
    t("fotoVerwijderenFout")
);

        };

}
