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

  var updateFirebase = function () {
    currentData = {
      lat      : map.getCenter().lat(),
      lng      : map.getCenter().lng(),
      zoom     : map.getZoom(),
      mapTypeId: map.getMapTypeId()
    };
    fb.set({
      map: currentData,
      inControl: userId
    });
  };

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
