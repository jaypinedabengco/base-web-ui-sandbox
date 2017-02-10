'use strict';
(function(){

    angular
        .module('app')
        .config(Config);


    Config.$inject = ['$locationProvider', '$routeProvider'];
    function Config($locationProvider, $routeProvider){
        $locationProvider.hashPrefix('!');

        $routeProvider
            .when('/', {
                templateUrl: 'views/home.view.html'
            })
            .when('/home', {
                templateUrl: 'views/home.view.html'
            })
            .when('/sandbox', {
                template : '<sandbox></sandbox>'
            })
            .when('/404', {
                templateUrl: 'views/404.view.html'
            })
            .otherwise('404');
    }


})();