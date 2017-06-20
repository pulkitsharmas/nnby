// Map's Model

var MapModel = function() {
	var self= this;
	var mapDiv = $('#map')[0];
	self.mapOpt = {
		center: {lat: 26.9124, lng :75.7873 },
		zoom: 13,
		mapTypeControl: false,
		styles: nightStyle
	};
	self.map = new google.maps.Map(mapDiv,self.mapOpt);
	google.maps.event.addDomListener(window, "resize", function() {
		var center = self.map.getCenter();
		google.maps.event.trigger(self.map, "resize");
		self.map.setCenter(center);
	});
};

// Application's ViewModel
function MapViewModel() {
	var self = this;
	self.map =  new MapModel();
	var amap = self.map.map;

	self.infoWindow = new google.maps.InfoWindow();

	// A generic Location model, can be defined outside the ViewModel

	self.location = function(venue) {
		this.name = venue.name;
		this.address = venue.address;
		this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(venue.lat,venue.lng),
			animation: google.maps.Animation.DROP,
			map: amap
		}); 
		google.maps.event.addListener(this.marker,'click', function() {
			self.showInfoWindow(this);
		}.bind(this));
		this.visible = venue.visible;
	};

	self.locationList = [];
	
	// Fetching locations using FourSquare Venues' Explore feature

	var cid = "OKZLWD0YYPQ4ZNNCKQARUCPRPOBISBB0JNJDJVDCXQFM1OJB";
	var cs = "WFHEGDNJHNOFAXV2ARH2VU4ACDMGHJOZAPFTZ0IZKKAPLLCG";
	var url = "https://api.foursquare.com/v2/venues/explore?m=foursquare&client_id="+cid+"&client_secret="+cs+"&v=20170510&ll="+26.9124+","+75.7873+"";
	$.getJSON(url).done(function(response) {
		self.locationList.splice(0);
		for(var i=0; i<response.response.groups.length; i++) {
			for(var j=0;j<response.response.groups[i].items.length;j++) {
				var myvenue = {};
				myvenue.name = response.response.groups[i].items[j].venue.name;
				myvenue.lat = response.response.groups[i].items[j].venue.location.lat;
				myvenue.lng = response.response.groups[i].items[j].venue.location.lng;
				myvenue.address = response.response.groups[i].items[j].venue.location.formattedAddress;			
				myvenue.visible = true;
				self.locationList.push(new self.location(myvenue));
			}
		}
	}).fail(function(e) {
		console.log("--Error--");
		console.log(e);
	});

	// filtering through the list

	self.filter = ko.observable("");
	self.viewList = ko.observableArray(self.locationList);

	self.filteredItems = ko.computed(function() {
    	var filterVal = self.filter().toLowerCase();
        return ko.utils.arrayFilter(self.viewList(), function(loc) {
            if(loc.name.toLowerCase().indexOf(filterVal)>=0)
            	return loc.visible = true;
            else
            	return loc.visible = false;
    	   	});
   	}, self);

	self.filter.subscribe(function() {
		for(var x = 0; x < self.viewList().length; x++) {
			if(self.viewList()[x].visible == false)
				self.viewList()[x].marker.setVisible(false);
			else
				self.viewList()[x].marker.setVisible(true);
		}
	});

	// Showing the infoWindow for the locations
	var last;
	self.showInfoWindow = function(venue) {
		if(window.innerWidth < 768 && isNavOpen()) {
			$(".navbar-brand").click();
		}
		if(last)
			last.setAnimation(null);
		last = venue.marker;
		venue.marker.setAnimation(google.maps.Animation.BOUNCE);
		self.infoWindow.setContent("<strong>"+venue.name+"</strong><br>"+venue.address);
		self.infoWindow.open(amap,venue.marker);
		amap.setCenter(venue.marker.getPosition());
		google.maps.event.addListener(self.infoWindow,'closeclick', function(){
   			last.setAnimation(null);
		});
	};
};

// Loading the map by setting the applications KO bindings

function initMap() {
	ko.applyBindings(new MapViewModel());
};

// In case google's status is not OK

function onError() {
	document.body.innerHTML	= "<h4>Failed to load google maps.</h4>";
};