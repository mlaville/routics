<?php
/**
 * getDetailVehicule.php
 *
  * @auteur     marc laville
 * @Copyleft 2015
 * @date       01/08/2015
 * @version    0.1.1
 * @revision   $0$
 *
 * @date revision 01/11/2015 remonte le trailor
 *
 * -A faire :
 * remonter le conducteur
 *
 * Fonctions d'acces aux donn�es TRACTEUR par les Webservice
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'ident.inc.php';
include './soap/configSoap.inc.php';
include './soap/funcVehicles.php';

include 'connect.inc.php';

$response = identSoap( $login );

if( $response["success"] ) {

	$typeVehicule = isset( $_POST['typeVehicule'] ) ? intval( $_POST['typeVehicule'] ) : 0;
	$idTransics = isset( $_POST['idVehicule'] ) ? $_POST['idVehicule'] : '187';
	
	if( $typeVehicule == 0 ) {
		$resultVehicle = soapGetVehicle( new SoapClient($wsdl), $login, $idTransics );

		$vehicleInfo = $resultVehicle["result"];
		if( is_array($vehicleInfo) ) {
			$vehicleInfo = array_pop($vehicleInfo);
		}

		$response["dateModif"] = $vehicleInfo->Modified;
		$response["CurrentKms"] = $vehicleInfo->CurrentKms;
		$response["marque"] = $vehicleInfo->TechnicalInfo->ChassisNumber;
		$response["transport"] = $vehicleInfo->AutoFilter;
		$response["Category"] = $vehicleInfo->Category;
		$response["position"] = $vehicleInfo->Position;
		$response["Trailer"] = isset($vehicleInfo->Trailer) ? $vehicleInfo->Trailer : null;
//		$response["Driver"] = $vehicleInfo->Driver;
		$response["DateInit"] = null;
	} else {
		$resultVehicle = soapGetTrailerV4( new SoapClient($wsdl), $login, $idTransics );

		$vehicleInfo = $resultVehicle["result"];
		if( is_array($vehicleInfo) ) {
			$vehicleInfo = array_pop($vehicleInfo);
		}

		/* Acces � la BdD */
		$stmt = $dbFlotte->prepare( "SELECT Filter, ChassisNumber,"
							. " DATE_FORMAT( MIN( BeginDate ), '%d/%m/%Y' ) AS DateInit, SUM( KmEnd - KmBegin ) AS KmParcourus"
							. " FROM t_trailer LEFT JOIN t_km_parcourt ON t_trailer.ID = t_km_parcourt.Trailer"
							. " WHERE t_trailer.TransicsID = ?" );
		if( $stmt->execute( array( $idTransics ) ) ) {
			$resultVehicleInfo = $stmt->fetch( );
			$response["CurrentKms"] = $resultVehicleInfo['KmParcourus'];
			$response["DateInit"] =  $resultVehicleInfo['DateInit'];
			$response["marque"] = $vehicleInfo->TechnicalInfo->ChassisNumber;
			$response["dateModif"] = $vehicleInfo->Modified;

			$response["transport"] =  $resultVehicleInfo['Filter'];
			$response["Category"] = null;
			$response["vehicleInfo"] = $vehicleInfo;
			$response["position"] = $vehicleInfo->Position;
		} else {
			// gerer l'erreur
		}
	}
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
