//const apiKey = 'GOLD_BCCL614web5amf6zg6kk'; // Replace with your API key
//// Initialize the video players when the DOM is loaded
//let playerconf = [];
//// document.addEventListener('DOMContentLoaded', function (e) {
////     e.preventDefault();
//// Check if the SPL library and the "window.spl.load" function are available
//const videoPlays = document.querySelectorAll('#home-post-video-slider .video-post .playercontroller');
//if (videoPlays.length > 0) {
//    videoPlays.forEach((videoPlay) => {
//        let itemId = videoPlay.getAttribute('id');
//        console.log(itemId);
//        let videoID = videoPlay.getAttribute('data-slike');
//
//        PLAYER_CONFIG1 = {
//            apiKey: apiKey,
//            contEl: itemId,
//            playsInline: true,
//            fallbackMute: false,
//            video: {
//                id: videoID,
//            },
//            player: {
//                autoPlay: false, // Enable autoPlay
//                mute: false,
//                skipAd: false,
//                volume: 100,
//                playInBackground: false,
//            },
//        };
//        playerconf.push(PLAYER_CONFIG1);
//    });
//    console.log(videoPlays.length);
//    console.log(playerconf);
//// Load the player
//
//    const videoPlaysposts = document.querySelectorAll('#home-post-video-slider .video-post');
//
//// Loop through all elements and hide them
//    videoPlaysposts.forEach((element) => {
//        element.style.opacity = '0';
//    });
//    loadVideos();
//    videoPlaysposts.forEach((element) => {
//        element.style.opacity = '1';
//    });
//// });
//}
//function loadVideos() {
//    if (window.spl && window.spl.load && playerconf) {
//        window.spl.load(playerconf[0], function (status, config) {
//            if (status) {
//                playerconf.forEach((element, index) => {
//                    player = 'player' + index + 1;
//                    window.player = new window.SlikePlayer(playerconf[index]);
//                });
////                setTimeout(function () {
//                    filterVideos();
////                }, 2000);
//
//            }
//        });
//    }
//}
////video js	
//
//function filterVideos() {
//    // Get the parent element
//    var parent = document.querySelectorAll("#cat-filter li a");
//
//// Add event listener to each link inside the parent element
//    parent.forEach(function (link) {
//        link.addEventListener("click", function (event) {
//            event.preventDefault();
//            // Remove 'active' class from all links
//            parent.forEach(function (link) {
//                link.classList.remove("active");
//            });
//            // Add 'active' class to the clicked link
//            this.classList.add("active");
//            // Extract the category from the link's href attribute
//            var cat = this.getAttribute("href").replace(/\/\s*$/, "").split('/').pop();
//            console.log(cat);
//            // Loop through the swiper slides and show/hide based on category
//            var slides = document.querySelectorAll("#home-post-video-slider .swiper-slide");
//            slides.forEach(function (slide) {
//                if (slide.classList.contains('category-' + cat)) {
//                    slide.style.display = "block";
//                } else {
//                    slide.style.display = "none";
//                }
//            });
//        });
//    });
//
//// Trigger click event on the first link to initialize the filter
//    var firstLink = document.querySelector("#cat-filter ul li:first-child a");
//    firstLink.click();
//}