window.logToScreen = function(message) {
    var logElement = document.getElementById("debugLog");
    if (logElement) {
        logElement.innerText = message + "\n" + logElement.innerText;
    }
};

angular.module('deadlinegamedev', ['ionic', 'deadlinegamedev.controllers'])

    .run(['$ionicPlatform', function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            //if (window.StatusBar) {
            //    // org.apache.cordova.statusbar required
            //    StatusBar.styleDefault();
            //}
        });
    }])

    .run(['$rootScope', 'notificationSvc', function ($rootScope, notificationSvc) {
        document.addEventListener('deviceready', function () {

            function SaveNotificationToken(token, platform) {
                notificationSvc.setToken(token, platform);
            }

            // handle APNS notifications for iOS
            window.onNotificationAPN = function(e) {
                if (e.alert) {
                    logToScreen('push-notification: ' + e.alert);
                    //    // showing an alert also requires the org.apache.cordova.dialogs plugin
                    //    navigator.notification.alert(e.alert);
                }

                //if (e.sound) {
                //    // playing a sound also requires the org.apache.cordova.media plugin
                //    var snd = new Media(e.sound);
                //    snd.play();
                //}

                //if (e.badge) {
                //    pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
                //}
            };

            // handle GCM notifications for Android
            window.onNotification = function(e) {
                logToScreen('EVENT -> RECEIVED:' + e.event);

                switch (e.event) {
                case 'registered':
                    if (e.regid.length > 0) {
                        logToScreen('REGISTERED -> REGID:' + e.regid);
                        // Your GCM push server needs to know the regID before it can push to this device
                        // here is where you might want to send it the regID for later use.
                        logToScreen("regID = " + e.regid);
                        SaveNotificationToken(e.regid, "android");
                    }
                    break;
                    case 'message':
                        
                    logToScreen('MESSAGE -> PAYLOAD: ' + angular.toJson(e.payload));

                    // if this flag is set, this notification happened while we were in the foreground.
                    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    if (e.foreground) {
                        logToScreen('--INLINE NOTIFICATION--');

                        //// on Android soundname is outside the payload. 
                        //// On Amazon FireOS all custom attributes are contained within payload
                        //var soundfile = e.soundname || e.payload.sound;
                        //// if the notification contains a soundname, play it.
                        //// playing a sound also requires the org.apache.cordova.media plugin
                        //var my_media = new Media("/android_asset/www/" + soundfile);

                        //my_media.play();

                        if (e.payload.type == "notification") {
                            if (e.payload.delete) {
                                window.plugin.notification.local.cancel(e.payload.notId);
                            } else if (e.payload.title || e.payload.message) {
                                window.plugin.notification.local.add({
                                    id: e.payload.notId,  // A unique id of the notifiction
                                    date: new Date(),    // This expects a date object
                                    message: e.payload.message,  // The message that is displayed
                                    title: e.payload.title,  // The title of the message
                                    repeat: undefined,  // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
                                    badge: undefined,  // Displays number badge to notification
                                    sound: (e.payload.defaults & 1) > 0 ? undefined : null,  // A sound to be played
                                    json: undefined,  // Data to be passed through the notification
                                    autoCancel: true, // Setting this flag and the notification is automatically canceled when the user clicks it
                                    ongoing: undefined, // Prevent clearing of notification (Android only)
                                });
                            }
                        }

                    } else { // otherwise we were launched because the user touched a notification in the notification tray.
                        if (e.coldstart)
                            logToScreen('--COLDSTART NOTIFICATION--');
                        else
                            logToScreen('--BACKGROUND NOTIFICATION--');
                    }

                    break;
                case 'error':
                    logToScreen('ERROR -> MSG:' + e.msg);
                    break;
                default:
                    logToScreen('EVENT -> Unknown, an event was received and we do not know what it is');
                    break;
                }
            };

            function tokenHandler(result) {
                logToScreen('token: ' + result);
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
                SaveNotificationToken(result, "ios");
            }

            function successHandler(result) {
                logToScreen('success:' + result);
            }

            function errorHandler(error) {
                logToScreen('error:' + error);
            }

            logToScreen('registering ' + ionic.Platform.platform());
            if (ionic.Platform.isAndroid()) {
                window.plugins.pushNotification.register(successHandler, errorHandler, { "senderID": "414059769019", "ecb": "onNotification" });
            } else if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                window.plugins.pushNotification.register(tokenHandler, errorHandler, { "badge": "true", "sound": "false", "alert": "true", "ecb": "onNotificationAPN" });
            }
        });
    }])

    .config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })
            .state('app.games', {
                url: "/games",
                views: {
                    'menuContent': {
                        templateUrl: "templates/games.html",
                        controller: 'GamesCtrl'
                    }
                }
            })
            .state('app.game', {
                url: "/games/:gameId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/game.html",
                        controller: 'GameCtrl'
                    }
                },
            });

        $urlRouterProvider.otherwise('/app/games');
        
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from outer templates domain.
            'http://deadlinegamedev.github.io/DeadlineGameDev/**'
        ]);
    }])

    .run(['$rootScope', '$ionicPlatform', '$ionicPopup', '$state', '$ionicNavBarDelegate', function ($rootScope, $ionicPlatform, $ionicPopup, $state, $ionicNavBarDelegate) {

        $rootScope
            .$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    if (fromState != toState && fromState.name == 'app.game') {
                        StatusBar.show();
                        
                        screen.unlockOrientation();
                        
                        if (typeof ($rootScope.backButtonOverrideCancel) != 'undefined') {
                            $rootScope.backButtonOverrideCancel();
                            $rootScope.backButtonOverrideCancel = undefined;
                        }
                    }
                });

        $rootScope.backButtonOverride = function (isFromCloseButton) {
            if (typeof ($rootScope.backButtonOverridePopup) === 'undefined') {
                $ionicPopup.show({
                    title: 'Please confirm',
                    template: 'The game state will not be saved.',
                    buttons: [
                        {
                            text: 'Keep playing',
                            type: 'button-default',
                            onTap: function(e) { return false; }
                        },
                        {
                            text: 'Back to menu',
                            type: 'button-positive',
                            onTap: function(e) { return true; }
                        }
                    ]
                }).then(function (res) {
                    var isOpenedFromBackButton = typeof ($rootScope.backButtonOverridePopupIsFromCloseButton) === 'undefined' || $rootScope.backButtonOverridePopupIsFromCloseButton != true;
                    var isClosedFromBackButton = typeof(res) === 'undefined';
                    if (res == true || (isClosedFromBackButton && isOpenedFromBackButton)) {
                        $ionicNavBarDelegate.back();
                    }
                    $rootScope.backButtonOverridePopup = undefined;
                });
                $rootScope.backButtonOverridePopupIsFromCloseButton = isFromCloseButton;
                $rootScope.backButtonOverridePopup = true;
            }
        };

        $rootScope
            .$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (toState.name == 'app.game') {
                        screen.lockOrientation('landscape');

                        StatusBar.hide();

                        if (typeof ($rootScope.backButtonOverrideCancel) == 'undefined') {
                            $rootScope.backButtonOverrideCancel = $ionicPlatform.registerBackButtonAction($rootScope.backButtonOverride, 100);
                        }
                    }
                });
        
    }]);
