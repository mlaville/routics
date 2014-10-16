<?php
 /**
 * deconnexion.php
 * 
 * @auteur     marc laville - polinux
 * @Copyleft 2013
 * @date       24/05/2013
 * @version    0.1
 * @revision   $0$
 * 
 *  Deconnexion de l'application par destruction de la session utilisateur
 *
 */
session_name("flotte");
session_start();

$_SESSION = array();
session_destroy();

header("Location: ../");
?>