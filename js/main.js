(function() {

	var lineHeight = 33;

	$('#skip-btn').click(function() {
		$('.page').animate({
			scrollTop: $('#content').offset().top
		}, 400);
	});


	$page = $('.page');
	$header = $('#header');
	$bgImage = $('.bg-photo');
	$postTitle = $('.post-title');
	$skipButtonWrapper = $('.skip-btn-wrapper');
	$postHeading = $('.post-title h1');
	$postSubHeading = $('.post-title h2');
	$meta = $('#header .meta');
	$bgImage.css('transform', 'translate3d(0,0,0)')

	// TODO: Use requestAnimationframe for transitions.

	function onScroll() {
		var headerHeight = $header.height();
		var r = $page.scrollTop() / headerHeight;
		console.log("scroll", 1 - r);

		$bgImage.fadeTo(0, 1 - r);

		var separation = ((headerHeight * 0.1) * r);

		// Using 3d
		$postTitle.css('transform', 'translate3d(0,'+ -(separation) +'px,0)');
		$postHeading.css('transform', 'translate3d(0,'+ -2 * (separation)  +'px,0)');
		$postSubHeading.css('transform', 'translate3d(0,'+ -(separation) +'px,0)');
		$meta.css('transform', 'translate3d(0,'+ -(separation) +'px,0)');


		// Using standard css
		//$postTitle.css('bottom', 33 + ((headerHeight * 0.5) * r));
		//$skipButtonWrapper.css('margin-top', 33 + (lineHeight * 6 * r));
		//$postHeading.css('margin-bottom', 16.5 + (lineHeight * 6 * r));
	}

//	setInterval(onScroll, 5)


	var nav = document.getElementById('nav');

	if (nav) {
		var headroom = new Headroom(document.getElementById('nav'));
		headroom.init();
	}


	function refreshBgPhotoSize() {
		console.log("refreshing size", arguments)

		$bgImage.css('left', ($(window).width() - $bgImage.width()) / 2);

	}

	$(window).resize(refreshBgPhotoSize);
	refreshBgPhotoSize();
})();