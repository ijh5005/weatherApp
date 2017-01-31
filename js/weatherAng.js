var weatherApp = angular.module('myWeatherApp', []);

weatherApp.controller('myWeatherCtrl', function ($scope, $http, $log) {
	//vars
	$scope.cityName = "city";
	$scope.place_id = "";
	$scope.lat = "";
	$scope.lng = "";
	$scope.temperature = "?";
	$scope.apparentTemperature = "?";
	$scope.date = "";
	$scope.humidity = "?";
	$scope.pressure = "";
	$scope.cloudCover = "";
	$scope.temperatureMax = [];
	$scope.temperatureMin = [];
	$scope.dateWeek = [];
	$scope.humidityWeek = [];
	$scope.pressureWeek = [];
	$scope.cloudCoverWeek = [];
	$scope.place = [];
	//send ajax request for the weater if the enter key is preseed
	$scope.init = function ($event) {
		//cache the input value to check for city
		var location = $("#city input").val();
		//split the city and state
		$scope.place = location.split(", ");
		//change the state inpu to uppercase
		var uppercaseState = $scope.place[1].toUpperCase();
		$scope.place[1] = uppercaseState;
		//the keycode for (enter) key is (13)
		if ($event.keyCode ==  13) {
			//send the ajax request to recieve the city id
			$http({
				method : "GET",
				url : "http://chathamweatherapi.azurewebsites.net/api/cities/search?byName=" + $scope.place[0]
			  }).then( getId, myError )
				.then( getCoordinates, myError );
		}

	};

	var getId = function (response) {
		//correct index for city
		var index;
		//cache response.data.predictions and length to search or the name in the loop
		var responceCities = response.data.predictions;
		var cityLength = responceCities.length;
		//loop through results to find the correct city index
		for ( var i = 0; i < cityLength; i++){
			if ( $scope.place[1] === responceCities[i].terms[1].value ) {
				index = i;
			}
		}
		//get the city id
		$scope.place_id = response.data.predictions[index].place_id;
	};

	var getCoordinates = function () {
		//use the city id to get the latitude(lat) and longitude(lng) from the request json
		$http({
			method : "GET",
			url : "http://chathamweatherapi.azurewebsites.net/api/cities/" + $scope.place_id
		}).then( setCoordinates, myError )
		  .then( getWeather, myError );

	};

	var setCoordinates = function (response) {
		//set the latitude(lat) and longitude(lng)
		$scope.lat = response.data.result.geometry.location.lat;
		$scope.lng = response.data.result.geometry.location.lng;

	};

	var getWeather = function (response) {
		//use the latitude(lat) and longitude(lng) to get the weather information from the request json
		$http({
			method : "GET",
			url : "http://chathamweatherapi.azurewebsites.net/api/forecast?latitude=" + $scope.lat + "&longitude=" + $scope.lng + "&source=WORLD_WEATHER"
		}).then( setWeather, myError );
		
	};

	var setWeather = function (response) {
		//show the current weather
		$("#blowUpDisplay").children().show();
		//indicate that the request for the weather information has come in
		$("#weekForecast").attr("data", "ready");
		//clear the dialogue
		$("#talk").html("");
		//cache the cloud cover -> used to indicate how cloudy it is
		var cloudCoverAnalysisOne = response.data.currently.cloudCover;
		//set the corresponding values from the weather json request
		$scope.temperature = response.data.currently.temperature;
		$scope.apparentTemperature = response.data.currently.apparentTemperature;
		$scope.date = response.data.currently.date;
		$scope.humidity = response.data.currently.humidity;
		$scope.pressure = response.data.currently.pressure;
		//use the cached cloud cover to indicate how cloudy it is
		if (cloudCoverAnalysisOne < 0.25){
			$scope.cloudCover = "Sunny";
		} else if (cloudCoverAnalysisOne < 0.50){
			$scope.cloudCover = "Party Cloudy";
		} else if (cloudCoverAnalysisOne < 0.69){
			$scope.cloudCover = "Mostly Cloudy";
		} else {
			$scope.cloudCover = "Cloudy";
		}

		//set the values for the next five days
		for( var i = 0; i < 6; i++){
			//cache the cloud cover -> used to indicate how cloudy it is
			var cloudCoverAnalysis = response.data.futureForecasts[i].cloudCover;
			$scope.temperatureMax[i] = response.data.futureForecasts[i].temperatureMax;
			$scope.temperatureMin[i] = response.data.futureForecasts[i].temperatureMin;
			$scope.dateWeek[i] = response.data.futureForecasts[i].date;
			$scope.humidityWeek[i] = response.data.futureForecasts[i].humidity;
			$scope.pressureWeek[i] = response.data.futureForecasts[i].pressure;
			//use the cached cloud cover to indicate how cloudy it is
			if (cloudCoverAnalysis < 0.25){
				$scope.cloudCoverWeek[i] = "Sunny";
			} else if (cloudCoverAnalysis < 0.50){
				$scope.cloudCoverWeek[i] = "Party Cloudy";
			} else if (cloudCoverAnalysis < 0.69){
				$scope.cloudCoverWeek[i] = "Mostly Cloudy";
			} else {
				$scope.cloudCoverWeek[i] = "Cloudy";
			}
		}
	};

	//error handler
	var myError = function (reason) {
		$log.info(reason.data);
		$("input").val("please enter a valid city");
	};

});