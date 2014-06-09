(function() {

	var lineHeight = 33;

	var headerHeight = 800;

	/**
	 * Min level to fade the bg photo out to when scrolling
	 */
	var bgImageMinOpacity = 0.9;

	var bgImageScrollSpeed = 0.5;

	var titleScrollSpeed = 0.5;

	/**
	 * Do we use 3d accelerated css? We use it anywhere it is supported, except
	 * chrome under windows, because it stuffs up font rendering
	 */
	var using3d = (function() {
		//return true;
		return Modernizr.csstransforms3d && !(/Chrome/.test(navigator.userAgent) && /Windows/.test(navigator.userAgent));
	})();

	/**
	 * Precache some commonly accessed dom elements
	 */
	$backButton			= $('#back-btn');
	$bgImage 			= $('.bg-photo');
	$header 			= $('#header');
	$postTitle 			= $('.post-title');
	$postHeading 		= $('.post-title h1');
	$postSubHeading 	= $('.post-title h2');
	$meta 				= $('#header .meta');
	$skipButtonWrapper 	= $('.skip-btn-wrapper');
	$skipButton 		= $('#skip-btn');
	$page 				= $('.page');
	$content			= $('#content');

	/**
	 * Polyfill for requestAnimationFrame api
	 */
	var requestAnimFrame = (function () {
      	var func = window.requestAnimationFrame ||
        	window.webkitRequestAnimationFrame ||
          	window.mozRequestAnimationFrame ||
          	window.oRequestAnimationFrame ||
          	window.msRequestAnimationFrame ||
          	
          	function (callback, element) {
          		window.setTimeout(callback, 1000 / 60);
          	};

      	// apply to our window global to avoid illegal invocations (it's a native)
      	return function (callback, element) {
          	func.apply(window, [callback, element]);
      	};
  	})();

  	/**
  	 * Set up skip button
  	 */
	$skipButton.click(function() {
		$page.animate({
			scrollTop: $content.offset().top
		}, 400);
	});

	/**
	 * Scroll loop function using only non-accelerated css properties such as
	 * margin and position. We use this when no translate3d is available, or
	 * when we are on desktop, to overcome some font-rendering artifacts when
	 * using translate3d in desktop webkit
	 */
	function updateHeaderContentOnScroll2d() {
		var h = $header.height();
		var s = $page.scrollTop();
		var r = s / h;

		if (s > headerHeight) {
			return;
		}

		$bgImage.fadeTo(0, 1 - (r * bgImageMinOpacity));
		$bgImage.css('top', Math.round(-s * bgImageScrollSpeed));
		$postTitle.css('bottom', Math.round(33 + s * titleScrollSpeed));
	}

	/**
	 * Scroll loop function that uses hardware accelerated css properties
	 */
	function updateHeaderContentOnScroll3d() {
		var h = $header.height();
		var s = $page.scrollTop();
		var r = s / h;

		if (s > headerHeight) {
			return;
		}

		$bgImage.fadeTo(0, 1 - (r * bgImageMinOpacity));
		$bgImage.css('transform', 'translate3d(0,'+ (-s * bgImageScrollSpeed) +'px,0)');
		$postTitle.css('transform', 'translate3d(0,'+ (-s * titleScrollSpeed) +'px,0)');
	}

	var updateHeaderContentOnScroll = updateHeaderContentOnScroll2d;

	/**
	 * Set up appropriate scroll loop handlers based on browser caps
	 */
	if (using3d) {		
		updateHeaderContentOnScroll = updateHeaderContentOnScroll3d;
	}
	
	function animationLoop() {
		requestAnimFrame(animationLoop);
		updateHeaderContentOnScroll();

		/*
		var headerHeight = $header.height();
		var r = $page.scrollTop() / headerHeight;

		$bgImage.fadeTo(0, 1 - r);

		var separation = ((headerHeight * 0.1) * r);

		// Using 3d
		$postTitle.css('transform', 'translate3d(0,'+ -(separation) +'px,0)');
		$postHeading.css('transform', 'translate3d(0,'+ -2 * (separation)  +'px,0)');
		$postSubHeading.css('transform', 'translate3d(0,'+ -(separation) +'px,0)');
		$meta.css('transform', 'translate3d(0,'+ -(separation) +'px,0)');
		*/

		// Using standard css
		//$postTitle.css('bottom', 33 + ((headerHeight * 0.5) * r));
		//$skipButtonWrapper.css('margin-top', 33 + (lineHeight * 6 * r));
		//$postHeading.css('margin-bottom', 16.5 + (lineHeight * 6 * r));
	}

	requestAnimFrame(animationLoop);

	//setInterval(onScroll, 5)


	var nav = document.getElementById('nav');

	if (nav) {
		var headroom = new Headroom(document.getElementById('nav'));
		headroom.init();
	}


	function refreshBgPhotoSize() {
		$('.bg-photo.bg-photo-centered').css('left', ($(window).width() - $bgImage.width()) / 2);
	}

	$(window).resize(refreshBgPhotoSize);
	refreshBgPhotoSize();
})();