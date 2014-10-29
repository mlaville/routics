function clicklistVehicle( a ) {
	var spans = a.querySelectorAll('span'),
		idTransics = a.querySelector('.idTransics').textContent,
		numParc = spans[1].textContent,
		li = a.parentNode,
		listLi = li.parentNode.getElementsByTagName('li'),
		cmptLi = listLi.length;
		
	// Affichage du logo dans la legende du fieldset
	document.getElementById('img-typeElement').setAttribute("src", ( AppOr.typeVehicule == 0 ) ? "./img/tracteur.png" : "./img/citerne.png");
	
	document.getElementById('idTransics').textContent = idTransics;
	document.getElementById('num-parc').value = numParc;
	document.getElementById('immat').textContent = spans[2].textContent;
	document.getElementById('km-vehicule').textContent = spans[3].textContent;
	figcaption = document.getElementById('km-vehicule').parentNode.getElementsByTagName('figcaption')[0];
	figcaption.textContent = ( document.forms["frm_nav"].typeElement[0].checked ) ? 'compteur' : 'parcourus';
	
	document.getElementById('fs_visu').style.opacity = 1;

	// Vide le formulaire de saisie
	afficheOr( null );
	
	// "marquage" du véhicule séléctionné
	for (var i = 0 ; i < cmptLi ; i++) {
		var liCourrant = listLi[i];
		if ( liCourrant == li ) {
			liCourrant.classList.add("selected");
		} else {
			liCourrant.classList.remove("selected");
		}
	}
	
	document.getElementById('marque').textContent = '';
	$.post("./php/getDetailVehicule.php", { "typeVehicule": AppOr.typeVehicule, "idVehicule": idTransics },
		function(data){
			if(data.success){
				document.getElementById('marque').textContent = data.marque;
			}
	}, "json");
	
	// Affichage des saisie d'OR
	listOrVehicule( numParc )

	return idTransics;
}


function afficheOr( unOr ) {
	var f = document.forms["form-or"];
	
	if(unOr == null){
		// Vide le formulaire de saisie
		[ f["idOr"], f["dateOR"], f["kmOR"], f["lieuOR"], f["numFactOR"], f["montantOR"], f["descriptOr"] ]
			.forEach( function( el ) { el.value = '' } );
	} else {
		f["idOr"].value = unOr.IdOR;
		f["dateOR"].value = unOr.or_date;
		f["kmOR"].value = unOr.or_km;
		f["lieuOR"].value = unOr.or_prestataire;
		f["numFactOR"].value = unOr.or_numFacture;
		f["montantOR"].value = unOr.or_montant;
		f["descriptOr"].value = unOr.or_description;
	}
	return;
}

function afficheListOr( unTab ) {

	var tbody = document.getElementById('table-or').getElementsByTagName('tbody')[0],
		tfoot = document.getElementById('table-or').getElementsByTagName('tfoot')[0],
		tot = 0;
	// retire tous les enfants d'un élément
	while (tbody.firstChild) {
	  tbody.removeChild(tbody.firstChild);
	}
	
	for( var i = 0 ; i < unTab.length ; i++ ) {
		var tr = tbody.appendChild( document.createElement('tr') ),
			or = unTab[i],
			tdAction = document.createElement('td'),
			aEdit = tdAction.appendChild( document.createElement('a') ),
			aSup = tdAction.appendChild( document.createElement('a') );
		
		aEdit.appendChild( document.createElement('img') ).setAttribute('src', "./img/b_edit.png");
		aEdit.setAttribute('href', "#");
		aEdit.addEventListener('click', function(e) {
			/* Recherche l'Id de la ligne */
			tds = e.currentTarget.parentNode.parentNode.getElementsByTagName('td');
			afficheOr( {"IdOR" : tds[0].textContent,
					"or_date" : tds[1].textContent,
					"or_km" : tds[4].textContent,
					"or_prestataire" : tds[2].textContent,
					"or_numFacture" : tds[3].textContent,
					"or_description" : tds[5].textContent,
					"or_montant" : tds[6].textContent
			});
		});
		aSup.appendChild( document.createElement('img') ).setAttribute('src', "./img/b_drop.png");
		aSup.setAttribute('href', "#");
		aSup.addEventListener('click', function(e) {
			var trContent = e.currentTarget.parentNode.parentNode.getElementsByTagName('td');
			if( confirm( "Supprimer l'Ordre de Réparation ?\n\n" + trContent[5].textContent ) ){
			/* Recherche l'Id de la ligne */
				supprimeOr( trContent[0].textContent );
			}
			return;
		});
		
		tr.appendChild( document.createElement('td') ).textContent = or.IdOR;
		tr.appendChild( document.createElement('td') ).textContent = or.or_date;
		tr.appendChild( document.createElement('td') ).textContent = or.or_prestataire;
		tr.appendChild( document.createElement('td') ).textContent = or.or_numFacture;
		tr.appendChild( document.createElement('td') ).textContent = or.or_km;
		tr.appendChild( document.createElement('td') ).textContent = or.or_description;
		tr.appendChild( document.createElement('td') ).textContent = or.or_montant;
		tr.appendChild( tdAction );
		
		tot += or.or_montant * 100;
	}
	trfoot = tfoot.getElementsByTagName('tr')[0];
	trfoot.getElementsByTagName('td')[1].textContent = ( tot > 0 ) ? tot / 100 : '';
	
	return;
}

function listOrVehicule( unNumParc ) {
	$.post("./php/crudOR.php", { cmd: 'load', idVehicule: unNumParc },
		function(data){
			afficheListOr( data.result );
	}, "json");
	
	return;
}

//
// Validation des saisie
//
function validOr(f){

	var param = { idVehicule: f["num-parc"].value,
				idTransics: f["idTransics"].value,
				dateOR: f["dateOR"].value,
				kmOR: f["kmOR"].value,
				lieuOR: f["lieuOR"].value,
				numFactOR: f["numFactOR"].value,
				montantOR: f["montantOR"].value,
				descriptOr: f["descriptOr"].value
			},
		idOr = f["idOr"].value;
			
	f["validOr"].disable = true;
		
	if( idOr > 0 ) {
		param["cmd"] = 'update';
		param["idOr"] = idOr;
	} else {
		param["cmd"] = 'create';
	}

	$.post("./php/crudOR.php", param,
		function(d){
			listOrVehicule( param.idVehicule );
			afficheOr( null );
			f["validOr"].disable = false;
	}, "json");

	return false;
}

function supprimeOr( unIdentOr ){

	var param = { cmd: 'delete', idOr: unIdentOr };

	$.post("./php/crudOR.php", param,
		function(d){
			listOrVehicule( document.getElementById('num-parc').textContent );
	}, "json");

	return false;
}


window.addEventListener('load', function() {

    document.getElementById('a_vehicule').addEventListener('click', function() {
		loadVehicules( )
    });

	document.forms["frm_nav"].addEventListener('change', function(e) {
		return switchVehicle( this.typeElement );
	});
	
	$( "#dateOR" ).datepicker({
		onSelect: function(dateText, inst) {
			var noeud = document.getElementById('kmOR'),
				ajaxLoad = noeud.nextSibling;
			
			noeud.value = '';
			while( ajaxLoad.nodeName != 'DIV' ){
				ajaxLoad = ajaxLoad.nextSibling;
			};
			ajaxLoad.style.display = 'inline-block';
		
			if( document.forms["frm_nav"].typeElement[0].checked ) {
			
				$.post("./php/getKmCompteur.php", {
						"idVehicule": document.getElementById('idTransics').value,
						"dateOr": dateText 
					},
					function(data){
						
						ajaxLoad.style.display = 'none';
						noeud.value = data.km;
						
						if(data.km != null) {
						do {
							noeud = noeud.previousSibling;
						} while(noeud.nodeType != Node.ELEMENT_NODE);
						noeud.getElementsByTagName('span')[0].textContent = 'compteur';
						} else {
						}
						return;
					}, "json"
				);
			} else {
				$.post("./php/selectKmParcourus.php", {
						"numParc": document.getElementById('num-parc').value,
						"dateOr": dateText 
					},
					function(data){

						ajaxLoad.style.display = 'none';
						noeud.value = data.result.KmParcourus;
						do {
							noeud = noeud.previousSibling;
						} while(noeud.nodeType != Node.ELEMENT_NODE);
						noeud.getElementsByTagName('span')[0].textContent = 'parcourus depuis le ' + data.result.DateInit;
						
						return;
					}, "json"
				);
			}
			document.forms["form-or"]["lieuOR"].focus();
			
		}
	});
	
	document.forms["form-or"].addEventListener("keypress", 
		function(e){
			if(e.keyCode==13) {
				var noeud = e.target.nextSibling,
					nextInput = false;
				
				e.preventDefault();
				while( !nextInput ) {
					noeud = noeud.nextSibling;
					if( noeud.nodeName == 'INPUT' || noeud.nodeName == 'TEXTAREA' ) {
						noeud.focus();
						nextInput = true;
					}
				};
			}
		},
		false
	);
	document.forms["form-or"].addEventListener('submit', function(event) {
		event.preventDefault();
		
		return validOr( event.target );
	});

	loadVehicules( );
	switchVehicle( document.forms["frm_nav"].typeElement );
	
	return;
});
