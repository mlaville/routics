<?php
/**
 * soapBuildVersion.php
 *
  * @auteur     marc laville
 * @Copyleft 2015
 * @date       29/08/2015
 * @version    0.1
 * @revision   $0$
 *
 * Récupère la version des services Transics
 * Permet de tester la connexion
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

 /* Settings */
$wsdl = "http://transics.tx-connect.com/IWSLead/Service.asmx?WSDL";

/* Create Soap client */
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
	'cache_wsdl'=>WSDL_CACHE_BOTH 
); 

try {
	$clientSoap = new SoapClient($wsdl, $options);
} catch (Exception $e) {
	$retour = array( "succes" => false, "error" => array( "reason" => $e->getMessage() ) );
	die( htmlspecialchars_decode( json_encode( $retour ), ENT_QUOTES ) );
}
$result = $clientSoap->Get_BuildVersion( );

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( array( 'succes' => true, 'result' => explode ( "\n", $result->Get_BuildVersionResult ) ) ), ENT_QUOTES );
?>