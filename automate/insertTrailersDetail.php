<?php
/*
*/
include '../php/connect.inc.php';
include '../php/soap/configSoap.inc.php';
//include 'fonctionSoap.inc.php';

function soapGetVehicleV7( $unWsdl, $login ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);
	
	/* Create selection object */
	$VehicleSelection = new stdClass();
	$VehicleSelection->IncludeTechnicalInfo = true;
	$VehicleSelection->IncludeUpdateDates = true;
	$VehicleSelection->ExcludeInactive = true;

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection=$VehicleSelection;
	
	/* Call the webservice */
	return $client->Get_Vehicles_V7($sender);
}

function soapGetTrailersV3( $unWsdl, $login ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);
	
	/* Create selection object */
	$VehicleSelection = new stdClass();
	$VehicleSelection->IncludeTechnicalInfo = true;
	$VehicleSelection->ExcludeInactive = true;

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection=$VehicleSelection;
	
	/* Call the webservice */
	return $client->Get_Trailers_V3($sender);
}

$stmtReplaceTrailer = $dbFlotte->prepare( "REPLACE INTO t_trailer ( TransicsID, ID, Code, Filter, ChassisNumber, LicensePlate, FormattedName, tr_dateImport )"
							. " VALUES ( ?, ?, ?, ?, ?, ?, ?, NOW( ) )" );

$stmtUpdateTrailer = $dbFlotte->prepare( "UPDATE t_trailer SET ChassisNumber = ?, LicensePlate = ?, FormattedName = ? WHERE TransicsID = ?" );

$stmtSelectTrailer = $dbFlotte->prepare( "SELECT COUNT(*) AS NbTrailer FROM t_trailer WHERE TransicsID = ?" );

$stVehicle = $dbFlotte->prepare( "REPLACE INTO t_vehicle ( VehicleTransicsID, VehicleID, VehicleExternalCode, LicensePlate, Category, AutoFilter, ChassisNumber, CurrentKms, vh_dateImport )"
							. " VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, NOW( ) )" );

// Obsolete							
$stKmCompteur = $dbFlotte->prepare( "INSERT INTO t_km_compteur ( km_VehicleTransicsId, km_date, km_km, km_dateCollecte )"
							. " VALUES ( ?, ?, ?, NOW( ) )" );

$resultTrailer = soapGetTrailersV3( $wsdl, $login );
$arrTrailer = $resultTrailer->Get_Trailers_V3Result->Trailers->TrailerResult_V2;
$trailers = array();
foreach( $arrTrailer as &$trailer ) {
	$trailers[$trailer->TrailerTransicsID] = $trailer;
}

$resultVehicule = soapGetVehicleV7( $wsdl, $login );
$arrResult = $resultVehicule->Get_Vehicles_V7Result->Vehicles->InterfaceVehicleResult_V7;

$errVehicle = array();
foreach( $arrResult as &$vehicle ) {
	$res = $stVehicle->execute( array( $vehicle->VehicleTransicsID,
					$vehicle->VehicleID,
					$vehicle->VehicleExternalCode,
					$vehicle->LicensePlate, 
					$vehicle->Category, 
					$vehicle->AutoFilter, 
					$vehicle->TechnicalInfo->ChassisNumber, 
					$vehicle->CurrentKms
				) );
				
	if( $res == false ){
		$err = $stVehicle->errorInfo();
		$errVehicle[$vehicle->VehicleID] = array( "reason"=>$err[2] );
	}
/*
	$res = $stKmCompteur->execute( array( $vehicle->VehicleTransicsID,
					str_replace ( 'T' , ' ' , $vehicle->UpdateDates->Position ), 
					$vehicle->CurrentKms
				) );
*/
	if( isset($vehicle->Trailer) ) {
		$trailer = $vehicle->Trailer;
		
		if(isset($trailers[$trailer->TransicsID])) {
			$trailers[$trailer->TransicsID]->Filter = $trailer->Filter;
		}

	}
}

/* Enregistrement des remorques
 * si la valeur de Filter n'est pas récupèrée, on écrase pas l'enregistrement existant
 */
foreach( $trailers as &$trailer ) {
	$Filter = isset($trailer->Filter) ? $trailer->Filter : '';
	$replaceTrailer = ( strlen ($Filter) > 0 ); // On remplace le Trailer existant
	if( !$replaceTrailer ) {
		if( $stmtSelectTrailer->execute( array( $trailer->TrailerTransicsID ) ) ) {
			$exist = $stmtSelectTrailer->fetch( PDO::FETCH_ASSOC );
			$replaceTrailer = ($exist["NbTrailer"] == 0);
		}
	}
	
	if( $replaceTrailer ) {
		$res = $stmtReplaceTrailer->execute( array( $trailer->TrailerTransicsID,
						$trailer->TrailerID,
						$trailer->TrailerExternalCode,
						$Filter, 
						$trailer->TechnicalInfo->ChassisNumber, 
						$trailer->LicensePlate, 
						$trailer->FormattedTrailerName
					) );
	} else {
		$res = $stmtUpdateTrailer->execute( array( 
						$trailer->TechnicalInfo->ChassisNumber, 
						$trailer->LicensePlate, 
						$trailer->FormattedTrailerName,
						$trailer->TrailerTransicsID,
					) );
	}
}
/* Prints out the response object */

$response["result"] = array( "vehicles"=>$arrResult ); 
$response["errVehicle"] = $errVehicle; 
//$response["trailers"] = $trailers; 

header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
