var weatherApp = angular.module('myWeatherApp', []);

weatherApp.controller('myWeatherCtrl', ($scope, $http, $log) => {
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
	$scope.states = [
    	{ appr: "AL", fullName: "Alabama" }, { appr: "AK", fullName: "Alaska" }, { appr: "AZ", fullName: "Arizona" }, { appr: "AR", fullName: "Arkansas" }, { appr: "CA", fullName: "California" }, { appr: "CO", fullName: "Colorado" }, { appr: "CT", fullName: "Connecticut" }, { appr: "DE", fullName: "Delaware" }, { appr: "FL", fullName: "Florida" }, { appr: "GA", fullName: "Georgia" }, { appr: "HI", fullName: "Hawaii" }, { appr: "ID", fullName: "Idaho" }, { appr: "IL", fullName: "Illinois" }, { appr: "IN", fullName: "Indiana" }, { appr: "IA", fullName: "Iowa" }, { appr: "KS", fullName: "Kansas" }, { appr: "KY", fullName: "Kentucky" }, { appr: "LA", fullName: "Louisiana" }, { appr: "ME", fullName: "Maine" }, { appr: "MD", fullName: "Maryland" }, { appr: "MA", fullName: "Massachusetts" }, { appr: "MI", fullName: "Michigan" }, { appr: "MN", fullName: "Minnesota" }, { appr: "MS", fullName: "Mississippi" }, { appr: "MO", fullName: "Missouri" }, { appr: "MT", fullName: "Montana" }, { appr: "NE", fullName: "Nebraska" }, { appr: "NV", fullName: "Nevada" }, { appr: "NH", fullName: "New Hampshire" }, { appr: "NJ", fullName: "New Jersey" }, { appr: "NM", fullName: "New Mexico" }, { appr: "NY", fullName: "New York" }, { appr: "NC", fullName: "North Carolina" }, { appr: "ND", fullName: "North Dakota" }, { appr: "OH", fullName: "Ohio" }, { appr: "OK", fullName: "Oklahoma" }, { appr: "OR", fullName: "Oregon" }, { appr: "PA", fullName: "Pennsylvania" }, { appr: "RI", fullName: "Rhode Island" }, { appr: "SC", fullName: "South Carolina" }, { appr: "SD", fullName: "South Dakota" }, { appr: "TN", fullName: "Tennessee" }, { appr: "TX", fullName: "Texas" }, { appr: "UT", fullName: "Utah" }, { appr: "VT", fullName: "Vermont" }, { appr: "VA", fullName: "Virginia" }, { appr: "WA", fullName: "Washington" }, { appr: "WV", fullName: "West Virginia" }, { appr: "WI", fullName: "Wisconsin" }, { appr: "WY", fullName: "Wyoming" }
	];
	//send ajax request for the weater if the enter key is preseed
	$scope.init = ($event) => {
		//cache the input value to check for city
		var location = $("#city input").val();
		//correct input if the user doesn't put a space after the comma -> ex: Philadelphia, PA (the space is between "," and "PA")
			//get the location of the comma
			var commaLocation = location.indexOf(",");
			//the spce should be one index after the commaLoaction
			var spaceLocation = commaLocation + 1;
			//cache bool for if statement
			var spaceCheck = (location.charAt(spaceLocation) == " ");
			//check to see if there is a space
			if(!spaceCheck){
				//add a space if there is no space present
				var addSpace = " ";
				location = [location.slice(0, spaceLocation), addSpace, location.slice(spaceLocation)].join('');
			}
		//split the city and state
		$scope.place = location.split(", ");
		//change the state inpu to uppercase
		var uppercaseState = angular.uppercase($scope.place[1]);
		//appreviate the state input if not done by user
			//get $scope.states length to use it to replace the state if not appreviated
			console.log( $scope.place[1].length );
			const statesLen = $scope.states.length;
			console.log(statesLen);
			//for()
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

	const getId = (response) => {
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
		$scope.cityName = response.data.predictions[index].description;
	};

	const getCoordinates = () => {
		//use the city id to get the latitude(lat) and longitude(lng) from the request json
		$http({
			method : "GET",
			url : "http://chathamweatherapi.azurewebsites.net/api/cities/" + $scope.place_id
		}).then( setCoordinates, myError )
		  .then( getWeather, myError );

	};

	const setCoordinates = (response) => {
		//set the latitude(lat) and longitude(lng)
		$scope.lat = response.data.result.geometry.location.lat;
		$scope.lng = response.data.result.geometry.location.lng;

	};

	const getWeather = (response) => {
		//use the latitude(lat) and longitude(lng) to get the weather information from the request json
		$http({
			method : "GET",
			url : "http://chathamweatherapi.azurewebsites.net/api/forecast?latitude=" + $scope.lat + "&longitude=" + $scope.lng + "&source=WORLD_WEATHER"
		}).then( setWeather, myError );
		
	};

	const setWeather = (response) => {
		//show the current weather
		$("#blowUpDisplay").children().show();
		//indicate that the request for the weather information has come in
		$("#weekForecast").attr("data", "ready");
		//reset the 6th weather forcast to notReady until it is confirmed that the data is recieved -> this is checked seperately
		$(".resultsPlaceholder:last-child").css("display", "none");
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

		//set the values for the following days
		//cache the length of the follwing days
		var len = response.data.futureForecasts.length;
		console.log(response.data.futureForecasts);
		//hides the 6th day if there is no additional forest day (sometimes the request comes back with a 6th day)
		if (len === 6) { 
			$(".resultsPlaceholder:last-child").css("display", "");
		}
		for( var i = 0; i < len; i++){
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
	}; // end: setWeather()

	//error handler
	const myError = (reason) => {
		$log.info(reason.data);
		$("input").val("please enter a valid city");
	};

});