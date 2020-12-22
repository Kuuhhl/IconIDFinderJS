//wrapper function to remove element from DOM
function removeElement(id) {
	var elem = document.getElementById(id)
	return elem.parentNode.removeChild(elem)
}

function get_JSON(url) {
	return fetch(url)
		.then(function (response) {
			if (response.status !== 200) {
				console.log(
					'Looks like there was a problem. Status Code: ' +
						response.status
				)
				return
			}

			// Examine the text in the response
			return response.json().then(function (data) {
				return data
			})
		})
		.catch(function (err) {
			console.log('Fetch Error :-S', err)
		})
}
function parse_JSON_background(searchQuery) {
	let backgrounds
	get_JSON(
		'http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json'
	).then((data) => {
		backgrounds = data
		var listOfResults = []
		for (index in backgrounds) {
			background = backgrounds[index]
			if (
				background.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			) {
				backgroundDict = {
					backgroundTitle: background.name,
					backgroundImageLink:
						'http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes' +
						background.splashPath.match('(?<=splashes).*'),
					backgroundId: background.id,
					backgroundDescription: background.description,
				}
				listOfResults.push(backgroundDict)
			}
		}
		populate_answers_background(listOfResults)
	})
}
function parse_JSON_icon(searchQuery) {
	let icons
	get_JSON(
		'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-icons.json'
	).then((data) => {
		icons = data
		var listOfResults = []
		for (index in icons) {
			icon = icons[index]
			if (icon.title.toLowerCase().includes(searchQuery.toLowerCase())) {
				iconDict = {
					iconTitle: icon.title,
					iconImageLink: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${icon.id}.jpg`,
					iconReleaseYear: icon.yearReleased,
					iconId: icon.id,
				}
				try {
					iconDict['iconDescription'] =
						icon.descriptions[0]['description']
				} catch (e) {
					console.log(
						`Icon ${icon.title} doesn't have a description!`
					)
				}
				listOfResults.push(iconDict)
			}
		}
		populate_answers_icon(listOfResults)
	})
}
function populate_answers_icon(listOfResults) {
	let div = document.createElement('div')
	div.setAttribute('id', 'searchResults')

	let ul = document.createElement('ul')
	for (index in listOfResults) {
		icon = listOfResults[index]

		iconTitle = icon.iconTitle
		iconImageLink = icon.iconImageLink
		iconReleaseYear = icon.iconReleaseYear
		iconId = icon.iconId
		iconDescription = icon.iconDescription
		li = document.createElement('li')
		li.innerHTML = `
		<li>
		<header>	
		<h2>${iconTitle}</h2>
		</header>

		<header>
		<h3>ID: </h3>
		<p>${iconId}</p>
		</header>

		<header>
		<h3>Releaseyear:</h3>
		<p>${iconReleaseYear}</p>
		</header>
		<header>
		<h3>Description: </h3>
		<p>${iconDescription}</p>
		</header>

		<a><img src=${iconImageLink} alt=${iconTitle}/></a>
		<br>
		<button onclick="window.open('${iconImageLink}','_blank');" type="button">Open image in new window</button>
		<button onclick="copyToClipboard(${iconId});" type="button">Copy ID to clipboard</button>
		</li>`
		ul.appendChild(li)
	}
	div.appendChild(ul)
	document.body.appendChild(div)
	document.getElementById('searchResults').scrollIntoView()
}
function populate_answers_background(listOfResults) {
	let div = document.createElement('div')
	div.setAttribute('id', 'searchResults')
	let ul = document.createElement('ul')
	for (index in listOfResults) {
		background = listOfResults[index]

		backgroundTitle = background.backgroundTitle
		backgroundImageLink = background.backgroundImageLink
		backgroundId = background.backgroundId
		backgroundDescription = background.backgroundDescription
		if (backgroundDescription == null) {
			backgroundDescription = ' - '
		}
		li = document.createElement('li')
		li.innerHTML = `
		<li>
		<header>	
		<h2>${backgroundTitle}</h2>
		</header>

		<header>
		<h3>ID: </h3>
		<p>${backgroundId}</p>
		</header>

		<header>
		<h3>Description: </h3>
		<p>${backgroundDescription}</p>
		</header>

		<a><img src=${backgroundImageLink} alt=${backgroundTitle}/></a>
		<br>
		<button onclick="window.open('${backgroundImageLink}','_blank');" type="button">Open image in new window</button>
		<button onclick="copyToClipboard(${backgroundId});" type="button">Copy ID to clipboard</button>
		</li>`
		ul.appendChild(li)
	}
	div.appendChild(ul)
	document.body.appendChild(div)
	document.getElementById('searchResults').scrollIntoView()
}
function searchSubmit(type) {
	//TRUE: icon; FALSE: background
	let searchQuery = document.getElementById('searchQuery').value
	document.getElementById('searchQuery').value = ''
	try {
		removeElement('searchResults')
	} catch {
		console.log('First search')
	}
	if (type == true) {
		parse_JSON_icon(searchQuery)
	} else {
		parse_JSON_background(searchQuery)
	}
}
function copyToClipboard(Id) {
	window.prompt('To copy, press CTRL+C: ', Id)
}

window.onscroll = function () {
	scrollFunction()
}
function scrollFunction() {
	if (
		document.body.scrollTop > 20 ||
		document.documentElement.scrollTop > 20
	) {
		topBtn.style.display = 'block'
	} else {
		topBtn.style.display = 'none'
	}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	document.body.scrollTop = 0
	document.documentElement.scrollTop = 0
}
