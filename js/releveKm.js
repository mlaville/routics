/**
 * releveKm.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       13/09/2015
 * @version    0.5
 * @revision   $0$
 *
 * Affichage des relevés KM
 * 
 * @date revision   
 *
 * Appel  ajax:
 * - ../php/getStatVehicles.php
 *
 * A Faire
 * Mise en forme des dates
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

ctrlReleveKm = function( formReleve, tableKm ) {
	var btCalculKm = formReleve.calculKm,
		xhrKm = new XMLHttpRequest(),
		listReleveKm = function( unArray ) {
			var tbody = tableKm.getElementsByTagName('tbody')[0],
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
				
			btCalculKm.disabled = true;
		
			// retire tous les enfants d'un élément
			while (tbody.firstChild) {
			  tbody.removeChild(tbody.firstChild);
			};
			unArray.forEach(ajoutLigne);
			
			btCalculKm.disabled = false;
			
			return;
		},
		afficheReleveKm = function (event){

			var f = event.target,
				formData = new FormData();
				
			event.stopPropagation();
			event.preventDefault();
			
			formData.append( 'mois', ( '0' + f.moisReleve.value.replace('/', '') ).slice(-6) );
			formData.append( 'typeVehicule',  ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque' );

/*			
			fetch( new Request( './php/getStatVehicles.php', { method: "POST", body: formData } ) ).then(function(response) {
			  return response.json().then(function(data){
					listReleveKm( data.result );
				});
			}).catch(function (error) {  
				alert('Request failed', error);  
			});
*/
			xhrKm.open("POST", "./php/getStatVehicles.php", true);
			xhrKm.send(formData);
			
			return false;
		},
		dateRef = new Date(),
		traiteReponse = function(data) {
			var jsonData = JSON.parse(data);
			
			return listReleveKm( jsonData.result );
		};
	
	xhrKm.onreadystatechange = function (aEvt) {
	  if (xhrKm.readyState == XMLHttpRequest.DONE) {
		 if(xhrKm.status == 200) {
		  traiteReponse(xhrKm.responseText);
		 } else {
		  alert("Erreur pendant le chargement de la page.\n");
	     }
	  }
	};
	
 	dateRef.setMonth( dateRef.getMonth() - 1 );
	monthPickerFactory.createMonthPicker( formReleve.moisReleve );
	formReleve.moisReleve.value = [ ( '0' + ( dateRef.getMonth() + 1 ) ).slice(-2), dateRef.getFullYear() ].join('/');
		
	formReleve.addEventListener('submit', afficheReleveKm);
	btCalculKm.disabled = false;

	return this;
}
