function toonPagina(pagina){

    document.querySelectorAll("section")
        .forEach(
            x => x.classList.add("hidden")
        );


    document.getElementById(pagina)
        .classList.remove("hidden");


    // Actieve navigatieknop markeren

    document
        .querySelectorAll(".bottom-nav button")
        .forEach(
            knop => knop.classList.remove("actief")
        );


    let actieveKnop =
        document.querySelector(
            `.bottom-nav button[onclick="toonPagina('${pagina}')"]`
        );


    if(actieveKnop){

        actieveKnop.classList.add("actief");

    }


    // Favorieten laden

    if(pagina === "favorietenPage"){

        toonFavorieten();

    }


    // Kaart laden

    if(pagina === "kaartPage"){

        toonKaart();

    }

}


function terugNaarLijst(){

    toonPagina(
        "restaurantsPage"
    );

}
