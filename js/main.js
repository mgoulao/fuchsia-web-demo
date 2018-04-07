'use strict';

// Fix Viewport Height caused by the keyboard
let viewheight = $(window).height();
let viewwidth = $(window).width();
let viewport = document.querySelector("meta[name=viewport]");
viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");

function getMonth(m) {
    switch (m) {
        case 1: m = "JAN";
            break;
        case 2: m = "FEB";
            break;
        case 3: m = "MAR";
            break;
        case 4: m = "APR";
            break;
        case 5: m = "MAY";
            break;
        case 6: m = "JUN";
            break;
        case 7: m = "JUL";
            break;
        case 8: m = "AUG";
            break;
        case 9: m = "SEP";
            break;
        case 10: m = "OCT";
            break;
        case 11: m = "NOV";
            break;
        case 12: m = "DEC";
            break;
    }
    return m;
}

function getWeekDay(d) {
    var days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    return days[d];
}

$(document).ready(function () {
    var navbarTime = $("#navbar_time");
    var navbar = $(".navbar");
    var homeButton = $("#home_button");
    var homeCards = $(".home_cards");
    var menu = $("#menu");
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
    var card = $(".card");
    var openedApp = $("#opened_app");
    var openedAppContent = $("#app_content");
    var openedAppHeader = $("#opened_app header");
    var bigCards = $(".big_cards");
    var smallCards = $(".small_cards");
    var openedAppObj;
    //Draggable
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

    var appDataList = [
        {
            "title": "Inbox",
            "color": "#4285f4",
            "id": "inbox",
            "image": "resources/ginbox_icon.png",
            "source": "Inbox",
            "text": "You received a new email",
            "content": "<h2>Content</h2>"
        },
        {
            "title": "Recipes",
            "color": "#455A64",
            "id": "recipes",
            "image": "resources/recipes.jpg",
            "source": "Google",
            "text": "See recipes for you",
            "content": "<h2>Content</h2>"
        },
        {
            "title": "Maps",
            "color": "#689df6",
            "id": "maps",
            "image": "resources/ist.png",
            "source": "Maps",
            "text": "45 min drive to Work",
            "content": "<h2>Content</h2>"
        },
        {
            "title": "Alpha",
            "color": "#3F51B5",
            "id": "alpha",
            "image": "resources/empty.png",
            "source": "",
            "text": "Story Alpha",
            "content": "<h2>Content</h2>"
        },
        {
            "title": "Story Eta",
            "color": "#00695C",
            "id": "eta",
            "image": "resources/empty.png",
            "source": "",
            "text": "Story Eta",
            "content": "<h2>Content</h2>"
        },
        {
            "title": "Story Zeta",
            "color": "#827717",
            "id": "zeta",
            "image": "resources/empty.png",
            "source": "",
            "text": "Story Zeta",
            "content": "<h2>Content</h2>"
        },
        {
            "title": "Story theta",
            "color": "#E65100",
            "id": "theta",
            "image": "resources/empty.png",
            "source": "",
            "text": "Story Theta",
            "content": "<h2>Content</h2>"
        },
        {
            "title": "Story Iota",
            "color": "#1B5E20",
            "id": "iota",
            "image": "resources/empty.png",
            "source": "",
            "text": "Story Iota",
            "content": "<h2>Content</h2>"
        }
    ];

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
    var fuse = new Fuse(appDataList, options); // "list" is the item array

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

    $(document).click(function () {
        if (statusMenu.hasClass("active")) {
            statusMenu.removeClass("active");
            showHome();
            showAppHistory();
        } else if (menu.hasClass("active")) {
            menu.removeClass("active");
        }
    });

    googleSearch.click(activateGoogleSearch);

    function activateGoogleSearch() {
        home.css({ "top": homeMax + "px" });
        appHistory.css({ "transform": "translateY(" + homeMax + "px)" });
        showSearchInput();
        searchInput.focus();
    }

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
            lockScreen.hide();
            lockHour.show();
            lockOptionsButton.show();
            lockOptionsButton.css('opacity', '1');
            lockOptions.removeClass("active");
            lockOptions.css('opacity', '0');
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

        if (statusMenu.hasClass("active")) {
            statusMenu.removeClass("active");
            showHome();
            showAppHistory();
        } else {
            statusMenu.addClass("active");
            hideHome();
            hideAppHistory();
        }
    });

    statusMenu.click(function () {
        event.stopPropagation();
    });

    signOutButton.click(function () {
        lockScreen.show();
        statusMenu.removeClass("active");
        showHome();
    });

    homeButton.click(function () {
        if (openedAppObj != undefined) {
            openedAppObj.close();
        }
        showHome();
        showAppHistory();
        menu.removeClass("active");
        showStatusBar();
    });

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
            homeCards.append('<div class="card" id="' + apps[i].id + '">' +
                '<img class="card_image" src="' + apps[i].image + '">' +
                '<div class="card-content">' +
                '<h6 class="card_header">' + apps[i].source + '</h6>' +
                '<h5 class="card_text">' + apps[i].text + '</h5>' +
                '</div>' +
                '</div>');
        }
    }

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

    $("#app_history").on("click", ".app_container", function (e) {
        console.log("Click Card: ", e.currentTarget.id);
        var cardId = e.currentTarget.id;
        openedAppObj = new App(cardId);
    });

    Number.prototype.roundTo = function (nTo) {
        nTo = nTo || 10;
        return Math.round(this * (1 / nTo)) * nTo;
    }

    //Home Drag
    home.draggable({
        axis: "y",
        scroll: false,
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
            console.log("Battery charging? "
                + (battery.charging ? "Yes" : "No"));
        }

    });

    var appData = {
        "inbox": {
            "title": "Inbox",
            "color": "#4285f4",
            "content": "<h2>Content</h2>"
        },
        "recipes": {
            "title": "Recipes",
            "color": "#455A64",
            "content": "<h2>Content</h2>"
        },
        "maps": {
            "title": "Maps",
            "color": "#689df6",
            "content": "<h2>Content</h2>"
        },
        "alpha": {
            "title": "Alpha",
            "color": "#3F51B5",
            "content": "<h2>Content</h2>"
        },
        "eta": {
            "title": "Story Eta",
            "color": "#00695C",
            "content": "<h2>Content</h2>"
        },
        "zeta": {
            "title": "Story Zeta",
            "color": "#827717",
            "content": "<h2>Content</h2>"
        },
        "theta": {
            "title": "Story theta",
            "color": "#E65100",
            "content": "<h2>Content</h2>"
        },
        "iota": {
            "title": "Story Iota",
            "color": "#1B5E20",
            "content": "<h2>Content</h2>"
        }
    };

    class OpenApps {
        constructor() {
            this.appList = [];
            this.numberOfApps = 0;
        }

        addApp(app) {
            if (app instanceof App) {
                this.refreshList(app);
                this.appList.push(app.id);
                console.log("App list", this.appList);
                this.updateUI();
            }
        }

        removeApp(index) {
            this.appList.splice(index, 1);
        }

        openAppsSize() {
            return this.appList.length;
        }

        getApp(index) {
            var id = this.appList[index]
            return [appData[id], id];
        }

        refreshList(app) {
            var appId = app.id;
            for (var i = 0; i < this.openAppsSize(); i++) {
                if (this.appList[i] == appId) {
                    this.removeApp(i);
                    break;
                }
            }
        }

        updateUI() {
            bigCards.empty();
            smallCards.empty();

            for (var i = 0; i < this.openAppsSize(); i++) {
                var app = this.getApp(i)[0];
                var id = this.getApp(i)[1];
                var card = '<div class="history_card" style="border-top: 5px solid ' + app.color + '"></div>';
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

})
