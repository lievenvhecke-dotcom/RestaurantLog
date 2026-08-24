/* =====================================================
BEZOEKEN
===================================================== */

let uploadBezig = {};
let fotoRenderVersie = {};

/* =====================================================
DATUMFORMAAT
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

if(!lijst){
    return;
}

lijst.innerHTML = "";

if(!huidigRestaurant){
    return;
}

bezoekenOphalen(
    huidigRestaurant.id,
    function(bezoeken){

        bezoeken.sort(
            function(a, b){

                return b.datum.localeCompare(
                    a.datum
                );

            }
        );

        if(bezoeken.length === 0){

            lijst.innerHTML =
                "<p class='geen-resultaten'>" +
                "Nog geen bezoeken geregistreerd." +
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
        title="Bezoek verwijderen"
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


document
    .getElementById(
        "bezoekOpmerking"
    )
    .value =
    "";


/*
 * Bij een nieuw bezoek tonen we
 * opnieuw alle bezoeken.
 */

toonBezoeken();

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


    huidigBezoek.datum =
        datum;


    huidigBezoek.score =
        score;


    huidigBezoek.opmerking =
        opmerking;


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
        .add(
            "hidden"
        );


    /*
     * Na opslaan terug naar het
     * normale overzicht.
     */

    toonBezoeken();


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


        alert(
            "Bezoek toegevoegd ✅"
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


        document
            .getElementById(
                "bezoekOpmerking"
            )
            .value =
            huidigBezoek.opmerking || "";


        bezoekBewerkModus =
            true;


        /*
         * Eerst de lijst met alle bezoeken
         * verbergen.
         */

        let bezoekenLijst =
            document.getElementById(
                "bezoekenLijst"
            );


        if(bezoekenLijst){

            bezoekenLijst.classList.add(
                "hidden"
            );

        }


        /*
         * Wijzigformulier tonen.
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
         * Fotoknop tonen.
         */

        toonFotoToevoegenKnop(
            huidigBezoek.id
        );


        /*
         * Foto's van dit bezoek laden.
         */

        toonBezoekFotos(
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
    huidigBezoek.datum;


document
    .getElementById(
        "bezoekScore"
    )
    .value =
    huidigBezoek.score;


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


let bezoekenLijst =
    document.getElementById(
        "bezoekenLijst"
    );


if(bezoekenLijst){

    bezoekenLijst.classList.add(
        "hidden"
    );

}


toonFotoToevoegenKnop(
    huidigBezoek.id
);

}

/* =====================================================
FOTO TOEVOEGEN KNOP TONEN
===================================================== */

function toonFotoToevoegenKnop(bezoekId){

document
    .querySelectorAll(
        "[id^='fotoActie_']"
    )
    .forEach(
        function(container){

            container.innerHTML = "";

        }
    );


let container =
    document.getElementById(
        "fotoActie_" + bezoekId
    );


/*
 * Als de bezoekkaart verborgen is,
 * bestaat de container niet meer.
 *
 * Daarom gebruiken we de container
 * binnen het formulier als alternatief.
 */

if(!container){

    let formulier =
        document.getElementById(
            "nieuwBezoekForm"
        );


    if(!formulier){
        return;
    }


    /*
     * Fotoknop voor het formulier.
     */

    let bestaande =
        document.getElementById(
            "fotoBezoekInput_" + bezoekId
        );


    if(bestaande){
        return;
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
                📷 Foto toevoegen
            </label>

            <input
                type="file"
                id="fotoBezoekInput_${bezoekId}"
                accept="image/*"
                multiple
                hidden
                onchange="bezoekFotoInput(${bezoekId}, event)"
            >

        </div>

        `
    );


    return;

}


container.innerHTML = `

    <label
        for="fotoBezoekInput_${bezoekId}"
        class="foto-toevoegen"
    >
        📷 Foto toevoegen
    </label>

    <input
        type="file"
        id="fotoBezoekInput_${bezoekId}"
        accept="image/*"
        multiple
        hidden
        onchange="bezoekFotoInput(${bezoekId}, event)"
    >

`;

}

/* =====================================================
BEZOEK VERWIJDEREN
===================================================== */

function bezoekVerwijderen(id){

let bevestiging =
    confirm(
        "Dit bezoek en alle bijhorende foto's verwijderen?"
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


        delete fotoRenderVersie[id];


        toonBezoeken();

    };


transaction.onerror =
    function(event){

        console.error(
            "Fout bij verwijderen bezoek:",
            event.target.error
        );


        alert(
            "Het bezoek kon niet worden verwijderd."
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
        "fotoActie_" + bezoekId
    );


if(!container){

    container =
        document.getElementById(
            "fotoActieFormulier"
        );

}


if(container){

    container.innerHTML = `

        <div class="foto-laden">

            📷 Foto wordt toegevoegd...

        </div>

    `;

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


    toonBezoekFotos(
        bezoekId
    );


    toonFotoToevoegenKnop(
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


if(
    !fotoRenderVersie[bezoekId]
){

    fotoRenderVersie[bezoekId] =
        0;

}


fotoRenderVersie[bezoekId]++;


let huidigeRender =
    fotoRenderVersie[bezoekId];


container.innerHTML = "";


fotosBezoekOphalen(
    bezoekId,
    function(fotos){

        if(
            fotoRenderVersie[bezoekId] !==
            huidigeRender
        ){

            return;

        }


        container.innerHTML = "";


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

        toonBezoekFotos(
            bezoekId
        );

    };


transaction.onerror =
    function(){

        alert(
            "De foto kon niet worden verwijderd."
        );

    };

}
