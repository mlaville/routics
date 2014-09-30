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
 * A Faire
 * - Se passer de JQuery
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
window.addEventListener('load', function() {
	var dateRef = new Date;
	
	dateRef.setDate( dateRef.getDate() - 1 );
	document.getElementById('input-mois-planning').value = ( dateRef.getMonth() + 1 ) + '-' + dateRef.getFullYear();
		
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
/*

	$('#input-mois-planning').monthpicker({
		pattern: 'mm-yyyy', // Default is 'mm/yyyy' and separator char is not mandatory
		selectedYear: 2014,
		startYear: 2013,
		finalYear: 2020,
		monthNames: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
	});

	$('#input-mois-recap').monthpicker({
		pattern: 'mm-yyyy', // Default is 'mm/yyyy' and separator char is not mandatory
		selectedYear: 2014,
		startYear: 2013,
		finalYear: 2020,
		monthNames: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
	});
*/
	document.forms["signup"].addEventListener('submit', function(event) {
		var	f = event.target,
			param = { login: f['login'].value, pwd: f['pwd'].value };
			
		event.stopPropagation();
		event.preventDefault();
		
		document.getElementById('ajax-loader').style.display='block';
		
		$.post("./php/login.php", { login: f['login'].value, pwd: f['pwd'].value },
			function(data){
				document.getElementById('ajax-loader').style.display='none';
				if(data.succes) {
					if( document.getElementById('rd_tt').checked ) {
					
						docCookies.setItem('module', 'TT', 3600 * 24 * 7 );
						window.location.replace( './indexTT.php?mois=' + document.getElementById('input-mois-planning').value );
					} else {
						if( document.getElementById('rd_recap').checked ) {
							docCookies.setItem('module', 'RM', 3600 * 24 * 7 );
							window.location.replace( './indexWorkTime.php?mois=' + document.getElementById('input-mois-recap').value );
						} else {
							docCookies.setItem('module', 'OR', 3600 * 24 * 7 );
							window.location.replace("./indexOR.php");
						}
					}
				} else {
					alert(data.error.reason);
				}
			}, "json");
	});
	
	return;
});
