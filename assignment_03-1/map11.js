mapboxgl.accessToken = 'pk.eyJ1IjoiaGFveXVhbmt1YW5nIiwiYSI6ImNtN2NhYWZuZDBvYW8ycnE4OXF1b2Z6ZXgifQ.NJu5ySndWQQfetxImL1Owg';

const map11 = new mapboxgl.Map({
    container: 'map11',
    style: 'mapbox://styles/haoyuankuang/cm6sl8xi0016h01ry70s211rw',
    center: [0, 0],
    zoom: 1.5


});
map11.on('load', function () {
    map11.setProjection('lambertConformalConic'); 

    map11.addSource('uhc-data', {
        type: 'geojson',
        data: './data/dieeet_clean.geojson'
    });

    map11.addLayer({
        id: 'calories',
        type: 'fill',
        source: 'uhc-data',
        paint: {
            'fill-color': [
                'match',
                ['get', 'naturalBreaks'],
                '0 - 2360', 'rgb(255, 255, 255)',
                '2360 - 2775', 'rgb(255, 129, 27)',
                '2775 - 3216', 'rgb(203, 27, 0)',
                '3216 - 3911', 'rgb(132, 18, 0)','#ccc'
                
            ],
            'fill-opacity': 0.7
        }
    });

    map11.on('click', 'calories', function (e) {
        var properties = e.features[0].properties;
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <div style="color: grey; font-size: 14px;">
                    <strong>${properties.country}</strong><br>
                    Calories: ${properties.calories}
                </div>
            `)
            .addTo(map11);
    });
});
