/* =====================================================
   IDEEËN
===================================================== */


/* =====================================================
   NIEUW IDEE
===================================================== */

function nieuwIdee(){

    let veld =
        document.getElementById(
            "ideeTekst"
        );


    veld.value = "";


    veld.focus();

}


/* =====================================================
   IDEE OPSLAAN
===================================================== */

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


/* =====================================================
   IDEEËN TONEN
===================================================== */

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


            /* =========================================
               GEEN IDEEËN
            ========================================= */

            if(ideeen.length === 0){

                lijst.innerHTML =
                    "<p class='geen-ideeen'>" +
                    t("geenIdeeen") +
                    "</p>";

                return;

            }


            /* =========================================
               IDEEËN TONEN
            ========================================= */

            ideeen.forEach(
                function(idee){

                    let datum =
                        new Date(
                            idee.datum
                        );


                    /*
                     * Datum in de huidige taal.
                     */

                    let taalCode =
                        huidigeTaal === "fr"
                            ? "fr-BE"
                            : huidigeTaal === "en"
                                ? "en-GB"
                                : "nl-BE";


                    let datumTekst =
                        datum.toLocaleDateString(
                            taalCode
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
                            title="${t("ideeVerwijderen")}"
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


/* =====================================================
   IDEE VERWIJDEREN
===================================================== */

function verwijderIdee(id){

    let bevestiging =
        confirm(
            t("ideeVerwijderenBevestiging")
        );


    if(!bevestiging){

        return;

    }


    ideeVerwijderen(
        id
    );


    toonIdeeen();

}
