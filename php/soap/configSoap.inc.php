<?php
/**
 * configSoap.inc.php
 * 
 * @auteur     marc laville - polinux
 * @Copyleft 2015
 * @date       26/10/2015
 * @version    0.2
 * @revision   $0$
 * 
 *  Configuration des accès Soap
 *
 */
/* Settings */
$wsdl = "https://iwsfleet.tx-connect.com/IWS/Service.asmx?WSDL";
//$wsdl = "http://transics.tx-connect.com/IWSLead/Service.asmx?WSDL";
//$wsdl = "../wsdl/transics.wsdl";

// Définit le fuseau horaire par défaut à utiliser. Disponible depuis PHP 5.1
date_default_timezone_set('Europe/Paris');

/* Create login object */
$login = new stdClass();

$login->DateTime = date(DateTime::W3C);
$login->Dispatcher = 'POLINUX';
$login->Password = 'POLINUX_1333';
$login->SystemNr = 2858;
$login->Integrator = '2858_POLINUX_01';
$login->Language = 'fr';
$login->ApplicationName = 'routics';
$login->ApplicationVersion = '0.1.2';

$login->Version = '0';
?>
