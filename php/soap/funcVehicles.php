<?php
/**
 * funcVehicles.php
 *
  * @auteur     marc laville
 * @Copyleft 2015
 * @date       12/04/2015
 * @version    0.1.1
 * @revision   $1$
 *
 * @date revision 01/11/2015 renomme soapGetVehicle_V7 en soapGetVehicle
 * 
 * Fonctions d'acces aux données TRACTEUR par les Webservices
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

 function soapVehicleSelection( $arrIdent ) {
	/* Create selection object */
	$vehicleSelection = new stdClass();
	
	$vehicleSelection->IncludeDrivers = true;
	$vehicleSelection->IncludeActivity = true;
	$vehicleSelection->IncludeTechnicalInfo = true;
	$vehicleSelection->IncludePosition = true;
	$vehicleSelection->Identifiers = $arrIdent;
	
	return $vehicleSelection;
}

function soapGetVehiclesV7( $soapClient, $login, $uneDate ){
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection = soapVehicleSelection( Array() );
	
	/* Call the webservice */
	$get_Vehicles_V7 = $soapClient->Get_Vehicles_V7($sender);

	return array( 
		'executiontime'=>$get_Vehicles_V7->Get_Vehicles_V7Result->Executiontime,
		'result'=>$get_Vehicles_V7->Get_Vehicles_V7Result->Vehicles->InterfaceVehicleResult_V7
	);
}

function soapGetVehicles( $unWsdl, $login, $uneDate ){
	
	return soapGetVehiclesV7( new SoapClient($unWsdl), $login, $uneDate );
}

function soapGetVehicle( $soapClient, $login, $idTransics ){

	/* effectue la sélection */
	$IdentifierVehicle = new stdClass();
    $IdentifierVehicle->IdentifierVehicleType = "TRANSICS_ID";
    $IdentifierVehicle->Id = $idTransics;
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection = soapVehicleSelection( Array($IdentifierVehicle) );
	
	/* Call the webservice */
	$get_Vehicles_V7 = $soapClient->Get_Vehicles_V7($sender);
	
	$result_V7 = $get_Vehicles_V7->Get_Vehicles_V7Result;
	
	return array( 
		'executiontime'=>$result_V7->Executiontime,
		'result'=>$result_V7->Vehicles->InterfaceVehicleResult_V7
	);
}

/**
 * Trailors
 */
 
  function soapTrailorSelection( $arrIdent ) {
	/* Create selection object */
	$vehicleSelection = new stdClass();
	
	$vehicleSelection->IncludeDrivers = true;
	$vehicleSelection->IncludeActivity = true;
	$vehicleSelection->IncludeTechnicalInfo = true;
	$vehicleSelection->IncludePosition = true;
	$vehicleSelection->Identifiers = $arrIdent;
	
	return $vehicleSelection;
}

function soapGetTrailers_V4( $soapClient, $login, $uneDate ){
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection = soapTrailorSelection( Array() );
	
	/* Call the webservice */
	set_time_limit(60);
	$get_Trailers_V4 = $soapClient->Get_Trailers_V4($sender);
	
	return array( 
		'executiontime'=>$get_Trailers_V4->Get_Trailers_V4Result->Executiontime,
		'result'=>$get_Trailers_V4->Get_Trailers_V4Result->Trailers->InterfaceTrailerResult_V3
	);
}

function soapGetTrailers( $unWsdl, $login, $uneDate ){
	
	return soapGetTrailers_V4( new SoapClient($unWsdl), $login, $uneDate );
}

function soapGetTrailerV4( $soapClient, $login, $idTransics ){

	/* effectue la sélection */
	$IdentifierVehicle = new stdClass();
    $IdentifierVehicle->IdentifierVehicleType = "TRANSICS_ID";
    $IdentifierVehicle->Id = $idTransics;
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection = soapVehicleSelection( Array($IdentifierVehicle) );
	
	/* Call the webservice */
	$get_Trailers_V4 = $soapClient->Get_Trailers_V4($sender);
	
	return array( 
		'executiontime'=>$get_Trailers_V4->Get_Trailers_V4Result->Executiontime,
		'result'=>$get_Trailers_V4->Get_Trailers_V4Result->Trailers->InterfaceTrailerResult_V3
	);
}


?>