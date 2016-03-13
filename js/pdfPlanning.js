/**
 * pdfPlanning.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013-14
 * @date       06-05-2014
 * @version    0.1
 * @revision   $0$
 *
 * @date revision   01/07/2014  Affichage des Vacances et des jous fériés  ascenssion, pentecôte
 *
 * Génère le pdf du plannig
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
function pdfPlanning( uneTable, tabAt ) {
	// You'll need to make your image into a Data URL
	// Use http://dataurl.net/#dataurlmaker
	var imgData = document.getElementById('dataUrl').value,
		imgTm = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAwADADASIAAhEBAxEB/8QAHAAAAgMAAwEAAAAAAAAAAAAABQYCBAcAAQMI/8QAPBAAAQMCAwQFCAgHAAAAAAAAAQIDBAURAAYHEiFBURMUFSKiFjFhcoKRlOJERmJjgaGxwRdDUnGS4fD/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIEAwX/xAAkEQABBAIBAgcAAAAAAAAAAAABAAIDERITMQQhIiNBUVKB8P/aAAwDAQACEQMRAD8A+jM9Z5k0ardnw227oTda1o29/K1xhfGplY+4+G+fAnVVVs4yh/b9BillDL8zMNQ6tGshCBtOuqHdbT+5PAY2MYzCyvEn6ifeWMKZP4lVnkx8N8+Iq1MrI4MfDfPj1kSdP6E91FqFKr01J2Fqb3p2uV7hPuBxFmRp9XnuoOwpVAmqVsIW5uTtcr3KfeBhUz4p5TcbBf76XgrVGsDhH+F+fDDkDPsiuVfs6Y23dSboWhGxv5EXP/DGb50y5My5UeqyrLQsbTLyR3XE/sRxH+sXdIFXztHHoP6YHsZjYRBPNuDHlS1ZXbPMlP2UnBx6QrL+kMdURRblVd4hxxJsoI717H1Uge0cLWrk+RA1KefiSHI8hpCFtuINik78W63q1VallpqnRmTCnrBRLlIO4p+74gq48uHMSLLQFTyxsshJopey8vpcwUyOhIIXMZQE87rAtiOZldDmGpx1AWRMeQRw3LUMAWpb8eQh9h1bTzawttxJ3pUDcEekEYL1+tsV1Lc5+P1erlWzKLSbMyBbc6P6VcCPMfOOIx1y7rGACyvVPzclWYtG5Spii5LozwDbijdRR3bXPqqI9kYAaOLvn2On7Cjgq+DlfRiS3MHRza0+no21DvBPd849VJPtDC9oi9t6jxk3/krP5pxxJ8JW1o82O+aVTXh3Y1Llpv8AR2z+a8K+XKz2RWItSENib1de30L99lXu8x4g77EDccaJrzkTM1Rzb23RIqZbbrKW1oJsUlJJB8WM58hNQh9X/HiWvFUqmgkMhcAtFfqGl+ZlGVIkyKBNXdTrZSUpJ4m9lIP4EE8scYqOl+WVCXHlSK/NRZTbYSVJB4G+ylA/EkjljPPIbUO1vJ7x46ORtQyLeT3jwZD3Rrk5w7q1nXN1RzRVTOnlLaUApYjoN0Mp5A8SeJ4+gAAGtA3SvU6Km/0Z0+JGFg5C1CP1f8eNH0EyHmamZu7brcVMRtplTaEA3Ktogkn/ABGEXCqThhk2hzgv/9k=',
		imgPolinux = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAPAEMDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAwQFAAYC/8QAKRAAAgICAQQCAQMFAAAAAAAAAQIDBAUREgAGITETIgcUI0EVFjJRgf/EABkBAQACAwAAAAAAAAAAAAAAAAEABQIDBP/EAB4RAAEDBQEBAAAAAAAAAAAAAAABAhEDEiExYQSR/9oADAMBAAIRAxEAPwDp8VIZO6qGDhxWPmrDCQ2BDBiKj2JpBjln4h3hclnceyGP26co5PBZUZCDFYuJpqdKzYeU46i8Y+KOVlcD9CpMRKRAljG25QAp1vqPTt9vnOVMvL3FjfhbDxUZ6ri1HKpNAVpByWu6gg8iCOQOh1QF7seAWZaGQxsFqxXniaRrFgqWljmj58Vx68QBMRwQop4JsbG+rJHULU1MJ9MMnrtqxPlsFiQmN7d/XXstNTEj4WoF0Fr8AdReADIx2Bvz/Oh09ZpXq2TnpWa3bEKV4RPNPJgoFWNCwUFkMHyAlmUaKb+wbXE8uo2DuYTF4THV4O9MQl2lkZriSCtbKjksATW4PJBiJII169+etj72HoTGWt3nhQWXg6yU7UiOuwdMjVyrDYB8g+QD7A6q/Vmq6zXBSR3Jf1DHw/JbxfbqMLU1RoxhqZZZIgnPeota+40QT6P/AGocFnjBfsJiu25IKFizXsyJhapCNBGXYn9nemAIU/70DrY3Eky+OloS0Zu9sLNFLM07tLSsvJ8jceTCQ1y4J4LvR8689FPcMBew39/4sGy1hpuNW0BIZwBLsCv5DcV8egQCNHrRD+iMTRXIIjNPV7YjiVqodzhaxCixEZUJAhJ0FU70Cd+gelslLbx/xrZx/bYlfZ+JMPTchfHFyREV03tdHyNN/iykjfL454a8Mne2FeOuysqvSstyKjSc91/3Ao+oD7ABIGgddBuX8VcRFt98YucozsHkguM+2PJvsYNkE7OidbZj7Y7If0hy/wCSo4Y+7H+CvXrq9KnKUghWJAz1YmYhVAA2xJ8D+et0P8gXKV7ud58faS3XWrUhEyIyq7R14420HAbXJT7A63XSmhP/2Q==',
		
		doc = new jsPDF('l'),
		eltTr = uneTable.querySelector('thead tr'),
		listCell = eltTr.querySelectorAll('th.day'),
		nbJour = listCell.length,
		listTr = uneTable.querySelectorAll('tbody tr'),
		nbLg = listTr.length,
		impair = true,
		h = 26,
		delta = 4,
		marge = 10,
		lgCol1 = 40,
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
		
		docHeader = function(  ) {
			doc.setFont("helvetica");
			doc.setFontType("normal");
			doc.setFontSize(10);
			doc.text(8, 8, "+");
			
			doc.addImage(imgTm, 'JPEG', 4, 4, 9.6, 9.6);
			doc.addImage(imgData, 'JPEG', 260, 4, 25.5, 6.3);
			
			doc.setFontType("bold");
			doc.setFontSize(16);
			doc.text(72, 12, 'Planning des Absences');
			
			return;
		}
		docFooter = function(  ) {

			doc.setFontSize(8);
			doc.setFont("times");
			doc.setFontType("italic");
			doc.text( 220, 200, strMois );
			doc.addImage( imgPolinux, 'JPEG', 4, 200, 13.4, 3 );
			
			return;
		}
		tableHeader = function( unEltTr ) {
		
			var listCellHead = unEltTr.querySelectorAll('th.day'),
				nbJour = listCellHead.length;
				
			doc.setFontType("bold");
			doc.setFontSize(10);
			doc.setFillColor(127,127,255);
			doc.rect(marge, h - delta, lgCol1, 6, 'FD');
//			doc.rect(marge, h - delta, lgCol1, 6);
			
			doc.text(marge+1, h, unEltTr.firstElementChild.firstChild.textContent + ' ' + unEltTr.firstElementChild.lastChild.textContent ); // mois année
			
			gauche = marge + lgCol1;
			
			doc.setFontType("normal");
			for( var i = 0 ; i < nbJour ; i++ ) {
				var cell = listCellHead[i],
					cl = cell.classList ;
					largCell = largJour;
					
//				if(cell.dataset.jour == 0) {
				if( cl.contains('ferie') || cell.dataset.jour == 0 ) {
					largCell -= 2;
					doc.setFontSize(8);
					doc.setFillColor(200, 200,255);
					doc.rect(gauche, h - delta, largCell, 6, 'FD'); 
				} else {
					if( cl.contains('vacances') ) {
						doc.setFillColor(197, 217, 0);
						doc.rect(gauche, h - delta, largCell, 6, 'FD'); 
					} else {
						doc.rect(gauche, h - delta, largCell, 6); 
					}
					doc.setFontSize(10);
				}
			
				doc.text(gauche + .5 , h, cell.lastElementChild.textContent); // Jour du mois
				gauche += largCell;
			}
			doc.setDrawColor(200,0,0);
			doc.setFontSize(8);
			for( var i = 0 ; i < tabAt.length ; i++ ) {
				doc.rect(gauche, h - delta, largCell, 6); 
				doc.text(gauche + .5 , h, tabAt[i]);
				gauche += largCell;
			}
			doc.setDrawColor(0,0,0);
//			doc.rect( gauche, h - delta, largCell, 6 );
		
			return;
		};
		
	docHeader( );
	tableHeader( uneTable.querySelector('thead tr') );
	
	rupt = listTr[0].dataset.rupture;

	for( var ligne = 0 ; ligne < nbLg ; ligne++ ) {
		var recapAt = tabAt.reduce(
				function(previousValue, currentValue, index, array){
						if( currentValue )
							previousValue[currentValue] = 0;
						return previousValue;
				}, {}
			);
		eltTr = listTr[ligne];
		listCell = eltTr.querySelectorAll('td.day');
		h += 6;
		// Test le changement de page
		if( h > 186 || rupt != eltTr.dataset.rupture ) {
			docFooter( );
			doc.addPage();
			docHeader( );
			h = 26;
			rupt = eltTr.dataset.rupture;
			tableHeader( uneTable.querySelector('thead tr') );
			h += 6;
		}
		
		// Cellule Conducteur
		doc.setDrawColor(0,0,0);
		doc.setFont("helvetica");
		doc.setFontSize(10);
		if(impair) {
			doc.setFillColor(255,255,255);
		} else {
			doc.setFillColor(230,230,230);
		}
		doc.rect( marge, h - delta, lgCol1, 6, 'FD' ); 
		doc.text( marge+1, h, listTr[ligne].firstElementChild.firstElementChild.textContent.capitalize() );

		// Parcourt les jours
		
		doc.setFont("courier");
		for( var i = 0, gauche = marge + lgCol1 ; i < nbJour ; i++ ) {
			var cell = listCell[i],
				typeAt = cell.dataset.at || '',
				cl = cell.classList ;
				largCell = largJour;
//			if(cell.dataset.jour == 0) {
			if( cl.contains('ferie') || cl.contains('dimanche') ) {
				largCell -= 2;
				doc.setFillColor(200,200,255);
				doc.rect(gauche, h - delta, largCell, 6, 'FD'); 
				doc.setFontSize(8);
			} else {
				doc.setFontSize(10);
				doc.rect( gauche, h - delta, largCell, 6 ); 
				if(impair) {
					doc.setFillColor(255,255,255);
				} else {
					doc.setFillColor(230,230,230);
				}
				doc.rect(gauche, h - delta, largCell, 6, 'FD'); 
			}
		
			doc.text( gauche + 1 , h, typeAt );
			if( typeAt.length ) {
				recapAt[typeAt]++;
			}
			gauche += largCell;
		}
		// Affichage du compte Absences
		doc.setDrawColor(200,0,0);
		for( var i = 0 ; i < tabAt.length ; i++ ) {
			var nbJourAT = recapAt[tabAt[i]];
			doc.rect( gauche, h - delta, largCell, 6 ); 
			doc.text( gauche + .5 , h, nbJourAT > 0 ? (' ' + nbJourAT).slice(-2) : '' );
			gauche += largCell;
		}
		doc.rect( gauche, h - delta, largCell, 6 ); 
		
		impair = !impair;
	}

	return doc.output('datauristring');
}
