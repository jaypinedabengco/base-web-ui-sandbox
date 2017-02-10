'use strict';
(function(){

     angular
        .module('app.component.module')
        .component('sandbox', {
            templateUrl : 'components/sandbox/sandbox.component.html',
            controller : Controller
    });

    Controller.$inject = [];
    function Controller(){

        var vm = this;

        vm.person = {
            firstname : 'john', 
            lastname : 'doe'
        };

        vm.greetPerson = greetPerson;

        return activate();

        /////
        function activate(){
            vm.greetPerson();
        }

        function greetPerson(){
            console.log("HELLO " + vm.person.firstname +"!");
        }

    }

})();