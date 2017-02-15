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

        //images to cache
        var _images_to_convert_location = "/resources/images/"
        var _images_to_convert = [
            'pdf-header-logo.png',
            'check-icon.png',
            'x-icon.png'
        ];

        var _cached_converted_images = [];
        var _base_pdf_template = {}

        //Services
        var services = {
            getBaseDocDefinition: getBaseDocDefinition,
            createTable : createTable,
            createTableHeader : createTableHeader,
            createTableField : createTableField,
            createTableFieldForIcon : createTableFieldForIcon,             
            createColumnField : createColumnField,
            createTitle : createTitle,
            createLineSeperator : createLineSeperator,
            convertImageToBase64 : convertImageToBase64,
            createPDFName : createPDFName
        }
        
        return services;
        
        //////////

        /**
         * Get Base Template 
         * 
         * return 
         *  - baseDocDefinition ( Object )
         *      * header
         *      * footer
         *      * images
         *      * styles
         *      * date_created
         * 
         * NOTE 
         *      For reference (on how to) : http://pdfmake.org/#/gettingstarted
         */
        function getBaseDocDefinition(date_created){
            var deferred = $q.defer();

            //prepare resources first, like convert all images to base 64, etc.
            prepareAllResources().then(
                function(msg){

                    var _base_doc_definition = createBaseDocDefinitionDefaults();

                    //get base contents
                    if ( !date_created )
                        date_created = moment(date_created).format('YYYY-MM-DD hh:mm a');

                    var _image_dictionaries = getImageDictionaries();
                    var _style_dictionaries = getStyleDictionaries();
                    var _header = getHeader();
                    var _footer = getFooter('Generated on ' + date_created);

                    //build initial doc definition
                    _base_doc_definition.images = _image_dictionaries;
                    _base_doc_definition.styles = _style_dictionaries;
                    _base_doc_definition.header = _header;
                    _base_doc_definition.footer = _footer;  
                    _base_doc_definition.date_created = date_created;                  
                    
                    deferred.resolve(_base_doc_definition);
                }
            );

            return deferred.promise;
        }

        function createBaseDocDefinitionDefaults(){
            return {
                pageMargins: [ 40, 40, 40, 40 ]
            }
        }

        /**********************************
         * ----CONTENT BUILDERs----
         **********************************/

        /**
         * SET style dictionaries here
         */
        function getStyleDictionaries(){
            return {
                style_header_with_image : {
                     alignment : 'left', 
                     margin:[40,10,10,30]
                },
                style_footer : {
                    alignment : 'right', 
                    margin:[0, 20, 10, 0]
                },
                style_title : {
                    fontSize: 22,
                    alignment : 'center', 
                    bold:true
                },
                style_line_seperator : {
                    margin : [0,10,0,10]
                },
                style_table_header : {
                    bold: true, 
                    alignment : 'center'
                }, 
                style_table_field : {
                    margin:[2, 2, 2, 2], 
                    fontSize:10                 
                },
                style_table_field_for_icon : {
                    alignment : 'center'      
                },                

            }
        }

        /**
         * SET Image Dictionaries
         */
        function getImageDictionaries(){
            return {
                cached_image_header_logo : _cached_converted_images['pdf-header-logo.png'],
                cached_check_icon : _cached_converted_images['check-icon.png'],
                cached_x_icon : _cached_converted_images['x-icon.png']                
            }
        }

        /**
         * HEADER
         */
        function getHeader(){
            return function(currentPage, pageCount) { 
                if ( currentPage == 1 ){ //on start only
                    var _header = { 
                            image :  'cached_image_header_logo',
                            fit: [150, 150],
                            style : ['style_header_with_image']
                    };
                    return _header;
                }

                return "";

            };      
        }

        /**
         * FOOTER
         */
        function getFooter(date_created){
            return function(currentPage, pageCount) { 

                var _text = [];

                //page
                _text.push({
                    text : currentPage.toString() + '/' + pageCount.toString(),
                    bold : true,
                    fontSize : 10
                });

                var _footer = {
                    text : _text,
                    style : ['style_footer']
                }
                return _footer;
            };
        }

        /************************************************************
         *  Content Container Builders
         *  - Tables
         *  - Columns
         *************************************************************/

        /**
         * Contents should be added this way
         * 
         * var _table = createTable(['head1','head2'], [*,'auto']);
         * _table.body.push(['data1a', 'data2a']);
         * _table.body.push(['data1b', 'data2b']);
         */
        function createTable(_headers, _width_per_headers){

            //initialize table
           var _table = {   
                headerRows : 1,
                widths : _width_per_headers,
                body : [],                            
                margin : 10,
                alignment : 'center'
            }

            //add headers, format using createTableHeader function
            var _converted_header = [];
            _headers.forEach(function(_header){
                _converted_header.push(services.createTableHeader(_header));
            });
            _table.body.push(_converted_header); 

            return _table;            
        }        

        function createTableHeader(data){
            return {text : data, style : ['style_table_field', 'style_table_header']}
        }

        function createTableField(data){
            return {text : data, style : ['style_table_field']}
        }        

        function createTableFieldForIcon(icon){
            var _image = getImageDictionaries()[icon];
            if ( !_image ){
                console.log("icon " + icon + " not found on image dictionary");
                return createTableField("image " + icon + " not found on image dictionary")
            }

            return { 
                        image : icon, 
                        fit: [10,10],
                        style : ['style_table_field', 'style_table_field_for_icon'] 
                    }
        }           

        function createColumnField(label, value){
            return {
                    text : [
                            { text : label + " ",  bold: true }, 
                            value
                        ]
                    };
        }

        /**
         * Create Line seperator using canvas
         *  * lineWidth - set height of line
         * 
         * reference : https://github.com/bpampuch/pdfmake/issues/2
         */
        function createLineSeperator(lineWidth){
            if ( lineWidth >= 0 == false)
                lineWidth = 2;//default
            return {
                canvas: [
                            {
                                type: 'line',
                                x1: 0,
                                y1: 5,
                                x2: 520,
                                y2: 5,
                                lineWidth: lineWidth
                            }
                        ],
                style : ['style_line_seperator']
            }
        }

        function createTitle(value){
            return {
                text : value, 
                style : ['style_title']
            }
        }

        /**
         * 
         */
        function createPDFName(_initial_name, _type){

            var _pdf_file_name = [
                                    _initial_name, 
                                    _type, 
                                    new Date().getTime() + '.pdf'
                                ].join('-');

            return _pdf_file_name
                        .replace(' ', '')
                        .replace(/\s+/g, '-')
                        .replace(/\//g, '');             
        }


        /**********************************
         * ----Utilities----
         **********************************/

        /**
         * Prepare needed Resources
         */
        function prepareAllResources(){
            var deferred = $q.defer();
            var _promises = [];

            //convert all images to base64
            _images_to_convert.forEach(function(_image_name){
                _promises.push(convertAndCacheImageToBase64(_image_name));
            });

            $q.all(_promises).then(function(){
                deferred.resolve('done');
            });

            return deferred.promise;
        }


        /************************************
         * Convert & Cache Image To Base 64
         *  - private use only, not accessible outside
         * returns Promise
         *************************************/
        function convertAndCacheImageToBase64(image_name){

            var deferred = $q.defer();

            if ( _cached_converted_images[image_name] ){
                deferred.resolve(_cached_converted_images[image_name]);
            } else {
                convertImageToBase64(_images_to_convert_location + image_name, function(base64_value){
                    _cached_converted_images[image_name] = base64_value;
                    deferred.resolve(base64_value);
                });
            }
                
            return deferred.promise;

        }

        /************************************
         * Convert Image To Base 64
         * 
         * returns Promise
         *************************************/
        function convertImageToBase64(_url, callback){
            var deferred = $q.defer();
            
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);

                var _converted_data = canvas.toDataURL(undefined);
                    
                deferred.resolve(_converted_data); //resolve

                if ( callback instanceof Function )
                    callback(_converted_data);
            };
            img.src = _url;
            if (img.complete || img.complete === undefined) {
                img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                img.src = _url;
            }

            return deferred.promise;            
        }

    }

})();