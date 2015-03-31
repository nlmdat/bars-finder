var map;
var mapOptions;
var searchData;
var searchQuery;

function setMapOptions(lat, lng, zoom) {
	var latlng = new google.maps.LatLng(lat, lng);
	mapOptions = {
		center: latlng,
        zoom: zoom
	};
}

function storeSearchData(data) {
	searchData = data;
}

function storeSearchQuery(query) {
	searchQuery = query;
}

function drawResults() {

	var results  = $.map(searchData, function(value, index) {
		return [value];
	});
	
	for (var i = 0; i < results.length; i++) {
		var image = {
			url: "logos/bar.png"
		};
		
		var marker = new google.maps.Marker({
			map: map,
			position: results[i].location,
			title: results[i].name,
			icon: image
		});
	}
}

function updateLocation() {
	var query;
	location.search.substr(1).split("&").forEach(function(item) {
		tmp = item.split("=");
		if (tmp[0] == "search") query = decodeURIComponent(tmp[1]);
	});
	if (!query) return;
	
	$.ajax({
		url: "https://maps.googleapis.com/maps/api/geocode/json",
		data: {address: query},
		success: function(results, status) {
			if (status == "success") {
				map.setCenter(results.results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results.results[0].geometry.location,
				});
			}
		}
	});
}

$(function() {
	$("#search").val(searchQuery);
	setMapOptions(1.2929, 103.7701, 16);
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	updateLocation();
	drawResults();
});
