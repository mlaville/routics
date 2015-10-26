<?php
/**
 * getDrivers.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013-14
 * @date       26/06/2013
 * @version    0.6
 * @revision   $6$
 *
 * @date revision   01/10/2013 Gestion du flag flagTmpsService
 * @date revision   23/10/2013 Instancie 1 seul client SOAP pour accès aux données tachy
 * @date revision   31/10/2013 'try catch' autour le l'appel au webservice
 * @date revision   03/02/2014 Les fonctions d'accès à la base de données sont regroupées dans database/funcDrivers.php
 * @date revision   18/02/2014 Contrôle l'intervales de date dans les plages horaires renvoyées par Transcics (tServiceTachyDriver)
  * @date revision 07/06/2014 Calcul la colonne réseve à partir de la table des heures dues (t_heure_du_hdu)
*
 * Charge les données d'affichage du planning Conducteur
 * ou pour une simple liste de Conducteurs
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
error_reporting(E_ERROR);

include 'soap/configSoap.inc.php';
include 'soap/funcDrivers.php';

include 'connect.inc.php';
include 'database/funcDrivers.php';
include 'database/crudRecap.php';

function soapSenderGetServiceTimesTachoDetail( $login, $idTransics, $dateDeb, $dateFin ){

	$Identifier = new stdClass();
	$Identifier->IdentifierType = "TRANSICS_ID";
	$Identifier->Id = $idTransics;
	
	$DateTimeRangeSelection = new stdClass();
	$DateTimeRangeSelection->StartDate = $dateDeb;
	$DateTimeRangeSelection->EndDate = $dateFin;

	/* Create selection object */
	$ServiceTimesSelection = new stdClass( );
	$ServiceTimesSelection->Drivers = array( $Identifier );
	$ServiceTimesSelection->DateTimeRangeSelection = $DateTimeRangeSelection;

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ServiceTimesSelection = $ServiceTimesSelection;
	
	return $sender;
}

function tServiceTachyDriver($client, $login, $idDriver, $dateDeb, $dateFin) {
	$retour = array( 'error'=>null, 'debug'=>array() );
	$sender = soapSenderGetServiceTimesTachoDetail($login, $idDriver, $dateDeb, $dateFin);
	
	$resultTT = null;
	set_time_limit ( 360 );
	try {
		$resultTT = $client->Get_ServiceTimesTachoDetail($sender);
	} catch (Exception $e) {
		$retour['error'] = array('reason'=>$e->getMessage());
	}
	
	if( !is_null($resultTT) ) {

		$erreurs = $resultTT->Get_ServiceTimesTachoDetailResult->Errors;

		$retour['succes'] = !isset($erreurs->Error);
		if( $retour['succes'] ) {
			$ServiceTimes = $resultTT->Get_ServiceTimesTachoDetailResult->ServiceTimes;
			$result =( isset( $ServiceTimes->ServiceTimeTachoDetail ) ) ? $ServiceTimes->ServiceTimeTachoDetail : array();
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
$mois = ( isset($_POST['mois']) ) ? $_POST['mois'] : '2014-05' /* date('Y-m')*/ ;

$arrMois = explode( '-', $mois);
$dtMois = mktime( 0, 0, 0, $arrMois[1], 1, $arrMois[0] ); 
$dateDeb = date(DateTime::W3C, $dtMois);
$dtMois = mktime( 23, 59, 59, $arrMois[1], intval( date("t", $dtMois) ), $arrMois[0] ); 
$dateFin = date(DateTime::W3C, $dtMois);

$retour = array( 'error'=>null, 'result'=>null );

set_time_limit ( 60 );
$resultDrivers = listDrivers( $wsdl, $login );
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

	foreach( $result as &$driver ) {
		if(!$driver->Inactive) {
			$driverTransicsID = intval( $driver->PersonTransicsID );
			
			if($flagTmpsService == true) {
				set_time_limit ( 60 );
				$driver->tt = tServiceTachyDriver( $clientSoap, $login, $driver->PersonTransicsID, $dateDeb, $dateFin );
			}
			if( isset( $quotaDrivers[ $driver->PersonTransicsID ] ) ) {
				$driver->tempsMaxi = intval( $quotaDrivers[$driver->PersonTransicsID]['maxTmpsServise'] );
				$driver->reserve_old = intval( $quotaDrivers[$driver->PersonTransicsID]['reserve'] );
			} else {
				$driver->tempsMaxi = 190;
				$driver->reserve = 0;
			}
			$driver->arretsTravail = isset( $atDriver[ $driverTransicsID ] ) ? $atDriver[ $driverTransicsID ] : array();
			$driver->reserve = isset( $reserveDriver[ $driverTransicsID ] ) ? $reserveDriver[ $driverTransicsID ] : 0;
		}
	}
	
	$retour['result'] = $result;
	$retour['reserveDriver'] = $reserveDriver;
	
} else {
	$retour['error'] = $erreurs->Error;
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $retour ), ENT_QUOTES );
?>