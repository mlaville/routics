<?php
/**
 * config.inc.php
 * 
 * @auteur     marc laville - polinux
 * @Copyleft   2014-2016 - polinux
 * @date       14/06/2014
 * @version    0.2
 * @revision   $0$
 * 
 * @date revision  21/02/2016  Utilisation de constante par define
 *
 *  Parametres de la connexion à la base de données
 *
 */

 /**
 * Database configuration
 */
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_NAME', 'flotte');


$loginServeur = DB_HOST;
$loginUsername = DB_USERNAME;
$loginPassword = DB_PASSWORD;
$nomBase = DB_NAME;

?>