'use strict';

$(document).ready( function () {

	var animateWeekResults = function (selector, delay) {
		setTimeout( function () {
			$(selector).slideUp(800);
			setTimeout( function () {
				$(selector).slideDown(400);
			}, 700);
			setTimeout( function () {
				$(selector).attr("animating", "false");
			}, 1100);
		}, delay);
	};

	var animateCheck = function (selector) {
		var isAnimating = $(selector).attr("animating");
		var isReady = $("#weekForecast").attr("data");
		if (isAnimating === "false" && isReady === "ready") {
			$(selector).children().show()
		}
	};

	$("input").keydown( function (event) {
		if (event.keyCode ==  13) {
			$(".weekResults").children().hide();
			$(".weekResults").attr("animating", "true");
			$("#weekForecast").attr("data", "notReady");

			animateWeekResults(".weekResults[data=1]", 0);
			animateWeekResults(".weekResults[data=2]", 250);
			animateWeekResults(".weekResults[data=3]", 500);
			animateWeekResults(".weekResults[data=4]", 750);
			animateWeekResults(".weekResults[data=5]", 1000);
			animateWeekResults(".weekResults[data=6]", 1250);

			var check = setInterval( function () {
							animateCheck(".weekResults[data=1]");
							animateCheck(".weekResults[data=2]");
							animateCheck(".weekResults[data=3]");
							animateCheck(".weekResults[data=4]");
							animateCheck(".weekResults[data=5]");
							animateCheck(".weekResults[data=6]");
						}, 250);
		}
	});

	$(".weekResults").children().hide();
	//$(".weekTempCenter").children().hide();
	//$(".weekDateCenter").children().hide();
	$("#img").click( function () {
		var isPaused = $(this).css("animation-play-state");
		$(this).css("animation-play-state",  "paused");

		if(isPaused === "paused") {
			$(this).css("animation-play-state",  "");	
		}
	});

	var setVarWidths = function () {
		var viewPortWidth = $(window).width();
		var bodyWidth = $("body").width();
		var getCityWidth = bodyWidth * 0.98;
		var getRobotFaceWidth = $("#robotFace").width();
		var getRobotFaceHeight = $("#robotFace").height();
		var getRobotHeadHeight = $("#robotHead").height();
		var getShaperWidth = ( bodyWidth - getRobotFaceWidth ) / 2;
		var getNeckShaperHeight = ( getRobotFaceHeight - getRobotHeadHeight );
		
		var setCityWidth = $("#city").css("width", getCityWidth + "px");
		var setWeekForecastWidth = $("#weekForecast").css("width", bodyWidth + "px");
		var setShaperWidth = $(".shaper").css("width", getShaperWidth + "px");
		var setNeckShaperHeight = $(".neckShaper").css("height", getNeckShaperHeight + "px");
		var setNeckHeight = $("#robotMouth").css("height", getNeckShaperHeight + "px");
	};

	setInterval( function () {
		setVarWidths();
	}, 10);

});