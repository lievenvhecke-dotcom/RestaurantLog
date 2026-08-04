function toonPagina(pagina){

    document.querySelectorAll("section")
        .forEach(x => x.classList.add("hidden"));


    document.getElementById(pagina)
        .classList.remove("hidden");


    if(pagina === "favorietenPage"){

        toonFavorieten();

    }

}


function terugNaarLijst(){

    toonPagina(
        "restaurantsPage"
    );

}
