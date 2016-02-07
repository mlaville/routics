<?php
include 'ident.inc.php';

include 'connect.inc.php';

$response = identSoap( null );

if( $response['success'] ) {
	$reqSql = // "SELECT DATE_FORMAT( MIN( BeginDate ) , '%d/%m/%Y' ) AS DateInit, SUM( KmEnd - KmBegin ) AS KmParcourus FROM t_km_parcourt WHERE Trailer = ?";
		" SELECT EndDate, KmEnd AS km FROM t_km_parcourt WHERE VehicleTransicsId = ? AND EndDate < ? ORDER BY KmEnd desc LIMIT 1";
	// requete 
	if( isset( $_POST['dateOr'] ) ) {
//		$stmt = $dbFlotte->prepare( $reqSql . " AND EndDate < ?" );
		$stmt = $dbFlotte->prepare( $reqSql );
		$dateOr = implode( '', array_reverse( explode( '/', $_POST['dateOr'] ) ) );
		$response["success"] = $stmt->execute( array( $_POST['idVehicule'], $dateOr ) );
	} else {
		$stmt = $dbFlotte->prepare( $reqSql );
		$response["success"] = $stmt->execute( array( $_POST['idVehicule'] ) );
	}

	if( $response["success"] ) {
		/* Fetch all of the values of the first column */
		$result = $stmt->fetch( );
		$response["result"] = $result;
		$response["km"] = $result["km"];
	} else {
		$tabErreur = $dbConnect->errorInfo();
		$response["erreur"] = $tabErreur[2];
	}
}

header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode($response), ENT_QUOTES );
?>