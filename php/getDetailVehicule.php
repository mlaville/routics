<?php
/*
*/
include 'ident.inc.php';
include './soap/configSoap.inc.php';
include 'fonctionSoap.inc.php';

include 'connect.inc.php';

$response = identSoap( $login );

if( $response["success"] ) {

	$typeVehicule = isset( $_POST['typeVehicule'] ) ? intval( $_POST['typeVehicule'] ) : 0;
	$idTransics = isset( $_POST['idVehicule'] ) ? $_POST['idVehicule'] : '187';
	
	if( $typeVehicule == 0 ) {
		$resultVehicle = soapGetVehicleV7( new SoapClient($wsdl), $login, $idTransics );

		
		$vehicleInfo = $resultVehicle->Get_Vehicles_V7Result->Vehicles->InterfaceVehicleResult_V7;
		if( is_array($vehicleInfo) ) {
			$vehicleInfo = array_pop($vehicleInfo);
		}

		$response["CurrentKms"] = $vehicleInfo->CurrentKms;
		$response["marque"] = $vehicleInfo->TechnicalInfo->ChassisNumber;
		$response["transport"] = $vehicleInfo->AutoFilter;
		$response["Category"] = $vehicleInfo->Category;
		$remorque["DateInit"] = null;
		/* $response["vehicleInfo"] = $vehicleInfo; */
	} else {
		/* Acces à la BdD */
//		$reqTrailerInfo = "SELECT Filter, ChassisNumber FROM t_trailer WHERE TransicsID = ?"
		$stmt = $dbFlotte->prepare( "SELECT Filter, ChassisNumber,"
							. " DATE_FORMAT( MIN( BeginDate ), '%d/%m/%Y' ) AS DateInit, SUM( KmEnd - KmBegin ) AS KmParcourus"
							. " FROM t_trailer LEFT JOIN t_km_parcourt ON t_trailer.ID = t_km_parcourt.Trailer"
							. " WHERE t_trailer.TransicsID = ?" );
		if( $stmt->execute( array( $idTransics ) ) ) {
			$resultVehicleInfo = $stmt->fetch( );
			$response["CurrentKms"] = $resultVehicleInfo['KmParcourus'];
			$response["DateInit"] =  $resultVehicleInfo['DateInit'];
			$response["marque"] = $resultVehicleInfo['ChassisNumber'];
			$remorque["DateInit"] = $resultVehicleInfo['DateInit'];
			$response["transport"] =  $resultVehicleInfo['Filter'];
			$response["Category"] = null;
		} else {
			// gerer l'erreur
		}
	}
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
