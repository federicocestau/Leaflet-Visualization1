// Creating map object
var map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

// If data.beta.nyc is down comment out this link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(mag) {
    switch (true) {
        case mag > 5:
            return "#FF3933";
        case mag > 4:
            return "#FFFC33";
        case mag > 3:
            return "#5BFF33";
        case mag > 2:
            return "#33FFF3";
        case mag > 1:
            return "#333CFF";
        default:
            return "#FF3333";
    }
}

// Grabbing our GeoJSON data..
d3.json(link, function (data) {
    var circles = data.features;
    circles.forEach(function (circle) {
        L.circleMarker([circle.geometry.coordinates[1], circle.geometry.coordinates[0]],
            {
                color: "black",
                radius: circle.properties.mag * 2,
                fillColor: chooseColor(circle.properties.mag),
                fillOpacity: 1,
                weight: 0.5
            }).bindPopup(`Magnitude ${circle.properties.mag}`).addTo(map);
    });
    console.log(data)
    // // color function to be used when creating the legend
    // function getColor(d) {
    //     return d > 5 ? '#FF3933' :
    //         d > 4 ? '#FFFC33' :
    //             d > 3 ? '#5BFF33' :
    //                 d > 2 ? '#33FFF3' :
    //                     d > 1 ? '#333CFF' :
    //                         '#FF3339';
    // }

    // Add legend to the map
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mags = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < mags.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(mags[i] + 1) + '"></i> ' +
                mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
}
);
