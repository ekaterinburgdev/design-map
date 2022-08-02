ymaps.ready(init);

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

	objectManager.objects.options.set('preset', 'islands#greenDotIcon');
	objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
	myMap.geoObjects.add(objectManager);

	const response = await fetch(`/api/map`);
	const objects = await response.json();

	const types = {
		'Логотип': 'orange',
		'Навигационные стелы': 'yellow',
		'Таблички ОКН': 'olive',
		'Таблички ЧО': 'gray',
		'Обыные адресные таблички': 'violet',
		'Фризы остановок': 'pink',
		'Светофор': 'lightBlue',
		'Исторические адресные таблички': 'black'
	}

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
			id: name + i,
			geometry: {
				type: 'Point',
				coordinates: coords.split(', ')
			},
			options: {
				preset: `islands#${types[type]}CircleDotIcon`
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
}