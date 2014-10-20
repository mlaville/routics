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
	var imgData =
	'data:image/jpeg;base64,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';

	var imgTm = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAwADADASIAAhEBAxEB/8QAHAAAAgMAAwEAAAAAAAAAAAAABQYCBAcAAQMI/8QAPBAAAQMCAwQFCAgHAAAAAAAAAQIDBAURAAYHEiFBURMUFSKiFjFhcoKRlOJERmJjgaGxwRdDUnGS4fD/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIEAwX/xAAkEQABBAIBAgcAAAAAAAAAAAABAAIDERITMQQhIiNBUVKB8P/aAAwDAQACEQMRAD8A+jM9Z5k0ardnw227oTda1o29/K1xhfGplY+4+G+fAnVVVs4yh/b9BillDL8zMNQ6tGshCBtOuqHdbT+5PAY2MYzCyvEn6ifeWMKZP4lVnkx8N8+Iq1MrI4MfDfPj1kSdP6E91FqFKr01J2Fqb3p2uV7hPuBxFmRp9XnuoOwpVAmqVsIW5uTtcr3KfeBhUz4p5TcbBf76XgrVGsDhH+F+fDDkDPsiuVfs6Y23dSboWhGxv5EXP/DGb50y5My5UeqyrLQsbTLyR3XE/sRxH+sXdIFXztHHoP6YHsZjYRBPNuDHlS1ZXbPMlP2UnBx6QrL+kMdURRblVd4hxxJsoI717H1Uge0cLWrk+RA1KefiSHI8hpCFtuINik78W63q1VallpqnRmTCnrBRLlIO4p+74gq48uHMSLLQFTyxsshJopey8vpcwUyOhIIXMZQE87rAtiOZldDmGpx1AWRMeQRw3LUMAWpb8eQh9h1bTzawttxJ3pUDcEekEYL1+tsV1Lc5+P1erlWzKLSbMyBbc6P6VcCPMfOOIx1y7rGACyvVPzclWYtG5Spii5LozwDbijdRR3bXPqqI9kYAaOLvn2On7Cjgq+DlfRiS3MHRza0+no21DvBPd849VJPtDC9oi9t6jxk3/krP5pxxJ8JW1o82O+aVTXh3Y1Llpv8AR2z+a8K+XKz2RWItSENib1de30L99lXu8x4g77EDccaJrzkTM1Rzb23RIqZbbrKW1oJsUlJJB8WM58hNQh9X/HiWvFUqmgkMhcAtFfqGl+ZlGVIkyKBNXdTrZSUpJ4m9lIP4EE8scYqOl+WVCXHlSK/NRZTbYSVJB4G+ylA/EkjljPPIbUO1vJ7x46ORtQyLeT3jwZD3Rrk5w7q1nXN1RzRVTOnlLaUApYjoN0Mp5A8SeJ4+gAAGtA3SvU6Km/0Z0+JGFg5C1CP1f8eNH0EyHmamZu7brcVMRtplTaEA3Ktogkn/ABGEXCqThhk2hzgv/9k=';

	var imgPolinux = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAPAEMDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAwQFAAYC/8QAKRAAAgICAQQCAQMFAAAAAAAAAQIDBAUREgAGITETIgcUI0EVFjJRgf/EABkBAQACAwAAAAAAAAAAAAAAAAEABQIDBP/EAB4RAAEDBQEBAAAAAAAAAAAAAAABAhEDEiExYQSR/9oADAMBAAIRAxEAPwDp8VIZO6qGDhxWPmrDCQ2BDBiKj2JpBjln4h3hclnceyGP26co5PBZUZCDFYuJpqdKzYeU46i8Y+KOVlcD9CpMRKRAljG25QAp1vqPTt9vnOVMvL3FjfhbDxUZ6ri1HKpNAVpByWu6gg8iCOQOh1QF7seAWZaGQxsFqxXniaRrFgqWljmj58Vx68QBMRwQop4JsbG+rJHULU1MJ9MMnrtqxPlsFiQmN7d/XXstNTEj4WoF0Fr8AdReADIx2Bvz/Oh09ZpXq2TnpWa3bEKV4RPNPJgoFWNCwUFkMHyAlmUaKb+wbXE8uo2DuYTF4THV4O9MQl2lkZriSCtbKjksATW4PJBiJII169+etj72HoTGWt3nhQWXg6yU7UiOuwdMjVyrDYB8g+QD7A6q/Vmq6zXBSR3Jf1DHw/JbxfbqMLU1RoxhqZZZIgnPeota+40QT6P/AGocFnjBfsJiu25IKFizXsyJhapCNBGXYn9nemAIU/70DrY3Eky+OloS0Zu9sLNFLM07tLSsvJ8jceTCQ1y4J4LvR8689FPcMBew39/4sGy1hpuNW0BIZwBLsCv5DcV8egQCNHrRD+iMTRXIIjNPV7YjiVqodzhaxCixEZUJAhJ0FU70Cd+gelslLbx/xrZx/bYlfZ+JMPTchfHFyREV03tdHyNN/iykjfL454a8Mne2FeOuysqvSstyKjSc91/3Ao+oD7ABIGgddBuX8VcRFt98YucozsHkguM+2PJvsYNkE7OidbZj7Y7If0hy/wCSo4Y+7H+CvXrq9KnKUghWJAz1YmYhVAA2xJ8D+et0P8gXKV7ud58faS3XWrUhEyIyq7R14420HAbXJT7A63XSmhP/2Q==';
	
	var doc = new jsPDF('l'),
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
			doc.rect(marge, h - delta, lgCol1, 6, 'FD'); // filled square with red borders
//			doc.rect(marge, h - delta, lgCol1, 6); 
			doc.text(marge+1, h, unEltTr.firstElementChild.textContent);
			
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
			
				doc.text(gauche + .5 , h, cell.firstElementChild.textContent);
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
