/**
 * login.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013-2015
 * @date       23/08/2013
 * @version    1.0
 * @revision   $0$
 *
 * Gére la saisie du login utilisateur
 *
 * @date revision   29/08/2015 Teste la connexion Transics et récupère la version
 * @date revision   30/08/2015 Suppime la dependance à Zepto pour l'envoi des requetes Ajax
 *
 * Appel  ajax:
 * - ./php/soapBuildVersion.php
 * - ./php/login.php
 * 
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
var requete = function( url, method, callBack, loader ) {
	var xhr = new XMLHttpRequest(),
		loaderStyle = document.getElementById('transics-loader').style;
	
	xhr.open( method, url );
//    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function () {
	  var DONE = 4, // readyState 4 means the request is done.
		  OK = 200, // status 200 is a successful return.
		  responseObject = null;
	  switch( xhr.readyState ) {
		case 1 :
			loaderStyle.backgroundColor = 'red';
			break;
		case 2 :
			loaderStyle.backgroundColor = '#FFA500';
			break;
		case 3 :
			loaderStyle.backgroundColor = '#00A5ff';
			break;
		case DONE :
			loaderStyle.backgroundColor = 'blue';
			loaderStyle.display = 'none';
			if (xhr.status === OK) {
	//		  console.log(xhr.responseText); // 'This is the returned text.'
				try {
					responseObject = JSON.parse(xhr.responseText);
				} catch (e) {
				  console.error("Parsing error:", e); 
				}
				if(responseObject) {
					if( !callBack( responseObject ) ){
						xhr.send();
					}
				} else {
					requete( url, method, callBack );
				}
			} else {
			  console.log('Error: ' + xhr.status); // An error occurred during the request.
			};
			break;
			
		default: ;
	  }
	};	
	return xhr;
}


window.addEventListener('load', function() {
	var dateRef = new Date,
		formSignup = document.forms["signup"],
		/*
		 * Appelé à la soumission du login
		  * redirige vers la page correspondant à la selection du radio 
		 */
		testConnexion = function(data){
			if(data.succes) {
				var v1 = /'(.*)'/.exec(data.result[0]),
					v2 = /'(.*)'/.exec(data.result[1]);
					
				document.getElementById('info-transics').textContent = [ v1[1], v2[1] ].join('/');
				formSignup.soumettre.disabled = false;
			} else {
			}
			return data.succes;
		},
		logRoutics = function(data){
			var expireDelai = 3600 * 24 * 7,
				app = formSignup.app.value, // selection du radio button
				appLocation = {
					OR : './indexOR.php',
					TT : './indexTT.php?mois=' + document.getElementById('input-mois-planning').value,
					RM : './indexWorkTime.php?mois=' + document.getElementById('input-mois-recap').value
				}[app];
			
			document.getElementById('ajax-loader').style.display = 'none';
			
			if(data.succes) {
				docCookies.setItem('module', app, expireDelai );
				window.location.replace(appLocation);
			} else {
				alert(data.error.reason);
			}
		}, 
		xhrLogin = requete( document.body.dataset.login, 'POST', logRoutics, document.getElementById('ajax-loader') ), // dataset.login = "./php/login.php"
		signup = function(event){
			var	fd = new FormData();
				
			event.stopPropagation();
			event.preventDefault();
			
			document.getElementById('ajax-loader').style.display = 'block';
			
			fd.append('login', formSignup['login'].value);
			fd.append('pwd', formSignup['pwd'].value);
			
			return xhrLogin.send( fd );
		}; 
	
	formSignup.soumettre.disabled = true;
	formSignup.addEventListener('submit', signup );
	
	dateRef.setDate( dateRef.getDate() - 1 );
	document.getElementById('input-mois-planning').value = [ dateRef.getMonth() + 1, dateRef.getFullYear() ].join('-');
		
	dateRef.setMonth( dateRef.getMonth() - 1 );
	document.getElementById('input-mois-recap').value = [ ( '0' + ( dateRef.getMonth() + 1 ) ).slice(-2), dateRef.getFullYear() ].join('-');
	
	[ formSignup.planning, formSignup.recap ].forEach( monthPickerFactory.createMonthPicker );
	
	formSignup.app.value = docCookies.getItem( 'module' ) || 'TT';

	requete('./php/soapBuildVersion.php', 'GET', testConnexion, document.getElementById('transics-loader') )
		.send();

	return;
});
