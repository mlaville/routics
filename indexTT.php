<?php
/**
 * indexTT.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       01/08/2013
 * @version    1.2
 * @revision   $2$
 *
 * Affichage du planning conducteur
 * 
 * @date revision  marc laville le 08/01/2014 administration des types d'arrêts (temps, couleur)
 * @date revision  marc laville le 26/06/2014 Usage de input type=color en lieu et place de spectrum
 * @date revision   05/05/2015  Prise en compte des données custom
 *
 * A Faire
 * - fixer les entetes de colonne
 * - gerer les requetes ajax sans JQuery
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
ini_set('session.gc_maxlifetime', 36000);
session_name("flotte");
session_start();

if( !isset( $_SESSION['ident']) ) {
	header("Location: ./");
}

include './php/soap/configSoap.inc.php';

$user = isset($_SESSION['firstname'], $_SESSION['lastname']) ? $_SESSION['firstname'] . ' ' . $_SESSION['lastname'] : '** **';

/* Lecture des parametres pour l'affichage de l'entete */
$param = json_decode( file_get_contents( './custom/param.json') );

$demo = isset($param->demo) ? $param->demo : false;
$ajaxDrivers = $demo ? './response/getDrivers.json' : './php/getDrivers.php';

$dataUrlImg = $param->dataUrlImg;

?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8" />
	<title>Routics - Gestion des Temps de Travail</title>
	<meta content="marc Laville - polinux" name="author" />
	<meta content="Routics - Gestion des Temps de Travail" name="description" />
	
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="0" />

	<link rel="stylesheet" type="text/css" href="./css/panel.css" />
	<link rel="stylesheet" type="text/css" href="./css/table-typeAT.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/ajaxLoader.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/calendrierTT.css" />
	
	<script type="text/javascript" src="http://cdn.jsdelivr.net/jquery/2.1.1/jquery.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	<script type="text/javascript" src="http://lib.polinux.fr/js/jspdf.min.js"></script>

</head>
<body data-drivers="<?php echo $ajaxDrivers; ?>" >
<input type="hidden" id="dataUrl" value="<?php echo $dataUrlImg; ?>" />
	<header>
		<img alt="Gestion des TT" src="./img/time_machine.png">Gestion des Temps de Travail
		<ul>
			<li>
				<button class="imprimer" id="btnImprime"></button>
			</li>
			<li>
				<label for="input-mois">Mois</label>
				<input type="text" id="input-mois" readonly />
			</li>
			<li>
				<ul id='ul-typeAT'></ul>
			</li>
			<li>
				<button id='btnEditTypeAT' class="editer"></button>
			</li>
		</ul>
		<nav>
			<div>
				<?php echo $user; ?>
				<a href="./php/deconnexion.php">Déconnexion</a>
			</div>
		</nav>
			<?php echo $param->header; ?>
	</header>
	<div>
		<label for="afficheTT">Afficher les temps de Travail</label>
		<input type="checkbox" id="afficheTT">
		<table summary="Calendrier" id="table-calendrier" >
			<thead>
				<tr></tr>
			</thead>
			<tfoot>
				<tr>
					<td colspan=12><div id="ajax-loader"></div></td>
				</tr>
				<tr>
					<td class="rounded-foot-left" colspan="4"><em></em></td>
					<td colspan=3>"AR" : "Repos"</td>
					<td colspan=3>"RD" : "Conduite"</td>
					<td colspan=3>"AA" : "Travail"</td>
					<td colspan=3>"AO" : "Dispo"</td>
					<td class="rounded-foot-right">&nbsp;</td>
				</tr>
			</tfoot>
			<tbody></tbody>
		</table>
	</div>
<table class="data" id="table-typeAT" style="display:none">
	<thead>
		<tr>
			<th colspan="6">
				<form>
				<fieldset>
				<input type='hidden' name='idTypeAt'/>
				<input type='text' name='inputLibelle'/>
				<input type='text' name='inputCode'/>
				<input type='text' name='inputDuree'/>
				<input type='color' name='inputColor' value='#3355cc' /><br>
				<input type='submit' name='sauve' value='Enregistrer' disabled />
				<input type='reset' name='reset' value='Annuler' />
				</fieldset>
				</form>
			</th>
		</tr>
		<tr>
            <th>Id</th>
			<th>Libellé</th>
			<th>Code</th>
			<th>Durée</th>
			<th colspan="2"></th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<th colspan="6">
				<button class='inserer' value="ajout" name="ajout" type="button">ajouter ...</button>
			</th>
		</tr>
	</tfoot>
    <tbody></tbody>
</table>
	<script type="text/javascript" src="http://lib.polinux.fr/js/js-util.js"></script>
	<script type="text/javascript" src="./js/panel.js"></script>
	<script type="text/javascript" src="./js/crudAT.js"></script>
	<script type="text/javascript" src="./js/tt.js"></script>
	<script type="text/javascript" src="./js/pdfPlanning.js"></script>
</body>
</html>