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
            .when('/sandbox-html-to-canvas', {
                template : '<sandbox-html-to-canvas></sandbox-html-to-canvas>'
            })
            .when('/sandbox-pdf-make', {
                template : '<sandbox-pdf-make></sandbox-pdf-make>'
            })            
            .when('/404', {
                templateUrl: 'views/404.view.html'
            })
            .otherwise('404');
    }


})();