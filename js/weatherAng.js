var weatherApp = angular.module('myWeatherApp', []);

weatherApp.controller('myWeatherCtrl', function ($scope, $http) {

	$scope.cityName = "city";
	$scope.place_id = "";
	$scope.lat = "";
	$scope.lng = "";
	$scope.temperature = "?";
	$scope.apparentTemperature = "?";
	$scope.date = "";
	$scope.humidity = "?";
	$scope.pressure = "";
	$scope.cloudCover = "?";
	$scope.temperatureMax = [];
	$scope.temperatureMin = [];
	$scope.dateWeek = [];
	$scope.humidityWeek = [];
	$scope.pressureWeek = [];
	$scope.cloudCoverWeek = [];
	$scope.init = function ($event) {

		if ($event.keyCode ==  13) {
			var city = $("#city input").val();
			$scope.cityName = city;

			$(".questionTemp").css("display", "none");
			$http({
				method : "GET",
				url : "http://chathamweatherapi.azurewebsites.net/api/cities/search?byName=" + $scope.cityName
			  }).then( getId, myError )
				.then( getCoordinates, myError );
		}

	};

	var getId = function (response) {

		$scope.place_id = response.data.predictions[0].place_id;

	};

	var getCoordinates = function () {

		$http({
			method : "GET",
			url : "http://chathamweatherapi.azurewebsites.net/api/cities/" + $scope.place_id
		}).then( setCoordinates, myError )
		  .then( getWeather, myError );

	};

	var setCoordinates = function (response) {

		$scope.lat = response.data.result.geometry.location.lat;
		$scope.lng = response.data.result.geometry.location.lng;

	};

	var getWeather = function (response) {

		$http({
			method : "GET",
			url : "http://chathamweatherapi.azurewebsites.net/api/forecast?latitude=" + $scope.lat + "&longitude=" + $scope.lng + "&source=WORLD_WEATHER"
		}).then( setWeather, myError );
		
	};

	var setWeather = function (response) {
		console.log(response.data);
		$(".loading").css("display", "none");
		$("#weekForecast").attr("data", "ready");

		$scope.temperature = response.data.currently.temperature;
		$scope.apparentTemperature = response.data.currently.apparentTemperature;
		$scope.date = response.data.currently.date;
		$scope.humidity = response.data.currently.humidity;
		$scope.pressure = response.data.currently.pressure;
		$scope.cloudCover = response.data.currently.cloudCover;

		for( var i = 0; i < 5; i++){
			$scope.temperatureMax[i] = response.data.futureForecasts[i].temperatureMax;
			$scope.temperatureMin[i] = response.data.futureForecasts[i].temperatureMin;
			$scope.dateWeek[i] = response.data.futureForecasts[i].date;
			$scope.humidityWeek[i] = response.data.futureForecasts[i].humidity;
			$scope.pressureWeek[i] = response.data.futureForecasts[i].pressure;
			$scope.cloudCoverWeek[i] = response.data.futureForecasts[i].cloudCover;
		}
	};

	var myError = function (response) {

		$("input").val("please enter a valid city");

	};

});