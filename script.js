const MAP_OBJECTS_TYPES = {
	'Логотипы и айдентика': 'darkOrange',
	'Навигационные стелы': 'olive',
	'Таблички ОКН': 'lightBlue',
	'Таблички ЧО': 'darkBlue',
	'Обычные адресные таблички': 'orange',
	'Фризы остановок': 'gray',
	'Светофор': 'brown',
	'Исторические адресные таблички': 'darkGreen',
	'Уличная мебель': 'violet',
	'Памятные таблички': 'black',
	'Транспорт': 'yellow',
	'Настенные таблички': 'green'
}

const loader = document.querySelector('[data-loader]');

async function init() {
	const myMap = new ymaps.Map('map', {
		center: [56.838011, 60.597465],
		zoom: 15,
		controls: []
	});

	const objectManager = new ymaps.ObjectManager({
		clusterize: false,
		gridSize: 64,
		clusterDisableClickZoom: true
	});

	myMap.geoObjects.add(objectManager);

	const response = await fetch(`/api/map`);
	const objects = await response.json();

	loader.remove();

	const mapItems = objects.map(({
		name,
		description,
		type,
		coords,
		street,
		images,
		date
	}, i) => {
		return {
			type: 'Feature',
			id: `${type}_${name}_${i}`,
			geometry: {
				type: 'Point',
				coordinates: coords.split(', ')
			},
			options: {
				preset: getOptionsPresetName(type)
			},
			properties: {
				balloonContent: `
					<div class="balloon">
						<p class="balloon__name">${name}</p>
						${type ?
						`<p class="balloon__type">${type}</p>` : ''}
						${street ?
						`<address class="balloon__address">${street}</address>` : ''}
						${description ?
						`<p class="balloon__description">${description}</p>` : ''}
						${date ?
						`<p class="balloon__date">${new Date(date).toLocaleDateString('ru')}</p>` : ''}
						${images?.map(x => `<br><img src="${x}" alt="" style="max-width: 100%" />`).join('<br />')}
					</div>
					`,
				hintContent: `
					<b>${name}</b>
					<br />
					${street}
				`
			}
		}
	})
	objectManager.add(mapItems);
	initMapFilter(objectManager);
}

function initMapFilter(objectManager) {
	const objectsList = objectManager.objects.getAll();
	const filter = document.createElement('div');
	filter.classList.add('filter');

	let getNumberOfObjectsByType = (type) => {
		return objectsList.filter(object => object.id.includes(type)).length
	}

	let filterMapObjects = () => {
		let filteredValues =
			[...document.querySelectorAll('.checkbox__input')]
				.filter(input => input.checked)
				.map(input => input.name)
				
		objectManager.setFilter(object => filteredValues.includes(object.options.preset))
	}

	let renderFilterItem = (type, numberOfType) => {
		const label = document.createElement('label');
		label.classList.add('checkbox');

		const input = document.createElement('input');
		input.classList.add('checkbox__input');
		input.type = 'checkbox';
		input.name = getOptionsPresetName(type);
		input.checked = true;
		input.addEventListener('input', () => filterMapObjects(type))

		const labelText = document.createElement('span');
		labelText.classList.add('checkbox__caption');
		labelText.innerText = type;

		const labelTextCounter = document.createElement('span');
		labelTextCounter.classList.add('checkbox__caption-counter');
		labelTextCounter.innerText = numberOfType;

		label.appendChild(input);
		label.appendChild(labelText);
		labelText.appendChild(labelTextCounter);

		filter.appendChild(label);
		return label;
	}

	for (const type of Object.keys(MAP_OBJECTS_TYPES)) {
		const numberOfObjects = getNumberOfObjectsByType(type);

		if (numberOfObjects) {
			const filterItem = renderFilterItem(type, numberOfObjects);
			filter.appendChild(filterItem);
		}
	}

	document.body.appendChild(filter);
}

function getOptionsPresetName(type) {
	return `islands#${MAP_OBJECTS_TYPES[type]}CircleDotIcon`
}