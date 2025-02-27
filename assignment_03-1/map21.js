mapboxgl.accessToken = 'pk.eyJ1IjoiaGFveXVhbmt1YW5nIiwiYSI6ImNtN2NhYWZuZDBvYW8ycnE4OXF1b2Z6ZXgifQ.NJu5ySndWQQfetxImL1Owg';
const map21 = new mapboxgl.Map({
    container: 'map21',
    style: 'mapbox://styles/haoyuankuang/cm6sl8xi0016h01ry70s211rw',
    center: [0, 0],
    zoom: 1.5
});

map21.on('load', function () {
    map21.setProjection('equalEarth');  // 🔥 使用 Equal Earth 投影

    map21.addSource('uhc-data', {
        type: 'geojson',
        data: './data/dieeet_clean.geojson'
    });

    map21.addLayer({
        id: 'calories-layer',
        type: 'fill',
        source: 'uhc-data',
        paint: {
            'fill-color': [
                'match',
                ['get', 'quantiles'],
                'Low', '#fee8c8',
                'Medium', '#fdbb84',
                'High', '#e34a33',
                '#ccc'
            ],
            'fill-opacity': 0.7

        }
    });
    

    map21.on('click', 'calories-layer', function (e) {
        var properties = e.features[0].properties;
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <div style="color: grey; font-size: 14px;">
                    <strong>${properties.country}</strong><br>
                    Calories: ${properties.calories}
                </div>
            `)
            .addTo(map21);
    });
    
});
