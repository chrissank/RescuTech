var map;
var basecampMarker;
var basecampInfo;
var trapMarkers = [];
var trapWindows = [];
var droneMarkers = [];

var drones = null;
var traps = null;

var first = false;

var org;

function createMap() {
    map = new google.maps.Map(document.getElementById('map-container'), {
        center: {
            lat: 43.5890,
            lng: -79.6441
        },
        zoom: 7,
        styles: [
            {
                "featureType": "water",
                "stylers": [
                    {
                        "color": "#19a0d8"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "weight": 6
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#e85113"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#efe9e4"
                    },
                    {
                        "lightness": -40
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#efe9e4"
                    },
                    {
                        "lightness": -20
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "lightness": 100
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "lightness": -100
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.icon"
            },
            {
                "featureType": "landscape",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "stylers": [
                    {
                        "lightness": 20
                    },
                    {
                        "color": "#efe9e4"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "lightness": 100
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "lightness": -100
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "hue": "#11ff00"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "lightness": 100
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "hue": "#4cff00"
                    },
                    {
                        "saturation": 58
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#f0e4d3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#efe9e4"
                    },
                    {
                        "lightness": -25
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#efe9e4"
                    },
                    {
                        "lightness": -10
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            }
        ],
        disableDefaultUI: true
    });

    initTraps();
}

function initTraps() {
    var user = firebase.auth().currentUser;
    var bounds = new google.maps.LatLngBounds();

    firebase.database().ref("users").child(user.uid).once("value", function (value) {
        org = value.val();
        firebase.database().ref("disasters").child(value.val()).once("value", function (disaster) {
            var basecamp = disaster.val().base_camp.replace(" ", "").split(",");
            bounds.extend({
                lat: parseFloat(basecamp[0]), lng: parseFloat(basecamp[1])
            });
            basecampMarker = new google.maps.Marker({
                position: {
                    lat: parseFloat(basecamp[0]), lng: parseFloat(basecamp[1])
                }, icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png', map: map
            });
            basecampInfo = new google.maps.InfoWindow({
                content: "<h5><u>Basecamp</u><h5>"
            });
            basecampMarker.addListener('click', function () {
                basecampInfo.open(map, basecampMarker);
            });
            document.getElementById('dashName').innerHTML = disaster.val().type + " " + disaster.val().name + " Dashboard";
            for (t in disaster.val().traps) {
                var trap = disaster.val().traps[t];
                var location = { lat: 0.01, lng: 0.01 };
                var marker = new google.maps.Marker({
                    position: location, map: map,
                    icon: (trap.secured ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'),
                    title: t
                });
                marker.addListener('click', function () {
                    openInfo(this);
                });
                $("#trapsTable").append("<tr onclick=\"console.log(\'ye\');\"> <th scope='row'>" + trap.name + "</th> <td>" + trap.kids + "</td> <td>" + trap.adults + "</td> <td>" + trap.other + "</td> <td>" + trap.shelter + "</td> <td>" + trap.severity + "</td> <td>" + trap.emergency + "</td> <td>" + (trap.secured ? "true" : "false") + "</td> </tr>");

                if (trap.dlat !== undefined) {
                    var newLoc = { lat: parseFloat(trap.dlat), lng: parseFloat(trap.dlong) };
                    marker.setPosition(newLoc);
                    bounds.extend({ lat: parseFloat(trap.dlat), lng: parseFloat(trap.dlong) });
                    new google.maps.Circle({
                        strokeColor: (trap.secured ? '#00d435' : '#FF0000'),
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: (trap.secured ? '#00d435' : '#FF0000'),
                        fillOpacity: 0.35,
                        map: map,
                        center: newLoc,
                        radius: 60
                    });
                } else {
                    firebase.database().ref("disasters").child(value.val()).child("traps").child(t).on("value", function (tt) {
                        var trap = tt.val();
                        var newLoc = { lat: parseFloat(trap.dlat), lng: parseFloat(trap.dlong) };
                        marker.setPosition(newLoc);
                        bounds.extend({ lat: parseFloat(trap.dlat), lng: parseFloat(trap.dlong) });
                        new google.maps.Circle({
                            strokeColor: (trap.secured ? '#00d435' : '#FF0000'),
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: (trap.secured ? '#00d435' : '#FF0000'),
                            fillOpacity: 0.35,
                            map: map,
                            center: newLoc,
                            radius: 60
                        });
                    });
                }
            }
            var droneCount = 0;
            var droneActiveCount = 0;
            for (d in disaster.val().drones) {
                var drone = disaster.val().drones[d];
                if (drone.active) droneActiveCount++;
                if (drone.active === true) {
                    var droneLoc = { lat: drone.latitude, lng: drone.longitude };
                    var droneMarker = new google.maps.Marker({ position: droneLoc, map: map, icon: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png' });
                    droneMarker.addListener('click', function () {
                        new google.maps.InfoWindow({
                            content: "<h5><u>" + drone.nickname + "</u><h5></ br><p>ID: " + d + "</p>"
                        }).open(map, droneMarker);
                    });
                    bounds.extend(droneLoc);
                    droneMarkers[d] = droneMarker;
                    firebase.database().ref("disasters").child(value.val()).child("drones").child(d).on("value", function (newD) {
                        droneMarkers[d].setPosition({ lat: newD.val().latitude, lng: newD.val().longitude });
                        console.log('testestest');
                    });
                }
                droneCount++;
            }

            document.getElementById("active_drones").innerHTML = droneActiveCount;
            document.getElementById("inactive_drones").innerHTML = droneCount - droneActiveCount;
            document.getElementById("total_drones").innerHTML = droneCount;
            map.fitBounds(bounds);
        });

        firebase.database().ref("disasters").child(value.val()).child("traps").on("child_added", function (t) {
            if (first === false) return;
            var trap = t.val();
            var location = { lat: 0.01, lng: 0.01 };
            var marker = new google.maps.Marker({
                position: location, map: map,
                icon: (trap.secured ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'),
                title: t.key
            });
            marker.addListener('click', function () {
                openInfo(this);
            });
            $("#trapsTable").append("<tr onclick=\"console.log(\'ye\');\"> <th scope='row'>" + trap.name + "</th> <td>" + trap.kids + "</td> <td>" + trap.adults + "</td> <td>" + trap.other + "</td> <td>" + trap.shelter + "</td> <td>" + trap.severity + "</td> <td>" + trap.emergency + "</td> <td>" + (trap.secured ? "true" : "false") + "</td> </tr>");

            if (trap.dlat !== undefined) {
                var newLoc = { lat: parseFloat(trap.dlat), lng: parseFloat(trap.dlong) };
                marker.setPosition(newLoc);
                bounds.extend({ lat: parseFloat(trap.dlat), lng: parseFloat(trap.dlong) });
                new google.maps.Circle({
                    strokeColor: (trap.secured ? '#00d435' : '#FF0000'),
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: (trap.secured ? '#00d435' : '#FF0000'),
                    fillOpacity: 0.35,
                    map: map,
                    center: newLoc,
                    radius: 60
                });
            } else {
                firebase.database().ref("disasters").child(value.val()).child("traps").child(t.key).on("value", function (tt) {
                    var trap = tt.val();
                    var newLoc = { lat: parseFloat(trap.dlat), lng: parseFloat(trap.dlong) };
                    marker.setPosition(newLoc);
                    bounds.extend({ lat: parseFloat(trap.dlat), lng: parseFloat(trap.dlong) });
                    new google.maps.Circle({
                        strokeColor: (trap.secured ? '#00d435' : '#FF0000'),
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: (trap.secured ? '#00d435' : '#FF0000'),
                        fillOpacity: 0.35,
                        map: map,
                        center: newLoc,
                        radius: 60
                    });
                });
            }
        });

        setTimeout(function () {
            first = true;
        }, 4000);
    });
}

function openInfo(trapMarker) {
    firebase.database().ref("disasters").child(org).child("traps").child(trapMarker.getTitle()).once("value", function (trap) {
        var content = "<h5>" + trap.val().name + "</h5>";
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });

        infoWindow.open(map, trapMarker);
    });

}


window.onload = function () {
    var config = {
        apiKey: "AIzaSyDLCmGt8jbi8NcBTNosNCova9txARCJ1-Y",
        authDomain: "rescue-tech.firebaseapp.com",
        databaseURL: "https://rescue-tech.firebaseio.com",
        projectId: "rescue-tech",
        storageBucket: "",
        messagingSenderId: "63539586922"
    };
    firebase.initializeApp(config);
    verifyLoggedIn();
};

function verifyLoggedIn() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (firebase.database().ref('users/' + user.uid).once("value", function (created) {
                if (created.val() === null) {
                    window.location.replace("login.html");
                } else {
                    createMap();
                }
            }));
        } else {
            window.location.replace("login.html");
        }
    });
}