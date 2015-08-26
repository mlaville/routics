<?php
/**
 * indexStat.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       04/05/2015
 * @version    0.5
 * @revision   $0$
 *
 * Statisyique sur les ordres de réparation
 * 
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
session_name("flotte");
session_start();

if( !isset( $_SESSION['ident']) ) {
	header("Location: ./");
}
/* Lecture des parametres pour l'affichage de l'entete */
$param = json_decode( file_get_contents( './custom/param.json') );

$demo = isset($param->demo) ? $param->demo : false;
$ajaxVehicule = $demo ? './response/getVehicule.json' : './php/getVehicule.php';
$ajaxTrailers = $demo ? './response/getTrailers.json' : './php/getTrailers.php';
$ajaxStat = $demo ? './response/getStatVehicles.php' : './php/getStatVehicles.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8" />
	<title>Routics - Statistiques</title>
	<meta content="marc Laville - polinux" name="author" />
	<meta content="Transics Véhicules" name="description" />
	
	<link rel="stylesheet" type="text/css" href="./css/panel.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="http://lib.polinux.net/js/JQuery/ui/flick/jquery-ui-1.10.2.custom.css" />
	<link rel="stylesheet" type="text/css" href="./css/layout-old.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/listVehicule.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/form.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/tableGenerator.css" />

	<script type="text/javascript" src="http://cdn.jsdelivr.net/jquery/2.1.1/jquery.min.js"></script>
	<script src="http://lib.polinux.net/js/JQuery/ui/jquery-ui-1.10.2.custom.js" type="text/javascript"></script>
	<script src="http://lib.polinux.net/js/JQuery/ui/jquery.ui.datepicker-fr.js" type="text/javascript"></script>
	
</head>
<body data-vehicule="<?php echo $ajaxVehicule; ?>" data-trailers="<?php echo $ajaxTrailers; ?>" data-stat="<?php echo $ajaxStat; ?>" >
	<header>
			<img alt="Gestion des OR" src="./img/dossierOr.png">Gestion des Ordres de Réparation
			<?php echo $param->header; ?>
			<nav>
			<form name="frm_menu">
				<input type="radio" id="rd-saisie" name="menu">
				<label for="rd-saisie"><a href='./indexOR.php'>Saisie OR</a></label>
				<input type="radio" id="rd-stat" name="menu" checked >
				<label for="rd-stat">Statistiques</label>
			</form>
			<div>
				<?php echo $_SESSION['firstname'] . ' ' . $_SESSION['lastname']; ?>
				<a href="./php/deconnexion.php">Déconnexion</a>
			</div>
			</nav>
	</header>
    <div id="wrapper">
        <div id="contentliquid">
		<div id="content">
			<form id="form-or" name="form-or">
				<h1>Statistiques</h1>
				<ul style="display:none">
					<li><a class="medium button blue" href="#">Mois Précédent</a></li>
					<li><a class="medium button blue" href="#">3 Mois Précédents</a></li>
					<li><a class="medium button blue" href="#">Trimestre Précédent</a></li>
				</ul>
				<fieldset class="listSelect"><legend>Période</legend>
					<ul>
						<li>
							<label for="dateInf">Du</label>
							<input type="text" name="dateInf" id="dateInf" />
						</li>
						<li>
							<label for="dateSup">au</label>
							<input type="text" name="dateSup" id="dateSup" />
						</li>
					</ul>
				</fieldset>
				<fieldset class="listSelect"><legend>Rupture</legend>
					<ul>
						<li>
							<input type="radio" name="rupture" id="rd_marque" checked />
							<label for="rd_marque"><p>Marque</p></label>
						</li>
						<li>
							<input type="radio" name="rupture" id="rd_transport" />
							<label for="rd_transport"><p>Transport</p></label>
						</li>
					</ul>
				</fieldset>
				<button name="calculStat" type="submit">Calculer ...</button>
				<div class="ajax-loader"></div>
				<fieldset class="listSelect"><legend>Imprimer ...</legend>
					<ul>
						<li>
							<a href="#" id="a_impDetail">Détail</a>
						</li>
						<li>
							<a href="#" id="a_impSynthese">Synthèse</a>
						</li>
					</ul>
				</fieldset>
			</form>
			<div id="PreviewTableClassDiv" class="CSSTableGenerator">		
			<table summary="Récatituletif des ORs" id="table-stat" >
				<thead>
					<tr>
						<th></th>
						<th colspan=2>Parc</th>
						<th colspan=2>Km Parcourus</th>
						<th>Nb OR</th>
						<th colspan=2>Coût Total</th>
						<th>Coût KM</th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<td class="rounded-foot-left" colspan="4"><em></em></td>
						<td></td>
						<td class="rounded-foot-right">&nbsp;</td>
					</tr>
				</tfoot>
				<tbody></tbody>
			</table>
			</div>
		</div>
	   </div>
        <div id="leftcolumn">
			<a href="#" id="a_vehicule">Actualiser</a>
			<nav>
				<form name="frm_nav">
					<input type="radio" id="rd-tracteur" value="tracteur" name="typeElement" checked >
					<label for="rd-tracteur"><img src="./img/tracteur.png" /></label>
					<input type="radio" id="rd-remorque" value="remorque" name="typeElement">
					<label for="rd-remorque"><img src="./img/citerne.png" /></label>
				</form>
			</nav>
			<form class="form-recherche">
				<input id="search" type="text" placeholder="Recherche ...">
				<input id="submit" type="submit" value="go">
			</form>
			<div id="div_vehicule">
				<ul id="ul_tracteur"></ul>
				<ul id="ul_remorque"></ul>
			</div>
        </div>
    </div>
	<div id="divFondPdf"></div>
	<footer>
		<a target="_blank" href="http://polinux.fr" style="float:left">
			<img src="http://lib.polinux.fr/img/polinux-micro.gif" alt="polinux.fr" style="border-style: none;">
		</a>
	</footer><!-- #footer -->
	<script type="text/javascript" src="./js/panel.js"></script>
	<script src="./js/appOr.js" type="text/javascript"></script>
	<script src="./js/statOr.js" type="text/javascript"></script>
</body>
</html>