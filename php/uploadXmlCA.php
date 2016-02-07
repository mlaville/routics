<?php
/**
 * uploadXmlCA.php
 */
 
include 'ident.inc.php';

include 'soap/configSoap.inc.php';


include 'connect.inc.php';
include './database/crudCAfunc.php';

$response = identSoap( $login );

if( $response["success"] ){

	if(isset($_FILES['fileCA'])) {
		$result = array( );
		
		$filePath = "../uploads/" . $_FILES['fileCA']['name'];
		// Example:
		move_uploaded_file($_FILES['fileCA']['tmp_name'], $filePath);
		
		$xmlstring = file_get_contents( $filePath );
		$xml = simplexml_load_string( $xmlstring );
		foreach($xml as $key => $value) {
			$result[] = $value;
		}
		$rep = createCAMois( $dbFlotte, $_REQUEST['mois'], $result );
		
		$response['result'] = $result;
		$response['_REQUEST'] = $_REQUEST;
		$response['rep'] = $rep;
	} else {
		
	}
}		
	/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>