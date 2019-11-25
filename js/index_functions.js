function toggleNav() {
	var element = document.getElementById("myNav");
	element.classList.toggle("open");
}

// function closeNav() {
// document.getElementById("myNav").remove("open");
// }

$().ready(function(){
 	$('div.logo-pop').delay(1000);
 	$('div.logo-pop').hide(300);
 	});



document.getElementById('yourBox').onchange = function() {
document.getElementById('yourText').disabled = this.checked;
};