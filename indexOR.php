<?php
/**
 * indexOR.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       03/05/2015
 * @version    0.5
 * @revision   $0$
 *
 * @date revision   01/08/2015 Affichade de la card du véhicle : vehicule-card
 *
 * Gestion des ordres de réparation
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
$ajaxDetailVehicule = $demo ? './response/getDetailVehicule.json' : './php/getDetailVehicule.php';
$ajaxTrailers = $demo ? './response/getTrailers.json' : './php/getTrailers.php';
$ajaxKmCompteur = $demo ? './response/getKmCompteur.json' : './php/getKmCompteur.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8" />
	<title>Routics - Véhicules</title>
	<meta content="marc Laville - polinux" name="author" />
	<meta content="Routics - Saisie OR" name="description" />
	
	<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="./css/layout-old.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/listVehicule.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/form.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/marques.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/table.css" />
	
</head>
<body data-vehicule="<?php echo $ajaxVehicule; ?>" data-trailers="<?php echo $ajaxTrailers; ?>" data-detail_vehicule="<?php echo $ajaxDetailVehicule; ?>" data-km_compteur="<?php echo $ajaxKmCompteur; ?>">
	<header>
		<img alt="Gestion des OR" src="./img/dossierOr.png">Gestion des Ordres de Réparation
		<?php echo $param->header; ?>
		<nav>
			<form name="frm_menu">
				<input type="radio" id="rd-saisie" name="menu" checked >
				<label for="rd-saisie">Saisie OR</label>
				<input type="radio" id="rd-stat" name="menu">
				<label for="rd-stat"><a href='./indexStat.php'>Statistiques</a></label>
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
<!-- 				<h1>Saisie des Ordres de Réparation</h1> -->
				<fieldset id="fs_visu">
					<legend>
						<output name="num-parc" class="numParc" id="num-parc" ></output>
					</legend>
					<div>
					<figure id="vehicule-card">
						<div class="box">
							<output name="idTransics" class="idTransics" id="idTransics" ></output></div>
						<div class="box marque">
							<output name="marque"></output>
						</div>
						<div class="box">
							<output name="immat" class="immat"></output>
						</div>
					</figure>
					<figure>
						 <div class="cadran">
							<output name="km-vehicule" class="km"></output>
							<label>compteur</label>
						</div>
					</figure>
					<figure id="position">
						<div>
							<div id="googleMap"></div>
							<div id="indication">
								<div class="localite"></div>
								<div class="destination"></div>
							</div>
						</div>
						<figcaption><output name="dateInfoVehicule"></output></figcaption>
					</figure>
					</div>
				</fieldset>
				<fieldset>
					<legend>Saisie d'un Ordre de Réparation
						<output name="idOr" id="idOr" ></output>
					</legend>
					<label for="dateOR">Date
					<span class="small">de l'OR</span>
					</label>
					<input type="text" name="dateOR" id="dateOR" />

					<label for="kmOR">Km
					<span class="small">.</span>
					</label>
					<input type="text" name="kmOR" id="kmOR" />
					<div class="ajax-loader"></div>
					<br style="clear:both"/>

					<label for="lieuOR">Lieu
					<span class="small">des Réparations</span>
					</label>
					<input type="text" name="lieuOR" id="lieuOR" />

					<label for="numFactOR">N° Facture
					<span class="small"></span>
					</label>
					<input type="text" name="numFactOR" id="numFactOR" />
					
					<label for="montantOR">Montant
					<span class="small">€ HT</span>
					</label>
					<input type="text" name="montantOR" id="montantOR" />
					
					<br style="clear:both" />
					<label for="description">Nature des Réparations</label>
					<textarea name="descriptOr" id="description"></textarea>

					<button name="validOr" type="submit">Enregistrer</button>
					<div class="ajax-loader"></div>
				</fieldset>

			</form>
						
			<table summary="Récatituletif des ORs" id="table-or">
				<thead>
					<tr>
						<th>N° OR</th>
						<th>Date</th>
						<th>Lieu</th>
						<th>N° Facture</th>
						<th>km</th>
						<th>Nature des Réparations</th>
						<th>Montant</th>
						<th></th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<td class="rounded-foot-left" colspan="6"><em>Totaux</em></td>
						<td></td>
						<td class="rounded-foot-right">&nbsp;</td>
					</tr>
				</tfoot>
				<tbody></tbody>
			</table>
		</div>
	   </div>
        <div id="leftcolumn">
			<a href="#" id="a_vehicule">Actualiser</a><br />
			<form name="form_nav">
				<input type="radio" id="rd-tracteur" value="tracteur" name="typeElement" checked />
				<label for="rd-tracteur"><img src="./img/tracteur.png" /></label>
				<input type="radio" id="rd-remorque" value="remorque" name="typeElement" />
				<label for="rd-remorque"><img src="./img/citerne.png" /></label>

				<input id="search" type="text" placeholder="Recherche ..." style="display: none;">

				<div id="div_vehicule">
					<ul id="ul_tracteur"></ul>
					<ul id="ul_remorque"></ul>
				</div>
			</form>
        </div>
    </div>
	<footer>
		<a target="_blank" href="http://polinux.fr" style="float:left">
			<img src="http://lib.polinux.fr/img/polinux-micro.gif" alt="polinux.fr" style="border-style: none;">
		</a>
	</footer><!-- #footer -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
	<script src="http://lib.polinux.net/js/JQuery/ui/jquery.ui.datepicker-fr.js" type="text/javascript"></script>
	<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js"></script>
	
	<script src="http://lib.polinux.fr/js/js-util.js" type="text/javascript"></script>
	<script src="./js/appOr.js" type="text/javascript"></script>
	<script src="./js/formOr.js" type="text/javascript"></script>
</body>
</html>