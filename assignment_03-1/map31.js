mapboxgl.accessToken = 'pk.eyJ1IjoiaGFveXVhbmt1YW5nIiwiYSI6ImNtN2NhYWZuZDBvYW8ycnE4OXF1b2Z6ZXgifQ.NJu5ySndWQQfetxImL1Owg';
const map31 = new mapboxgl.Map({
    container: 'map31',
    style: 'mapbox://styles/haoyuankuang/cm6sl8xi0016h01ry70s211rw',
    center: [0, 0],
    zoom: 1.5
});

map31.on('load', function () {
    map31.setProjection('mercator');  

    map31.addSource('uhc-data', {
        type: 'geojson',
        data: './data/dieeet_clean.geojson'
    });

    map31.addLayer({
        id: 'calories-layer',
        type: 'fill',
        source: 'uhc-data',
        paint: {
            'fill-color': ['interpolate', ['linear'],
                ['coalesce', ['get', 'calories'], 0], // 处理 null 值
                0, 'rgb(255, 228, 225)',
                4000, 'rgb(193, 10, 0)'
            ],
            'fill-opacity': 0.7
        }
    });

    map31.on('click', 'calories-layer', function (e) {
        var properties = e.features[0].properties;
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <div style="color: grey; font-size: 14px;">
                    <strong>${properties.country}</strong><br>
                    Calories: ${properties.calories}
                </div>
            `)
            .addTo(map31);
    });
});

