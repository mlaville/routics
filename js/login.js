/**
 * login.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       23/08/2013
 * @version    1.0
 * @revision   $0$
 *
 * Gére la saisie du login utilisateur
 *
 * @date revision   29/08/2015 Teste la connexion Transics et récupère la version
 *
 * Appel  ajax:
 * - ./php/soapBuildVersion.php
 * - ./php/login.php
 * 
 * A Faire
 * - Se passer de Zepto
*
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
window.addEventListener('load', function() {
	var dateRef = new Date;
	
	dateRef.setDate( dateRef.getDate() - 1 );
	document.getElementById('input-mois-planning').value = [ dateRef.getMonth() + 1, dateRef.getFullYear() ].join('-');
		
	dateRef.setMonth( dateRef.getMonth() - 1 );
	document.getElementById('input-mois-recap').value = ( '0' + ( dateRef.getMonth() + 1 ) ).slice(-2) + '-' + dateRef.getFullYear();
		
	switch( docCookies.getItem( 'module' ) ) {
		case 'RM' : document.getElementById('rd_recap').checked = true;
			break;
	
		case 'TT' : document.getElementById('rd_tt').checked = true;
			break;
	
		case 'OR' : ;
		default : document.getElementById('rd_or').checked = true;
			break;
	
	}

	monthPickerFactory.createMonthPicker( document.getElementById('input-mois-planning') );
	monthPickerFactory.createMonthPicker( document.getElementById('input-mois-recap') );

	document.forms["signup"].addEventListener('submit', function(event) {
		var	f = event.target;
			
		event.stopPropagation();
		event.preventDefault();
		
		document.getElementById('ajax-loader').style.display = 'block';
		
//		$.post("./php/login.php", { login: f['login'].value, pwd: f['pwd'].value },
		$.post( document.body.dataset.login, { login: f['login'].value, pwd: f['pwd'].value },
			function(data){
				var expireDelai = 3600 * 24 * 7;
				
				document.getElementById('ajax-loader').style.display = 'none';
				if(data.succes) {
					if( document.getElementById('rd_tt').checked ) {
					
						docCookies.setItem('module', 'TT', expireDelai );
						window.location.replace( './indexTT.php?mois=' + document.getElementById('input-mois-planning').value );
					} else {
						if( document.getElementById('rd_recap').checked ) {
							docCookies.setItem('module', 'RM', expireDelai );
							window.location.replace( './indexWorkTime.php?mois=' + document.getElementById('input-mois-recap').value );
						} else {
							docCookies.setItem('module', 'OR', expireDelai );
							window.location.replace("./indexOR.php");
						}
					}
				} else {
					alert(data.error.reason);
				}
			}, "json");
	});
	
	$.get( './php/soapBuildVersion.php', { }, function(data) {
		if(data.succes) {
			var v1 = /'(.*)'/.exec(data.result[0]),
				v2 = /'(.*)'/.exec(data.result[1]);
				
			document.getElementById('info-transics').textContent = [ v1[1], v2[1] ].join('/');
			document.forms.signup.soumettre.disabled = false;
		}
	})

	return;
});
