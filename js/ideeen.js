function nieuwIdee(){

    let veld =
        document.getElementById(
            "ideeTekst"
        );


    veld.value = "";


    veld.focus();

}


function ideeOpslaanViaForm(){

    let veld =
        document.getElementById(
            "ideeTekst"
        );


    let tekst =
        veld.value.trim();


    if(tekst === ""){

        return;

    }


    let idee = {

        tekst: tekst,

        datum:
            new Date().toISOString()

    };


    ideeOpslaan(
        idee,
        function(){

            veld.value = "";

            toonIdeeen();

        }
    );

}


function toonIdeeen(){

    let lijst =
        document.getElementById(
            "ideeenLijst"
        );


    if(!lijst){

        return;

    }


    lijst.innerHTML = "";


    ideeenOphalen(
        function(ideeen){

            // Nieuwste eerst

            ideeen.sort(
                function(a,b){

                    return new Date(b.datum)
                        -
                        new Date(a.datum);

                }
            );


            if(ideeen.length === 0){

                lijst.innerHTML =
                    "<p class='geen-ideeen'>" +
                    "Nog geen ideeën genoteerd." +
                    "</p>";

                return;

            }


            ideeen.forEach(
                function(idee){

                    let datum =
                        new Date(
                            idee.datum
                        );


                    let datumTekst =
                        datum.toLocaleDateString(
                            "nl-BE"
                        );


                    let kaart =
                        document.createElement(
                            "div"
                        );


                    kaart.className =
                        "idee-card";


                    kaart.innerHTML = `

                        <div class="idee-inhoud">

                            <div class="idee-tekst">
                                💡 ${idee.tekst}
                            </div>

                            <div class="idee-datum">
                                ${datumTekst}
                            </div>

                        </div>

                        <button
                            class="idee-verwijder"
                            onclick="verwijderIdee(${idee.id})"
                            title="Idee verwijderen"
                        >
                            🗑️
                        </button>

                    `;


                    lijst.appendChild(
                        kaart
                    );

                }
            );

        }
    );

}


function verwijderIdee(id){

    let bevestiging =
        confirm(
            "Dit idee verwijderen?"
        );


    if(!bevestiging){

        return;

    }


    ideeVerwijderen(id);


    toonIdeeen();

}
