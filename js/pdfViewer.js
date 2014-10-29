/**
 * pdfViewer.js
 */
 
function visuPdf( url ) {
	var divPdf = document.getElementById('divFondPdf'),
		btClose = divPdf.appendChild( document.createElement('button') ),
		objPdf = divPdf.appendChild( document.createElement('object') );
		
	btClose.setAttribute('type', 'button');
	btClose.setAttribute('class', 'close');
	btClose.textContent = 'X';
	btClose.addEventListener('click', function(e) {
		divPdf.style.display='none';
		while (divPdf.firstChild) {
		  divPdf.removeChild(divPdf.firstChild);
		}
	});	
	objPdf.setAttribute('type', 'application/pdf');
	objPdf.setAttribute('data', url);
	
	return divPdf.style.display = 'block';
}
