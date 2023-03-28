//  Store API endpoint inside queryUrl
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    // console.log(data);
    createFeatures(data.features);
  });

  function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"+
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
          var color;
          var r = 250
          var g = Math.floor(250-30*feature.properties.mag);
          var b = Math.floor(250-10*feature.properties.mag);
          color= "rgb("+r+" ,"+g+","+b+")"
        
          var geojsonMarkerOptions = {
            radius: 4*feature.properties.mag,
            fillColor: color,
            color: "pink",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
        }
      });
  
    // Sending earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  function createMap(earthquakes) {
    // Create the street map tile layer that will be the background of our map.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the topographic map tile layer that will be the background of our map.
    let topographic = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object to hold the base maps layer.
    let baseMaps = {
        Street: street,
        Topo: topographic
    };
   
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes,
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [41.881832, -87.62317],
      zoom: 2.5,
      layers: [street, earthquakes]
    
    });
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    legend: true
  }).addTo(myMap);
  
  var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
     
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Categories</strong>'],
    categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];
  
    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(myMap);
  }