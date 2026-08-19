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

                let backup =
                    JSON.parse(
                        e.target.result
                    );


                console.log(
                    "Backup inhoud:",
                    backup
                );


                // Controleren of dit een geldige backup is

                if(
                    !backup.restaurants ||
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
                    backup.bezoeken
                    ? backup.bezoeken.length
                    : 0;


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


                gegevensHerstellen(
                    backup,

                    function(){

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
                    "Fout bij backup:",
                    error
                );


                alert(
                    "De back-up kon niet worden gelezen."
                );

            }

        };


    reader.readAsText(
        bestand
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
