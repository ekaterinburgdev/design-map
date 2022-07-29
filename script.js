ymaps.ready(init);

async function init() {
    const myMap = new ymaps.Map('map', {
        center: [56.838011, 60.597465],
        zoom: 15,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });

    const objectManager = new ymaps.ObjectManager({
        clusterize: false,
        gridSize: 32,
        clusterDisableClickZoom: true
    });

    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);
    myMap.controls.add('zoomControl');

    const response = await fetch(`/api/map`);
    const objects = await response.json();

    console.debug(objects);

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
            properties: {
                iconCaption: `${name} (${type})`,
                balloonContent: `
                        <h3>${name}</h3>

                        <p>Улица: ${street}</p>
                        <p>Тип: ${type}</p>
                        <p>Описание: ${description}</p>
                        <p>Дата: ${new Date(date).toLocaleDateString('ru')}</p>
                        ${images?.map(x => `<br><img src="${x}" alt="" style="max-width: 100%" />`)}
                        `,
                hintContent: street
            }
        }
    })
    objectManager.add(mapItems);
}