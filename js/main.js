function initMap(stopData) {
	var auckland = {lat: -36.848461, lng: 174.763336};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: auckland,
		mapTypeControl:true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, 
			position: google.maps.ControlPosition.BOTTOM_CENTER
		},
		fullscreenControl: true,
		fullscreenControlOptions : {
			position: google.maps.ControlPosition.BOTTOM_LEFT
		}
	});

	// Set up search for map
	var input = document.getElementById('nav-input');
	var autocomplete = new google.maps.places.Autocomplete(input);

	autocomplete.setComponentRestrictions({'country' : 'nz'});

	autocomplete.addListener('place_changed', function() {
		infowindow.close();
		var place = autocomplete.getPlace();

		if (!place.geometry) {
			window.alert('No details available for input');
			return;
		}

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(16);
		}


	});

	var infowindow = new google.maps.InfoWindow();

	for (i = 0; i < stopData.length; i++) {
		var position = new google.maps.LatLng(stopData[i].latitude, stopData[i].longitude);
		marker = new google.maps.Marker({
			position: position,
			map: map,
			title: stopData[i].address
		});

		var data = stopData[i];

		if (data.mobilitySpaces > 0) {
			marker.setIcon('https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' + data.mobilitySpaces + '%7C718CDE%7Cffffff');
		}
		else {
			marker.setIcon('http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|EA6F66')
		}

		/*Function Scope Starts*/
		(function (marker, data) {
			google.maps.event.addListener(marker, 'click', function(e) {
				infowindow.setContent(
					'<div class="info-content">' + '<h4>' + data.address +'</h4>' + '<hr>' + '<p>' + data.name + '</p>' + '</div>'
				);
				infowindow.open(map, marker);
			});
			map.panTo(marker.getPosition());

		})(marker, data);

	}
}

function about() {
	swal({
		title: 'About',
		type: 'question',
		html: '<p>This site shows the parking locations available in Auckland, provided by <a href="https://api.at.govt.nz">Auckland Transport\'s API.</a></p>' + 
		'<p>' + 
		'The <b style="color:#EA6F66;">red</b> markers signify parking locations with no mobility spaces. The <b style="color:#718CDE;">blue</b> markers have the number of mobility spaces available on them.' + 
		'</p>' +
		'<p>Please note that the API currently used is restricted to 100 calls a day.</p>'

	});
}

// function init() {
// 		$.ajax({
// 		url: "https://api.at.govt.nz/v1/public/display/parkinglocations?api_key=be3ef1c9-e1f1-4893-8b89-38d2ad66f6ee",
// 		type: 'GET',
// 		dataType: 'jsonp',
// 		crossDomain: true,
// 		contentType: 'application/json; charset=utf-8',
// 		jsonpCallback: 'localJsonpCallback',
// 		success: function(data) {
// 			console.log(data);
// 			var stopData = data.response;

// 			initMap(stopData);
// 		},
// 		error: function(e) {
// 			alert(e + "error");
// 		}
// 	});

// }