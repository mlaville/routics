<?php
/**
 * calcRecapTpsServ.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013-14
 * @date       04/11/2013
 * @version    0.1.0
 *
 * @date revision 27/01/2014 gestion du code Optigest
 *
 * Calcul les données d'affichage du recap temps de service
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'soap/funcDrivers.php';

include 'database/crudRecap.php';
include 'database/funcDrivers.php';


function recapTmsService( $wsdl, $login, $dbFlotte, $mois ) {
	$quotaDefaut = 190;
	
	$retour = array( 'error'=>null, 'result'=>null );

	$resultDrivers = soapGetDrivers( $wsdl, $login );
	$erreurs = $resultDrivers->Get_Drivers_V5Result->Errors;

	$retour['succes'] = !isset($erreurs->Error);

	if( $retour['succes'] ) {
		$result = $resultDrivers->Get_Drivers_V5Result->Persons->InterfacePersonResult_V5;
		usort( $result, "cmp" );

		$recap = chargeRecap( $dbFlotte, $mois );
		
		if($recap["success"]) {
			$recapDrivers = $recap['result'];

			$ret = loadQuotaDriver( $dbFlotte, $quotaDefaut );
			$quotaDrivers = $ret['result'];
			
			foreach( $result as &$driver ) {
				if(!$driver->Inactive) {
					$driverTransicsID = intval( $driver->PersonTransicsID );
					if( isset( $recapDrivers[ $driverTransicsID ] ) ){
						$driver->recapTpsService = $recapDrivers[ $driverTransicsID ];
						// Destruction d'un élément de tableau
						unset($recapDrivers[ $driverTransicsID ]);
					}
					if( isset( $quotaDrivers[ $driverTransicsID ] ) ) {
						$driver->tempsMaxi = intval( $quotaDrivers[$driverTransicsID]['maxTmpsServise'] );
						$driver->reserve = intval( $quotaDrivers[$driverTransicsID]['reserve'] );
						$driver->color = $quotaDrivers[$driverTransicsID]['color'];
						$driver->bgcolor = $quotaDrivers[$driverTransicsID]['bgcolor'];
						$driver->idOptigest = $quotaDrivers[$driverTransicsID]['idOptigest'];
					} else {
						$driver->tempsMaxi = $quotaDefaut;
						$driver->reserve = 0;
					}
				}
			}
			$retour['result'] = $result;
			$retour['quotaDrivers'] = $quotaDrivers;
		} else {
			$retour['error'] = $recap["error"];
		}
	} else {
		$retour['error'] = $erreurs->Error;
	}
	return $retour;
}
?>