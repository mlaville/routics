/**
 * formOr.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       03/05/2015
 * @version    0.5
 * @revision   $0$
 *
 * Gestion des ordres de réparation
 * 
 * @date revision   01/08/2015 Affichage de la card du véhicule
 *
 * Appel  ajax:
 * - ./php/getVehicule.php
 * - ./php/getTrailers.php
 *
 * Note : les appels getVehicule et getTrailers sont parametrés par le dataset de document.body
 *
 * A Faire
 * - gerer les requetes ajax sans JQuery
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
var AppOr = {
		typeVehicule : 0,
		vehicule : null,
		position : new google.maps.LatLng(46.680184,5.5803363),
		carte: new google.maps.Map(
			document.getElementById("googleMap"), {
			center: new google.maps.LatLng(46.680184,5.5803363),
			zoom:12,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		}),
		marker : null,
		changePos : function( pos ) {
			
			AppOr.carte.panTo( pos );
			return AppOr.marker.setPosition( pos );
		}
	};

// VehicleView
function ajoutVehicule( objet, unUl ) {
	var	li_vehicule = document.createElement("li"),
		label_vehicule = li_vehicule.appendChild( document.createElement("label") ),
		input_select = label_vehicule.appendChild( document.createElement("input") ),
		span_idTransics = document.createElement("span"),
		span_numParc = document.createElement("span"),
		span_immat = document.createElement("span"),
		div_km = document.createElement("span");
		
	span_idTransics.classList.add("idTransics");
    span_idTransics.textContent = objet.VehicleTransicsID;
	
	span_numParc.classList.add("numParc");
    span_numParc.textContent = objet.VehicleID;
		
    span_immat.textContent = objet.LicensePlate;
	
	div_km.classList.add("km");
    div_km.textContent = ("000000" + objet.CurrentKms).substr(-7);
	
	input_select.setAttribute('type', 'radio')
	input_select.setAttribute( 'name', ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque' )
	
    label_vehicule.appendChild(span_idTransics);
    label_vehicule.appendChild(span_numParc);
    label_vehicule.appendChild(span_immat);
    label_vehicule.appendChild(div_km);
    input_select.addEventListener('change', function(e) {
		afficheVehicle( objet.VehicleTransicsID, objet.VehicleID, objet.LicensePlate, objet.CurrentKms );
   });
	return unUl.appendChild(li_vehicule);
}

function ajoutTracteur( objet ) {
	return ajoutVehicule( objet, document.getElementById('ul_tracteur') );
}

function ajoutRemorque( objet ) {
	return ajoutVehicule( objet, document.getElementById('ul_remorque') );
}

function loadVehicules( ) {
//	$.post("./php/getVehicule.php", { },
	$.post( document.body.dataset.vehicule, { },
		function(data){
			data.result.forEach( ajoutTracteur );
	}, "json");
	
//	$.post("./php/getTrailers.php", { },
	$.post( document.body.dataset.trailers, { },
		function(data){
			data.result.forEach( ajoutRemorque );
	}, "json");
	
	return;
}

function switchVehicle( rd ) {
	var arrUl = document.getElementById('div_vehicule').getElementsByTagName('ul');

	for( i = 0 ; i < rd.length ; i++ ) {
		if( rd[i].checked ) {
			AppOr.typeVehicule = i;
		}
	}
	
	for( i = 0 ; i < arrUl.length ; i++ ) {
		arrUl[i].style.display = ( AppOr.typeVehicule == i ) ? 'block' : 'none';
	}
	
	return false;
}

//*[@id="ul_vehicule"]