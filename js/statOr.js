
function listStatVehicule( unTab, rupt ) {

	var tbody = document.getElementById('table-stat').getElementsByTagName('tbody')[0],
		lgTot = unTab[unTab.length - 1],// Référence la ligne de totaux 
		clickSousTotal = function ( a ) {
			previousTr = a.parentNode.parentNode.previousSibling;
			
			while( previousTr && !previousTr.classList.contains("sousTotal") ) {
				previousTr.classList.toggle("masque");
				previousTr = previousTr.previousSibling;
			}
			return false;
		},
		ajoutLigne = function( lg ) {
			var tr = document.createElement('tr'),
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
					/* Creation du lien pour gèrer l'expansion */
					var a_expand = tr.appendChild( document.createElement('td') ).appendChild( document.createElement('a') ),
						img = a_expand.appendChild( document.createElement('img') ).setAttribute("scr", "./img/bullet_arrow_up.png");
						
					a_expand.setAttribute("href", "#");
					a_expand.textContent = ' ^ ';
					a_expand.addEventListener('click', function(e) {
						clickSousTotal( e.currentTarget );
				   });
					
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

function afficheStat(f){

	var param = {
		dateInf: f["dateInf"].value, 
		dateSup: f["dateSup"].value,
		typeVehicule: ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque',
		rupture: f["rupture"][0].checked ? 'marque' : 'transport'
	};
	
//	$.post("./php/getStatVehicles.php", param,
	$.post( document.body.dataset.stat, param,
		function(data){
			listStatVehicule( data.result, param.rupture );
			f["calculStat"].disable = false;
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

window.addEventListener('load', function() {

	/* Attache un datePicker aus champs date */
	/* et initilisation au mois passé */
	var dateRef = new Date(),
		monthRef = dateRef.getMonth();
	
	dateRef.setDate(1);
	
	$( "#dateInf" ).datepicker({
		defaultDate: "-1m",
		changeMonth: true,
		onClose: function( selectedDate ) {
			$( "#dateSup" ).datepicker( "option", "minDate", selectedDate );
		}
	});
	$( "#dateSup" ).datepicker({
		defaultDate: "-1m",
		changeMonth: true,
		onClose: function( selectedDate ) {
			$( "#dateInf" ).datepicker( "option", "maxDate", selectedDate );
		}
	});
/*	
    document.getElementById('a_vehicule').addEventListener('click', function() {
		loadVehicules( )
    });
*/
/*	document.forms["frm_nav"].addEventListener('change', function(e) {
		return switchVehicle( this.typeElement );
	});
*/
	document.forms["form-stat"].addEventListener('submit', function(event) {
		event.preventDefault();
		
		return afficheStat( event.target );
	});
	
    document.getElementById('a_impDetail').addEventListener('click', function() {
		return editStat( document.forms['form-stat'], 'detail' );
    });
	
    document.getElementById('a_impSynthese').addEventListener('click', function() {
		return editStat( document.forms['form-stat'], 'synthese' );
    });
	
	return;
});
