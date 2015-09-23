/**
 * pdfStatOr.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       20/09/2015
 * @version    0.1
 * @revision   $0$
 *
 * @date revision   
 *
 * Génère le pdf des statistique OR
 * 
 * Ajax : 
 * aucun appel
 *
 * A Faire
 * - Extraire les données personnalisées
 * - Numérotation des pages
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
function pdfStat( uneTable ) {
	// You'll need to make your image into a Data URL
	// Use http://dataurl.net/#dataurlmaker
	var imgData = document.getElementById('dataUrl').value,
		imgTm = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAwADADASIAAhEBAxEB/8QAHAAAAgMAAwEAAAAAAAAAAAAABQYCBAcAAQMI/8QAPBAAAQMCAwQFCAgHAAAAAAAAAQIDBAURAAYHEiFBURMUFSKiFjFhcoKRlOJERmJjgaGxwRdDUnGS4fD/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIEAwX/xAAkEQABBAIBAgcAAAAAAAAAAAABAAIDERITMQQhIiNBUVKB8P/aAAwDAQACEQMRAD8A+jM9Z5k0ardnw227oTda1o29/K1xhfGplY+4+G+fAnVVVs4yh/b9BillDL8zMNQ6tGshCBtOuqHdbT+5PAY2MYzCyvEn6ifeWMKZP4lVnkx8N8+Iq1MrI4MfDfPj1kSdP6E91FqFKr01J2Fqb3p2uV7hPuBxFmRp9XnuoOwpVAmqVsIW5uTtcr3KfeBhUz4p5TcbBf76XgrVGsDhH+F+fDDkDPsiuVfs6Y23dSboWhGxv5EXP/DGb50y5My5UeqyrLQsbTLyR3XE/sRxH+sXdIFXztHHoP6YHsZjYRBPNuDHlS1ZXbPMlP2UnBx6QrL+kMdURRblVd4hxxJsoI717H1Uge0cLWrk+RA1KefiSHI8hpCFtuINik78W63q1VallpqnRmTCnrBRLlIO4p+74gq48uHMSLLQFTyxsshJopey8vpcwUyOhIIXMZQE87rAtiOZldDmGpx1AWRMeQRw3LUMAWpb8eQh9h1bTzawttxJ3pUDcEekEYL1+tsV1Lc5+P1erlWzKLSbMyBbc6P6VcCPMfOOIx1y7rGACyvVPzclWYtG5Spii5LozwDbijdRR3bXPqqI9kYAaOLvn2On7Cjgq+DlfRiS3MHRza0+no21DvBPd849VJPtDC9oi9t6jxk3/krP5pxxJ8JW1o82O+aVTXh3Y1Llpv8AR2z+a8K+XKz2RWItSENib1de30L99lXu8x4g77EDccaJrzkTM1Rzb23RIqZbbrKW1oJsUlJJB8WM58hNQh9X/HiWvFUqmgkMhcAtFfqGl+ZlGVIkyKBNXdTrZSUpJ4m9lIP4EE8scYqOl+WVCXHlSK/NRZTbYSVJB4G+ylA/EkjljPPIbUO1vJ7x46ORtQyLeT3jwZD3Rrk5w7q1nXN1RzRVTOnlLaUApYjoN0Mp5A8SeJ4+gAAGtA3SvU6Km/0Z0+JGFg5C1CP1f8eNH0EyHmamZu7brcVMRtplTaEA3Ktogkn/ABGEXCqThhk2hzgv/9k=',
		imgPolinux = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAPAEMDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAwQFAAYC/8QAKRAAAgICAQQCAQMFAAAAAAAAAQIDBAUREgAGITETIgcUI0EVFjJRgf/EABkBAQACAwAAAAAAAAAAAAAAAAEABQIDBP/EAB4RAAEDBQEBAAAAAAAAAAAAAAABAhEDEiExYQSR/9oADAMBAAIRAxEAPwDp8VIZO6qGDhxWPmrDCQ2BDBiKj2JpBjln4h3hclnceyGP26co5PBZUZCDFYuJpqdKzYeU46i8Y+KOVlcD9CpMRKRAljG25QAp1vqPTt9vnOVMvL3FjfhbDxUZ6ri1HKpNAVpByWu6gg8iCOQOh1QF7seAWZaGQxsFqxXniaRrFgqWljmj58Vx68QBMRwQop4JsbG+rJHULU1MJ9MMnrtqxPlsFiQmN7d/XXstNTEj4WoF0Fr8AdReADIx2Bvz/Oh09ZpXq2TnpWa3bEKV4RPNPJgoFWNCwUFkMHyAlmUaKb+wbXE8uo2DuYTF4THV4O9MQl2lkZriSCtbKjksATW4PJBiJII169+etj72HoTGWt3nhQWXg6yU7UiOuwdMjVyrDYB8g+QD7A6q/Vmq6zXBSR3Jf1DHw/JbxfbqMLU1RoxhqZZZIgnPeota+40QT6P/AGocFnjBfsJiu25IKFizXsyJhapCNBGXYn9nemAIU/70DrY3Eky+OloS0Zu9sLNFLM07tLSsvJ8jceTCQ1y4J4LvR8689FPcMBew39/4sGy1hpuNW0BIZwBLsCv5DcV8egQCNHrRD+iMTRXIIjNPV7YjiVqodzhaxCixEZUJAhJ0FU70Cd+gelslLbx/xrZx/bYlfZ+JMPTchfHFyREV03tdHyNN/iykjfL454a8Mne2FeOuysqvSstyKjSc91/3Ao+oD7ABIGgddBuX8VcRFt98YucozsHkguM+2PJvsYNkE7OidbZj7Y7If0hy/wCSo4Y+7H+CvXrq9KnKUghWJAz1YmYhVAA2xJ8D+et0P8gXKV7ud58faS3XWrUhEyIyq7R14420HAbXJT7A63XSmhP/2Q==',
		
		doc = new jsPDF('l'),
		eltTr = uneTable.querySelector('thead tr'),
		listCell = eltTr.querySelectorAll('th'),
		nbJour = listCell.length,
		listTr = uneTable.querySelectorAll('tbody tr'),
		nbLg = listTr.length,
		impair = true,
		h = 26,
		delta = 4,
		marge = 8,
		lgCol = 44,
		lgCol1 = 92,
		gauche = marge + lgCol1,
		largJour = 6,
		dateEdition = new Date,
		tabMois = Date.monthNames(),
		strMois = 'Edité le ' 
			+ Date.dayNames()[dateEdition.getDay()] + ' '
			+ dateEdition.getDate() + ' '
			+ Date.monthNames()[ dateEdition.getMonth() ] + ' '
			+ dateEdition.getFullYear() + ' à '
			+ dateEdition.getHours() + 'h' + dateEdition.getMinutes(),
		pageNum = 1,
		
		docHeader = function() {
			doc.setFont("helvetica");
			doc.setFontType("normal");
			doc.setFontSize(10);
			doc.text(8, 8, "+");
			
			doc.addImage(imgTm, 'JPEG', 4, 4, 9.6, 9.6);
			doc.addImage(imgData, 'JPEG', 260, 4, 25.5, 6.3);
			
			doc.setFontType("bold");
			doc.setFontSize(16);
			doc.text(72, 12, 'Coûts Kilométriques');
			
			return;
		},
		docFooter = function( ) {

			doc.setFontSize(8);
			doc.setFont("times");
			doc.setFontType("italic");
			doc.text( 220, 200, strMois );
			doc.addImage( imgPolinux, 'JPEG', 4, 200, 13.4, 3 );
			
			return;
		},
		tableHeader = function( unEltTr ) {
			
			var cellEntete = function( arrLib ) {
				doc.setFillColor(150,150,255);
				doc.rect(gauche, h - delta, lgCol, 12, 'FD'); // filled square with red borders
				doc.text(gauche + 2, h, arrLib[0]);
				doc.text(gauche + 2, 5 + h, arrLib[1]);
				gauche += lgCol;
			};
			
			doc.setFontSize(12);
			doc.text(72, 18, 'du 01/08/2015 au 31/08/2015');

			doc.setFont("helvetica");
			doc.setFontType("bold");
			doc.setFontSize(12);
			doc.setFillColor(150,150,255);
			doc.rect(marge, h - delta, lgCol1, 12, 'FD'); // filled square with red borders
			doc.text(marge + 1, h, 'Parc'); // libellé du mois
			
			gauche = marge + lgCol1;

			[ ['Km Parcourus', 'pendant la période'],
			  ['Nb OR', ''],
			  ['Coût Total', ''],
			  ['Coût KM', ''] ].forEach(cellEntete);

			h += 6;
			
			return;
		},
		tableRow = function( unElmtTr ) {
			var listCell = unElmtTr.querySelectorAll('td'),
				bSousTotal = unElmtTr.classList.contains('sousTotal'),
				fontSize = bSousTotal ? 12 : 10,
				arrayBgColor = bSousTotal ? [ 200,200,255 ] : ( impair ? [ 255, 255, 255 ] : [ 230,230,230 ] ),
				tableCellNumber = function( unNumber ) {
					doc.setFillColor( 100, 100, 100 );
					doc.rect( gauche, h - delta, lgCol, 6, 'FD' );
					doc.text( gauche + 2, h, ('     ' + unNumber).slice(-8) );
					gauche += lgCol;
				};
				
			h += 6;
			// Test le changement de page
			if( h > 186 ) {
				docFooter( );
				doc.addPage();
				pageNum++;
				docHeader( );
				h = 26;
				tableHeader( uneTable.querySelector('thead tr') );
				h += 6;
			}
			
			/**
			 * Dessine chaque cellule de la ligne 
			 */
			// Cellule Parc
			doc.setFont("helvetica");
			doc.setFontSize(fontSize);
			gauche = marge;
			
			doc.setDrawColor( 100, 100, 100 );
			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect( gauche, h - delta, lgCol1 / 3, 6, 'FD' );
			doc.text( gauche+1, h, ( ( bSousTotal ? '' : '      ' ) + listCell[1].textContent.toUpperCase() ).slice(-12) );
			gauche += lgCol1 / 3;

			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect( gauche, h - delta, lgCol1 / 3, 6, 'FD' ); 
			doc.text( gauche+1, h, ( '      ' + listCell[2].textContent.toUpperCase() ).slice(-12) + (bSousTotal ? ' %' : '') );
			gauche += lgCol1 / 3;

			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect( gauche, h - delta, lgCol1 / 3, 6, 'FD' ); 
			doc.text( gauche+1, h, listCell[3].textContent.capitalize() );
			gauche += lgCol1 / 3;

			doc.setFont("courier");
			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect( gauche, h - delta, lgCol, 6, 'FD' ); 
			doc.text( gauche+2, h, ( '          ' + new Number(listCell[4].textContent) ).slice(bSousTotal ? -8 : -12) );
			gauche += lgCol;

			if(bSousTotal){
				doc.setFontSize(9);
				doc.setTextColor(200, 100, 100);
				doc.text( gauche+1 - lgCol/2 , h, ( '       ' + new Number(listCell[5].textContent).toFixed(1) ).slice(-8) + ' %');
				doc.setTextColor(0, 0, 0) 
				doc.setFontSize(fontSize);
			}
			
			doc.setFont("courier");
			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect( gauche, h - delta, lgCol, 6, 'FD' ); 
			doc.text( gauche+1, h, ( '   ' + new Number(listCell[6].textContent) ).slice(-5) );
			gauche += lgCol;

			doc.setFont("courier");
			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect( gauche, h - delta, lgCol, 6, 'FD' ); 
			doc.text( gauche+1, h, ( '        ' + new Number(listCell[7].textContent).toFixed(2) ).slice(-10) );
			gauche += lgCol;

			if(bSousTotal){
				doc.setFontSize(9);
				doc.setTextColor(200, 100, 100);
				doc.text( gauche+1 - lgCol/2, h, ( '    ' + new Number(listCell[8].textContent).toFixed(1) ).slice(-6) + ' %');
				doc.setTextColor(0, 0, 0) 
				doc.setFontSize(fontSize);
				
					doc.setFont("courier");
					doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
					doc.rect( gauche, h - delta, lgCol, 6, 'FD' ); 
					doc.text( gauche+1, h, ( '        ' + new Number(listCell[9].textContent).toFixed(7) ).slice(-12) );

			} else {
				doc.setFont("courier");
				doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
				doc.rect( gauche, h - delta, lgCol, 6, 'FD' ); 
				doc.text( gauche+1, h, ( '        ' + new Number(listCell[8].textContent).toFixed(7) ).slice(-12) );
				gauche += lgCol;
			}
			/* Fin de ligne */
			impair = bSousTotal ? true : !impair;
		};
		
	docHeader( );
	tableHeader( uneTable.querySelector('thead tr') );
	
	for( var ligne = 0 ; ligne < nbLg ; ligne++ ) {
		var eltTr = listTr[ligne];

		if( eltTr.style.display != 'none' ) {
			tableRow(eltTr);
		}
	}
	
	docFooter( );

	return doc.output('datauristring');
}
