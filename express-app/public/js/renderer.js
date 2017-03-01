//template js, we need??
$(document).ready(function(){


  $(".submenu > a").click(function(e) {
    e.preventDefault();
    var $li = $(this).parent("li");
    var $ul = $(this).next("ul");

    if($li.hasClass("open")) {
      $ul.slideUp(350);
      $li.removeClass("open");
    } else {
      $(".nav > li > ul").slideUp(350);
      $(".nav > li").removeClass("open");
      $ul.slideDown(350);
      $li.addClass("open");
    }
  });






// function to tell if online
function isOnline() {
  console.log(navigator.onLine)
	if (navigator.onLine) {
    document.getElementById('estudios-btn').disabled = false
  }
	else 
    document.getElementById('estudios-btn').disabled = true
}

// isOnline()
window.addEventListener('online',  isOnline)
window.addEventListener('offline',  isOnline)

isOnline()

});
