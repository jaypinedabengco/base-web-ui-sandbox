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
            var _user_data = vm.sampleData;
            var _text_greetings = [ 
                                        'Hello ', 
                                        _user_data.firstname + ' ' + _user_data.lastname + '! ', 
                                        'How are you?'
                                    ];

            var _table_body_friends_list = [];
            _table_body_friends_list.push(['Firstname', 'Lastname', 'Age']);//header
            _user_data.friendsList.forEach(function(_friend){
                _table_body_friends_list.push([_friend.firstname, _friend.lastname, _friend.age]);                
            });

            pdfMakeService.getBaseDocDefinition().then(function(baseDocDefinition){
                vm.pdf_DocDefinition = baseDocDefinition;
                vm.pdf_DocDefinition.content = [
                    {
                        text : _text_greetings
                    },
                    {
                        table : {
                            headerRows : 1,
                            widths : ['auto', 'auto', 'auto'],
                            body : _table_body_friends_list
                        }
                    }                    
                ];

                loadPDFToIFrame();
                
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