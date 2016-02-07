<?php
/**
 * uploadCsvAutoroute.php
 *
 * @auteur     marc laville
 * @Copyleft 2016
 * @date       23/01/2016
 * @version    0.1
 * @revision   $0$
 * 
 * @date revision xx/xx/xxxx zzzzzz
 *
 * Gere l'upload des rapports d'autoroute
 */
 
include 'ident.inc.php';

include 'soap/configSoap.inc.php';

include 'connect.inc.php';
include './database/crudAutoroute.php';


function traiteCsvAutoroute( $filePath ) {
	$csvstring = file( $filePath );
	$result = array( );
	
	// supprime 2 premières lignes (entete)
	array_shift( $csvstring ); // supprime la première ligne (entete)
	array_shift( $csvstring ); 
	foreach($csvstring as $value) {
		$tabChamp = explode ( ';', utf8_encode($value) );
		if(strlen(trim($tabChamp[0])) == 0){
			if( isset( $tabChamp[1]) ){ // On ne tient pas compte des lignes Total
				$result[] = array(
					'badge' => $tabChamp[1],
					'societe' => $tabChamp[10],
					'Immatriculation' => $tabChamp[3],
					'Parc' => $tabChamp[5],
					'Societe' => $tabChamp[11],
					'DateEntree' => implode('-', array_reverse ( explode ( '/', $tabChamp[14] ) ) ) . ' ' . $tabChamp[15],
					'entree' => $tabChamp[13],
					'DateSortie' => implode('-', array_reverse ( explode ( '/', $tabChamp[19] ) ) ) . ' ' . $tabChamp[20],
					'sortie' => $tabChamp[18],
					'Kilometres' => str_replace(",", ".", $tabChamp[24]),
					'TotalHT' => $tabChamp[37]
				);
			}
		}
	}
	return $result;
}


$response = identSoap( $login );

if( $response["success"] ){

	if(isset($_FILES['fileAutoroute'])) {
		$filePath = "../uploads/" . $_FILES['fileAutoroute']['name'];
		
		move_uploaded_file($_FILES['fileAutoroute']['tmp_name'], $filePath);
		$response['result'] = createRapAutoroute( $dbFlotte, traiteCsvAutoroute( $filePath ) );
	} else {
	}
}		
/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>