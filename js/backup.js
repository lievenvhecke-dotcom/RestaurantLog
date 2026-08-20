/* =====================================================
   BACKUP MAKEN
   ===================================================== */

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

            let backup;


            try{

                let tekst =
                    e.target.result;


                // BOM verwijderen
                tekst =
                    tekst
                    .replace(/^\uFEFF/, "")
                    .trim();


                // JSON lezen
                backup =
                    JSON.parse(tekst);


                console.log(
                    "Backup gelezen:",
                    backup
                );


            }
            catch(error){

                console.error(
                    "JSON-fout:",
                    error
                );


                alert(
                    "Dit backupbestand kon niet worden gelezen.\n\n" +
                    error.name +
                    "\n" +
                    error.message
                );


                return;

            }


            /* =========================================
               BACKUP CONTROLEREN
               ========================================= */

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


            /* =========================================
               BEVESTIGING
               ========================================= */

            let bevestiging =
                confirm(

                    "Bestaande gegevens vervangen?\n\n" +

                    restaurants.length +
                    " horecazaken\n" +

                    bezoeken.length +
                    " bezoeken\n" +

                    ideeen.length +
                    " ideeën\n" +

                    fotosRestaurant.length +
                    " restaurantfoto's\n" +

                    fotosBezoek.length +
                    " bezoekfoto's\n\n" +

                    "De huidige gegevens op dit toestel " +
                    "worden vervangen door deze backup."

                );


            if(!bevestiging){
                return;
            }


            /* =========================================
               DATABASE HERSTELLEN
               ========================================= */

            gegevensHerstellen(
                backup,

                function(){

                    console.log(
                        "Backup succesvol hersteld."
                    );


                    /*
                     * Database opnieuw uitlezen.
                     * Zo werken we met de werkelijk
                     * teruggezette gegevens.
                     */

                    restaurantsOphalen(
                        function(data){

                            restaurants =
                                data;


                            /*
                             * Eventuele open detailpagina
                             * verlaten.
                             */

                            huidigRestaurant =
                                null;


                            huidigBezoek =
                                null;


                            bezoekBewerkModus =
                                false;


                            bewerkModus =
                                false;


                            /*
                             * Lijst opnieuw tonen
                             */

                            toonPagina(
                                "restaurantsPage"
                            );


                            toonRestaurants();


                            /*
                             * Succesmelding
                             */

                            alert(

                                "Back-up hersteld ✅\n\n" +

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

        };


    reader.onerror =
        function(){

            console.error(
                "FileReader fout:",
                reader.error
            );


            alert(
                "Het backupbestand kon niet worden gelezen."
            );

        };


    reader.readAsText(
        bestand,
        "UTF-8"
    );


    /*
     * Input leegmaken zodat hetzelfde bestand
     * opnieuw geselecteerd kan worden.
     */

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


        /* =========================================
           BESTAANDE GEGEVENS WISSEN
           ========================================= */

        restaurantsStore.clear();

        bezoekenStore.clear();

        ideeenStore.clear();

        fotosRestaurantStore.clear();

        fotosBezoekStore.clear();


        /* =========================================
           RESTAURANTS
           ========================================= */

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


        /* =========================================
           BEZOEKEN
           ========================================= */

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


        /* =========================================
           IDEEËN
           ========================================= */

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


        /* =========================================
           RESTAURANTFOTO'S
           ========================================= */

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


        /* =========================================
           BEZOEKFOTO'S
           ========================================= */

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


        /* =========================================
           TRANSACTIE SUCCESVOL
           ========================================= */

        transaction.oncomplete =
            function(){

                console.log(
                    "Database succesvol hersteld."
                );


                if(callback){

                    callback();

                }

            };


        /* =========================================
           TRANSACTIE FOUT
           ========================================= */

        transaction.onerror =
            function(event){

                console.error(
                    "Database restore fout:",
                    event.target.error
                );


                alert(
                    "De backup kon niet in de database worden gezet.\n\n" +
                    event.target.error
                );

            };


        transaction.onabort =
            function(event){

                console.error(
                    "Database restore afgebroken:",
                    event.target.error
                );


                alert(
                    "Het herstellen van de backup is afgebroken."
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
            error.name +
            "\n" +
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
