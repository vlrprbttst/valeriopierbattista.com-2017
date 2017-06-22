//smart resize
(function($, sr) {
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function(func, threshold, execAsap) {
      var timeout;

      return function debounced() {
        var obj = this,
          args = arguments;

        function delayed() {
          if (!execAsap)
            func.apply(obj, args);
          timeout = null;
        };

        if (timeout)
          clearTimeout(timeout);
        else if (execAsap)
          func.apply(obj, args);

        timeout = setTimeout(delayed, threshold || 100);
      };
    }
    // smartresize
  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };

})(jQuery, 'smartresize');


$('#bars').click(function() {
	$('#bars').toggleClass('fa-bars fa-remove');
	$('nav').toggleClass('mobile-menu-visible');
});

function navHeight() {
	var heights = window.innerHeight;
	var outerHeights = $(".sidebar .sub-container-sidebar").outerHeight(true) + $("footer .sub-container-sidebar").outerHeight(true);
	$('nav.nav ul').css('height', (heights - outerHeights) + "px");
};

navHeight();
$(window).smartresize(function() {
  navHeight();
});

// cookie management and cookie bar
function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else
		var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
		c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

(function() {
	var InfoCookieCont = jQuery('#info_cookie');
	var InfoCookieDiv = jQuery(".ok-cookie");
	InfoCookieDiv.click(function() {
		createCookie('infoCookie', 'true', 365)
		InfoCookieCont.removeClass("cookie-visible").addClass("cookie-hidden");
	});

	var InfoCookie = readCookie("infoCookie");
	if (!InfoCookie) {
		InfoCookieCont.removeClass("cookie-hidden").addClass("cookie-visible");
	}
})();

// headroom
function mobileMenu() {
	var wWidth = $(window).width();
	var myElement = document.querySelector(".sidebar");
	var headroom = new Headroom(myElement, {
		"offset" : 200,
		"tolerance" : 5
	});

	if (wWidth <= 1024) {
		headroom.init();
	} else {
		headroom.destroy();
	}
};

mobileMenu();
$(window).smartresize(function() {
  mobileMenu();
});

//share popup

$(".js-share-popup").click(function() {
  var leftPosition, topPosition;
  leftPosition = window.screen.width / 2 - (566 / 2 + 10);
  topPosition = window.screen.height / 2 - (576 / 2 + 50);
  var url = $(this).data("href");

  window.open(
    url,
    'name_' + Math.random(),
    "status = 1, height = 576, width = 566, resizable = 0,left=" +
      leftPosition +
      ",top=" +
      topPosition +
      ",screenX=" +
      leftPosition +
      ",screenY=" +
      topPosition +
      ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no"
  );
});


// google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-42737159-1', 'auto');
ga('send', 'pageview');
