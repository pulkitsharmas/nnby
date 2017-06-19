var MapModel = function() {
	var self= this;
	var mapDiv = $('#map')[0];
	self.currentCenter = {lat: 26.9124, lng :75.7873 };
	self.mapOpt = {
		center: self.currentCenter,
		zoom: 13,
		mapTypeControl: false,
		styles: nightStyle
	};
	self.map = new google.maps.Map(mapDiv,self.mapOpt);
};

function MapViewModel() {
	var self = this;
	self.map =  new MapModel();
	var amap = self.map.map;

	var input = $("#exp-input")[0];
	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.setTypes(['geocode']);
	self.infoWindow = new google.maps.InfoWindow;
	
    autocomplete.addListener('place_changed', function() {
    	var place = autocomplete.getPlace();
    	self.map.currentCenter = place.geometry.location;
    	amap.setCenter(place.geometry.location);
    	$("#exp-input").val("");
    });
    $("#find-me").click(function(e) {
    	if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            self.map.currentCenter = pos;
            self.infoWindow.setPosition(pos);
            self.infoWindow.setContent('Location found.');
            self.infoWindow.open(amap);
            amap.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, amap.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, amap.getCenter());
        }
    });

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        self.infoWindow.setPosition(pos);
        self.infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed. Use Explore.' :
                              'Error: Your browser doesn\'t support geolocation. Use Explore.');
        self.infoWindow.open(amap);
      }

      self.location = function(venue) {
      	this.name = venue.name;
      	this.address = venue.address;
      	this.marker = new google.maps.Marker({
      		position: new google.maps.LatLng(venue.lat,venue.lng),
      		animation: google.maps.Animation.DROP,
      		map: amap
      	}); 
      	this.marker.addListener('click', function(){
      		self.showInfoWindow(this);
      	});
      };

      self.locationList = ko.observableArray();

      self.filter = ko.observable("");
      self.getList = ko.computed(function() {
      	return ko.utils.arrayFilter(self.locationList(), function(venue) {
      		if(venue.name.toLowerCase().indexOf(self.filter().toLowerCase())>=0)
      			venue.marker.setVisible(true);
      		else
      			venue.marker.setVisible(false);
      	});
      },self);

      self.listClick = function(){
      		if(window.innerWidth < 768) {
      			$(".navbar-brand").click();
      		}
      		self.getList();
      };
      var exploreLocation = function(loc){
      		var cid = "OKZLWD0YYPQ4ZNNCKQARUCPRPOBISBB0JNJDJVDCXQFM1OJB";
      		var cs = "WFHEGDNJHNOFAXV2ARH2VU4ACDMGHJOZAPFTZ0IZKKAPLLCG";
      		var url = "https://api.foursquare.com/v2/venues/explore?m=foursquare&client_id="+cid+"&client_secret="+cs+"&v=20170510&ll="+loc.lat+","+loc.lng+"";
      		$.getJSON(url).done(function(response) {
      			
      			self.locationList.removeAll();
      			for(var i=0; i<response.response.groups.length; i++)
      			{
      				for(var j=0;j<response.response.groups[i].items.length;j++)
      				{
      					
      					var myvenue = {};
      					myvenue.name = response.response.groups[i].items[j].name;
      					myvenue.lat = response.response.groups[i].items[j].location.lat;
      					myvenue.lng = response.response.groups[i].items[j].location.lng;
      					myvenue.address = response.response.groups[i].items[j].formattedAddress;
      					self.locationList.push(new self.location(myvenue));
      				}
      			}
      		}).fail(function(e){
      			console.log("--Error--");
      			console.log(e);
      		});
      };
      exploreLocation(self.map.currentCenter);

      self.showInfoWindow = function(venue) {
     	for(var x=0; x<= self.locationList().length;x++)
     		self.locationList()[i].marker.setAnimation(null);
     	venue.marker.setAnimation(google.maps.Animation.BOUNCE);
     	var iwc = $("#info-window")[0];
     	iwc.children['IW-name'].textContent = venue.name;
     	iwc.children['IW-address'].textContent = venue.address.join(' ');
     	self.infoWindow.setContent(iwc);
     	amap.setCenter(venue.marker.getPosition());
      };
};

function initMap() {
	ko.applyBindings(new MapViewModel());
};