function clickSousTotal( a ){
	previousTr = a.parentNode.parentNode.previousSibling;
	
	while( previousTr && !previousTr.classList.contains("sousTotal") ) {
		previousTr.classList.toggle("masque");
		previousTr = previousTr.previousSibling;
	}
	return false;
}

function listStatVehicule( unTab, rupt ) {

	var tbody = document.getElementById('table-stat').getElementsByTagName('tbody')[0],
		lgTot = unTab[unTab.length - 1];// Référence la ligne de totaux 
	
	// retire tous les enfants d'un élément
	while (tbody.firstChild) {
	  tbody.removeChild(tbody.firstChild);
	}
	
	for( var i = 0 ; i < unTab.length ; i++ ) {
		var tr = tbody.appendChild( document.createElement('tr') ),
			lg = unTab[i];
			
		if( lg.VehicleID != null ) {
			tr.classList.add("masque");
			tr.appendChild( document.createElement('td') );
			tr.appendChild( document.createElement('td') ).textContent = lg.VehicleID;
			tr.appendChild( document.createElement('td') ).textContent = lg.LicensePlate;
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
				
				tr.appendChild( document.createElement('td') ).textContent = lg.NbVehicule + ' ' + lg.Rupture;
				tr.appendChild( document.createElement('td') ).textContent = Math.round( 1000 * lg.NbVehicule/lgTot.NbVehicule ) / 10;
				tr.lastChild.classList.add("nombre");
				tr.lastChild.classList.add("pourcent");
			} else {
				/* Derniere ligne */
				var tdTot = tr.appendChild( document.createElement('td') );
				tdTot = tr.appendChild( document.createElement('td') );
				
				tdTot.setAttribute("colspan", "2");
				tdTot.textContent = lg.NbVehicule + ' Véhicules';
//				tr.lastChild.classList.add("masque");
			}
//			tr.appendChild( document.createElement('td') ).textContent = "Total";
		}
		
		tr.appendChild( document.createElement('td') ).textContent = lg.Kms;
		tr.lastChild.classList.add("td-km");
		tr.lastChild.classList.add("nombre");
		
		if( lg.VehicleID == null ) {
			tr.appendChild( document.createElement('td') ).textContent = Math.round( 1000 * lg.Kms/lgTot.Kms ) / 10;
			tr.lastChild.classList.add("nombre");
			tr.lastChild.classList.add("pourcent");
		} else {
			tr.lastChild.setAttribute("colspan", "2");
		}
		tr.appendChild( document.createElement('td') ).textContent = lg.NbOr;
		tr.lastChild.classList.add("nombre");
//		tr.appendChild( document.createElement('td') ).textContent = Math.round( 1000 * lg.NbOr/lgTot.NbOr ) / 10;
//		tr.lastChild.classList.add("nombre");
//		tr.lastChild.classList.add("pourcent");
		
		
		tr.appendChild( document.createElement('td') ).textContent = lg.TotCout;
		tr.lastChild.classList.add("nombre");
		tr.lastChild.classList.add("td-euro");
		if( lg.VehicleID == null ) {
			tr.appendChild( document.createElement('td') ).textContent = Math.round( 1000 * lg.TotCout/lgTot.TotCout ) / 10;
			tr.lastChild.classList.add("nombre");
			tr.lastChild.classList.add("pourcent");
		} else {
			tr.lastChild.setAttribute("colspan", "2");
		}
		
		tr.appendChild( document.createElement('td') ).textContent = lg.CoutKm;
		tr.lastChild.classList.add("nombre");
	}
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

//		return visuPdf( './php/pdfStatVehicle.php?dateInf=' + f["dateInf"].value
//			+ '&dateSup=' + f["dateSup"].value 
//			+ '&typeVehicule=' + ( ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque' )
//			+ '&typeEdit=' + typeEdit
//			);
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
	
    document.getElementById('a_vehicule').addEventListener('click', function() {
		loadVehicules( )
    });

	document.forms["frm_nav"].addEventListener('change', function(e) {
		return switchVehicle( this.typeElement );
	});

	document.forms["form-or"].addEventListener('submit', function(event) {
		event.preventDefault();
		
		return afficheStat( event.target );
	});
	
    document.getElementById('a_vehicule').addEventListener('click', function() {
		loadVehicules( )
    });
	
    document.getElementById('a_impDetail').addEventListener('click', function() {
		return editStat( document.forms["form-or"], 'detail' );
    });
	
    document.getElementById('a_impSynthese').addEventListener('click', function() {
		return editStat( document.forms["form-or"], 'synthese' );
    });
	
	loadVehicules( );
	switchVehicle( document.forms["frm_nav"].typeElement );
	
	return;
});
