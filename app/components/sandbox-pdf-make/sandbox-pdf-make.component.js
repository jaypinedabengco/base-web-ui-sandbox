'use strict';
(function(){

     angular
        .module('app.component.module')
        .component('sandboxPdfMake', {
            templateUrl : 'components/sandbox-pdf-make/sandbox-pdf-make.component.html',
            controller : Controller
    });

    Controller.$inject = ['pdfMakeService'];
    function Controller(pdfMakeService){

        var vm = this;

        vm.pdf_DocDefinition = {};
        vm.generatedPDF;
        vm.pdf_name = "pdfmake-sample.pdf"

        vm.viewPDF = viewPDF;
        vm.downloadPDF = downloadPDF;
        vm.refreshPDFContent = refreshPDFContent;

        vm.base64Images = {}

        vm.sampleData = {};
        
   
        return activate();

        /////
        function activate(){
            refreshPDFContent();
        }

        function refreshPDFContent(){
            populateSampleData();
            populateFromService();            
        }

        function downloadPDF(){
             pdfMake.createPdf(vm.pdf_DocDefinition).download(vm.pdf_name);
        }

        function viewPDF(){
             pdfMake.createPdf(vm.pdf_DocDefinition).open();
        }        

        function populateSampleData(){
            vm.sampleData = {
                firstname : 'John', 
                lastname : 'Doe'
            };

            vm.sampleData.friendsList = [];
            for ( var i = 0; i <= 100; i++ ){
                vm.sampleData.friendsList.push({
                    firstname : 'John', 
                    lastname : 'Smith' + i, 
                    age : (Math.ceil(Math.random() * 75))
                });
            }
        }

        function populateFromService(){
            pdfMakeService
                .getBaseDocDefinition()
                .then(function(baseDocDefinition){

                /* - PREPARE Contents - */

                var _user_data = vm.sampleData;


                var _user_column = pdfMakeService.createHeaderInformationColumnObject();
                    _user_column.addContent("User", _user_data.firstname + ' ' + _user_data.lastname);
                var _header_info = pdfMakeService.createHeaderInformationContainer(_user_column);


                var _table_friends_list =  pdfMakeService.createTable(
                                                    ['Firstname', 'Lastname', 'Age', 'Real Friend?'],
                                                    ['*', '*', 'auto', 'auto']
                                            );

                //process body
                _user_data.friendsList.forEach(function(_friend){
                    var _real_friend = ( Math.floor(Math.random() * 1000 ) % 2 );

                    var _field_icon = "cached_x_icon";
                    if ( _real_friend )
                        _field_icon = "cached_check_icon";

                    _table_friends_list.body.push([
                                                    pdfMakeService.createTableField(_friend.firstname), 
                                                    pdfMakeService.createTableField(_friend.lastname), 
                                                    pdfMakeService.createTableField(_friend.age),
                                                    pdfMakeService.createTableFieldForIcon(_field_icon)
                                                ]);                
                });

                 /* - END - */
                
                vm.pdf_DocDefinition = baseDocDefinition;
                vm.pdf_DocDefinition.content = [
                    _header_info,
                    {
                        table : _table_friends_list,
                    }                
                ];

                // loadPDFToIFrame();
                
            });
        }

        function loadPDFToIFrame(){
             var pdfDocGenerator = pdfMake.createPdf(vm.pdf_DocDefinition);
             pdfDocGenerator.getDataUrl(function(dataUrl){
                  const targetElement = document.querySelector('#iframeContainer');
                  const iframe = document.createElement('iframe');
                  iframe.src = dataUrl;
                  targetElement.innerHTML = "";
                  targetElement.appendChild(iframe);
             })
        }


    }

})();