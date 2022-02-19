// Add console.log to check to see if our code is working.
//console.log("working");

// Create the map object with a center and zoom level.
let map = L.map('mapid').setView([40.7, -94.5], 4.5);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});



// Then we add our 'streets' title layer to the map.
streets.addTo(map);

// Accessing the JSON File
const MonarchURL = 'static/journey_north/JNorth_Adult_Site_2016_11.geojson';

// Grabbing our GeoJSON data.
d3.json(MonarchURL).then(function(data) {
// console.log(data);
// Creating a GeoJSON layer with the retrieved data.
L.geoJSON(data).addTo(map);
});

// Then we add our 'graymap' tile layer to the map.
// streets.addTo(map);

// Loop through the cities array and create on marker for each city.
