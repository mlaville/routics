<?php
/*
 * getKmCompteur.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013-14
 * @date       08/01/2014
 * @version    0.9
 * @revision   $0
 *
 * Remontée des km compteur
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'ident.inc.php';
include './soap/configSoap.inc.php';
include 'fonctionSoap.inc.php';

$response = identSoap( $login );

if( $response["success"] ) {
	date_default_timezone_set('Europe/Paris'); 
	$idTransics = isset( $_POST['idVehicule'] ) ? $_POST['idVehicule'] : '76';
	$dateOr =  isset( $_POST['dateOr'] ) ? $_POST['dateOr'] : '30/12/2013';

	$tabDateOr =  explode( '/', $dateOr );
	$resultKm = null;
	$jourRef = $tabDateOr[0];
	
	 set_time_limit(120);
	 while( $resultKm == null ) {
	
		$dateRef = date( DateTime::W3C, mktime( 12, 0, 0, $tabDateOr[1], $jourRef, $tabDateOr[2] ) ); 
		$resultInfo_On_Date = soapVehicleInfo_On_Date($wsdl, $login, $dateRef, $idTransics );
		
		$vehicleInfo = $resultInfo_On_Date->Get_VehicleInfo_On_DateResult->VehicleInfos;
		$response["vehicleInfo"] = $vehicleInfo;
		
		if( isset( $vehicleInfo->VehicleInfoOnDateItem) ) {;
			$vehicleInfoOnDateItem = $vehicleInfo->VehicleInfoOnDateItem;
		
			if( is_array($vehicleInfoOnDateItem) ) {
				$vehicleInfoOnDateItem = array_pop($vehicleInfoOnDateItem);
			}

			$resultKm = isset( $vehicleInfoOnDateItem->kmsEnd ) ? $vehicleInfoOnDateItem->kmsEnd : $vehicleInfoOnDateItem->KmsBegin;
			$response["dateRef"] = $dateRef;
		}
		
		$jourRef--;
		
//		$dateMaxi->add(new DateInterval('P1D'));

	}
	$response["km"] = $resultKm;
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
