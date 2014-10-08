<?php
/**
 * connect.inc.php
 * 
 * @auteur     marc laville - polinux
 * @Copyleft 2013
 * @date       27/03/2013
 * @version    0.1
 * @revision   $0$
 * 
 *  Connexion  à la base de données
 *
 */
include 'config.inc.php';

try {
    $dbFlotte = new PDO('mysql:host=' . $loginServeur . ';dbname=' . $nomBase, $loginUsername, $loginPassword);
} catch (PDOException $e) {
	$raisonErreur = str_replace( "'", " ", $e->getMessage() );
	echo "{ success: false, errors: { reason: '" . $raisonErreur . "' } }";
    die();
}

$dbFlotte->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
$dbFlotte->exec("SET NAMES 'utf8'");

?>