'use strict';
(function(){

    /**
     * App
     */
    angular
        .module('app', [   
            'ngRoute',
            
            'app.service.module',
            'app.component.module'            
        ])
        .run(initialize);

    //////////////

    function initialize(){
        console.log('on load!');
    }


})();

