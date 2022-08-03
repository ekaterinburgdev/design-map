const MAP_OBJECTS_TYPES = {
	'Логотип': 'orange',
	'Навигационные стелы': 'yellow',
	'Таблички ОКН': 'olive',
	'Таблички ЧО': 'gray',
	'Обыные адресные таблички': 'violet',
	'Фризы остановок': 'pink',
	'Светофор': 'lightBlue',
	'Исторические адресные таблички': 'black'
}

const map = ymaps.ready(init);

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
	const filter = document.createElement('div');
	filter.classList.add('filter');

	let toggleMapObject = (type) => {
		let filteredValues =
			[...document.querySelectorAll('.checkbox__input')]
				.filter(input => input.checked)
				.map(input => input.name)
				
		objectManager.setFilter(object => filteredValues.includes(object.options.preset))
	}

	let renderFilterItem = (type) => {
		const label = document.createElement('label');
		label.classList.add('checkbox');

		const input = document.createElement('input');
		input.classList.add('checkbox__input');
		input.type = 'checkbox';
		input.name = getOptionsPresetName(type);
		input.checked = true;
		input.addEventListener('input', () => toggleMapObject(type))

		const labelText = document.createElement('span');
		labelText.classList.add('checkbox__caption');
		labelText.innerHTML = type;

		label.appendChild(input);
		label.appendChild(labelText);

		filter.appendChild(label);
		return label;
	}

	for (const type of Object.keys(MAP_OBJECTS_TYPES)) {
		filter.appendChild(renderFilterItem(type));
	}

	document.body.appendChild(filter);
}

function getOptionsPresetName(type) {
	return `islands#${MAP_OBJECTS_TYPES[type]}CircleDotIcon`
}