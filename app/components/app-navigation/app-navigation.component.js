'use strict';
(function(){

     angular
        .module('app.component.module')
        .component('appNavigation', {
            templateUrl : 'components/app-navigation/app-navigation.component.html',
            controller : Controller
    });

    Controller.$inject = [];
    function Controller(){

        var vm = this;

        activate();

        ///////

        function activate(){
        }

    }

})();