'use strict';
/********************************************
 * For reference (on how to) : 
 *  http://pdfmake.org/#/gettingstarted
 *********************************************/
(function(){
    
    angular
        .module('app.service.module')
        .factory('pdfMakeService', Service);

    Service.$inject = ['$q'];
    function Service($q){

        var cached_converted_images = [];
        var _base_pdf_template = {}

        //base doc definition
        //set defaults here
        var _base_doc_definition = {
            pageMargins: [ 40, 40, 40, 20 ]
        };

        //images to cache
        var _images_to_convert = [
            '/resources/images/header-icon.png',
            '/resources/images/flowers.jpg',
            '/resources/images/favicon.ico'
        ];

        var services = {
            getBaseDocDefinition: getBaseDocDefinition
        }
        
        return services;
        
        //////////

        /**
         * Get Base Template 
         * 
         * return 
         *  - baseDocDefinition ( Object )
         *      * contains default 
         * 
         * NOTE 
         *      For reference (on how to) : http://pdfmake.org/#/gettingstarted
         */
        function getBaseDocDefinition(){
            var deferred = $q.defer();

            prepareAllResources().then(
                function(msg){
                    var _header = getHeader();
                    var _footer = getFooter();

                    _base_doc_definition.header = _header;
                    _base_doc_definition.footer = _footer
                    
                    deferred.resolve(_base_doc_definition);
                }
            );

            return deferred.promise;
        }

        function getHeader(){
            return function(currentPage, pageCount) { 
                var _header = { 
                        image :  cached_converted_images['/resources/images/favicon.ico'],
                        fit : [20,20],
                        alignment : 'right', 
                        margin:[10,10,0,10]
                };
                return _header;
            };      
        }

        function getFooter(){
            return function(currentPage, pageCount) { 

                var _text = [];
                if ( currentPage == pageCount ){//last
                    var date_created = 'Created at ' + moment().format('MM/DD/YYYY hh:mm:ss a');
                    _text.push({
                        text : date_created,
                        fontSize : 8,
                        italics : true
                    });

                    _text.push({
                        text : " | ", 
                        fontSize : 10,
                        bold : true
                    });
                }

                //page
                _text.push({
                    text : currentPage.toString(),
                    bold : true,
                    fontSize : 10
                });

                var _footer = {
                    text : _text,
                    alignment : 'right', 
                    margin:[0, 0, 10, 0]
                }
                return _footer;
            };
        }

        /**
         * Prepare needed Resources
         */
        function prepareAllResources(){
            var deferred = $q.defer();
            var _promises = [];

            //convert all images to base64
            _images_to_convert.forEach(function(_image_url){
                _promises.push(convertImageToBase64(_image_url));
            });

            $q.all(_promises).then(function(){
                deferred.resolve('done');
            });

            return deferred.promise;
        }

        /**
         * Convert Image To Base 64
         * 
         * returns Promise
         */
        function convertImageToBase64(_url){
            var deferred = $q.defer();
            
            var _converted_data = cached_converted_images[_url];
            if ( _converted_data  ){ //exists
                deferred.resolve(_converted_data); //resolve
            } else {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function() {
                    var canvas = document.createElement('CANVAS');
                    var ctx = canvas.getContext('2d');
                    var dataURL;
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);

                    _converted_data = canvas.toDataURL(undefined);

                    cached_converted_images[_url] = _converted_data;
                    deferred.resolve(_converted_data); //resolve
                };
                img.src = _url;
                if (img.complete || img.complete === undefined) {
                    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                    img.src = _url;
                }
            }

            return deferred.promise;            
        }

    }

})();