function toonBezoeken(){

    let lijst =
        document.getElementById(
            "bezoekenLijst"
        );


    lijst.innerHTML = "";


    bezoekenOphalen(
        huidigRestaurant.id,
        function(bezoeken){


            bezoeken.forEach(b => {


                lijst.innerHTML += `

<div class="restaurant-card">

    <div onclick="openBezoek(${b.id})">

        <h4>
            📅 ${b.datum}
            ${"⭐".repeat(Number(b.score))}
        </h4>


        <p class="opmerking-tekst">
            ${b.opmerking}
        </p>

    </div>


    <button onclick="bezoekVerwijderen(${b.id})">
        🗑
    </button>

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