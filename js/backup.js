function backupMaken(){

    alleRestaurantsOphalen(
        function(restaurants){

            alleBezoekenOphalen(
                function(bezoeken){

                    let backup = {

                        versie: 1,

                        datum:
                            new Date().toISOString(),

                        restaurants:
                            restaurants,

                        bezoeken:
                            bezoeken

                    };


                    let bestand =
                        new Blob(
                            [
                                JSON.stringify(
                                    backup,
                                    null,
                                    2
                                )
                            ],
                            {
                                type:
                                    "application/json"
                            }
                        );


                    let link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        URL.createObjectURL(
                            bestand
                        );


                    link.download =
                        "HorecaLog_backup_" +
                        new Date()
                            .toISOString()
                            .split("T")[0] +
                        ".json";


                    link.click();


                    URL.revokeObjectURL(
                        link.href
                    );

                }
            );

        }
    );

}


function backupHerstellen(event){

    let bestand =
        event.target.files[0];


    if(!bestand){
        return;
    }


    let reader =
        new FileReader();


    reader.onload =
        function(e){

            try{

                // Tekst uit bestand ophalen
                let tekst =
                    e.target.result;


                // Eventuele BOM / verborgen tekens
                // aan het begin verwijderen
                tekst =
                    tekst
                    .replace(/^\uFEFF/, "")
                    .trim();


                console.log(
                    "Backuptekst gelezen:",
                    tekst.substring(0, 100)
                );


                // JSON lezen
                let backup =
                    JSON.parse(tekst);


                console.log(
                    "Backup succesvol gelezen:",
                    backup
                );


                // ================================
                // CONTROLE BACKUP
                // ================================

                if(
                    !backup ||
                    !Array.isArray(
                        backup.restaurants
                    )
                ){

                    alert(
                        "Dit is geen geldige HorecaLog-backup."
                    );

                    return;

                }


                let aantalRestaurants =
                    backup.restaurants.length;


                let aantalBezoeken =
                    Array.isArray(
                        backup.bezoeken
                    )
                    ? backup.bezoeken.length
                    : 0;


                console.log(
                    "Restaurants:",
                    aantalRestaurants
                );


                console.log(
                    "Bezoeken:",
                    aantalBezoeken
                );


                // ================================
                // BEVESTIGING
                // ================================

                let bevestiging =
                    confirm(

                        "Bestaande gegevens vervangen?\n\n" +

                        aantalRestaurants +
                        " horecazaken\n" +

                        aantalBezoeken +
                        " bezoeken\n\n" +

                        "Deze gegevens worden vervangen door " +
                        "de gegevens uit de back-up."

                    );


                if(!bevestiging){
                    return;
                }


                // ================================
                // DATABASE HERSTELLEN
                // ================================

                gegevensHerstellen(
                    backup,

                    function(){

                        console.log(
                            "Backup succesvol hersteld"
                        );


                        restaurantsOphalen(
                            function(data){

                                restaurants =
                                    data;


                                toonRestaurants();


                                alert(
                                    "Back-up hersteld ✅\n\n" +

                                    aantalRestaurants +
                                    " horecazaken en " +

                                    aantalBezoeken +
                                    " bezoeken teruggezet."
                                );

                            }
                        );

                    }
                );


            }
            catch(error){

                console.error(
                    "FOUT BIJ BACKUP:",
                    error
                );


                alert(
                    "Back-up kon niet worden gelezen.\n\n" +
                    error.name +
                    "\n" +
                    error.message
                );

            }

        };


    reader.onerror =
        function(){

            alert(
                "Het backupbestand kon niet worden gelezen."
            );

        };


    reader.readAsText(
        bestand,
        "UTF-8"
    );

}

let backupInput =
    document.getElementById(
        "backupInput"
    );


if(backupInput){

    backupInput.addEventListener(
        "change",
        backupHerstellen
    );

}

function alleBezoekenOphalen(callback){

    let transaction =
        db.transaction(
            ["bezoeken"],
            "readonly"
        );

    let store =
        transaction.objectStore(
            "bezoeken"
        );

    let request =
        store.getAll();

    request.onsuccess = function(){

        callback(
            request.result
        );

    };

}
