<?php
/**
 * login.php
 * 
 * @auteur     marc laville - polinux
 * @Copyleft 2013-14
 * @date       21/10/2013
 * @version    0.1
 * @revision   $0$
 * 
 *  Contrôle et Affecte l'identification au login Soap
 *
 */
session_name("flotte");
session_start();

include './soap/configSoap.inc.php';
include 'fonctionSoap.inc.php';

$retour = array( 
				'succes' => isset( $_POST["login"], $_POST["pwd"] ), 
				'error' => null, 
				'result' => null 
				);

if( $retour['succes'] ){

	$resultDispatchers = soapGetDispatchers( $wsdl, $login, $_POST["login"] );
	$erreurs = $resultDispatchers->Get_DispatchersResult->Errors;

	$retour['succes'] = !isset($erreurs->Error);
	if( $retour['succes'] ) {
	
		$dispResult = $resultDispatchers->Get_DispatchersResult->Dispatchers->DispatcherResult;
		$retour['succes'] = ( strtoupper( $dispResult->Password ) == strtoupper( $_POST["pwd"] ) );
		if( $retour['succes'] ) {
			$retour['result'] = array( 'firstname' => $dispResult->Firstname,
									   'lastname' => $dispResult->Lastname,
									   'email' => $dispResult->Email,
									   'PersonExternalCode' => $dispResult->PersonExternalCode,
									   'sexFeminin' => ($dispResult->SexType == 'FEMALE'),
									   'langage' => $dispResult->Language 
									 );
			$_SESSION['ident'] = $dispResult->PersonID;
			$_SESSION['pwd'] = $dispResult->Password;
			$_SESSION['firstname'] = $dispResult->Firstname;
			$_SESSION['lastname'] = $dispResult->Lastname;
			$_SESSION['email'] = $dispResult->Email;
			$_SESSION['PersonExternalCode'] = $dispResult->PersonExternalCode;
			$_SESSION['sexFeminin'] = ($dispResult->SexType == 'FEMALE');
			$_SESSION['langage'] = $dispResult->Language;
		} else {
			$retour['error'] = array( 'reason' => "Erreur d'Authentification" );
		}
	} else {
		$retour['error'] = $erreurs->Error;
	}
} else {
	$retour['error'] = array( 'reason' => "Login Invalide" );
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $retour ), ENT_QUOTES );
?>