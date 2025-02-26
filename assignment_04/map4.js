mapboxgl.accessToken = 'pk.eyJ1IjoiaGFveXVhbmt1YW5nIiwiYSI6ImNtN2NhYWZuZDBvYW8ycnE4OXF1b2Z6ZXgifQ.NJu5ySndWQQfetxImL1Owg';

const map4 = new mapboxgl.Map({
    container: 'map4',
    style: 'mapbox://styles/haoyuankuang/cm6sl8xi0016h01ry70s211rw',
    zoom: 3,
    center: [-98, 38.88],
    maxZoom: 15,
    minZoom: 1,

});



// 确保 `map.load` 事件完成后再执行 `fetchAndDecompressGeoJSON`
map4.on('load', function () {
    console.log("map loaded successfully!");

    // 加载 states 数据（无压缩，直接可用）
    map4.addSource('states', {
        'type': 'geojson',
        'data': './data/merged_states.geojson'
    });

    map4.addLayer({
        'id': 'B24050_035E',
        'type': 'fill',
        'source': 'states',
        'paint': {
            'fill-color': ['interpolate', ['linear'],
                ['coalesce', ['get', 'B24050_035E'], 0], // 处理 null 值
                1000, 'rgb(255, 195, 204)',
                300000, 'rgb(151, 0, 15)'
            ],
            'fill-opacity': 0.8

        },
        'maxzoom': 6
    });

    map4.addLayer({
        'id': 'highlight-border',
        'type': 'line',
        'source': 'states',
        'paint': {
            'line-color': '#000',
            'line-width': 1
        },
        'filter': ['==', 'geoid', '']
    });

    // **等待 counties 数据解压后再添加到 map4**

            map4.addSource('counties', {
                'type': 'geojson',
                'data': './data/merged_counties.geojson'
            });

            map4.addLayer({
                'id': 'counties-layer',
                'type': 'fill',
                'source': 'counties',
                'paint': {
                    'fill-color': ['interpolate', ['linear'],
                        ['coalesce', ['get', 'B24050_035E'], 0], // 处理 null 值
                        1000, 'rgb(255, 195, 204)',
                        15000, 'rgb(151, 0, 15)'
                    ],
                    'fill-opacity': 0.7
                },
                'minzoom': 6
            });

            map4.addLayer({
                'id': 'highlight-border-counties',
                'type': 'line',
                'source': 'counties',
                'paint': {
                    'line-color': '#000',
                    'line-width': 1
                },
                'filter': ['==', 'geoid', '']
            });

        })
        .catch(error => console.error("Error loading counties data:", error.message));

    // Add hover effect (black border for both states and counties)
    map4.addLayer({
        'id': 'highlight-border',
        'type': 'line',
        'source': 'states',
        'paint': {
            'line-color': '#000',
            'line-width': 1
        },
        'filter': ['==', 'geoid', ''] // Start with no highlight
    });

    map4.addLayer({
        'id': 'highlight-border-counties',
        'type': 'line',
        'source': 'counties',
        'paint': {
            'line-color': '#000',
            'line-width': 1
        },
        'filter': ['==', 'geoid', '']
    });

    let hoveredFeatureId = null;

    map4.on('mousemove', function (e) {
        var features = map4.queryRenderedFeatures(e.point, {
            layers: ['B24050_035E', 'counties-layer']
        });
        
        if (features.length) {
            var props = features[0].properties;
            var layerId = features[0].layer.id === 'B24050_035E' ? 'highlight-border' : 'highlight-border-counties';
            map4.setFilter(layerId, ['==', 'geoid', props.geoid]); // Highlight border
        } else {
            map4.setFilter('highlight-border', ['==', 'geoid', '']); // Remove highlight
            map4.setFilter('highlight-border-counties', ['==', 'geoid', '']); // Remove highlight
        }
    });

    // Create legend
 // 创建 legend 并初始化
var legend = document.createElement('div');
legend.id = 'legend';
legend.style.position = 'absolute';
legend.style.bottom = '10px';
legend.style.left = '10px';
legend.style.background = 'white';
legend.style.padding = '5px';
legend.style.fontSize = '10px'; // 调小字体
legend.style.textAlign = 'left';
document.body.appendChild(legend);

// 更新 legend 的函数
function updateLegend(zoomLevel) {
    if (zoomLevel < 6) {
        legend.innerHTML = `<strong style='font-size:12px;'>Same-Sex Ratio (State)</strong><br>
            <div style='background:#edf8fb; width:15px; height:15px; display:inline-block;'></div> 0-0.75%<br>
            <div style='background:#b2e2e2; width:15px; height:15px; display:inline-block;'></div> 0.75%-1.50%<br>
            <div style='background:#66c2a4; width:15px; height:15px; display:inline-block;'></div> 1.50%-2.25%<br>
            <div style='background:#2ca25f; width:15px; height:15px; display:inline-block;'></div> 2.25%-3.00%<br>
            <div style='background:#006d2c; width:15px; height:15px; display:inline-block;'></div> 3.00%+<br>`;
    } else {
        legend.innerHTML = `<strong style='font-size:12px;'>Same-Sex Ratio (County)</strong><br>
            <div style='background:#edf8fb; width:15px; height:15px; display:inline-block;'></div> 0-2.5%<br>
            <div style='background:#b2e2e2; width:15px; height:15px; display:inline-block;'></div> 2.5%-5.0%<br>
            <div style='background:#66c2a4; width:15px; height:15px; display:inline-block;'></div> 5.0%-7.5%<br>
            <div style='background:#2ca25f; width:15px; height:15px; display:inline-block;'></div> 7.5%-10.0%<br>
            <div style='background:#006d2c; width:15px; height:15px; display:inline-block;'></div> 10.0%+<br>`;
    }
}

// 监听地图缩放事件，动态更新 legend
map4.on('zoom', function () {
    updateLegend(map4.getZoom());
});

// 初始化 legend
updateLegend(map4.getZoom());


    // Click event to show tooltip
    var tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'white';
    tooltip.style.padding = '5px';
    tooltip.style.border = '1px solid black';
    tooltip.style.display = 'none';
    tooltip.style.fontSize = '10px'; // Reduced font size
    tooltip.style.textAlign = 'left';
    document.body.appendChild(tooltip);

    map4.on('click', function (e) {
        var features = map4.queryRenderedFeatures(e.point, {
            layers: ['B24050_035E', 'counties-layer']
        });
    
        if (features.length) {
            var props = features[0].properties;
    
            // 格式化数据
            function formatNumber(num) {
                return num ? parseInt(num).toLocaleString() : "No Data";
            }
    
            function formatPercentage(num) {
                return num ? (parseFloat(num) * 100).toFixed(2) + "%" : "No Data";
            }
    
            tooltip.innerHTML = `<strong style='font-size:14px;'>${props.NAME_x}</strong><br>
                Opposite-Sex Spouse: ${formatNumber(props.B09019_010E)}<br>
                Same-Sex Spouse: ${formatNumber(props.B09019_011E)}<br>
                Opposite-Sex Partner: ${formatNumber(props.B09019_012E)}<br>
                Same-Sex Partner: ${formatNumber(props.B09019_013E)}<br>
                <strong>Same-Sex Ratio:</strong> ${formatPercentage(props.B24050_035E)}`;
    
            tooltip.style.left = e.originalEvent.pageX + 10 + 'px';
            tooltip.style.top = e.originalEvent.pageY + 10 + 'px';
            tooltip.style.display = 'block';
        } else {
            tooltip.style.display = 'none';
        }
    });
    
    // ✅ 让 tooltip 在鼠标移动时消失
    map4.on('mousemove', function (e) {
        var features = map4.queryRenderedFeatures(e.point, {
            layers: ['B24050_035E', 'counties-layer']
        });
    
        if (!features.length) {
            tooltip.style.display = 'none';
        }
    });

