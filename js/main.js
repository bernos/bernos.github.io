(function() {
	$('#skip-btn').click(function() {
		$('html, body').animate({
			scrollTop: $('#content').offset().top - 66
		}, 400);
	});

	var nav = document.getElementById('nav');

	if (nav) {
		var headroom = new Headroom(document.getElementById('nav'));
		headroom.init();
	}
	
})();