function datumFormaat(datum){

    let d = new Date(datum);

    return d.toLocaleDateString(
        "nl-BE",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

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
            (a,b) => b.datum.localeCompare(a.datum)
        );


        bezoeken.forEach(b => {

 lijst.innerHTML += `

<div class="bezoek-card">


    <div class="bezoek-header">

        <span class="bezoek-datum">
            ${datumFormaat(b.datum)}
        </span>


        <span class="bezoek-score">
            ${"⭐".repeat(Number(b.score))}
        </span>


        <button class="verwijder-bezoek"
                onclick="bezoekVerwijderen(${b.id})">
            🗑
        </button>

    </div>


    <div class="opmerking-tekst">
        ${b.opmerking || ""}
    </div>


</div>

`;


            });


        }
    );

}

function nieuwBezoek(){

    document
    .getElementById(
        "nieuwBezoekForm"
    )
    .classList
    .remove("hidden");


    document.getElementById(
        "bezoekDatum"
    ).value =
        new Date()
        .toISOString()
        .split("T")[0];

}

function bezoekOpslaanNieuw(){

if(bezoekBewerkModus){

    huidigBezoek.datum =
        document.getElementById("bezoekDatum").value;

    huidigBezoek.score =
        document.getElementById("bezoekScore").value;

    huidigBezoek.opmerking =
        document.getElementById("bezoekOpmerking").value;


    bezoekAanpassen(
        huidigBezoek
    );


    bezoekBewerkModus = false;

    toonBezoeken();

    return;

}

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
    function(){

        document
        .getElementById(
            "nieuwBezoekForm"
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

function openBezoek(id){

    bezoekenOphalen(
        huidigRestaurant.id,
        function(bezoeken){

            huidigBezoek =
                bezoeken.find(
                    b => b.id === id
                );

        }
    );

}

function bezoekBewerken(){

    if(!huidigBezoek){
        return;
    }


    document.getElementById("bezoekDatum").value =
        huidigBezoek.datum;


    document.getElementById("bezoekScore").value =
        huidigBezoek.score;


    document.getElementById("bezoekOpmerking").value =
        huidigBezoek.opmerking;


    bezoekBewerkModus = true;


document
    .getElementById("nieuwBezoekForm")
    .classList
    .remove("hidden");

}

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


    store.delete(id);


    transaction.oncomplete = function(){

        toonBezoeken();

    };

}
