var userId = new Date().getTime();

var fb, startData = {
  map: {
    lat: -34.397,
    lng: 150.644,
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  },
  inControl: userId
};

if (window.location.hash) {
  fb = new Firebase('https://mapstash.firebaseio.com/').child(window.location.hash.replace('#', ''));
} else {
  fb = new Firebase('https://mapstash.firebaseio.com/').push(startData);
  window.location.hash = fb.name();
}

fb.once('value', function (snapshot) {

  var initialData = snapshot.val() || startData;

  window.map = new google.maps.Map(document.getElementById("map"), {
    zoom: initialData.map.zoom,
    center: new google.maps.LatLng(initialData.map.lat, initialData.map.lng),
    mapTypeId: initialData.map.mapTypeId,
    streetViewControl: false
  });

  var markers = [],
      markerIds = [];

  fb.child('markers').on('child_added', function (snapshot) {
    if (markers.indexOf(snapshot.name()) < 0) {
      var marker = snapshot.val();
      addMarker(new google.maps.LatLng(marker.lat, marker.lng), snapshot.ref());
    }
  });

  fb.child('markers').on('child_removed', function (snapshot) {
    removeMarker(snapshot.name());
  });

  var updateFirebase = function () {
    currentData = {
      lat      : map.getCenter().lat(),
      lng      : map.getCenter().lng(),
      zoom     : map.getZoom(),
      mapTypeId: map.getMapTypeId()
    };
    fb.update({
      map: currentData,
      inControl: userId
    });
  };

  function removeMarker(id, markerRef) {
    // window.console.log(id, marker)
    var idx = markerIds.indexOf(id);
    if (idx >= 0) {
      markers[idx].setMap(null);
      markers.splice(idx, 1);
      markerIds.splice(idx, 1);
    }
    if (markerRef) {
      markerRef.remove();
    }
  }

  function addMarker(location, markerRef) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });

    if (!markerRef) {
      markerRef = fb.child('markers').push({
        lat: location.lat(),
        lng: location.lng()
      });
    }

    markers.push(marker);
    markerIds.push(markerRef.name());

    google.maps.event.addListener(marker, 'click', function(event) {
      removeMarker(markerRef.name(), markerRef);
    });

  }

  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng);
  });

  var listeners = [],
      eventNames = ['center_changed', 'zoom_changed', 'maptypeid_changed'];

  var addListeners = function () {
    eventNames.forEach(function (eventName) {
      listeners.push(google.maps.event.addListener(map, eventName, updateFirebase));
    });
  };

  var removeListeners = function () {
    listeners.forEach(function (listener) {
      google.maps.event.removeListener(listener);
    });
    listeners = [];
  };

  addListeners();

  fb.on('value', function (snapshot) {
    var data = snapshot.val();
    if (data && data.inControl !== userId) {
      removeListeners();
      map.setCenter(new google.maps.LatLng(data.map.lat, data.map.lng));
      map.setZoom(data.map.zoom);
      map.setMapTypeId(data.map.mapTypeId);
      addListeners();
    }
  });

});
