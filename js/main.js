(function() {
	$('#skip-btn').click(function() {
		$('html, body').animate({
			scrollTop: $('#content').offset().top - 66
		}, 400);
	});
})();