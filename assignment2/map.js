mapboxgl.accessToken = 'pk.eyJ1IjoiaGFveXVhbmt1YW5nIiwiYSI6ImNtNzJyYmlhaDBkdHkydHE5dW1xMHhmbm8ifQ.i98uq_FQJpAUnNfpywxrnw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/haoyuankuang/cm6sl8xi0016h01ry70s211rw',
    zoom: 10,
    center: [-74, 40.725],
    maxZoom: 15,
    minZoom: 8,
    maxBounds: [[-74.45, 40.45], [-73.55, 41]]
});



map.on('load', function () {
    let layers = map.getStyle().layers;
    let firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': 'turnstileData',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'data/turnstileData.geojson'
        },
        'paint': {
            'circle-color': ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                -1, 'rgb(10, 28, 0)',
                -0.7, 'rgb(44, 91, 0)',
                -0.4, 'rgb(255, 247, 9)',
            ],
            'circle-stroke-color': 'rgb(255, 255, 255)',
            'circle-stroke-width': 0.8,
            'circle-radius': ['interpolate', ['exponential', 2], ['zoom'],
                10, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                    -1, 10,
                    -0.4, 1
                ],
                15, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                    -1, 25,
                    -0.4, 12
                ]
            ],
        }
    }, firstSymbolId);


    
    map.addLayer({
        'id': '1_4MilePoints_walk_to_parks——service_area',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/1_4MilePoints_20250212.geojson'
        },
        'paint': {
            'fill-color': 'rgb(255, 242, 0)',
            'fill-opacity': 0.1,
            'fill-outline-color': 'rgb(255, 255, 255)',
            'fill-outline-width': 0.3
        }
    }, 'turnstileData');

    // Add the new layer for Bicycle Parking data
    map.addLayer({
        'id': 'bicycleParking_points',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'data/Bicycle_Parking_20250212.geojson' // Ensure this path is correct
        },
        'paint': {
            'circle-color': 'rgb(37, 134, 154)', // Change this color as needed
            'circle-radius': 2
        }
    }, 'turnstileData'); // Move this layer before '1_4MilePoints_20250212'
});

// Create the popup
map.on('click', 'turnstileData', function (e) {
    let entriesDiff = e.features[0].properties.ENTRIES_DIFF;
    let entries_06 = e.features[0].properties.ENTRIES_06;
    let entries_20 = e.features[0].properties.ENTRIES_20;
    let stationName = e.features[0].properties.stationName;
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4 style="color:grey;">' + stationName + '</h4>'
            + '<p style="color:grey;"><b>Friday, March 6th:</b> ' + entries_06 + ' entries<br>'
            + '<b>Friday, March 20th:</b> ' + entries_20 + ' entries<br>'
            + '<b>Change:</b> ' + Math.round(entriesDiff * 1000) / 10 + '%</p>')
        .addTo(map);
        
});
// Change the cursor to a pointer when the mouse is over the turnstileData layer.
map.on('mouseenter', 'turnstileData', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'turnstileData', function () {
    map.getCanvas().style.cursor = '';
});


var toggleableLayerIds = ['turnstileData', '1_4MilePoints_walk_to_parks——service_area', 'bicycleParking_points'];


for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function(e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}