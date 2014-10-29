<?php
/*
*/
include 'ident.inc.php';
include './soap/configSoap.inc.php';
include 'fonctionSoap.inc.php';

include 'connect.inc.php';

function cmp($a, $b) {
	$cmp = intval( substr( $a->VehicleID, -3) ) - intval( substr( $b->VehicleID, -3) );
    return $cmp == 0 ? strcmp ( $b->Modified, $a->Modified ) : $cmp;
}

$response = identSoap( $login );
if( $response["success"] ){
//	$dateRef = date( DateTime::W3C, mktime(0, 0, 0, date("m")  , date("d")-30, date("Y")) ); // '2013-03-26T00:51:30+00:00'
	$resultTrailers = soapGetTrailers( $wsdl, $login );

	$arrTrailers = $resultTrailers->Get_TrailersResult->Vehicles->VehicleResult;
	usort($arrTrailers, "cmp");

	$stmt = $dbFlotte->prepare( "SELECT DATE_FORMAT( MIN( BeginDate ), '%d/%m/%Y' ) AS DateInit, SUM( KmEnd - KmBegin ) AS KmParcourus, Filter"
							. " FROM t_km_parcourt LEFT JOIN t_trailer ON t_trailer.ID = t_km_parcourt.Trailer"
							. " WHERE Trailer = ?" );

	for( $i = 0 , $arrRemorque = array() ; $i < count( $arrTrailers ) ; $i++ ){
		$trailer = $arrTrailers[$i];
		$vehicleID = preg_replace( '/\s/', '', $trailer->VehicleID );

		if( !isset($arrRemorque[$vehicleID]) ){
		
			if( preg_match( '/^[Ss][0-9]{3}$/', $vehicleID) > 0 and $trailer->Inactive == false ) {
				$remorque = array( "VehicleID"=>$vehicleID, "LicensePlate"=>$trailer->LicensePlate, "VehicleTransicsID"=>$trailer->VehicleTransicsID, "Modified"=>$trailer->Modified );
				
				/* Recupère les kilometres parcouru par chaque vehicule */
				if( $stmt->execute( array( $vehicleID ) ) ) {
					$resultKm = $stmt->fetch( );
					$remorque["CurrentKms"] = $resultKm['KmParcourus'];
					$remorque["DateInit"] = $resultKm['DateInit'];
					$remorque["Filter"] = $resultKm['Filter'];
				};
			
				$arrRemorque[$vehicleID] = $remorque;
			}
		}
	}

	$response["result"] = array_values($arrRemorque);
	$response["arrTrailers"] = array_values($arrTrailers);
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
