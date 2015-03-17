<?php
session_name("flotte");
session_start();

if( !isset( $_SESSION['ident']) ) {
	header("Location: ./");
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8" />
	<title>Transics - Véhicules</title>
	<meta content="marc Laville - polinux" name="author" />
	<meta content="Routics - Saisie OR" name="description" />
	
	<link rel="stylesheet" type="text/css" media="screen" href="http://lib.polinux.net/js/JQuery/ui/flick/jquery-ui-1.10.2.custom.css" />
	<link rel="stylesheet" type="text/css" href="./css/layout-old.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/listVehicule.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/form.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/table.css" />

	<script type="text/javascript" src="http://cdn.jsdelivr.net/jquery/2.1.1/jquery.min.js"></script>
	<script src="http://lib.polinux.net/js/JQuery/ui/jquery-ui-1.10.2.custom.js" type="text/javascript"></script>
	<script src="http://lib.polinux.net/js/JQuery/ui/jquery.ui.datepicker-fr.js" type="text/javascript"></script>
	
</head>
<body>
	<header>
			<img alt="Gestion des OR" src="./img/dossierOr.png">Gestion des Ordres de Réparation
			<h3>bouquerod<p>pierre s.a.s.</p></h3>
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
				<h1>Saisie des Ordres de Réparation</h1>
				<fieldset id="fs_visu">
					<legend>
						<output name="num-parc" class="numParc" id="num-parc" ></output>
						<img id="img-typeElement" src="./img/tracteur.png" />
					</legend>
					
					<output name="idTransics" class="idTransics" id="idTransics"></output>
					<output name="marque" id="marque"></output>
					<figure>
					<output name="immat" class="immat" id="immat"></output>
					</figure>
					<figure>
						<output name="km-vehicule" id="km-vehicule" class="km"></output>
						<figcaption>compteur</figcaption>
					</figure>
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
						<td> </td>
						<td class="rounded-foot-right">&nbsp;</td>
					</tr>
				</tfoot>
				<tbody></tbody>
			</table>
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
	<footer>
		<a target="_blank" href="http://polinux.fr" style="float:left">
			<img src="http://lib.polinux.fr/img/polinux-micro.gif" alt="polinux.fr" style="border-style: none;">
		</a>
	</footer><!-- #footer -->
	<script src="./js/appOr.js" type="text/javascript"></script>
	<script src="./js/formOr.js" type="text/javascript"></script>
</body>
</html>