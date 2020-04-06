'use strict';

// Fix Problem with the Scroll inside a draggable
var init = function () {
	document.addEventListener('touchstart', handler, true);
	document.addEventListener('touchmove', handler, true);
	document.addEventListener('touchend', handler, true);
	document.addEventListener('touchcancel', handler, true);
};

var handler = function (event) {
	var touch = event.changedTouches[0],
		simulatedEvent = document.createEvent('MouseEvent');

	simulatedEvent.initMouseEvent(
		{ touchstart: 'mousedown', touchmove: 'mousemove', touchend: 'mouseup' }[event.type],
		true, true, window, 1,
		touch.screenX, touch.screenY, touch.clientX, touch.clientY,
		false, false, false, false, 0, null);

	touch.target.dispatchEvent(simulatedEvent);
};

// Fix Viewport Height caused by the keyboard
let viewheight = $(window).height();
let viewwidth = $(window).width();
let viewport = document.querySelector("meta[name=viewport]");
viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");

var appData = {
	"inbox": {
		"title": "Inbox",
		"color": "#4285f4",
		"id": "inbox",
		"image": "resources/ginbox_icon.png",
		"text": "You received a new email",
		"content": ""
	},
	"recipes": {
		"title": "Recipes",
		"color": "#455A64",
		"id": "recipes",
		"image": "resources/recipes.jpg",
		"text": "See recipes for you",
		"content": ""
	},
	"maps": {
		"title": "Maps",
		"color": "#689df6",
		"id": "maps",
		"image": "resources/ist.png",
		"text": "45 min drive to Work",
		"content": "<div style='position:relative;height:100%;overflow:hidden'><iframe src='maps.html' allowfullscreen></iframe></div>"
	},
	"alpha": {
		"title": "Story Alpha",
		"color": "#3F51B5",
		"id": "alpha",
		"image": "resources/empty.png",
		"text": "",
		"content": "<div style='position:relative;height:100%;overflow:hidden'><iframe src='alpha.html' allowfullscreen></iframe></div>"
  }
};

// Helper functions

function getMonth(m) {
	switch (m) {
		case 0: m = "JAN";
			break;
		case 1: m = "FEB";
			break;
		case 2: m = "MAR";
			break;
		case 3: m = "APR";
			break;
		case 4: m = "MAY";
			break;
		case 5: m = "JUN";
			break;
		case 6: m = "JUL";
			break;
		case 7: m = "AUG";
			break;
		case 8: m = "SEP";
			break;
		case 9: m = "OCT";
			break;
		case 10: m = "NOV";
			break;
		case 11: m = "DEC";
			break;
	}
	return m;
}

function getWeekDay(d) {
	var days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
	return days[d];
}

Number.prototype.roundTo = function (nTo) {
	nTo = nTo || 10;
	return Math.round(this * (1 / nTo)) * nTo;
}

$(document).ready(function () {
	init();
	var navbarTime = $("#navbar_time");
	var navbar = $(".navbar");
	var homeButton = $("#home_button");
	var homeCards = $(".home_cards");
	var menu = $("#menu");
	var quickMenu = $("#quick_menu");
	var quickMenuObfuscator = $("#quick_menu_obfuscator");
	var menuButton = $("#menu_2 button");
	var quickMenuButton = $("#quick_menu button");
	var statusMenu = $("#menu_2");
	var home = $("#home");
	var appHistory = $("#app_history");
	var appContainer = $(".app_container");
	var lockScreen = $("#lockscreen");
	var lockOptionsButton = $("#lock_options_button");
	var lockOptions = $(".lock_options");
	var closeLockOptions = $("#lock_options_close");
	var guestButton = $("#lock_options_guest");
	var loginLoader = $("#login_loader");
	var lockHour = $("#lockscreen_hour");
	var batteryLevel = $(".battery_level");
	var batteryIcon = $(".battery_icon");
	var statusBar = $(".status_bar");
	var statusTime = $(".status_hour");
	var statusDay = $(".status_day");
	var statusUserImage = $(".fuchsia");
	var statusLocation = $(".status_location");
	var signOutButton = $(".signout");
	var googleSearch = $(".google_search");
	var searchInput = $(".search_input");
	var dummyInput = $("#dummy_input");
	var appsOverflow = $(".apps_overflow");
	var card = $(".card");
	var openedApp = $("#opened_app");
	var openedAppContent = $("#app_content");
	var openedAppHeader = $("#opened_app header");
	var bigCards = $(".big_cards");
	var smallCards = $(".small_cards");
	var openedAppObj;
	var volumeSlider = new mdc.slider.MDCSlider(document.querySelector('#volume_slider'));
	var brightnessSlider = new mdc.slider.MDCSlider(document.querySelector('#brightness_slider'));
	var quickVolumeSlider = new mdc.slider.MDCSlider(document.querySelector('#quick_volume_slider'));
	var quickBrightnessSlider = new mdc.slider.MDCSlider(document.querySelector('#quick_brightness_slider'));


	// Define Draggable Limits
	var slideHeight = $('body').height() * 0.5;
	var homeMin = 0;
	var homeMax = -slideHeight;
	var appHistoryslideHeight;
	var appHistoryMin;
	var appHistoryMax;

	function setAppHistoryTop() {
		appHistoryslideHeight = -appHistory.height() + 180;
		if ($("body").width() < 800) {
			appHistoryslideHeight = -appHistory.height() + 130;
			appHistory.css({ "top": appHistoryslideHeight });
		} else {
			appHistory.css({ "top": appHistoryslideHeight });
		}
		appHistoryMin = 0;
		appHistoryMax = appHistoryslideHeight;
	}
	setAppHistoryTop();

	// Search Engine
	var options = {
		shouldSort: true,
		threshold: 0.5,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: [
			"title"
		]
	};

	// Change appData format to the used on Fuse.js
	var appDataList = [];
	for (var app in appData) {
		appDataList.push(appData[app]);
	}

	var fuse = new Fuse(appDataList, options);

	//Date
	var today = new Date();
	var day = today.getDay();
	var date = today.getDate();
	var month = today.getMonth();
	statusDay.text(getWeekDay(day) + ", " + getMonth(month) + " " + date);

	//Time
	function updateTime() {
		today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		if (m < 10) { m = "0" + m };

		navbarTime.text(h + ":" + m);
		statusTime.text(h + ":" + m);
		lockHour.text(h + ":" + m);
		setTimeout(updateTime, 30000);
	}
	updateTime();

	// Listeners

	$(document).click(function () {
		if (statusUserImage.hasClass("active")) {
			statusUserImage.removeClass("active");
			showHome();
			showAppHistory();
		} else if (menu.hasClass("active")) {
			menu.removeClass("active");
		}
	});

	dummyInput.click(function () {
		home.css({ "top": homeMax + "px" });
		appHistory.css({ "transform": "translateY(" + homeMax + "px)" });
		showSearchInput();
		searchInput.focus();
	});

	lockOptionsButton.click(function () {
		lockOptionsButton.fadeTo("fast", 0, () => lockOptionsButton.hide());
		lockOptions.addClass("active");
		lockOptions.fadeTo("fast", 1);

	});

	closeLockOptions.click(function () {
		lockOptionsButton.fadeTo("fast", 1, () => lockOptionsButton.show());
		lockOptions.fadeTo("fast", 0, () => lockOptions.removeClass("active"));
	});

	guestButton.click(function () {
		lockHour.hide();
		loginLoader.show();
		setTimeout(function () {
			loginLoader.hide();
			lockScreen.fadeTo("fast", 0, () => {
				lockScreen.hide();
				lockHour.show();
				lockOptionsButton.show();
				lockOptionsButton.css('opacity', '1');
				lockOptions.removeClass("active");
				lockOptions.css('opacity', '0');
			});
		}, 2000);

	});

	/*navbarTime.click(function () {
		event.stopPropagation();
		console.log("click time");
		if (menu.hasClass("active")) {
			menu.removeClass("active");
		} else {
			menu.addClass("active");
		}
	});*/

	menu.click(function () {
		event.stopPropagation();
	})

	statusUserImage.click(function () {
		if (statusUserImage.hasClass("active")) {
			statusUserImage.removeClass("active");
			showHome();
			showAppHistory();
		} else {
			statusUserImage.addClass("active");
			hideHome();
			hideAppHistory();
			setTimeout(function () {
				brightnessSlider.layout();
				volumeSlider.layout();
			}, 400);
		}
	});

	statusMenu.click(function () {
		event.stopPropagation();
	});

	menuButton.click(function (e) {
		toggleButton(e);
	});

	quickMenuButton.click(function (e) {
		toggleButton(e);
	});

	signOutButton.click(function () {
		lockScreen.show();
		lockScreen.fadeTo("fast", 1);
		statusMenu.removeClass("active");
		if (quickMenu.hasClass("active"))
			toggleQuickMenu();
		returnHome();
	});

	$(document).keyup(function (e) {
		var keyCode = e.keyCode;
		if (keyCode == 91)
			returnHome();
	});



	homeButton.on('mousedown', function (e) {
		longPress.start();
		/* if (quickMenu.hasClass("active"))
		toggleQuickMenu();
		this.downTimer = setTimeout(function () {
			toggleQuickMenu();
		}, 500); */
	});

	homeButton.on('mouseup', function (e) {
		longPress.end();
	});

	quickMenuObfuscator.click(function () {
		toggleQuickMenu();
	});

	searchInput.keyup(function () {
		var query = searchInput.val();
		var result = fuse.search(query);
		console.log("Search Result:", result);
		if (result.length == 0 || query.length == 0) {
			result = appDataList.slice(0, 3);
		}
		updateHomeCards(result);
	});

	homeCards.on("click", ".card", function (e) {
		console.log("Click Card: ", e.currentTarget.id);
		var cardId = e.currentTarget.id;
		openedAppObj = new App(cardId);
	});

	appHistory.on("click", ".app_container", function (e) {
		console.log("Click Card: ", e.currentTarget.id);
		var cardId = e.currentTarget.id;
		openedAppObj = new App(cardId);
	});

	function toggleButton(e) {
		var buttonId = e.currentTarget.id;
		var jqueryBtn = $("#" + buttonId);
		if (jqueryBtn.hasClass("active")) {
			jqueryBtn.removeClass("active");
		} else {
			jqueryBtn.addClass("active");
		}
	}

	function returnHome() {
		if (openedAppObj != undefined) {
			openedAppObj.close();
		}
		showHome();
		showAppHistory();
		menu.removeClass("active");
		showStatusBar();
	}

	function hideHome() {
		event.stopPropagation();
		home.css({ "top": "0px" });
		home.css({ "transform": "translateY(50%)" });
	}

	function showHome() {
		event.stopPropagation();
		home.css({ "top": "0px" });
		home.css({ "transform": "translateY(0px)" });
		home.css({ "z-index": "1" });
		home.css({ "opacity": 1 });
		hideNavBar();
	}

	function toggleQuickMenu() {
		if (quickMenu.hasClass("active")) {
			quickMenu.removeClass("active");
			quickMenuObfuscator.removeClass("active");
		}
		else {
			quickMenu.addClass("active");
			quickMenuObfuscator.addClass("active");
		}
		console.log("Long Press");
	}

	function showStatusBar() {
		statusBar.css({ "opacity": 1 });
	}

	function hideAppHistory() {
		appHistory.css({ "top": appHistoryslideHeight + "px" });
		appHistory.css({ "transform": "translateY(-50%)" });
	}

	function showAppHistory() {
		appHistory.css({ "top": appHistoryslideHeight + "px" });
		appHistory.css({ "transform": "translateY(0px)" });
	}

	function showNavBar() {
		navbar.show();
	}

	function hideNavBar() {
		navbar.hide();
	}

	function hideSearchInput() {
		dummyInput.addClass("active");
		searchInput.removeClass("active");
	}

	function showSearchInput() {
		dummyInput.removeClass("active");
		searchInput.addClass("active");
	}

	function updateHomeCards(apps) {
		homeCards.empty();
		for (var i = 0; i < apps.length; i++) {
			var cardHeader = "";
			var cardText = apps[i].title;
			if (apps[i].text != "") {
				cardHeader = apps[i].title;
				cardText = apps[i].text;
			}

			homeCards.append('<div class="card" id="' + apps[i].id + '">' +
				'<img class="card_image" src="' + apps[i].image + '">' +
				'<div class="card-content">' +
				'<h6 class="card_header">' + cardHeader + '</h6>' +
				'<h5 class="card_text">' + cardText + '</h5>' +
				'</div>' +
				'</div>');
		}
	}

	//Home Drag
	home.draggable({
		axis: "y",
		scroll: false,
		handle: '.google_search',
		position: 'unset',
		drag: function (event, ui) {
			if (ui.position.top < 0) {
				appHistory.css({ "transform": "translateY(" + ui.position.top + "px)" });
				showSearchInput();
			} else {
				hideSearchInput();
			}
			if (ui.position.top > homeMin) ui.position.top = homeMin;
			if (ui.position.top < homeMax) ui.position.top = homeMax;
		},
		stop: function (event, ui) {
			var topPositionRounded = (ui.position.top).roundTo(slideHeight);
			appHistory.css({ "transform": "translateY(" + topPositionRounded + "px)" });
			if (topPositionRounded == 0) {
				hideSearchInput();
				appsOverflow.css({ "overflow": "hidden" });
			} else {
				appsOverflow.css({ "overflow": "auto" });
			}

			$(this).animate({
				'top': topPositionRounded
			});
		}
	});

	//App History Drag
	appHistory.draggable({
		axis: "y",
		scroll: false,
		position: 'unset',
		drag: function (event, ui) {
			if (ui.position.top > appHistoryslideHeight + 50) {
				home.css({ "opacity": 0 });
				statusBar.css({ "opacity": 0 });
				home.css({ "z-index": -1 });
				showNavBar();
			} else {
				home.css({ "z-index": 1 });
				home.show();
				home.css({ "opacity": 1 });
				statusBar.css({ "opacity": 1 });
				hideNavBar();
			}
			if (ui.position.top > appHistoryMin) ui.position.top = appHistoryMin;
			if (ui.position.top < appHistoryMax) ui.position.top = appHistoryMax;
		},
		stop: function (event, ui) {
			if (ui.position.top < appHistoryslideHeight + 200) {
				home.css({ "z-index": 1 });
				home.css({ "opacity": 1 });
				statusBar.css({ "opacity": 1 });
				navbar.hide();

				$(this).animate({
					'top': appHistoryMax
				});
			}
		}

	});

	// Show Computers Battery info
	navigator.getBattery().then(function (battery) {
		function updateAllBatteryInfo() {
			updateChargeLevel();
			updateChargeInfo();
		}
		updateAllBatteryInfo();

		battery.addEventListener('chargingchange', function () {
			updateChargeLevel();
		});
		function updateChargeLevel() {
			batteryLevel.text(Math.round(battery.level * 100) + " %")
		}

		battery.addEventListener('chargingchange', function () {
			updateChargeInfo();
		});
		function updateChargeInfo() {
			batteryIcon.html(battery.charging ? "battery_charging_full" : "battery_full");
		}

	});

	function LongPress() {
		var time = 500, startTime = 0, endTime = 0, downTimer = '';
		this.start = function () {
			downTimer = setTimeout(function () {
				toggleQuickMenu();
			}, time);

			startTime = new Date().getTime();
		}

		this.end = function () {
			clearTimeout(downTimer);
			endTime = new Date().getTime();
			if (endTime - startTime < time) {
				if (quickMenu.hasClass("active"))
					toggleQuickMenu();
				else
					returnHome();
			}
		}
	}

	// Classes

	/* Class representing a group of open Apps */
	class OpenApps {
		constructor() {
			this.appArray = [];
			this.numberOfApps = 0;
		}

		addApp(app) {
			if (app instanceof App) {
				this.refreshList(app);

				console.log("App list", this.appArray);
				this.updateUI();
			}
		}

		removeApp(index) {
			this.appArray.splice(index, 1);
		}

		openAppsSize() {
			return this.appArray.length;
		}

		getApp(index) {
			var id = this.appArray[index]
			return [appData[id], id];
		}

		/**
		* Moves a given app to the last position 
		* @param {App} app
		*/
		refreshList(app) {
			var appId = app.id;
			for (var i = 0; i < this.openAppsSize(); i++) {
				if (this.getApp(i)[1] == appId) {
					this.removeApp(i);
					break;
				}
			}
			this.appArray.push(app.id);
		}

		/**
		* Updates cards containers
		*/
		updateUI() {
			bigCards.empty();
			smallCards.empty();

			for (var i = 0; i < this.openAppsSize(); i++) {
				var app = this.getApp(i)[0];
				var id = this.getApp(i)[1];

				var card = '<div class="history_card" style="border-top: 5px solid ' + app.color + '">' +
					app.content + '<div class="history_card_hover"></div></div>';
				if (this.openAppsSize() - i < 3) {
					bigCards.append('<div class="app_container" id="' + id + '">' + card +
						'<h6>' + app.title + '</h6>' +
						'</div>');
				} else {
					smallCards.append('<div class="app_container" id="' + id + '">' + card +
						'<h6>' + app.title + '</h6>' +
						'</div>');
				}
			}
			setAppHistoryTop();

		}
	}

	/* Class represents an App */
	class App {
		constructor(id) {
			this.title = appData[id].title;
			this.id = id;
			this.color = appData[id].color;
			this.content = appData[id].content;
			this.open();
		}

		open() {
			console.log("Open App");
			hideHome();
			hideAppHistory();
			showNavBar();
			openedAppHeader.text(this.title);
			openedAppHeader.css({ "background": this.color });
			openedAppContent.html(this.content);
			openedApp.addClass("active");

			appHistoryList.addApp(this);
		}
		close() {
			console.log("Close App");
			showHome();
			showAppHistory();
			hideNavBar();
			home.css({ "opacity": 1 });
			statusBar.css({ "opacity": 1 });
			openedApp.removeClass("active");
		}
	}

	var appHistoryList = new OpenApps();
	updateHomeCards(appDataList.slice(0, 3));

	//Long press
	var longPress = new LongPress();
})
