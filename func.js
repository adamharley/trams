function calculateDistance(lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	var dLat = (lat2 - lat1).toRad();
	var dLon = (lon2 - lon1).toRad(); 
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		  Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
		  Math.sin(dLon / 2) * Math.sin(dLon / 2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	var d = R * c;
	return d;
}

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

if (navigator.geolocation) {
	
} else {
	
}

function getNearestStop() {
	navigator.geolocation.getCurrentPosition(function(position) {
		var lastDistance, lastStopId;
		
		Object.keys(stops).forEach(function(stopId) {
			var newDistance = calculateDistance(position.coords.latitude,position.coords.longitude,stops[stopId][0],stops[stopId][1]);
			
			if (lastDistance == null || lastDistance > newDistance) {
				lastDistance = newDistance;
				lastStopId = stopId;
			}
		});
		
		$("#cboStart").val(lastStopId);
	}, function(error) {
		alert('Error occurred. Error code: ' + error.code);
		// error.code can be:
		//   0: unknown error
		//   1: permission denied
		//   2: position unavailable (error response from locaton provider)
		//   3: timed out
	});
}

function getCurrentTime() {
	var date = new Date;
	
	var hours = date.getHours();
	
	if (hours > 1 && hours < 5) {
		hours = 5;
	}
	
	if (hours.toString().length == 1) {
		hours = "0" + hours.toString();
	}
	
	var minutes = 5 * Math.round(date.getMinutes()/5);
	
	if (minutes == 60) {
		minutes = 0;
	}
	
	if (minutes.toString().length == 1) {
		minutes = "0" + minutes.toString();
	}
	
	switch (date.getDay()) {
		case 0:
			var day = 3;
			break;
		case 6:
			var day = 2;
			break;
		default:
			var day = 1;
	}
	
	$("#cboHour").val(hours);
	$("#cboMinute").val(minutes);
	
	$("input[name='cboDayOfWeek'][value='"+day+"']").attr("checked",true);
	
	$("#cboIsEndTimeDeparting").attr("checked",true);
}

function displayResults(fields) {
	
}

$(function() {
	$("#hereNowBtn").click(function() {
		getNearestStop();
		getCurrentTime();
	});
	
	$("#searchBtn").click(function() {
		getResults($("form").serializeArray());
	});
});