$(function () {

var userId = new Date().getTime();

var fb, startData = {
  map: {
    lat: -34.397,
    lng: 150.644,
    zoom: 5
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
    center: new google.maps.LatLng(initialData.map.lat, initialData.map.lng)
  });

  var updateFirebase = function () {
    currentData = {
      lat: map.getCenter().lat(),
      lng: map.getCenter().lng(),
      zoom: map.getZoom()
    };
    fb.set({
      map: currentData,
      inControl: userId
    });
  };

  var centerListener, zoomListener;

  var addListeners = function () {
    centerListener = google.maps.event.addListener(map, 'center_changed', updateFirebase);
    zoomListener = google.maps.event.addListener(map, 'zoom_changed', updateFirebase);
  };

  var removeListeners = function () {
    google.maps.event.removeListener(centerListener);
    google.maps.event.removeListener(zoomListener);
  };

  addListeners();

  fb.on('value', function (snapshot) {
    var data = snapshot.val();
    if (data && data.inControl !== userId) {
      removeListeners();
      map.setCenter(new google.maps.LatLng(data.map.lat, data.map.lng));
      map.setZoom(data.map.zoom);
      addListeners();
    }
  });

});

});
