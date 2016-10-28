var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
    zoom: 13, // The larger the zoom number, the bigger the zoom
    center: me,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var numstationsA = 13;
var numstationsB = 5;
var numstationsC = 4;
var markers;
var stationsA = [{"stop": "Alewife", "lat":42.395428, "lon":-71.142483},
   {"stop": "Davis", "lat":42.39674, "lon":-71.121815},
   {"stop": "Porter Square", "lat": 42.3884, "lon": -71.11914899999999},
   {"stop": "Harvard Square", "lat":42.373362, "lon": -71.118956},
   {"stop": "Central Square", "lat":42.365486, "lon":-71.103802},
   {"stop": "Kendall/MIT", "lat":42.36249079, "lon":-71.08617653},
   {"stop": "Charles/MGH", "lat":42.361166, "lon":-71.070628},
   {"stop": "Park Street", "lat":42.35639457, "lon":-71.0624242},
   {"stop": "Downton Crossing", "lat":42.355518, "lon":-71.060225},
   {"stop": "South Station", "lat": 42.352271, "lon": -71.05524200000001},
   {"stop": "Broadway", "lat":42.342622, "lon":-71.056967},
   {"stop": "Andrew", "lat": 42.330154, "lon": -71.057655},
   {"stop": "JFK/UMass", "lat":42.320685, "lon": -71.052391}]
var stationsB = [{"stop": "North Quincy", "lat":42.275275, "lon":-71.029583},
   {"stop": "Wollaston", "lat":42.2665139, "lon":-71.0203369},
   {"stop": "Quincy Center", "lat":42.251809, "lon":-71.005409},
   {"stop": "Quincy Adams", "lat":42.233391, "lon":-71.007153},
   {"stop": "Braintree", "lat":42.2078543, "lon":-71.0011385}]
var stationsC = [{"stop": "Savin Hill", "lat":42.31129, "lon": -71.053331},
   {"stop": "Fields Corner", "lat":42.300093, "lon":-71.061667},
   {"stop": "Shawmut", "lat": 42.29312583, "lon":-71.06573796000001},
   {"stop": "Ashmont", "lat":42.284652, "lon":-71.06448899999999}]

function init()
{
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    getMyLocation();
}

function getMyLocation() {
    if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
        renderMap();
      });
    }
    else {
        alert("Geolocation is not supported by your web browser.");
    }
}

function renderMap()
{

    me = new google.maps.LatLng(myLat, myLng);

    for (var i = 0; i < numstationsA; i++) {
        pos = new google.maps.LatLng(stationsA[i].lat, stationsA[i].lon)
        var marker = new google.maps.Marker({animation: google.maps.Animation.DROP, position: pos, title: stationsA[i].stop, icon:"mbtaicon.png"})
        marker.setMap(map);

         google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(this.title);
          infowindow.open(map, this);
        });
    }

    for (var i = 0; i < numstationsB; i++) {
        console.log(i);
        pos = new google.maps.LatLng(stationsB[i].lat, stationsB[i].lon)
        var marker = new google.maps.Marker({animation: google.maps.Animation.DROP, position: pos, title: stationsB[i].stop, icon:"mbtaicon.png"})
        marker.setMap(map);

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(this.title);
          infowindow.open(map, this);
        });
    }

    for (var i = 0; i < numstationsC; i++) {
        console.log(i);
        pos = new google.maps.LatLng(stationsC[i].lat, stationsC[i].lon)
        var marker = new google.maps.Marker({animation: google.maps.Animation.DROP, position: pos, title: stationsC[i].stop, icon:"mbtaicon.png"})
        marker.setMap(map);

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(this.title);
          infowindow.open(map, this);
        });
    }

    var braintreePath = stationsA.map( function(station) {
             return new google.maps.LatLng(station.lat, station.lon);
        });

    braintreePath = braintreePath.concat(stationsB.map( function(station) {
             return new google.maps.LatLng(station.lat, station.lon);
        }));

    var ashmontPath = [new google.maps.LatLng(stationsA[12].lat, stationsA[12].lon)];
    ashmontPath = ashmontPath.concat(stationsC.map(function(station) {
             return new google.maps.LatLng(station.lat, station.lon);
        })); 

    var trainPathA = new google.maps.Polyline({
        path: braintreePath,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    var trainPathB = new google.maps.Polyline({
        path: ashmontPath,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    }); 

    // Update map and go there...
    map.panTo(me);

    // Create a marker
    marker = new google.maps.Marker({
      position: me,
      title: "Here I Am!",
      icon:"me.png"
    });

    trainPathA.setMap(map);
    trainPathB.setMap(map);
    marker.setMap(map);
  
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            var timedata = JSON.parse(request.responseText);
            console.log(timedata);
        }
    }

    request.open('GET', 'https://rocky-taiga-26352.herokuapp.com/redline.json', true);
    request.send();
}