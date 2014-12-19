angular.module('deadlinegamedev.services', [])

    .service('gameSvc', ['$http', function($http) {

        function GameSvc() {
        }

        GameSvc.prototype.all = function(onSuccess) {
            $http.get('http://deadlinegamedev.github.io/DeadlineGameDev/meta.json?ts=' + new Date().getTime()).success(onSuccess);
        };

        GameSvc.prototype.find = function(gameId, onSuccess) {
            $http.get('http://deadlinegamedev.github.io/DeadlineGameDev/meta.json?ts=' + new Date().getTime()).success(function (games) {
                for (var i = 0; i < games.length; ++i) {
                    if (games[i].id == gameId) {
                        onSuccess(games[i]);
                        break;
                    }
                }
            });
        };
        return new GameSvc();
    }])

    .service('notificationSvc', ['$http', function ($http) {

        function NotificationSvc() {
            this.token = undefined;
            this.platform = undefined;
        }

        NotificationSvc.prototype.setToken = function (token, platform) {
            this.token = token;
            this.platform = platform;
            this.sendToken();
        };

        NotificationSvc.prototype.sendToken = function () {
            if (typeof(this.token) !== 'undefined') {
                var setting = window.localStorage.getItem("notification");
                var deleteToken = typeof(setting) !== 'undefined' && setting == "false";
                $http.post('http://notifications.deadlinegamedev.com/api/clientinfo/Post/', { "Token": this.token, "Platform": this.platform, "Delete": deleteToken });
            }
        };

        return new NotificationSvc();
    }]);
