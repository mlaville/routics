<?php
/**
 * getStatVehicles.php
 *
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       30/09/2015
 * @version    0.3
 * @revision   $1$
 * 
 * @date revision 26/12/2015 Ajout de consommations
 * @date revision 10/01/2016 Ajout de l'immatriculation
 *
 * Construit la reponse pour les stat véhicule ou les releves KM
 */
include 'ident.inc.php';

include 'soap/configSoap.inc.php';
include 'soap/soapGetDrivers.php';

include 'connect.inc.php';
include './database/funcStatVehicles.php';
include './soap/funcVehicles.php';

function calculStat( $mois, $dbFlotte, $listDrivers, $getVehicles ) {
	$tabVehicule = array();		
	$coutKmMensuel = loadCoutKmMensuel($dbFlotte, $mois);
	
	foreach ($coutKmMensuel['result'] as &$vehicule) {
		$vehicule['conso'] = array();
		$tabVehicule[$vehicule['VehicleTransicsId']] = $vehicule;
	}

	$conso = loadConsoMensuel($dbFlotte, $mois);
	foreach ($conso['result'] as $consoVehicule) {
		$consoVehicule['driverName'] = $listDrivers[$consoVehicule['DriverTransicsId']]->FormattedName;
		$tabVehicule[$consoVehicule['VehicleTransicsId']]['conso'][] = $consoVehicule;
	}

	foreach ($getVehicles['result'] as &$vehicule) {
		$idTransics = $vehicule->VehicleTransicsID;
		$immat = $vehicule->LicensePlate;
		if( array_key_exists($idTransics, $tabVehicule) ) {
			$tabVehicule[$idTransics]['immat'] = $immat;
			$tabVehicule[$idTransics]['VehicleExternalCode'] = $vehicule->VehicleExternalCode;
			$tabVehicule[$idTransics]['marque'] = $vehicule->TechnicalInfo->ChassisNumber;
			$tabVehicule[$idTransics]['Category'] = $vehicule->Category . ' - ' . $vehicule->AutoFilter;
		}
	}

	return $tabVehicule;
}

$response = identSoap( $login );
if( $response["success"] ){
	isset($_REQUEST['mois']) ? $_REQUEST['mois'] : '';
	
	if( isset($_REQUEST['mois']) ) {
		$mois = $_REQUEST['mois'];
		if( isset($_POST['typeVehicule']) ) {
			$response = loadKmMensuel($dbFlotte, $mois);
		} else {
			$getVehicles = soapGetVehicles( $wsdl, $login, date( DateTime::W3C, mktime(0, 0, 0, date("m")  , date("d")-30, date("Y")) ) );
			
			$response['vehicules'] = calculStat( 
						$_REQUEST['mois'],
						$dbFlotte,
						arrayDrivers( $wsdl, $login ),
						$getVehicles
					);
//			$response['getVehicles'] = $getVehicles;
		}
	} else {
		$response = statVehicle($dbFlotte, $_POST);
	}
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>