'use strict';

$(document).ready( function () {
//goal: animate the week results when the city is entered
	//slide up and slide down effect when the city is entered
	var animateWeekResults = function (selector, delay) {
		//each week result will slide up at different times -> set a delay option
		setTimeout( function () {
			//slide up...
			$(selector).slideUp(800);
			setTimeout( function () {
				//slide down...
				$(selector).slideDown(400);
			}, 700);
			setTimeout( function () {
				//set the animation to false when sliding is complete -> used to display results only after individual animation is complete
				$(selector).attr("animating", "false");
			}, 1100);
		}, delay);
	}; // end: animateWeekResults()

	//checks the animation completeness status
	var animateCheck = function (selector) {
		//check the animaing attribute to check which result is still being animated
		var isAnimating = $(selector).attr("animating");
		//check to see if the ajax request for weather data came in -> this is updated in weatherAng.js -> used with the "loading..." feature
		var isReady = $("#weekForecast").attr("data");
		//display the weather results only if the animation is complete and the ajax request is back
		if (isAnimating === "false" && isReady === "ready") {
			$(selector).children().show()
		}
	}; // end: animateCheck()

	//initate the animation when the enter button is clicked
	$("input").keydown( function (event) {
		//the (keyCode) for the enter button equals (13)
		if (event.keyCode ==  13) {
			//hide any current weather results
			$(".weekResults").children().hide();
			//set the animation status to ready
			$(".weekResults").attr("animating", "true");
			//set the isReady status to not ready
			$("#weekForecast").attr("data", "notReady");

			//intiate the animation for each week result with different start times
			animateWeekResults(".weekResults[data=1]", 0);
			animateWeekResults(".weekResults[data=2]", 250);
			animateWeekResults(".weekResults[data=3]", 500);
			animateWeekResults(".weekResults[data=4]", 750);
			animateWeekResults(".weekResults[data=5]", 1000);
			animateWeekResults(".weekResults[data=6]", 1250);

			//checks the completeness status every quarter of a second to be ready to show the weather information quickly
			var check = setInterval( function () {
							animateCheck(".weekResults[data=1]");
							animateCheck(".weekResults[data=2]");
							animateCheck(".weekResults[data=3]");
							animateCheck(".weekResults[data=4]");
							animateCheck(".weekResults[data=5]");
							animateCheck(".weekResults[data=6]");
						}, 250);
		} // end: if(event.keyCode ==  13)
	}); // end: $("input").keydown()
////////// animation goal complete //////////


//hide all blank weather data in page load
	$(".weekResults").children().hide();

//pause the sliding image onclick
	$("#img").click( function () {
		//cache the current pause status
		var isPaused = $(this).css("animation-play-state");
		//toggle image pause
		(isPaused === "paused") ? $(this).css("animation-play-state",  "") : $(this).css("animation-play-state",  "paused");
	});

//dynamically change widths when windoww is resized -> maintains the page look
	var setVarWidths = function () {
		//get the current window width
		var viewPortWidth = $(window).width();
		//get the current body width
		var bodyWidth = $("body").width();
		//set #city (input parent) width
		var setCityWidth = bodyWidth * 0.98;
		//get robot face widths
		var getRobotFaceWidth = $("#robotFace").width();
		var getRobotFaceHeight = $("#robotFace").height();
		var getRobotHeadHeight = $("#robotHead").height();
		var getShaperWidth = ( bodyWidth - getRobotFaceWidth ) / 2;
		var getNeckShaperHeight = ( getRobotFaceHeight - getRobotHeadHeight );
		
		//set the calculate widths
		var setCityWidth = $("#city").css("width", setCityWidth + "px");
		var setWeekForecastWidth = $("#weekForecast").css("width", bodyWidth + "px");
		var setShaperWidth = $(".shaper").css("width", getShaperWidth + "px");
		var setNeckShaperHeight = $(".neckShaper").css("height", getNeckShaperHeight + "px");
		var setNeckHeight = $("#robotMouth").css("height", getNeckShaperHeight + "px");
	}; // end: setVarWidths()
	//watch for a window resize the change the widths
	setInterval( function () {
		setVarWidths();
	}, 10);
////////// dynamic width changes complete //////////


//make the robot talk
	//disable typing interactions until the robot is done typing
	var getReadyStatus = false;
	//dialogue to be appended to the page when dynamically filled
	var dialog = "";
	//introduction on page load (words appened at different im intervals to have a typing effect)
	var intro = ["hi",", i'm",  " the", " coolest", " robot", " you", " will", " ever", " meet.", " i' m" ," here", " to", " assist", " your", " every", " \"weather\"", " need!"];
	//directions after intro
	var directions = ["please ", "enter ", "your ", "city ", "in ", "my ", "nose..... ", "L ", "O ", "L ", "smiley ", "face."];
	//used to -> append "loading..." when waiting for weather results
	var loading = ["loading..."];
	//used to -> keeptrack of which box is highlighted for the robot talking effect
	var mouthData = [1, 2, 3, 4, 5, 6];
	//dialogue to display when the forcaste boxes are pressed
	var weatherTalk = ["on ", "DATE", " the", " high", " will", " be ", "HIGH", "F,", " the", " low", " will", " be ", "LOW", "F and,", " it", " will", " be ", "CC", " outside", " so"];
	var actionSunny = [" get", " your", " sunglasses", " out!"];
	var actionNotSunny = [" only"," sunglasses"," for"," me"," because"," that's"," how"," i"," roll!"];

//make the robot talk
	//talk function
	var talk = function (array) {
		//get length of which dialogue array is passed in
		var length = array.length;
		//tracks the end of the dialogue
		var end = 0;
		//appends a word every tenth of a seond to have a typing effect
		var speak = setInterval( function () {
			//checks the array position
			if(length != end){
				//append the array position to the page dialogue
				dialog += array[end];
				end++;
				$("#talk").html(dialog);
			} else {
				clearInterval(speak);
			}
		}, 100);
	}; // end: talk()
	//highlight the weekresult boxs to have a talking effect
	var mouthHighlight = function (array, time){
		//trackers
		var end = 0;
		var index = 0;
		//highlight the boxes about every tenth of a second
		var highlight = setInterval( function () {
			//check to see when done
			if(end != time){
				//remove any hightlight classes
				$(".weekResults").removeClass("talk");
				//add a hightlight class -> ths changes the background image of the box
				$(".weekResults[data="+array[index]+"]").addClass("talk");
				//increment tracker
				end++;
				index++;
				//keep index under 6 to use the mouthData array
				if (index === 6){
					index = 0;
				}
			} else {
				//clear intever when complete
				clearInterval(highlight);
				//remove all highlighting classes
				$(".weekResults").removeClass("talk");
			}
		}, 150); // end: highlight = setInterval()
	}; // end: mouthHighlight()
	//initiate the talking effect
	mouthHighlight(mouthData, 23);
	//initiate page typying effect
	talk(intro);
	//change the page dialogue to the directions after intro is complete
	setTimeout( function () {
		//clear dialogue var
		dialog = "";
		//initiate directions
		talk(directions);
		//initiate talking effect
		mouthHighlight(mouthData, 11);
	}, 6400);
////////// talking effect initiation complete //////////

//append the loading array when a city is entered
	$("input").keydown( function (event) {
		if (event.keyCode ==  13) {
			//clear dialogue var
			dialog = "";
			//display "loading..." while waiting for the ajax request
			talk(loading);
		}
	});

	//watch for ajax request to set readyStatus to true if there is weather information to show
	//-> this starts after 8 secs because that is when the intro/description complete
	setTimeout( function () {
		var isAjaxComplete = setInterval( function () {
			//cache temp text -> indicates if the ajax request is complete
			var tempText = $("#tempBig").text(); //if not complete -> the text is "?OF"
			if (tempText != " ?OF"){
				getReadyStatus = true;
				//stop checking
				clearInterval(isAjaxComplete);
			}
		}, 100);
	}, 8050);
	
//report the weather
	//the robot types the weather when a week result is clicked
	$(".weekResults").click( function () {
		//check for ready status first
		if( getReadyStatus === true ){
			//disable weather reporting until done typing the current report
			getReadyStatus = false;

			//get variables for the weather report to insert into talk()
			var getDate = $(this).children(".weekDateCenter").children().html();
			var getHigh = $(this).children(".weekTempCenter").children(".weekTemp").children(".high").html();
			var getLow = $(this).children(".weekTempCenter").children(".weekTemp").children(".low").html();
			var getCloudCover = $(this).children(".weekTempCenter").children(".weekTemp").children(".cc").children().html();
			var getAction;
			//the getAction value is dependent on how cloudy it is
			if (getCloudCover === "Sunny"){
				getAction = actionSunny;
			} else if (getCloudCover === "Party Cloudy"){
				getAction = actionSunny;
			} else if (getCloudCover === "Mostly Cloudy"){
				getAction = actionNotSunny;
			} else if (getCloudCover === "Cloudy"){
				getAction = actionNotSunny;
			}

			//insert the above variable into the space holders in the weatherTalk array
			weatherTalk[1] = getDate;
			weatherTalk[6] = getHigh;
			weatherTalk[12] = getLow;
			weatherTalk[17] = getCloudCover;
			//combine the 2 arrays (weatherTalk[] and getAction[])
			var forecast = weatherTalk.concat(getAction);
			
			//clear dialogue var
			dialog = "";
			//initiate the forcaste dialog
			talk(forecast);
			//initiate the talking effect
			mouthHighlight(mouthData, 17);

			//set the getReadyStatus back to true after animation is complete
			setTimeout( function () {
				getReadyStatus = true;
			}, 2800);
		} // end: if( getReadyStatus === true )
	}); // end: $(".weekResults").click()
////////// weather report complete //////////
});