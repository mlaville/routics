/**
 * pdfHeuresDues.js
 * 
 * @auteur     marc laville
 * @Copyleft 2014
 * @date       30-05-2014
 * @version    0.1
 * @revision   $0$
 *
 * @date revision  24/06/2014 Ajout colonne et modif entete
 *
 * Génère le pdf du tableau des heures dues
 * 
 * Ajax : 
 * aucun appel
 *
 * A Faire
 * Fonction de dessin d'une cellule (à extraire de la bouclr forEach)
 * - Extraire les données personnalisées (image)
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
function pdfHeuresDues( uneTable ) {
	// You'll need to make your image into a Data URL
	// Use http://dataurl.net/#dataurlmaker
	var imgData =
	'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAA/APsDASIAAhEBAxEB/8QAGwABAQEBAQEBAQAAAAAAAAAAAAkIBwUEBgP/xAA3EAABAwMDAgUDAgUDBQEAAAABAgMEBQYHAAgRCRITGSFXlSIx1BQVFiMyQVEKYYEXJENiceH/xAAbAQEAAwEBAQEAAAAAAAAAAAAAAwQFBgIHAf/EADMRAAIBAgUBBwQBAwUBAAAAAAECEQMEAAUGEiExExUiQVJhkRQXMpJRQmJxBxYjscHR/9oADAMBAAIRAxEAPwC/GmmmmGGmmmmGGmmmmGGmmmmGON77t3tL2Q7fZecp9oJr7rdSiwYVFVVBDMp11fqA74bnBS2lxfHYeewj0+4/QbT86VHcxt5tfO9TsY225csFUtFGVUDKLDfirSg+KW2+/uSlK/6B6LH3++sJf6jLJj6bVxpg+nKcWuo1OXWJTDaee7wkJYZH+SSX3uB/t/8ANfiMqZ56vOxXEFkZOqVQtOj2BAjU6mRLHhUZqQ3CaaYSltmW44yHyXAg962ZBHeT2lsFA13thpehmGnLd1ZEr1qjbWdiJVfDsAEgktzO32nkA8DmOqK+X6nr0yrvQoUQXVFUwzHdvJMEAJ5bo84MEitGmstZ06n9g4d2K2zu+RbJlVG9KdH/AIbtlcoDumuNlTiFrHr4TRSvuUBye1I4SVjjL1Pzf1zMj4dlbvLev22aNbaoqqtEs1q3I3iOQkAL/lB2K6vsUgFQDknxSPseSjnGtdL39dHes6UVVzTmo0AuOqiAxMeZiPfGxc6qy+k1NKCPWeogqBaayQh6MZKgA+QmZ8sVG01nPpyb9afvc27ysoXNRolErtuylRLqhxFqMdC0thwSGgoqWlpaCSEqJKSlae5Xb3Hh3SR3obqN6G4DJdwZGyI5MsKiMk0Oi/ssJhMZcmUpUdPjNR0uuFthpafqWSe4FQJ9RG2msypm7FWE+mALyfUYULAMlvLoPfEi6nyypTtHpS4uSQkAf0/kSCRwv9USR/GN+6awFgje1uZzz1d7rwHb2S+MYWo/UEyaGxRoS0rEVpMY8yfB8Ycy1d/o5/6/b014e4/qL7wNwm7eds86dD1Lpf8ADktbdavCZDZkl1xklt8/zm3W0R0OLCPpaW6tSAUntPaZ10nmTXFOkWQbqQqkkkKiH1kjg+w3e08xC+rcsShVq7XOyqaIAAJdx5IAeR/BO3FGdNSH3J9TTqf7e3YO1fIFdpNOyHEq7b6b1pFHiPCtU94LQ22WHo/hoId9O9DTaiGwkpBClOaI6wW93cFs/wAdY0svC+RFQLyr7jrlXqaaPEkrkNMMttqHhPMrbT4jzwUOxII8Mgeh41OdGZn9RbUkqU2+oLBCGJBCgMWnbwsH/PkQMV11rlfZXLvTqL9OoaoGUAqWJAX8vyJHHO08QxxvDTWQ+otujzds+6e9EvOnX4lnJFRNIpi647AirUqapsOy3QwpnwT3JZeHaGwlPeCAOBr44m/y7tsPTFtDc9uXqyrpvi5ICV0yEuMzBVUpMlbjrCClhtKG224/apSggcpR/dShznJp6/rWYuKRDBqvZKBMs0TIkAbfckH+RHONFtR2FO8FvVDKex7ZiQIRJiGgk7vYA+xxsjTUsZe47reXNhKXvYgXra9FtFqMKuizWrdjdyoDYSpSkeNHcc8JSApfCpQdKSe3glA1rbAfUChZr6eVX3jT6TGpdTt+gVJVbp7PcthqoRGlK7WwSVdjh8NaUkkgOhJJI7jPf6YvrC37YOlQBgjBGkqx6BuB/iRInicQ5bqmwzG6WhsenvUuhddquo6lTJ8oMEAxzGNMaakHt36l/VV3A4rrdhYaYXd95KqKX5F3SaLTIrFBgpSkJZbCmmYy5Dy+8/zu8htCuxBJKm+o5r6ku8q0q5aew/B78K6czP0xlq97zm0+MUxKi8jxlsxmWkIjp8BCh3OOIUkBJBQVAq1fr6GzahdG2NSmXHUB+VUCTUaQNqDpLQSegIIOM6315lFxafVdnVFPyJTgtu2impBO5z1AWYE7iCCMUr01MG8d8HU+6dmS7aqW964rfyBZlyOlmQaVSmYzkUIUPELK24sZQeCSFBLiVtrSCkFKuVJ0x1IepJQ9mGGqJcGPqbDr913q332lEkKUqMGAlClS3QhQUpsBxASlJBWpfoQAoihW0tmS1qCUCtYViQjIZUlfyHIBEdTIAjnyONKhqnLXp12uFaiaIDOtQQQp6EQWBB6CCTMCJIxqbWVdq/UzVun3e3rtktrCYh0uzTUC5eCblL6ZSY8pMdBDAjJCfEKiofzSAEngq1meoboOs1tVxhC3T7hKpQbutCSyhFTtV+lRokumpfPDby1x4jYQpKuxPAW8B4nC0fco9j/TsY7lSLTyZnqsguyqvWo9Lakr57lFtCn3j/j6lPt/8p1sU9MW1hk17e3LpWCAKhRiQKhaD6eVBB5BUg8TjErapuL/ADaxsrRKlE1GLMHQAmkqlvPdw0EceIEc7fOlWmmmuDx3+GmmmmGGmmmmGGmmmmGGmmmmGGmmmmGI79ULO9pTerra8295Li7XxrMoLNZU0lTyWWkyES5DnYjk8jxwkpHqSgD1JA11XrYb2MH5lwhbW2nb5flJvas3LXos5/8AhmaiY3GZR3paaKmu4B9x1aQGue8BB7kjuT3bAX07NrMrLl15qq2N406t3nFfj152fIkSG5Dbym1LSWXnVs8ctp9A2OOOBwPTXl4G6XeznbreyMhY8xNCaqrKeI0uU/JlLYPr9TZlPO+GSCQVI7SQSCSCRr6HQ1Jp1aViXpVC9qo2gbQrP1M8kgBxIImZ5Ajn53cab1G1xfmlVphbskEncWWmBtWOACxQkEGACAQT5YI6sO3vIOF9iu3S16lFeXEtWmSIdw+EpSm2J8hth0BXHKf6kvJCuf7cD761VuH6mmzexdhUmbinK9AqlTrFm/tVtWnTpTbk6O+9FLSUyYyFFcZLQ5Ky4Ej6O0FSlJCtcZExxZWVrTlWRkC3IdVpcxHbJhToyHmnBzzwpCwUqHIHoQft/trOlmdG/YdZV1xbtgYYhPvxHFLbZnS5ktkkpKfqZkyHGlcc8juQeCARwQCKiaiynMbJKOao806j1Bs2w/aNuYNJBHPAInj3xaOnM2yq+NfKHSGpJSipulezAVWXaDPA5BgTzOMkbObXvnat0ZcyZxrFLlQ5d8RyiioUghYiPobhNSeDzwCZDiwSBykJI9CDr1OlFux2q7Len9dWRb5ynRlXXMuCXJctJman90krbabbjMoj895QsjnxQnw0+Ie5Q7FcUvuzHVmXtYszG1zW/FmUSfEMaVTpLCXGnWj90qSoEKH+eeedcAsHpH7IccxKxHt/EEMLrNNdgvyHpct51ppxpxpwNOuvrcYKkOKSVMqbUQeCSNT1NVZbmVveLf03Br1EbwbeVQABCT0iPyAMk9BGK9LSWY5ZUsDYVEIt0qL4935VJJcBesk/iSOBEmZGYP8AT72NVLrnZb3MVpJdqNUmt02PNdIUpTqyuVI9SOeSpbBP+f8AHprn3RIzRhjAG4TK9I3G39SLUr81ptmJOuia3Db72ZL/AOrZLzxSlLhWpo9hIKuw8c9p1TrbXtmxLtQx2rGGGrcTTKSuoOzXGBJedKnlhKVKKnnHFn0Qkf1cenpxriF/bDunluyzzdk2p2NCqF22tKis3ciM3OiBt99v9Q14imVtMyFqbUCVfzFAdqVHjtSJqmqMvv7/ADDtabi3rIglQN1NaZAEgmACxg89SB54gTS2ZWOWWISrTNzSqu53EhajPuYiQJkKJHh6Anyxi7LeWbE6gnWnx+jFkpFStqhVKnxWKklCg3PagKcmyHUgpB7CoLbST6KCEqHorXq9RO/rLyF1obFszLlzRaHalmv0WNOnVZ0NRkJJ/XKUtZ4CErU6hsrUe0AckgA6/t0h7TtvKPVCyXl20reiRLdtqLUv2FiJEaZaiNvSUxoqEIbASj/tkuD6Rxxz6+vrvHcx06drO7K7419ZhxzHn1WNG8ATW5MmO4tv04StUZ5ouAcegWVdvJ7eO5XOtf5tl+nc3s6Dq3Z07fbxBdXqcluYBMdeg5noIxl2WUZjqTK8xqq69pVuAOdwRkpEQOJIHWOp4g88if3WX3XY53jZmx3tb293fHuKLT6wEz6pSZSXYUmfLW0yy004OUultPdy4klPL3aCSFAdF6/uHqtb23DE71oU13+HbNkvUyUGEfRHStiO3HUoD0SP5KkA8ccrA9OQDrSN01do9PyfamV6TiuFDqdmJZFAEJ1+OzGLbzjySGGXUMc+I4pRJbJUTyok+uuzXxYtp5JtiXZl70GLU6ZOaLcuFNjodadQRwUqQsFKgR6EEEH+41zy6psMvOXrYU222zOzB4ly/BMj+2Y48MxzEnov9r5hf1MwqX9Rd1wiohSYQKDxBifFE8+KJ8MwI8P49t2FgWJVqp1y6s1akykNRTajM2VIeajOIDf6VdLZqinkoCT2KQWe1KfuAnXS85Y8trY30ZK5YNkZrg3pGyXerIpdwUtLbTLzLnhKdQgNvOhYCILiVfX91EEDgg6noXRn2F0K6WbrZwxDddYkl8MSZkx9hR5J4LD0hbKk+v8ASpsp/wBtdR3FbKcB7oLEoWNsq2iJlHtx8O0mE3Nkx0MEN+GOBHea9Aj0APIA9ABq7c6vsatxSAeq1IVFdwUorIU7gBsAJM9SWAI8sULPR1/Qo1CUpLUFJkpsHrNDMpUt4yQog9ApIMc8Y5r0esEUrC2xi0J4paWqpdUdVcqb62QlxZkHloH+/AZS0P8Agaxnt0vaxds/W2yLV90Ndj0JupzayKLWa274cZlyS8h6O4t5zgNoVHC0BZPaCoJ5H9qv2ha1Fsa06ZZVtw0x6dSKezCgR0kkNstICEJHJJ9EpA9STrl+5nYnts3aLiysy45hVKVEUPBm8uMvpSAr6A8wtt3s+oko7+wnglJIBGRaakoDOLyvdKxp3IdTtjcoYyCJ4MDiJA+Ma1zpiuchsrW2ZRVtmpuJnYzIOQY5hiSZAn254n11h9xNm75s0Y62j7V61FvGXCqLrkyp0RYkRVyn0oCENPJJQ4ltpK3HFpJQkHgq5QsJ+Pq60am4d3tYCfyGHnLLt62qLHkPKYU4hbEOef1QCR/WrwuwlI5JCkj+41QvbTsG2xbUJUip4exnBp86SpXiT1F1+R2kI5R4z63HQjlCT2BfZyO7t7vXX6HcjtUwluutJuzs02TEq8ZhzvjKfSpLjCuQSW3G1JcbJ44JQtJIJB5BIOjaaty3LLmzpW1Njb0d8zG9jUBDNx4RE+ET04J/iheaRzLNra9q3dVBXrhAoWSiLTYMBJG47o8Rjg8geWMc9YvqC7bK1s+mYVw1lygXXWrzeitBu26o3LRAhtOoecceU0VJaJ8NLYbUUrPiE8EJVruHR8xX/wBKun9YzD7fbJr7D1bkn/P6lwrbP2H/AIQ1/wDuvmc6OmxRdiosAYdiJiJqf65TiJ01Ly3AgoAU+JAeWkBSuEKcKElRISCSTpS0LVotjWnTLKtuGmPTqPT2YUCOkkhtlpAQhIJJJ4SkD1JOsu/zbJ00/wB2ZeH5q72Z9vPhgDwk+3H8iZ5407HKM6qaiGZ5iacLS2KqFuCWBJ8QEzzz/BiOJPo6aaa5LHYYaaaaYYaaaaYYaaaaYYaaaaYYaaaaYYaaaaYYaaaaYYazjvuzvnvHd+YkxHtofh/xRel0yVSGalHS5Fdp8SKpx5Lx7FrQ33ONKJb7XFBBSlaCrkaO1ircTBz1lXqNrqe2+u0uPW8PYzbejR7iiLfp0mbU33Aph9LSg6lK47aVd7ZCwptP9Q5SdjIqVGpf7q23Yiux3fjIUhd3tvKg+2MbP6tanljLRJ3sVUbfy8TANtnjcF3ETxI5x+mwvkXeRhfeJRtu+5jMFMv+jX7b1RqVBqTVrsUmTSX4SkKWyER1KQ4ypDqfValr7gPVIB7+Z17qVXxiDaXP3CXDXaQ9WMiZZqtMsB6txFmFSqOw+plDz7cNsPPttIZWfpCnFF1HJP211DF22jdPWa3eO5/cPedBqGTKjZEug2dRaGzJj0WgNqCiA14iVvqLjiW3HHFoK/ukBSUp1490bCco2/tVwrb+Hrho8G/8PNolRP10Z52m1B95hSJrDqUdjoadWtXK0p8QAngAnkby1sjNZfqdjH/jVyo2qeajEjavhHFJGZV58TAGecBqOeim/wBL2iqe0ZA7bmXw01UHcx3SzVaiKzQIQGIheLbNOoDXYW5y0cYNb0IGaIF81FVNqUNzGTtAlUZYaW41KZcS0lDyCsdi0rPIBSQP6iOzW1lPevuZz/li1MQZigWjY1m3zFpkOuIt6JOkERmGxMiMh5AQkLWpa1vul1ST4aW2wAs6/WbYsF7tahlc5w3WXvRIy6XT3YdBsiwnJ8ejhawnumPiSvxZLxH0pS4FNtjlSB3K5T7W3XAGWcMbN7isp2TSFZDuFyv1aVLacf8A0aqpNefcaUSWw72J7mgfo7uEngH7n8zG+yqmz1KCU+0Cqo4Rl3F924AUqaHaq7SQkENB3cnDLcvzaqEpV6lQUy5Y8urbRTKkEtVqONzPIG8EFNw2npw3G26zd5eWIrk3j3jl2LRcYWfd9ansU+FQIbsu5qSy8tEeCH3EBMVvuQhpK0JdecU44VLQPD1wyX1d8tIinNiN+FqrqKEpmDCcbE8v9vWkAAwRVXGfHDhRyS53dningK8Pg63ND2XQah06ouyqqVFMR1dis0yVOhBSkonBCXFPJCuwrHjgq4V29w9D28+nKrI23dQ3I1ZoWPM75KtGg2dQpLDtQq2P26nErNwtsKT2syHnVpRGS72hThjEKPqhPCVFQu2l/p/t6xdE2q8LwgmkPMTSqbmYyT+LDgKwUmKN3YahNrQKPU3OpZuXMVDyFJWrT2KklR1UgEurMFxsOz7iYvC0qXdsaMtluqU5iW2y5z3IS42lYSeQPUBXH2GsI7tN3W5Wh7uKvh6fusYwHbzC48ayqjU8dRqnAuXuaSt59yoSj4UdTa1dpSexCUqR3Eq5J36htLbQabHCUp4SB/YawleW2DqUO2rV9uC71xze9mVN59hu7chUypTa+zEkL7iFcKVGkKZ7j4RdJB7E89g4SjnsheyW+qPV2ARADwYBPVSyOhZYAhlMgmIIkdJnlO+bL6dNC5aRuZJEwOhCujhWPMowIIEypIOvsAz8uVLEFDmZ1VQl3UqKRVX7aW8YT5ClBDrfjIQpPejtUU8cBSiEkp4Osq9RrezcWIMuwcV0De7aGJobFNTJlvQ7QduWtPSjwfBkRvBUzDYLbiFoUT4iz6j6edd/xNjzMeD42McH2e9QpliW3Z37fctTqaJJqj0lhhDcf9P2fyW0FSVFfeVHghKQOOTwG6NqW9nF+4vIV2bcpeNZFFyVXEVKoV27KNOcq1KUpPhlDBjKDT6Gh9baH1BPcogpSCpS5svGWjNqlao6FYZkEAAnftAIZKir4ZYKVbiB1PEF82ZnJUo00cPKK5ksQNgYkFWRn5hCVZTJJmAZ6H0vdz1+7ncP3HVL4v2JeKbbu56k0u9otBNLNcjhll5LzkUgBlYLpQQlKRwlPpzypX3dSnOucsDYVptewmmRTxOrzca5bviW6Ku7bVNDa1uzkwyQHe0pT3FXKUp7iUklJHh7YcBbrdrG1GfZtsVS067kKqZAlVSoVevtzDFlMSJSfFkONspSvxyyn0QCGwrj61JHr7m7nFu8aTlCkZi2rZCozqWaIqk1axb3RMdokoKcW4JgRFV4jclPISFpTyU+hWkDtX6uO7G1B21I0+y3cA/idqqeQFAAcnjwBQZlQojHm07zTTxo1RU7Xb1H5AM7AQWdiWRRJG8sREOzGceD07cp7gMpvTrhuTdfaeZLGlU8OQ7ihW8ikVSm1ALSDEdix0eGlstnv4eKHgVD6Sgg61PrJu2bbXuhw3T8r7hayxYIyhfkOMmnUGkU+ZGoEd6MHg2t37ynysula1qHeTykK4+rWo7UXcjlr01y8RD/AHdUBk1X9vQtMf8AU9g8XwgslQR393aFEnjjkk6o579NUvWegylfCPCFHO2Twqqpg+HcqqGiY5xeyH6qlZinXVg3iMsWPAMDlmdhu/IKWYrMTxGPv0001iY3cNNNNMMNNSw88Hdf7fY8+Jn/AJunng7r/b7HnxM/83VHvC29/jH0n7U6u9KfuMVP01LDzwd1/t9jz4mf+bp54O6/2+x58TP/ADdO8Lb3+MPtTq70p+4xU/TUsPPB3X+32PPiZ/5unng7r/b7HnxM/wDN07wtvf4w+1OrvSn7jFT9NSw88Hdf7fY8+Jn/AJunng7r/b7HnxM/83TvC29/jD7U6u9KfuMVP01LDzwd1/t9jz4mf+bp54O6/wBvsefEz/zdO8Lb3+MPtTq70p+4xU/TUsPPB3X+32PPiZ/5unng7r/b7HnxM/8AN07wtvf4w+1OrvSn7jFT9ePR7As+g3dWL7pFuwo9Xr6Y6avUGYjaHpYYQUNBxxKQpztSSB3E8D0HA1Mjzwd1/t9jz4mf+bp54O6/2+x58TP/ADdehmVBZgnng/8Af/mPJ/0n1Y0Sicf3D/5ip+mpYeeDuv8Ab7HnxM/83Tzwd1/t9jz4mf8Am6894W3v8Y9fanV3pT9xip+mpYeeDuv9vsefEz/zdPPB3X+32PPiZ/5uneFt7/GH2p1d6U/cYqfpqWHng7r/AG+x58TP/N088Hdf7fY8+Jn/AJuneFt7/GH2p1d6U/cYqfpqWHng7r/b7HnxM/8AN088Hdf7fY8+Jn/m6d4W3v8AGH2p1d6U/cYqfpqWHng7r/b7HnxM/wDN088Hdf7fY8+Jn/m6d4W3v8YfanV3pT9xip+mpYeeDuv9vsefEz/zdPPB3X+32PPiZ/5uneFt7/GH2p1d6U/cYqfpqWHng7r/AG+x58TP/N088Hdf7fY8+Jn/AJuneFt7/GH2p1d6U/cYqfpqWHng7r/b7HnxM/8AN088Hdf7fY8+Jn/m6d4W3v8AGH2p1d6U/cYqfpqWHng7r/b7HnxM/wDN088Hdf7fY8+Jn/m6d4W3v8YfanV3pT9xj//Z';

	var imgWt = 'data:image/jpeg;base64,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';

	var imgPolinux = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAPAEMDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAwQFAAYC/8QAKRAAAgICAQQCAQMFAAAAAAAAAQIDBAUREgAGITETIgcUI0EVFjJRgf/EABkBAQACAwAAAAAAAAAAAAAAAAEABQIDBP/EAB4RAAEDBQEBAAAAAAAAAAAAAAABAhEDEiExYQSR/9oADAMBAAIRAxEAPwDp8VIZO6qGDhxWPmrDCQ2BDBiKj2JpBjln4h3hclnceyGP26co5PBZUZCDFYuJpqdKzYeU46i8Y+KOVlcD9CpMRKRAljG25QAp1vqPTt9vnOVMvL3FjfhbDxUZ6ri1HKpNAVpByWu6gg8iCOQOh1QF7seAWZaGQxsFqxXniaRrFgqWljmj58Vx68QBMRwQop4JsbG+rJHULU1MJ9MMnrtqxPlsFiQmN7d/XXstNTEj4WoF0Fr8AdReADIx2Bvz/Oh09ZpXq2TnpWa3bEKV4RPNPJgoFWNCwUFkMHyAlmUaKb+wbXE8uo2DuYTF4THV4O9MQl2lkZriSCtbKjksATW4PJBiJII169+etj72HoTGWt3nhQWXg6yU7UiOuwdMjVyrDYB8g+QD7A6q/Vmq6zXBSR3Jf1DHw/JbxfbqMLU1RoxhqZZZIgnPeota+40QT6P/AGocFnjBfsJiu25IKFizXsyJhapCNBGXYn9nemAIU/70DrY3Eky+OloS0Zu9sLNFLM07tLSsvJ8jceTCQ1y4J4LvR8689FPcMBew39/4sGy1hpuNW0BIZwBLsCv5DcV8egQCNHrRD+iMTRXIIjNPV7YjiVqodzhaxCixEZUJAhJ0FU70Cd+gelslLbx/xrZx/bYlfZ+JMPTchfHFyREV03tdHyNN/iykjfL454a8Mne2FeOuysqvSstyKjSc91/3Ao+oD7ABIGgddBuX8VcRFt98YucozsHkguM+2PJvsYNkE7OidbZj7Y7If0hy/wCSo4Y+7H+CvXrq9KnKUghWJAz1YmYhVAA2xJ8D+et0P8gXKV7ud58faS3XWrUhEyIyq7R14420HAbXJT7A63XSmhP/2Q==';
;
	
	var doc = new jsPDF('l'),
		eltTr = uneTable.querySelector('thead tr'),
//		listCell = eltTr.querySelectorAll('th.day'),
//		nbJour = listCell.length,
		listTr = uneTable.querySelectorAll('tbody tr'),
		nbLg = listTr.length,
		impair = true,
		h = 26,
		delta = 5,
		marge = 10,
		lgCol = 15,
		lgCol1 = 36,
		gauche = marge + lgCol1,
		largJour = 6,
		dateEdition = new Date,
		strMois = 'Edité le ' 
			+ Date.dayNames()[dateEdition.getDay()] + ' '
			+ dateEdition.getDate() + ' '
			+ Date.monthNames()[ dateEdition.getMonth() ] + ' '
			+ dateEdition.getFullYear() + ' à '
//			+ dateEdition.getMonth() + ' à '
			+ dateEdition.getHours() + 'h' + dateEdition.getMinutes(),
		pageNum = 1;
		
		docHeader = function(  ) {
			doc.setFont("helvetica");
			doc.setFontType("normal");
			doc.setFontSize(10);
			doc.text(8, 8, "+");
			
			doc.addImage(imgWt, 'JPEG', 4, 4, 9.6, 9.6);
			doc.addImage(imgData, 'JPEG', 260, 4, 25.5, 6.3);
			
			doc.setFontType("bold");
			doc.setFontSize(16);
			doc.text(72, 12, 'Tableau des Heures Dûes Conducteur');
			
			return;
		}
		docFooter = function(  ) {

			doc.setFontSize(8);
			doc.setFont("times");
			doc.setFontType("italic");
			doc.text( 120, 200, 'page ' + pageNum );
			doc.text( 220, 200, strMois );
			doc.addImage( imgPolinux, 'JPEG', 4, 200, 13.4, 3 );
		}
		tableHeader = function( unEltTr ) {
		
			var listCellHead = unEltTr.querySelectorAll('th.day'),
				nbJour = listCellHead.length;
				
			doc.setFontType("bold");
			doc.setFontSize(9);
			doc.setFillColor(150,150,255);
			doc.rect(marge, h - delta, lgCol1, 12, 'FD'); // filled square with red borders
//			doc.rect(marge, h - delta, lgCol1, 6); 
			doc.text(marge+1, h, document.getElementById('span-mois-hd').textContent);
			
			gauche = marge + lgCol1;
			doc.setFontType("normal");

			doc.rect(gauche, h - delta, 2 * lgCol, 12); // filled square with red borders
			doc.text(gauche + 1, h, "Solde mois précéd.");
			doc.text(gauche + 2, 5 + h, "Heures");
			gauche += lgCol;
			doc.text(gauche + 2, 5 + h, "Montant");
			
			doc.setFontSize(8);
			gauche += lgCol;
			doc.rect(gauche, h - delta, lgCol, 12); // filled square with red borders
			doc.text(gauche + 2, h - 1.5, "Prix de ");
			doc.text(gauche + 2, 2.5 + h, "l'Heure");
			doc.text(gauche + 2, 6.5 + h, "Disque");
			
			doc.setFontSize(9);
			gauche += lgCol;
			doc.rect(gauche, h - delta, 3 * lgCol, 12); // filled square with red borders
			doc.text(gauche + 2, h, "Dûes par bouquerod");
			doc.text(gauche + 2, 5 + h, "Heures");
			gauche += lgCol;
			doc.text(gauche + 2, 5 + h, "Ajust.");
			gauche += lgCol;
			doc.text(gauche + 2, 5 + h, "Montant");
			
			gauche += lgCol;
			doc.rect(gauche, h - delta, 2 * lgCol, 12); // filled square with red borders
			doc.text(gauche + 2, h, "Total");
			doc.text(gauche + 2, 5 + h, "Heures");
			gauche += lgCol;
			doc.text(gauche + 2, 5 + h, "Montant");
			
			gauche += lgCol;
			doc.rect(gauche, h - delta, 2 * lgCol, 12); // filled square with red borders
			doc.text(gauche + 2, h, "Dues par chauffeur");
			doc.text(gauche + 2, 5 + h, "Heures");
			gauche += lgCol;
			doc.text(gauche + 2, 5 + h, "Montant");
			
			gauche += lgCol;
			doc.rect(gauche, h - delta, 3 * lgCol, 12); // filled square with red borders
			doc.text(gauche + 3, h, "Prime");
			doc.text(gauche + 2, 5 + h, "Montant   Montant   Montant");
			
			gauche += 3 * lgCol;
			doc.rect(gauche, h - delta, 2 * lgCol, 12); // filled square with red borders
			doc.text(gauche + 2, h, "Solde");
			doc.text(gauche + 2, 5 + h, "Heures Montant");
			
			gauche += 2 * lgCol;
			doc.rect(gauche, h - delta, lgCol, 12); // filled square with red borders
			doc.text(gauche + 2, h, "Prime");
			doc.text(gauche + 2, 5 + h, "a+b");
			
			gauche += 2 * lgCol;
			doc.rect(gauche, h - delta, lgCol / 2, 12); // filled square with red borders
			doc.text(gauche + 2, 5 + h, "%");
			
			h += 6;
			
			return;
		};
	
	docHeader( );
	tableHeader( uneTable.querySelector('thead tr') );
	h += 6;

	
	for( var ligne = 0 ; ligne < nbLg ; ligne++ ) {
		var eltTr = listTr[ligne],
			arrayBgColor = eltTr.style.backgroundColor.arrayRGB(),
			arrayColor = [ 6, 6, 6 ],
			eltIdent, // Ident du Conducteur
			val;
		
		if(eltTr.style.display != 'none') {
			listCell = eltTr.querySelectorAll('td');
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
			
			if(listCell[0].style.color) {
				arrayColor = listCell[0].style.color.arrayRGB().map(function(i) { return +i; });
				doc.setDrawColor( arrayColor[0], arrayColor[1], arrayColor[2] );
			} else {
				doc.setDrawColor(6, 6, 6);
			}
			// Cellule Conducteur
			doc.setFont("helvetica");
			doc.setFontSize(10);
			
			if(arrayBgColor) {
				arrayBgColor = arrayBgColor.map(function(i) { return +i; });
			} else {
				arrayBgColor = impair ? [ 255, 255, 255 ] : [ 230,230,230 ];
			}
			
			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect( marge, h - delta, lgCol1, 12, 'FD' ); 
			eltIdent = listCell[0].firstElementChild; // Nom du Conducteur
			doc.text( marge+1, h, eltIdent.textContent.toUpperCase() );
			eltIdent = eltIdent.nextSibling.nextSibling.nextSibling; // Prénom du Conducteur
			doc.text( marge+1, h + 5, eltIdent.textContent.capitalize() );
			eltIdent = eltIdent.nextSibling; // Coéf du Conducteur
			doc.setFillColor( 200 );
			doc.rect( marge + lgCol1 - 12, h, 11, 3.5, 'F' ); 
			doc.text( marge + lgCol1 - 12, h + 3, eltIdent.textContent.toUpperCase() );

			doc.setFont("courier");
			doc.setFontSize(10);
			gauche = marge + lgCol1;

			[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].forEach( function(element, index, array) {
				var cell = listCell[element],
					valNumber, decal, decimal = 0;
					
				switch(element) {
					case 1 : decimal = 1;
						break;
					case 2 : decimal = 2;
						break;
					case 3 : decimal = 2;
						break;
					case 6 : decimal = 2;
						break;
					case 7 : decimal = 2;
						break;
					case 8 : decimal = 2;
						break;
					case 10 : decimal = 2;
						break;
					case 14 : decimal = 1;
						break;
					case 15 : decimal = 2;
						break;
					case 16 : decimal = 0;
						break;
					default :
						break;
 				}

				doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
				doc.rect(gauche, h - delta, lgCol, 6, 'FD');
				if( cell.firstElementChild.classList.contains('color-red') ) {
					doc.setTextColor(255,0,0);
					doc.setFontType('bold');
					doc.setFontSize(12);
					decal = 0;
				} else {
					doc.setTextColor(0, 0, 0);
					doc.setFontType('normal');
					doc.setFontSize(10);
					decal = 2;
				}
				valNumber = new Number( cell.firstElementChild.value );
				if( valNumber != 0 ) {
					doc.text( gauche + decal, h, ('    ' + valNumber.toFixed(decimal)).slice(-6) );
				}
				doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
				doc.rect(gauche, 6 + h - delta, lgCol, 6, 'FD');
				if( cell.firstElementChild.nextSibling.classList.contains('color-red') ) {
					doc.setTextColor(255,0,0);
					doc.setFontType('bold');
					doc.setFontSize(12);
					decal = -.5;
				} else {
					doc.setTextColor(0, 0, 0);
					doc.setFontType('normal');
					doc.setFontSize(10);
					decal = 2;
				}
				
				valNumber = new Number( cell.firstElementChild.nextSibling.value );
				if( valNumber != 0 ) {
					doc.text( gauche + decal, 6 + h , ('    ' + valNumber.toFixed(decimal)).slice(-6) );
				}
				gauche += lgCol;
			} );
			
			/* colonne 16 */
				var cellOutput = listCell[16].firstElementChild.nextSibling,
					valNumber = Number( cellOutput.value ),
					decal = 0;
					
			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect(gauche, 6 + h - delta, lgCol, 6, 'FD');
			if( cellOutput.classList.contains('color-red') ) {
				doc.setTextColor(255,0,0);
				doc.setFontType('bold');
				doc.setFontSize(12);
				decal = -.5;
			} else {
				doc.setTextColor(0, 0, 0);
				doc.setFontType('normal');
				doc.setFontSize(10);
				decal = 2;
			}
			
			if( valNumber != 0 ) {
				doc.text( gauche + decal, 5 + h , ('    ' + valNumber.toFixed(0)).slice(-5) );
			}
			
			
			h += 12;
			impair = !impair;
		}
	}
	docFooter( );

	return doc.output('datauristring');
}
