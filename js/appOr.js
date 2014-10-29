AppOr = {
	typeVehicule : 0,
	vehicule : null
};

// VehicleView
function ajoutVehicule( objet, unUl ) {
	var	li_vehicule = unUl.appendChild( document.createElement("li") ),
		a_vehicule = li_vehicule.appendChild( document.createElement("a") );
		
    span_idTransics = document.createElement("span");
	span_idTransics.classList.add("idTransics");
    span_idTransics.textContent = objet.VehicleTransicsID;
	
    span_numParc = document.createElement("span");
	span_numParc.classList.add("numParc");
//    span_numParc.textContent = objet.VehicleExternalCode;
    span_numParc.textContent = objet.VehicleID;
		
    span_immat = document.createElement("span");
    span_immat.textContent = objet.LicensePlate;
	
    div_km = document.createElement("span");
	div_km.classList.add("km");
    div_km.textContent = ("000000" + objet.CurrentKms).substr(-7);
	
	a_vehicule.setAttribute('href', '#')
    a_vehicule.appendChild(span_idTransics);
    a_vehicule.appendChild(span_numParc);
    a_vehicule.appendChild(span_immat);
    a_vehicule.appendChild(div_km);
    a_vehicule.addEventListener('click', function(e) {
		clicklistVehicle( e.currentTarget );
   });
	return;
}

function ajoutTracteur( objet ) {
	return ajoutVehicule( objet, document.getElementById('ul_tracteur') );
}

function ajoutRemorque( objet ) {
	return ajoutVehicule( objet, document.getElementById('ul_remorque') );
}

function loadVehicules( ) {
	$.post("./php/getVehicule.php", { },
//        $.post("./php/getRemoteVehicule.php", { "dateRef": "" },
		function(data){
			data.result.forEach( ajoutTracteur );
	}, "json");
	
	$.post("./php/getTrailers.php", { },
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
		if( AppOr.typeVehicule == i ) {
//				arrUl[i].style.removeProperty('display');
			arrUl[i].style.display = 'block';
		} else {
			arrUl[i].style.display = 'none';
		}
	}
	
	return false;
}

//*[@id="ul_vehicule"]