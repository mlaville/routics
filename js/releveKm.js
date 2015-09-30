function listReleveKm( unArray ) {
	var tbody = document.getElementById('table-km').getElementsByTagName('tbody')[0];
	
	return false;
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
