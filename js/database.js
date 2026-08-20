let db;
let dbReady = false;
let dbCallbacks = [];


function openDatabase(){

    let request = indexedDB.open(
        "RestaurantLogDB",
        8
    );


    request.onupgradeneeded = function(event){

        db = event.target.result;


        // =========================================
        // RESTAURANTS
        // =========================================

        if(!db.objectStoreNames.contains("restaurants")){

            let store =
                db.createObjectStore(
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


        // =========================================
        // BEZOEKEN
        // =========================================

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


        // =========================================
        // IDEEËN
        // =========================================

        if(!db.objectStoreNames.contains("ideeen")){

            db.createObjectStore(
                "ideeen",
                {
                    keyPath:"id",
                    autoIncrement:true
                }
            );

        }


        // =========================================
        // FOTO'S RESTAURANT
        // =========================================

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


        // =========================================
        // FOTO'S BEZOEK
        // =========================================

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

    };


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


    request.onerror = function(event){

        console.error(
            "Database fout:",
            event.target.error
        );

    };

}


// =========================================
// DATABASE KLAAR
// =========================================

function wanneerDatabaseKlaar(callback){

    if(dbReady){

        callback();

    }
    else{

        dbCallbacks.push(callback);

    }

}


// =========================================
// RESTAURANTS
// =========================================

function restaurantOpslaan(restaurant, callback){

    let transaction =
        db.transaction(
            ["restaurants"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "restaurants"
        );


    let request =
        store.add(restaurant);


    request.onsuccess = function(event){

        restaurant.id =
            event.target.result;


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


    request.onsuccess = function(){

        callback(
            request.result
        );

    };

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


    store.put(
        restaurant
    );

}


// =========================================
// RESTAURANT VERWIJDEREN
// =========================================

function restaurantVerwijderen(id){

    let transaction =
        db.transaction(
            [
                "restaurants",
                "bezoeken",
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


    let fotosRestaurantStore =
        transaction.objectStore(
            "fotosRestaurant"
        );


    let fotosBezoekStore =
        transaction.objectStore(
            "fotosBezoek"
        );


    // Restaurant verwijderen

    restaurantsStore.delete(id);


    // Restaurantfoto's verwijderen

    let restaurantFotoIndex =
        fotosRestaurantStore.index(
            "restaurantId"
        );


    let fotoRequest =
        restaurantFotoIndex.openCursor(
            IDBKeyRange.only(id)
        );


    fotoRequest.onsuccess =
        function(event){

            let cursor =
                event.target.result;


            if(cursor){

                cursor.delete();

                cursor.continue();

            }

        };


    // Bezoeken zoeken

    let bezoekIndex =
        bezoekenStore.index(
            "restaurantId"
        );


    let bezoekRequest =
        bezoekIndex.openCursor(
            IDBKeyRange.only(id)
        );


    bezoekRequest.onsuccess =
        function(event){

            let cursor =
                event.target.result;


            if(cursor){

                let bezoek =
                    cursor.value;


                let bezoekId =
                    bezoek.id;


                // Foto's van dit bezoek verwijderen

                let fotoIndex =
                    fotosBezoekStore.index(
                        "bezoekId"
                    );


                let fotoRequest =
                    fotoIndex.openCursor(
                        IDBKeyRange.only(
                            bezoekId
                        )
                    );


                fotoRequest.onsuccess =
                    function(event){

                        let fotoCursor =
                            event.target.result;


                        if(fotoCursor){

                            fotoCursor.delete();

                            fotoCursor.continue();

                        }

                    };


                // Bezoek verwijderen

                cursor.delete();

                cursor.continue();

            }

        };

}


// =========================================
// BEZOEKEN
// =========================================

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


    request.onsuccess = function(event){

        bezoek.id =
            event.target.result;


        if(callback){
            callback(bezoek);
        }

    };

}


function bezoekenOphalen(
    restaurantId,
    callback
){

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


// =========================================
// ALLES WISSEN
// =========================================

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
                "bezoeken",
                "ideeen",
                "fotosRestaurant",
                "fotosBezoek"
            ],
            "readwrite"
        );


    transaction.objectStore(
        "restaurants"
    ).clear();


    transaction.objectStore(
        "bezoeken"
    ).clear();


    transaction.objectStore(
        "ideeen"
    ).clear();


    transaction.objectStore(
        "fotosRestaurant"
    ).clear();


    transaction.objectStore(
        "fotosBezoek"
    ).clear();


    transaction.oncomplete =
        function(){

            alert(
                "Alle gegevens zijn gewist"
            );


            location.reload();

        };

}


// =========================================
// IDEEËN
// =========================================

function ideeOpslaan(
    idee,
    callback
){

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


    request.onsuccess =
        function(){

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


    request.onsuccess =
        function(){

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


// =========================================
// FOTO'S RESTAURANT
// =========================================

function fotoRestaurantOpslaan(
    foto,
    callback
){

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


    request.onsuccess =
        function(){

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


    request.onsuccess =
        function(){

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

function fotoBezoekOpslaan(foto, callback){

    let transaction =
        db.transaction(
            ["fotosBezoek"],
            "readwrite"
        );

    let store =
        transaction.objectStore(
            "fotosBezoek"
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


function fotosBezoekOphalen(
    bezoekId,
    callback
){

    let transaction =
        db.transaction(
            ["fotosBezoek"],
            "readonly"
        );

    let store =
        transaction.objectStore(
            "fotosBezoek"
        );

    let index =
        store.index(
            "bezoekId"
        );

    let request =
        index.getAll(
            bezoekId
        );

    request.onsuccess = function(){

        callback(
            request.result
        );

    };

}
