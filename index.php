<?php
/**
 * index.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       03/05/2015
 * @version    0.5
 * @revision   $0$
 *
 * Saisie du login utilisateur
 * 
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
$param = json_decode( file_get_contents( './custom/param.json') );
?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8" />
	<title>Routics - Login</title>
	<meta content="marc Laville - polinux" name="author" />
	<meta content="Routics Login" name="description" />
	<link rel="icon" href="/favicon.ico" />
	<link rel="stylesheet" type="text/css" href="http://lib.polinux.fr/js/month-picker/monthPicker.css" />	
	<link rel="stylesheet" type="text/css" media="screen" href="./css/ajaxLoader.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/bouton.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/login.css" />
	
</head>
<body data-login="<?php echo ( isset($param->demo) ? $param->demo : false ) ? './response/login.php' : './php/login.php' ; ?>">

<div class="container">

	<audio id="clickSound">
<!--		<source src="https://freesound.org/data/previews/321/321906_1755779-lq.mp3"></source> -->
		<source src="https://freesound.org/data/previews/26/26777_128404-lq.mp3"></source>
		Audio not supported.
	</audio>
    <form id="signup" name="signup" method="post" action="./php/login.php">
        <header>
			<?php echo $param->header; ?>
        </header>
        <hr />
        <div class="inputs">
            <input name="login" type="text" placeholder="Login" autofocus required />
            <input name="pwd" type="password" placeholder="Mot de Passe" />
            <div class="checkboxy">
                <input name="checky" id="checky" type="checkbox" value="1" />
				<label for="checky" class="terms">Mémoriser le Mot de Passe</label>
            </div>
			
			<ul>
				<li>
					<input type="radio" checked="" id="rd_or" name="app" value="OR" />
					<label for="rd_or"><img src="./img/dossierOr.png" alt="Gestion des Ordres de Réparation"></label>
				</li>
				<li>
					<input type="radio" id="rd_tt" name="app" value="TT" />
					<label for="rd_tt"><img src="./img/time_machine.png" alt="Gestion des Temps de Travail"></label>
					<input type="text" id="input-mois-planning" name="planning">
				</li>
				<li>
					<input type="radio" id="rd_recap" name="app" value="RM" />
					<label for="rd_recap"><img src="./img/wt.png" alt="Récapitulatif d'Activité"></label>
					<input type="text" id="input-mois-recap" name="recap" >
				</li>
			</ul>            
            <input name="soumettre" class="btn btn-primary btn-lg btn-block" type="submit" value="Connexion" disabled />
			<div id="ajax-loader"></div>
			<hr />
			<section id="info-transics">
				<div id="transics-loader"></div>
			</section>
		</div>
    </form>
</div>
<footer>
	<a style="float:left" href="http://polinux.fr" target="_blank">
		<img style="border-style: none;" alt="polinux.fr" src="http://lib.polinux.fr/img/polinux-micro.gif">
	</a>
</footer>

<script type="text/javascript" src="http://lib.polinux.fr/js/js-util.js"></script>
<script type="text/javascript" src="http://lib.polinux.fr/js/month-picker/monthPicker.js"></script>

<script src="./js/cookies.js" type="text/javascript"></script>
<script src="./js/login.js" type="text/javascript"></script>
</body>
</html>