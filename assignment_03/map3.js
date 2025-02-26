mapboxgl.accessToken = 'pk.eyJ1IjoiaGFveXVhbmt1YW5nIiwiYSI6ImNtN2NhYWZuZDBvYW8ycnE4OXF1b2Z6ZXgifQ.NJu5ySndWQQfetxImL1Owg';

const map3 = new mapboxgl.Map({
    container: 'map3',
    style: 'mapbox://styles/haoyuankuang/cm6sl8xi0016h01ry70s211rw',
    zoom: 10,
    center: [-74, 40.725],
    maxZoom: 15,
    minZoom: 8,
    maxBounds: [[-74.45, 40.45], [-73.55, 41]]
});

// 正确的 setProjection 语法
map3.setProjection('lambertConformalConic');

map3.on('load', function () {
    let layers = map3.getStyle().layers;
    let firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }

    map3.addLayer({
        'id': 'Business Category',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'data/issued_licenses.geojson' 
        },
        'paint': {
            'circle-color': [
                'match',
                ['get', 'Business Category'],
                'Bingo Game Operator', 'rgb(255, 62, 213)',
                'Booting Company', 'rgb(117, 13, 207)',
                'Car Wash', 'rgb(55, 162, 255)',
                'Commercial Lessor - Bingo', 'rgb(255, 28, 164)',
                'Construction Labor Provider', 'rgb(172, 137, 31)',
                'Dealer In Products For The Disabled', 'rgb(57, 151, 57)',
                'Debt Collection Agency', 'rgb(163, 89, 167)',
                'Electronic & Home Appliance Service Dealer', 'rgb(91, 228, 255)',
                'Electronic Cigarette Dealer', 'rgb(28, 213, 255)',
                'Electronics Store', 'rgb(28, 251, 255)',
                'Employment Agency', 'rgb(205, 106, 7)',
                'Games of Chance - Bell Jar', 'rgb(255, 119, 248)',
                'Games of Chance - Las Vegas / Casino Nights', 'rgb(236, 95, 191)',
                'Games of Chance - Raffle with Net Proceeds Over $30,000', 'rgb(255, 11, 190)',
                'Games of Chance - Raffle with Net Proceeds Under $30,000', 'rgb(255, 28, 81)',
                'Garage & Parking Lot', 'rgb(165, 196, 196)',
                'General Vendor', 'rgb(255, 0, 0)',
                'General Vendor Distributor', 'rgb(255, 206, 28)',
                'Home Improvement Contractor', 'rgb(255, 239, 115)',
                'Horse Drawn Cab Driver', 'rgb(255, 162, 0)',
                'Horse Drawn Cab Owner', 'rgb(255, 157, 0)',
                'Industrial Laundry', 'rgb(176, 255, 28)',
                'Industrial Laundry Delivery', 'rgb(113, 193, 0)',
                'Laundries', 'rgb(149, 255, 28)',
                'Locksmith', 'rgb(54, 255, 145)',
                'Newsstand', 'rgb(88, 169, 255)',
                'Pawnbroker', 'rgb(90, 108, 163)',
                'Pedicab Business', 'rgb(255, 236, 223)',
                'Pedicab Driver', 'rgb(255, 255, 255)',
                'Process Serving Agency', 'rgb(95, 0, 142)',
                'Scale Dealer/Repairer', 'rgb(100, 255, 203)',
                'Scrap Metal Processor', 'rgb(48, 102, 122)',
                'Secondhand Dealer - Auto', 'rgb(7, 61, 70)',
                'Secondhand Dealer - General', 'rgb(5, 69, 72)',
                'Sightseeing Bus', 'rgb(154, 53, 53)',
                'Stoop Line Stand', 'rgb(255, 255, 0)',
                'Storage Warehouse', 'rgb(60, 42, 91)',
                'Third Party Food Delivery Service', 'rgb(255, 123, 28)',
                'Ticket Seller Business', 'rgb(255, 28, 225)',
                'Tobacco Retail Dealer', 'rgb(255, 72, 0)',
                'Tow Truck Company', 'rgb(177, 133, 0)', 
                'Tow Truck Driver', 'rgb(149, 107, 0)',

                /* Add more categories and colors as needed */
                /* Default color */
                '#F1FAEE'
            ],
            'circle-stroke-color': 'rgb(255, 255, 255)',
            'circle-stroke-width': 0,
            'circle-radius': 3.5
        }
    }, firstSymbolId);

    // Ensure the GeoJSON data is loaded correctly
    map3.on('sourcedata', function(e) {
        if (e.sourceId === 'Business Category' && e.isSourceLoaded) {
            console.log('GeoJSON data loaded successfully.');
        }
    });
});

// Create the popup
map3.on('click', 'Business Category', function (e) {
    let businessCategory = e.features[0].properties['Business Category'];
    let businessName = e.features[0].properties['Business Name'];
    let licenseStatus = e.features[0].properties['License Status'];
    let LicenseType = e.features[0].properties['License Type'];
    let InitialIssuanceDate = e.features[0].properties['Initial Issuance Date'];
    let ExpirationDate = e.features[0].properties['Expiration Date'];
    let LicenseNumber = e.features[0].properties['License Number'];
    let ZIPCode = e.features[0].properties['ZIP Code'];
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4 style="color:grey;">' + businessName + '</h4>'
            + '<p style="color:grey;"><b>Category:</b> ' + businessCategory + '<br>'
            + '<b>License Type:</b> ' + LicenseType + '<br>'
            + '<b>Initial Issuance Date:</b> ' + InitialIssuanceDate + '<br>'
            + '<b>Expiration Date:</b> ' + ExpirationDate + '<br>'
            + '<b>License Number:</b> ' + LicenseNumber + '<br>'
            + '<b>ZIP Code:</b> ' + ZIPCode + '<br>'
            + '<b>Status:</b> ' + licenseStatus + '</p>')
        .addTo(map3);
});

// Change the cursor to a pointer when the mouse is over the Business Category layer.
map3.on('mouseenter', 'Business Category', function () {
    map3.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map3.on('mouseleave', 'Business Category', function () {
    map3.getCanvas().style.cursor = '';
});

var toggleableLayerIds = ['Business Category'];

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

        var visibility = map3.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map3.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map3.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}