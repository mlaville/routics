/**
 * statOr.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       13/09/2015
 * @version    0.5
 * @revision   $0$
 *
 * Gestion des ordres de réparation
 * 
 * @date revision   
 *
 * Appel  ajax:
 * - ../php/getStatVehicles.php
 * - ./php/pdfStatVehicle.php -- obsolete
 *
 *
 * A Faire
 * Mise en forme des dates
 * - gerer les requetes ajax sans JQuery
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
function listReleveKm( unArray ) {
	var tbody = document.getElementById('table-km').getElementsByTagName('tbody')[0],
	/*
	 * {"Vehicle":"68","VehicleTransicsId":"95","KmDebut":"569439","KmFin":"570042","DateDebut":"2015-08-03 03:50:00","DateFin":"2015-08-05 07:55:00","Distance":"603"}
	 */
		ajoutLigne = function( lg ) {
			var ligne = tbody.insertRow(-1),
				ajoutCell = function( lib, classArray ) {
					var cellule = ligne.insertCell(-1);
					
					cellule.textContent = lib || '';
					if(classArray) {
						classArray.forEach( function( item ) { return cellule.classList.add(item); } );
					}
						
					return cellule;
				},
				cellParc = ligne.insertCell(-1),
				spanParc = cellParc.appendChild( document.createElement('span') ),
				dummy = cellParc.appendChild( document.createElement('span') );
				spanTransics = cellParc.appendChild( document.createElement('span') );
				
			spanParc.textContent = lg.Vehicle;
			spanParc.classList.add('numParc');
			spanTransics.textContent = lg.VehicleTransicsId;
			spanTransics.classList.add('idTransics');

			ajoutCell( ); // immat
			
			ajoutCell(lg.DateDebut);
			ajoutCell(lg.KmDebut, [ 'td-km', 'nombre' ]);
			ajoutCell(lg.DateFin);
			ajoutCell(lg.KmFin, [ 'td-km', 'nombre' ]);
			ajoutCell(lg.KmFin - lg.KmDebut, [ 'td-km', 'nombre' ]);
			
			return ligne;
		};
	
	// retire tous les enfants d'un élément
	while (tbody.firstChild) {
	  tbody.removeChild(tbody.firstChild);
	}
	return unArray.forEach(ajoutLigne);
}


function afficheReleveKm(event){

	var f = event.target,
		param = {
			mois: ( '0' + f.moisReleve.value.replace('/', '') ).slice(-6), 
			typeVehicule: ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque'
		};
	
	event.stopPropagation();
	event.preventDefault();
		
	f.calculKm.disabled = true;
	
	$.post("./php/getStatVehicles.php", param,
		function(data){
			f.calculKm.disabled = false;
			listReleveKm( data.result );
	}, "json");

	return false;
}
