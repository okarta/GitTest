<?php

    /*
        Name: GetUsersJoinCountryAndCity
        
        Autor: m007

        Data model:

            JoinSample_Country : {
                value : string
            }

            JoinSample_City : {
                value : string
            }

            JoinSample_Address : {
                country : JoinSample_Country,
                city : JoinSample_City
            }

            JoinSample_User : {
                name : string,
                address : JoinSample_Address
            }

        Type description:

            JoinSample_User - users objects, store address reference
            JoinSample_Address - addresses objects store country and city reference
            JoinSample_Country - country list
            JoinSample_City - city list
    */

    $db = $hivext->data->base; // Request data base service.

    $hivext->local->SetHeader("Content-Type", "text/plain");
    
    // Request objects, join address type.
    $users = $db->GetObjects(
        $appid, // current application
        $signature, // node signature
        "JoinSample_User", // type name
        null, // from, null - skip param
        null, // count, null - skip param
        "address, address.country, address.city" // join 
                                                 // address : JoinSample_Address
                                                 // address.country : JoinSample_Country
                                                 // address.city : JoinSample_City
    );

    if($users->result == 0) { // Success.
        for($i = 0; $i < count($users->objects); $i++) {
            echo "name = " . $users->objects[$i]->name
                ."\ncountry = " . $users->objects[$i]->address->country->value
                ."\ncity = " . $users->objects[$i]->address->city->value . "\n\n";
         }
    }

?>