var MapModel = function() {
	this.mapDiv = $('#map');
	this.mapOpt = {
		center: {lat: -25.363, lng: 131.044},
		zoom: 13
	};
	this.map = new google.maps.Map(this.mapDiv,this.mapOpt);
};

function MapViewModel() {
	var self = this;
	self.map =  new MapModel();
};

function initMap() {
	ko.applyBindings(new MapViewModel());
};