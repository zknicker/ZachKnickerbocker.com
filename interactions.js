$(function() {
	$(document).on("keypress", function (e) {
   		if (e.which == 102) { // f key
   			$('.fps-meter').toggleClass('hidden');
   		}
	});
})