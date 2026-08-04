let db;
let dbReady = false;
let dbCallbacks = [];


function openDatabase(){

    let request = indexedDB.open(
        "RestaurantLogDB",
        4
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


    request.onerror = function(){

        console.log(
            "Database fout"
        );

    };

}


function restaurantOpslaan(restaurant){

    let transaction =
        db.transaction(
            ["restaurants"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "restaurants"
        );


    let request = store.add(restaurant);

request.onsuccess = function(event){

    restaurant.id = event.target.result;

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
            ["restaurants"],
            "readwrite"
        );


    let store =
        transaction.objectStore(
            "restaurants"
        );


    store.delete(id);

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

    let transaction =
        db.transaction(
            [
                "restaurants",
            ],
            "readwrite"
        );


    let restaurantsStore =
        transaction.objectStore(
            "restaurants"
        );

    restaurantsStore.clear();


    backup.restaurants.forEach(function(r){

        restaurantsStore.put(r);

    });


    transaction.oncomplete = function(){

        console.log("Herstel voltooid");


        if(callback){

            callback();

        }

    };


    transaction.onerror = function(event){

        console.log(
            "Herstel fout:",
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
