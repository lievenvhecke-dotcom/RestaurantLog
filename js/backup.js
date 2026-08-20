function backupMaken(){

    alleRestaurantsOphalen(
        function(restaurants){

            alleBezoekenOphalen(
                function(bezoeken){

                    ideeenOphalen(
                        function(ideeen){

                            alleRestaurantFotosOphalen(
                                function(fotosRestaurant){

                                    alleBezoekFotosOphalen(
                                        function(fotosBezoek){

                                            let backup = {

                                                versie: 2,

                                                datum:
                                                    new Date().toISOString(),

                                                restaurants:
                                                    restaurants,

                                                bezoeken:
                                                    bezoeken,

                                                ideeen:
                                                    ideeen,

                                                fotosRestaurant:
                                                    fotosRestaurant,

                                                fotosBezoek:
                                                    fotosBezoek

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


                                            let url =
                                                URL.createObjectURL(
                                                    bestand
                                                );


                                            let link =
                                                document.createElement(
                                                    "a"
                                                );


                                            link.href = url;


                                            link.download =
                                                "HorecaLog_backup_" +
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0] +
                                                ".json";


                                            document.body.appendChild(
                                                link
                                            );


                                            link.click();


                                            document.body.removeChild(
                                                link
                                            );


                                            setTimeout(
                                                function(){

                                                    URL.revokeObjectURL(
                                                        url
                                                    );

                                                },
                                                1000
                                            );


                                            alert(
                                                "Back-up gemaakt ✅\n\n" +
                                                restaurants.length +
                                                " horecazaken\n" +
                                                bezoeken.length +
                                                " bezoeken\n" +
                                                ideeen.length +
                                                " ideeën\n" +
                                                fotosRestaurant.length +
                                                " restaurantfoto's\n" +
                                                fotosBezoek.length +
                                                " bezoekfoto's"
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

}


/* =====================================================
   BACKUP HERSTELLEN
   ===================================================== */

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

                let tekst =
                    e.target.result;


                tekst =
                    tekst
                    .replace(/^\uFEFF/, "")
                    .trim();


                let backup =
                    JSON.parse(tekst);


                console.log(
                    "Backup gelezen:",
                    backup
                );


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


                let restaurants =
                    backup.restaurants;


                let bezoeken =
                    Array.isArray(
                        backup.bezoeken
                    )
                    ? backup.bezoeken
                    : [];


                let ideeen =
                    Array.isArray(
                        backup.ideeen
                    )
                    ? backup.ideeen
                    : [];


                let fotosRestaurant =
                    Array.isArray(
                        backup.fotosRestaurant
                    )
                    ? backup.fotosRestaurant
                    : [];


                let fotosBezoek =
                    Array.isArray(
                        backup.fotosBezoek
                    )
                    ? backup.fotosBezoek
                    : [];


                let bevestiging =
                    confirm(

                        "Bestaande gegevens vervangen?\n\n" +

                        restaurants.length +
                        " horecazaken\n" +

                        bezoeken.length +
                        " bezoeken\n" +

                        ideeen.length +
                        " ideeën\n\n" +

                        "De huidige gegevens op dit toestel " +
                        "worden vervangen door deze backup."

                    );


                if(!bevestiging){

                    return;

                }


                gegevensHerstellen(
                    backup,
                    function(){

                        restaurantsOphalen(
                            function(data){

                                restaurants = data;


                                toonRestaurants();


                                alert(

                                    "Back-up hersteld ✅\n\n" +

                                    restaurants.length +
                                    " horecazaken\n" +

                                    bezoeken.length +
                                    " bezoeken\n" +

                                    ideeen.length +
                                    " ideeën"

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


    // Input resetten zodat hetzelfde
    // bestand opnieuw gekozen kan worden

    event.target.value = "";

}


/* =====================================================
   DATABASE HERSTELLEN
   ===================================================== */

function gegevensHerstellen(
    backup,
    callback
){

    let transaction;


    try{

        transaction =
            db.transaction(
                [
                    "restaurants",
                    "bezoeken",
                    "ideeen",
                    "fotosRestaurant",
                    "fotosBezoek"
                ],
                "readwrite"
            );


        let restaurantsStore =
            transaction.objectStore(
                "restaurants"
            );


        let bezoekenStore =
            transaction.objectStore(
                "bezoeken"
            );


        let ideeenStore =
            transaction.objectStore(
                "ideeen"
            );


        let fotosRestaurantStore =
            transaction.objectStore(
                "fotosRestaurant"
            );


        let fotosBezoekStore =
            transaction.objectStore(
                "fotosBezoek"
            );


        // =========================================
        // BESTAANDE GEGEVENS WISSEN
        // =========================================

        restaurantsStore.clear();

        bezoekenStore.clear();

        ideeenStore.clear();

        fotosRestaurantStore.clear();

        fotosBezoekStore.clear();


        // =========================================
        // RESTAURANTS
        // =========================================

        if(
            Array.isArray(
                backup.restaurants
            )
        ){

            backup.restaurants.forEach(
                function(restaurant){

                    restaurantsStore.put(
                        restaurant
                    );

                }
            );

        }


        // =========================================
        // BEZOEKEN
        // =========================================

        if(
            Array.isArray(
                backup.bezoeken
            )
        ){

            backup.bezoeken.forEach(
                function(bezoek){

                    bezoekenStore.put(
                        bezoek
                    );

                }
            );

        }


        // =========================================
        // IDEEËN
        // =========================================

        if(
            Array.isArray(
                backup.ideeen
            )
        ){

            backup.ideeen.forEach(
                function(idee){

                    ideeenStore.put(
                        idee
                    );

                }
            );

        }


        // =========================================
        // RESTAURANTFOTO'S
        // =========================================

        if(
            Array.isArray(
                backup.fotosRestaurant
            )
        ){

            backup.fotosRestaurant.forEach(
                function(foto){

                    fotosRestaurantStore.put(
                        foto
                    );

                }
            );

        }


        // =========================================
        // BEZOEKFOTO'S
        // =========================================

        if(
            Array.isArray(
                backup.fotosBezoek
            )
        ){

            backup.fotosBezoek.forEach(
                function(foto){

                    fotosBezoekStore.put(
                        foto
                    );

                }
            );

        }


        // =========================================
        // SUCCES
        // =========================================

        transaction.oncomplete =
            function(){

                console.log(
                    "Database succesvol hersteld."
                );


                if(callback){

                    callback();

                }

            };


        transaction.onerror =
            function(event){

                console.error(
                    "Fout bij herstellen:",
                    event.target.error
                );


                alert(
                    "Fout bij herstellen van de backup:\n\n" +
                    event.target.error
                );

            };


    }
    catch(error){

        console.error(
            "Herstellen mislukt:",
            error
        );


        alert(
            "Herstellen mislukt:\n\n" +
            error.message
        );

    }

}


/* =====================================================
   BACKUP INPUT
   ===================================================== */

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
