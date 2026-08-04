function backupMaken(){

    alleRestaurantsOphalen(function(restaurants){

        alleFotosOphalen(function(fotos){


let backup = {

    datum:
        new Date().toISOString(),

    restaurants:
        restaurants

};


            let bestand =
                new Blob(
                    [
                        JSON.stringify(
                            backup
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
                "RestaurantLog_backup.json";


            link.click();


        });

    });

}

function backupHerstellen(event){

    let bestand =
        event.target.files[0];


    if(!bestand){
        return;
    }


    let reader =
        new FileReader();


    reader.onload = function(e){


        let backup =
            JSON.parse(
                e.target.result
            );

            console.log("Backup inhoud:", backup);

        let bevestiging =
            confirm(
                "Bestaande gegevens vervangen?"
            );


        if(!bevestiging){
            return;
        }


        gegevensHerstellen(
    backup,
    
    function(){

        restaurantsOphalen(function(data){

            restaurants = data;

            toonRestaurants();

        });


        alert(
            "Back-up hersteld ✅"
        );

    }
);

    };


    reader.readAsText(
        bestand
    );

}

let backupInput =
    document.getElementById("backupInput");


if(backupInput){

    backupInput.addEventListener(
        "change",
        backupHerstellen
    );

}