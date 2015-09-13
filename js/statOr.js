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
 * - ./php/pdfStatVehicle.php
 *
 *
 * A Faire
 * - gerer les requetes ajax sans JQuery
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

function listStatVehicule( unTab /* , rupt  */) {

	var tbody = document.getElementById('table-stat').getElementsByTagName('tbody')[0],
		lgTot = unTab[unTab.length - 1],// Référence la ligne de totaux 
		expendSousTotal = function(tr) {
			return function() {
				var previousTr = tr.previousSibling;
				
				while( previousTr && !previousTr.classList.contains("sousTotal") ) {
					previousTr.classList.toggle("masque");
					previousTr = previousTr.previousSibling;
				}
				return false;
			};
		},
		
		ajoutLigne = function( lg ) {
			var tr = document.createElement('tr'),
				expendCheck = function() {
					var label = document.createElement('label'),
						chk = label.appendChild( document.createElement('input') );
					
					chk.setAttribute('type', 'checkbox');
					chk.addEventListener('change', expendSousTotal(tr));
					
					label.appendChild(document.createElement('div'));
					
					return label;
				},
				ajoutCell = function( lib, classArray ) {
					var cellule = document.createElement('td');
					
					cellule.textContent = lib || '';
					if(classArray) {
						classArray.forEach( function( item ) { return cellule.classList.add(item); } );
					}
						
					return tr.appendChild( cellule );
				};
				
			if( lg.VehicleID != null ) {
				tr.classList.add("masque");
				ajoutCell();
				ajoutCell(lg.VehicleID);
				ajoutCell(lg.LicensePlate);
			} else {
				/* Ligne de Rupture */
				tr.classList.add("sousTotal");
				if( lg.Rupture != null ) {
					tr.appendChild( document.createElement('td') )
						/* Creation du lien pour gèrer l'expansion */
						.appendChild( expendCheck() );
					
					
					ajoutCell(lg.NbVehicule + ' ' + lg.Rupture);
					ajoutCell(Math.round( 1000 * lg.NbVehicule/lgTot.NbVehicule ) / 10, [ "nombre", "pourcent" ]);
				} else {
					/* Derniere ligne */
					var tdTot = tr.appendChild( document.createElement('td') );
					tdTot = tr.appendChild( document.createElement('td') );
					
					tdTot.setAttribute("colspan", "2");
					tdTot.textContent = lg.NbVehicule + ' Véhicules';
				}
			}
			
			ajoutCell(lg.Kms, [ 'td-km', 'nombre' ]);

			if( lg.VehicleID == null ) {
				ajoutCell( Math.round( 1000 * lg.Kms/lgTot.Kms ) / 10, [ 'pourcent', 'nombre' ] );
			} else {
				tr.lastChild.setAttribute("colspan", "2");
			}
			ajoutCell( lg.NbOr, [ 'nombre' ] );
			ajoutCell( lg.TotCout, [ 'nombre', 'td-euro' ] );
			
			if( lg.VehicleID == null ) {
				ajoutCell( Math.round( 1000 * lg.TotCout/lgTot.TotCout ) / 10, [ 'nombre', 'pourcent' ] );
			} else {
				tr.lastChild.setAttribute("colspan", "2");
			}
			
			ajoutCell( lg.CoutKm, [ 'nombre' ] );
			
			return tbody.appendChild(tr)
		};
	
	// retire tous les enfants d'un élément
	while (tbody.firstChild) {
	  tbody.removeChild(tbody.firstChild);
	}
	unTab.forEach(ajoutLigne);
	
	return;
}

function afficheStat(event){

	var f = event.target,
		param = {
			dateInf: f["dateInf"].value, 
			dateSup: f["dateSup"].value,
			typeVehicule: ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque',
			rupture: f["rupture"][0].checked ? 'marque' : 'transport'
		};
	
	event.preventDefault();
		
	f["calculStat"].disabled = true;
	
	$.post("./php/getStatVehicles.php", param,
//	$.post( document.body.dataset.stat, param,
		function(data){
			listStatVehicule( data.result /* , param.rupture  */);
			f["calculStat"].disabled = false;
	}, "json");

	return false;
}

function editStat(f, typeEdit){

		return domFenetrePdf( './php/pdfStatVehicle.php'
					+ '?dateInf=' + f["dateInf"].value
					+ '&dateSup=' + f["dateSup"].value 
					+ '&typeVehicule=' + ( ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque' )
					+ '&typeEdit=' + typeEdit,
				'Statistiques' );
}
