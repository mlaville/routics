<?php
/**
 * traiteCsvAutoroute.php
 */
 
 
function traiteCsvAutoroute( $filePath ) {
	$csvstring = file( $filePath );
	$result = array( );

	foreach($csvstring as $value) {
		$tabChamp = explode ( ';', utf8_encode($value) );
		if( isset( $tabChamp[1]) ){
			$result[] = array(
						'badge' => $tabChamp[1],
						'Immatriculation' => $tabChamp[3],
						'Parc' => $tabChamp[5],
						'Societe' => $tabChamp[11],
						'DateEntree' => $tabChamp[14] . ' ' . $tabChamp[15],
						'DateSortie' => $tabChamp[19] . ' ' . $tabChamp[20],
						'Kilometres' => $tabChamp[24],
						'TotalHT' => $tabChamp[37]
						);
		}

	}
	return $result;
}


$response = array( "success" => true );

if( $response["success"] ){

	$response['result'] = traiteCsvAutoroute( "../uploads/" . 'AUTOROUTE.csv' );

/*	
	echo json_encode( $result );
//	print_r($result );

    switch (json_last_error()) {
        case JSON_ERROR_NONE:
            echo ' - Aucune erreur';
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Profondeur maximale atteinte';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Inadéquation des modes ou underflow';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Erreur lors du contrôle des caractères';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Erreur de syntaxe ; JSON malformé';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Caractères UTF-8 malformés, probablement une erreur d\'encodage';
        break;
        default:
            echo ' - Erreur inconnue';
        break;
    }

    echo PHP_EOL;
*/

} else {
	
}
	file_put_contents("../uploads/test.json", json_encode( $response ));

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>