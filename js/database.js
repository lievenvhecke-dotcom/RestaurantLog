let db;
let dbReady = false;
let dbCallbacks = [];


function openDatabase(){

    let request = indexedDB.open(
        "RestaurantLogDB",
        7
    );


 request.onupgradeneeded = function(event){

    db = event.target.result;


    if(!db.objectStoreNames.contains("restaurants")){

        let store = db.createObjectStore(
            "restaurants",
            {
                keyPath:"id",
                autoIncrement:true
            }
        );

        store.createIndex(
            "naam",
            "naam",
            {
                unique:false
            }
        );

    }


    if(!db.objectStoreNames.contains("bezoeken")){

        let bezoekStore =
            db.createObjectStore(
                "bezoeken",
                {
                    keyPath:"id",
                    autoIncrement:true
                }
            );


        bezoekStore.createIndex(
            "restaurantId",
            "restaurantId",
            {
                unique:false
            }
        );

    }


    if(!db.objectStoreNames.contains("ideeen")){

        db.createObjectStore(
            "ideeen",
            {
                keyPath:"id",
                autoIncrement:true
            }
        );

    }

};

if(!db.objectStoreNames.contains("fotosRestaurant")){

    let fotoRestaurantStore =
        db.createObjectStore(
            "fotosRestaurant",
            {
                keyPath:"id",
                autoIncrement:true
            }
        );

    fotoRestaurantStore.createIndex(
        "restaurantId",
        "restaurantId",
        {
            unique:false
        }
    );

}


if(!db.objectStoreNames.contains("fotosBezoek")){

    let fotoBezoekStore =
        db.createObjectStore(
            "fotosBezoek",
            {
                keyPath:"id",
                autoIncrement:true
            }
        );

    fotoBezoekStore.createIndex(
        "bezoekId",
        "bezoekId",
        {
            unique:false
        }
    );

}


    request.onsuccess = function(event){

    db = event.target.result;

    dbReady = true;

    console.log(
        "Database geopend"
    );


    dbCallbacks.forEach(
        callback => callback()
    );

};


    request.onerror = function(){

        console.log(
            "Database fout"
        );

    };

}


function restaurantOpslaan(restaurant, callback){

    let transaction =
        db.transaction(["restaurants"], "readwrite");

    let store =
        transaction.objectStore("restaurants");

    let request = store.add(restaurant);

    request.onsuccess = function(event){

        restaurant.id = event.target.result;

        if(callback){
            callback(restaurant);
        }

    };

}


function restaurantsOphalen(callback){

    let transaction =
        db.transaction(
            ["restaurants"],
            "readonly"
        );


    let store =
        transaction.objectStore(
            "restaurants"
        );


    let request =
        store.getAll();


    request.onsuccess=function(){

        callback(
            request.result
        );

    };

}

function wanneerDatabaseKlaar(callback){

    if(dbReady){

        callback();

    } else {

        dbCallbacks.push(callback);

    }

}

function restaurantVerwijderen(id){

    let transaction =
        db.transaction(
            [
                "restaurants",
                "bezoeken"
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


    // Restaurant verwijderen

    restaurantsStore.delete(id);


    // Alle bezoeken van dit restaurant zoeken

    let index =
        bezoekenStore.index(
            "restaurantId"
        );


    let request =
        index.openCursor(
            IDBKeyRange.only(id)
        );


    request.onsuccess = function(event){

        let cursor =
            event.target.result;


        if(cursor){

            // Bezoek verwijderen

            cursor.delete();


            // Volgend bezoek

            cursor.continue();

        }

    };

}

function restaurantAanpassen(restaurant){

    let transaction =
        db.transaction(
            ["restaurants"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "restaurants"
        );


    store.put(restaurant);

}


function alleRestaurantsOphalen(callback){

    let transaction =
        db.transaction(
            ["restaurants"],
            "readonly"
        );

    let store =
        transaction.objectStore(
            "restaurants"
        );

    let request =
        store.getAll();


    request.onsuccess = function(){

        callback(
            request.result
        );

    };

}

function gegevensHerstellen(backup, callback){

    // Stap 1: alles wissen

    let wisTransaction =
        db.transaction(
            [
                "restaurants",
                "bezoeken"
            ],
            "readwrite"
        );


    wisTransaction
        .objectStore("restaurants")
        .clear();


    wisTransaction
        .objectStore("bezoeken")
        .clear();


    wisTransaction.oncomplete =
        function(){

            console.log(
                "Oude gegevens gewist"
            );


            // Stap 2: restaurants en bezoeken opnieuw toevoegen

            let herstelTransaction =
                db.transaction(
                    [
                        "restaurants",
                        "bezoeken"
                    ],
                    "readwrite"
                );


            let restaurantsStore =
                herstelTransaction.objectStore(
                    "restaurants"
                );


            let bezoekenStore =
                herstelTransaction.objectStore(
                    "bezoeken"
                );


            // Restaurants herstellen

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


            // Bezoeken herstellen

            if(
                Array.isArray(
                    backup.bezoeken
                )
            ){

                backup.bezoeken.forEach(
                    function(bezoek){

                        console.log(
                            "Bezoek herstellen:",
                            bezoek
                        );

                        bezoekenStore.put(
                            bezoek
                        );

                    }
                );

            }


            herstelTransaction.oncomplete =
                function(){

                    console.log(
                        "Herstel voltooid"
                    );


                    // Controle uitvoeren

                    let controleTransaction =
                        db.transaction(
                            [
                                "restaurants",
                                "bezoeken"
                            ],
                            "readonly"
                        );


                    let restaurantsRequest =
                        controleTransaction
                            .objectStore("restaurants")
                            .getAll();


                    let bezoekenRequest =
                        controleTransaction
                            .objectStore("bezoeken")
                            .getAll();


                    controleTransaction.oncomplete =
                        function(){

                            console.log(
                                "Controle na herstel"
                            );

                            console.log(
                                "Restaurants in database:",
                                restaurantsRequest.result
                            );

                            console.log(
                                "Bezoeken in database:",
                                bezoekenRequest.result
                            );

                            console.log(
                                "Aantal herstelde restaurants:",
                                restaurantsRequest.result.length
                            );

                            console.log(
                                "Aantal herstelde bezoeken:",
                                bezoekenRequest.result.length
                            );


                            if(callback){

                                callback();

                            }

                        };

                };


            herstelTransaction.onerror =
                function(event){

                    console.error(
                        "Fout tijdens herstel:",
                        event.target.error
                    );

                    alert(
                        "Fout bij het herstellen van de gegevens."
                    );

                };

        };


    wisTransaction.onerror =
        function(event){

            console.error(
                "Fout bij wissen:",
                event.target.error
            );

        };

}

function bezoekOpslaan(bezoek, callback){

    let transaction =
        db.transaction(
            ["bezoeken"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "bezoeken"
        );


    let request =
        store.add(bezoek);


    request.onsuccess = function(){

        if(callback){
            callback();
        }

    };

}

function bezoekenOphalen(restaurantId, callback){

    let transaction =
        db.transaction(
            ["bezoeken"],
            "readonly"
        );


    let store =
        transaction.objectStore(
            "bezoeken"
        );


    let index =
        store.index(
            "restaurantId"
        );


    let request =
        index.getAll(
            restaurantId
        );


    request.onsuccess = function(){

        callback(
            request.result
        );

    };

}

function bezoekAanpassen(bezoek){

    let transaction =
        db.transaction(
            ["bezoeken"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "bezoeken"
        );


    store.put(
        bezoek
    );

}

function allesWissen(){

    let bevestiging =
        confirm(
            "Ben je zeker dat je ALLE restaurants en bezoeken wilt verwijderen?"
        );


    if(!bevestiging){
        return;
    }


    let transaction =
        db.transaction(
            [
                "restaurants",
                "bezoeken"
            ],
            "readwrite"
        );


    transaction.objectStore(
        "restaurants"
    ).clear();


    transaction.objectStore(
        "bezoeken"
    ).clear();


    transaction.oncomplete = function(){

        alert(
            "Alle gegevens zijn gewist"
        );


        location.reload();

    };

}

function ideeOpslaan(idee, callback){

    let transaction =
        db.transaction(
            ["ideeen"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "ideeen"
        );


    let request =
        store.add(idee);


    request.onsuccess = function(){

        idee.id =
            request.result;


        if(callback){

            callback(idee);

        }

    };

}


function ideeenOphalen(callback){

    let transaction =
        db.transaction(
            ["ideeen"],
            "readonly"
        );


    let store =
        transaction.objectStore(
            "ideeen"
        );


    let request =
        store.getAll();


    request.onsuccess = function(){

        callback(
            request.result
        );

    };

}


function ideeVerwijderen(id){

    let transaction =
        db.transaction(
            ["ideeen"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "ideeen"
        );


    store.delete(id);

}

function fotoRestaurantOpslaan(foto, callback){

    let transaction =
        db.transaction(
            ["fotosRestaurant"],
            "readwrite"
        );

    let store =
        transaction.objectStore(
            "fotosRestaurant"
        );

    let request =
        store.add(foto);

    request.onsuccess = function(){

        foto.id =
            request.result;

        if(callback){
            callback(foto);
        }

    };

}


function fotosRestaurantOphalen(
    restaurantId,
    callback
){

    let transaction =
        db.transaction(
            ["fotosRestaurant"],
            "readonly"
        );

    let store =
        transaction.objectStore(
            "fotosRestaurant"
        );

    let index =
        store.index(
            "restaurantId"
        );

    let request =
        index.getAll(
            restaurantId
        );

    request.onsuccess = function(){

        callback(
            request.result
        );

    };

}


function fotoRestaurantVerwijderen(id){

    let transaction =
        db.transaction(
            ["fotosRestaurant"],
            "readwrite"
        );

    let store =
        transaction.objectStore(
            "fotosRestaurant"
        );

    store.delete(id);

}
