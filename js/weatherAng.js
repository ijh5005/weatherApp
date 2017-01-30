var weatherApp = angular.module('myWeatherApp', []);

weatherApp.controller('myWeatherCtrl', function ($scope, $http) {

	$scope.monthList = ["Jan", "Feb", "Mar", "April", "May", "Jun", "July", "Sep", "Oct", "Nov", "Dec"]
	$scope.day = new Date().getDate()
	$scope.year = new Date().getFullYear();
	$scope.month = $scope.monthList[ new Date().getMonth() ];
	$scope.hour = new Date().getHours()
	$scope.min = new Date().getMinutes();
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
		$("#weekForecast").attr("data", "ready");
		$("#talk").html("");
		var cloudCoverAnalysisOne = response.data.currently.cloudCover;
		$scope.temperature = response.data.currently.temperature;
		$scope.apparentTemperature = response.data.currently.apparentTemperature;
		$scope.date = response.data.currently.date;
		$scope.humidity = (response.data.currently.humidity * 100) + "%";
		$scope.pressure = response.data.currently.pressure;
		if (cloudCoverAnalysisOne < 0.25){
			$scope.cloudCover = "Sunny";
		} else if (cloudCoverAnalysisOne < 0.50){
			$scope.cloudCover = "Party Cloudy";
		} else if (cloudCoverAnalysisOne < 0.69){
			$scope.cloudCover = "Mostly Cloudy";
		} else {
			$scope.cloudCover = "Cloudy";
		}

		for( var i = 0; i < 5; i++){
			var cloudCoverAnalysis = response.data.futureForecasts[i].cloudCover;
			$scope.temperatureMax[i] = response.data.futureForecasts[i].temperatureMax;
			$scope.temperatureMin[i] = response.data.futureForecasts[i].temperatureMin;
			$scope.dateWeek[i] = response.data.futureForecasts[i].date;
			$scope.humidityWeek[i] = (response.data.futureForecasts[i].humidity * 100) + "%";
			$scope.pressureWeek[i] = response.data.futureForecasts[i].pressure;
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

	var myError = function (response) {

		$("input").val("please enter a valid city");

	};

});