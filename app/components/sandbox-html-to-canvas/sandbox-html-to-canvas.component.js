'use strict';
(function(){

     angular
        .module('app.component.module')
        .component('sandboxHtmlToCanvas', {
            templateUrl : 'components/sandbox-html-to-canvas/sandbox-html-to-canvas.component.html',
            controller : Controller
    });

    Controller.$inject = [];
    function Controller(){

        var vm = this;

        vm.pdfName = "";
        vm.createRandomId = createRandomId;
        vm.content = {};

        return activate();

        /////
        function activate(){
            createRandomId();
            populateContent();
        }

        function createRandomId(){
            vm.pdfName = 'file-' + Math.random() * 10000000 + '-'+ new Date().getTime() +'sample.pdf'
        }

        function populateContent(){
            vm.content.listIds = [];
            vm.content.tableObjects = [];
            for ( var i = 1; i <= 100; i++ ){
                vm.content.listIds.push(i);
                vm.content.tableObjects.push({
                    id : i,
                    firstname : 'john' + i,
                    lastname : 'doe' + i
                });
            }
        }

    }

})();