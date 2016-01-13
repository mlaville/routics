<?php
/**
 * soapGetDrivers.php
 * 
 */
function soapGetDrivers( $unWsdl, $login, $unIdTransics = null ){
	set_time_limit ( 300 );
	
	/* Create Soap client */
//	$clientSoap = null;
	$context = stream_context_create( array(
         'http' => array(
           'protocol_version'=> '1.0' ,
           'header'=> 'Content-Type: text/xml;' ,
         ),
    ));

	$options = array( 
		'stream_context' => $context,
		'soap_version'=>SOAP_1_2, 
		'exceptions'=>true, 
		'trace'=>1, 
		'cache_wsdl'=> WSDL_CACHE_NONE 
	); 
	try {
		$clientSoap = new SoapClient($unWsdl, $options);
	} catch (Exception $e) {
		echo 'Exception reçue : ',  $e->getMessage(), "\n";
	}
	
	if( !isset($clientSoap) ){
		echo 'Exception clientSoap\n';
	}
	$DriverSelection = new stdClass();
	$DriverSelection->ExcludeInactiveDrivers = true;
	
	/* Create selection object */
	if( !is_null($unIdTransics) ) {
		$Drivers = new stdClass();
		$Drivers->IdentifierType = 'TRANSICS_ID';
		$Drivers->Id = $unIdTransics;

		$DriverSelection->Persons = array($Drivers);
	}
	
	$DriverSelection->IncludeContactInfo = true;
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->DriverSelection = $DriverSelection;

	/* Call the webservice */
	return $clientSoap->Get_Drivers_V6($sender);
}


/*
 * Fonctions de tri ( sur PersonExternalCode)
 */
function cmp($a, $b) {
    return strcmp( $a->PersonExternalCode, $b->PersonExternalCode );
}
/*
 * Liste Triée
 */
function listDrivers( $unWsdl, $login ){

	$retour = array( 'error'=>null, 'result'=>null );
	$resultDrivers = soapGetDrivers( $unWsdl, $login );
	$erreurs = $resultDrivers->Get_Drivers_V6Result->Errors;

	$retour['succes'] = !isset($erreurs->Error);

	if( $retour['succes'] ) {
		$result = $resultDrivers->Get_Drivers_V6Result->Persons->InterfacePersonResult_V6;
		usort( $result, "cmp" );
		$retour['result'] = $result;
	} else {
		$retour['error'] = $erreurs;
	}

	$retour['resultDrivers'] = $resultDrivers;
	$retour['unWsdl'] = $unWsdl;
	$retour['login'] = $login;
	
	return $retour;
}

function arrayDrivers( $unWsdl, $login ){
	$listDrivers = listDrivers( $unWsdl, $login );
	$retour = array();
	
	foreach( $listDrivers["result"] as &$driver ) {
		if(isset($driver->PersonTransicsID)) {
			$retour[$driver->PersonTransicsID] = $driver;
		}
	}
	
	return $retour;
}

