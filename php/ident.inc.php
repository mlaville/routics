<?php
/**
 * ident.inc.php
 * 
 * @auteur     marc laville - polinux
 * @Copyleft 2013
 * @date       20/05/2013
 * @version    0.1
 * @revision   $0$
 * 
 * ml le 23/07/2013 : maxlifetime
 *  Affecte l'identification au login Soap
 *
 */
session_name("flotte");
ini_set('session.gc_maxlifetime', 36000);
session_start();

function identSoap( $unLogin ) {
	$retourIdent = array( "success" => isset( $_SESSION['ident'], $_SESSION['pwd'] ) );

	if( $retourIdent["success"] ) {
		if( $unLogin != null ) {
			$unLogin->Dispatcher = $_SESSION['ident'];
			$unLogin->Password = $_SESSION['pwd'];
		}
	} else {
		$retourIdent["error"] = array( "reason" => "Défaut d'Authentification", "_SESSION" => $_SESSION );
	}
	
	return $retourIdent;
}
?>