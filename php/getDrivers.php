<?php
/**
 * getDrivers.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       26/10/2015
 * @version    0.7
 * @revision   $0$
 *
 * @date revision 
 *
 * Charge les données d'affichage du planning Conducteur
 * ou pour une simple liste de Conducteurs
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
error_reporting(E_ERROR);

include 'soap/configSoap.inc.php';
include 'soap/soapGetDrivers.php';

include 'connect.inc.php';
include 'database/funcDrivers.php';
include 'database/crudRecap.php';

function tServiceTachyDriver($client, $sender, $dateDeb, $dateFin) {
	
	$retour = array( 'error'=>null, 'debug'=>array() );
//	$sender = soapSenderGetServiceTimesTachoDetail($login, $idDriver, $dateDeb, $dateFin);
	$DateTimeRangeSelection = $sender->ServiceTimesSelection->DateTimeRangeSelection;

	$DateTimeRangeSelection->StartDate = $dateDeb;
	$DateTimeRangeSelection->EndDate = $dateFin;

	$resultTT = null;
	set_time_limit ( 360 );
	try {
		$resultTT = $client->Get_ServiceTimesTachoDetail_V5($sender);
	} catch (Exception $e) {
		$retour['error'] = array('reason'=>$e->getMessage());
	}
	
	if( !is_null($resultTT) ) {

		$erreurs = $resultTT->Get_ServiceTimesTachoDetail_V5Result->Errors;

		$retour['succes'] = !isset($erreurs->Error);
		if( $retour['succes'] ) {
			$ServiceTimes = $resultTT->Get_ServiceTimesTachoDetail_V5Result->ServiceTimes;
			$result =( isset( $ServiceTimes->ServiceTimeTachoDetail_V5 ) ) ? $ServiceTimes->ServiceTimeTachoDetail_V5 : array();
			$ttMois = array();
			$today = date("Y-m-d"); 
			
			foreach( $result as &$detailTT ) {
				if( isset($detailTT->BeginDate) ) {

					$BeginDate = date_create( $detailTT->BeginDate );
					$EndDate = date_create( $detailTT->EndDate );

					// Controle que la date de fin est sur le même jour et que la plage horaire est sur le même jour
					if( date_format( $EndDate, "Y-m-d" ) == date_format( $BeginDate, "Y-m-d" ) && date_format( $EndDate, "Y-m-d" ) != $today ) {

						$duree = $EndDate->format('U') - $BeginDate->format('U'); // Retourne la durée en seconde de la plage horaire
						$intJour = intval( date_format( $BeginDate, "d") ); // N° de jour 1 -> 31 qui servira d'index dans la valeur retournée (ttMois)
						
						if( !isset( $ttMois[$intJour] ) ) {
							$ttMois[$intJour] = array();
						}
						$dureeCourante = isset( $ttMois[$intJour][$detailTT->WorkingCode->Code] ) ? $ttMois[$intJour][$detailTT->WorkingCode->Code] : 0;
						$ttMois[$intJour][$detailTT->WorkingCode->Code] = $dureeCourante + max($duree, 0);
					}
				} else {
					$retour['debug'][] = array( $idDriver=>$detailTT );
				}
			}
			$retour['ttMois'] = $ttMois;
		} else {
			$retour['error'] = $erreurs->Error;
		}
	}
	return $retour;
}

/*
 * flag pour remonté de temps tachy
 */
$flagTmpsService = ( isset($_POST['flagTmpsService']) ) ? ( $_POST['flagTmpsService'] == 1 ) : true ;
$mois = ( isset($_POST['mois']) ) ? $_POST['mois'] : '2015-09' /* date('Y-m')*/ ;

$arrMois = explode( '-', $mois);
$dtMois = mktime( 0, 0, 0, $arrMois[1], 1, $arrMois[0] ); 
$dateDeb = date(DateTime::W3C, $dtMois);
$dtMois = mktime( 23, 59, 59, $arrMois[1], intval( date("t", $dtMois) ), $arrMois[0] ); 
$dateFin = date(DateTime::W3C, $dtMois);

$retour = array( 'error'=>null, 'result'=>null );

set_time_limit ( 60 );
$resultDrivers = listDrivers( $wsdl, $login );
//$resultDrivers = array( 'dateDeb' => $dateDeb, 'dateFin' => $dateFin);

// print_r( json_encode($resultDrivers) );

if( $resultDrivers['succes'] ) {

	$result = $resultDrivers['result'];
	
	$ret = loadQuotaDriver( $dbFlotte, 190 );
	$quotaDrivers = $ret['result'];
	
	$retour['dates'] = array( $arrMois[0] . '-' . $arrMois[1] . '-01', $arrMois[0] . '-' . $arrMois[1] . '-31'); // debug
	
	$ret = loadATDriver( $dbFlotte, $arrMois[0], $arrMois[1] );
	$atDriver = $ret['result'];

	$ret = chargeReserve( $dbFlotte );
	$reserveDriver = $ret["success"] ? $ret['result'] : $ret["error"];


	/* Create Soap client */
	$clientSoap = new SoapClient($wsdl);
	
	$sender = new stdClass();
	$sender->Login = $login;

	$Drivers = new stdClass();
	$Drivers->IdentifierType = 'TRANSICS_ID';
//	$Drivers->Id = $unIdTransics;

	$DateTimeRangeSelection = new stdClass();
	$DateTimeRangeSelection->DateTypeSelection = 'STARTED';
	
	$ServiceTimesSelection = new stdClass();
	$ServiceTimesSelection->DateTimeRangeSelection = $DateTimeRangeSelection;
	
	$sender->ServiceTimesSelection = $ServiceTimesSelection;
	
	foreach( $result as &$driver ) {
		if(!$driver->Inactive) {
			$driverTransicsID = intval( $driver->PersonTransicsID );
			$ServiceTimesSelection->Drivers = array( $Drivers );

			$Drivers->Id = $driverTransicsID;

			if($flagTmpsService) {
				$driver->tt = tServiceTachyDriver( $clientSoap, $sender, $dateDeb, $dateFin );
			}
			
//			$driver->resultTT = $resultTT;
			
			if( isset( $quotaDrivers[ $driver->PersonTransicsID ] ) ) {
				$driver->tempsMaxi = intval( $quotaDrivers[$driver->PersonTransicsID]['maxTmpsServise'] );
//				$driver->reserve_old = intval( $quotaDrivers[$driver->PersonTransicsID]['reserve'] );
			} else {
				$driver->tempsMaxi = 190;
//				$driver->reserve = 0;
			}
			$driver->arretsTravail = isset( $atDriver[ $driverTransicsID ] ) ? $atDriver[ $driverTransicsID ] : array();
			$driver->reserve = isset( $reserveDriver[ $driverTransicsID ] ) ? $reserveDriver[ $driverTransicsID ] : 0;
		}
	}

	
	$retour['result'] = $result;
	$retour['succes'] = true;	
//	$retour['atDriver'] = $atDriver;	
//	$quotaDrivers['quotaDrivers'] = true;	
} else {
	$retour['error'] = $erreurs->Error;
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $retour ), ENT_QUOTES );

?>