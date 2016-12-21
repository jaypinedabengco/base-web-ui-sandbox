'use strict';
(function(){

angular.module('myApp',
		[
			"ngSanitize",
			"com.2fdevs.videogular",
			"com.2fdevs.videogular.plugins.controls",
			"com.2fdevs.videogular.plugins.overlayplay",
			"com.2fdevs.videogular.plugins.poster"
		]
	)
	.controller('HomeCtrl', ["$sce", function ($sce) {
            var vm = this;

            vm.config = {};
            vm.config_source_mp4 = "";
            vm.seek_time_value = 0;
            vm.total_duration = 0;
            vm.time_skip_list = [];

            vm.vgAPI;            

            vm.initializeVideo = initializeVideo;
            vm.onChangeVideoToEarth = changeVideoToEarth;
            vm.onChangeVideoToThea = changeVideoToThea;
            vm.testSeekTime = testSeekTime;
            vm.vgPlayerReady = vgPlayerReady;
            vm.vgComplete = vgComplete;
            vm.vgUpdateTime = vgUpdateTime;
            
            activate();

            return; 

            //////////

            function activate(){
                initializeVideo();
            }

            /**
             * Initialize Video
             */
            function initializeVideo(){
                vm.config = {
                    sources : [{src : $sce.trustAsResourceUrl("http://sandbox-interview-storage.s3.amazonaws.com/test_video_1234567.mp4"), type: "video/mp4"}],
                    tracks: [
                        {
                            src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                            kind: "subtitles",
                            srclang: "en",
                            label: "English",
                            default: ""
                        }
                    ],
                    theme: "../bower_components/videogular-themes-default/videogular.css",
                    // plugins: {
                        // poster: "http://www.videogular.com/assets/images/videogular.png"
                    // }
                };             
            }

            function changeVideoToEarth(){
                vm.vgAPI.clearMedia();
                vm.vgAPI.pause();
                vm.config.sources = [
                    {
                        src : $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), 
                        type: "video/mp4"
                    }
                ];      
                vm.total_duration = 0;
                // vm.vgAPI.play();          
            }

            function changeVideoToThea(){
                vm.vgAPI.clearMedia();
                vm.vgAPI.pause();
                vm.config.sources = [
                    {
                        src : $sce.trustAsResourceUrl("http://sandbox-interview-storage.s3.amazonaws.com/test_video_1234567.mp4"), 
                        type: "video/mp4"
                    }
                ];
                vm.total_duration = 0;
                // vm.vgAPI.play();    
            }            

            function testSeekTime(time_skip){
                if ( time_skip >= 0 && time_skip <= ( vm.vgAPI.totalTime / 1000 ) )
                    vm.vgAPI.seekTime(time_skip);
            }

            function vgPlayerReady($api){
                vm.vgAPI = $api;
            }

            function vgComplete(){
                console.log('done!');
            }
            
            function vgUpdateTime($currentTime, $duration){
                console.log($currentTime, $duration);
                vm.seek_time_value = Math.floor($currentTime);
                if ( vm.total_duration <= 0 ){
                    vm.total_duration = Math.floor($duration);
                    vm.time_skip_list = [];
                    for ( var i = 0; i <= vm.total_duration; i = i + 3 ){
                        vm.time_skip_list.push(i);
                    }                    
                    if ( vm.time_skip_list.indexOf(vm.total_duration) == -1 )
                        vm.time_skip_list.push(vm.total_duration);
                }
            }

            
		}]
	);

})();