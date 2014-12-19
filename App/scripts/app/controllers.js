angular.module('deadlinegamedev.controllers', ['deadlinegamedev.services'])

    /* menu */
    .controller('AppCtrl', ['$scope', 'notificationSvc', function ($scope, notificationSvc) {
        var initial = window.localStorage.getItem("notification");
        $scope.notification = typeof (initial) === 'undefined' || initial != "false";
        $scope.notificationChanged = function () {
            window.localStorage.setItem("notification", this.notification == true ? "true" : "false");
            notificationSvc.sendToken();
        };
    }])

    /* games list */
    .controller('GamesCtrl', ['$scope', 'gameSvc', function ($scope, gameSvc) {
        gameSvc.all(function (games) {
            $scope.games = games;
        });

        $scope.showYoutube = function (game) {
            window.open('http://www.youtube.com/watch?v=' + game.youtube, '_blank', 'location=yes');
        };

        $scope.share = function (game) {
            window.plugins.socialsharing.share(game.description, game.title, 'http://deadlinegamedev.github.io/DeadlineGameDev/game' + game.id + '/screenshot.png', 'https://www.youtube.com/watch?v=' + game.youtube);
        };
    }])

    /* fullscreen game */
    .controller('GameCtrl', ['$scope', '$rootScope', '$stateParams', 'gameSvc', '$sce', function ($scope, $rootScope, $stateParams, gameSvc, $sce) {
        gameSvc.find($stateParams.gameId, function (game) {
            $scope.game = game;
            $scope.frameUrl = $sce.trustAsResourceUrl('http://deadlinegamedev.github.io/DeadlineGameDev/game' + $scope.game.id + '/index.html?ts=' + new Date().getTime());
        });
        
        $scope.quit = function () {
            $rootScope.backButtonOverride(true);
        };
    }])
