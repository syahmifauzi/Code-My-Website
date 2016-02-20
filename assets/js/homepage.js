$(document).ready(function() {
  $(document).on("scroll", onScroll);

  $('.all-site-nav').on('click', function() {
    $('.all-site-nav').removeClass('active-nav');
    $(this).addClass('active-nav');
  });

  $('.mobile-nav-toggle').on('click', function() {
    $(this).add('.header-position').toggleClass('is-open');
      isMenuOpen();
  });

  // Hide header on scroll down and show on scroll up
  // ------------------------------------------------------
  var didScroll,
      lastScrollTop = 0,
      delta = 5,
      navbarHeight = $('#homepage .header-wrap header').outerHeight(),

      menuOpenCondition = false;

  function isMenuOpen() {
    if ($('.mobile-nav-toggle').hasClass('is-open')) {
        menuOpenCondition = true;
    } else {
        menuOpenCondition = false;
    }
  }

  $(window).scroll(function() {
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();

    if(Math.abs(lastScrollTop - st) <= delta)
      return;

    if (st > lastScrollTop && st >= navbarHeight) {
      if (menuOpenCondition === true) {
        console.log('Menu still open');
      }
      else {
        $('.header-wrap header').addClass('nav-up-hide');
        $('.header-position, .mobile-nav-toggle').removeClass('is-open');
      }
    }
    else {
      if (st + $(window).height() < $(document).height()) {
        $('header').removeClass('nav-up-hide');
      }
    }

    lastScrollTop = st;
  }
  // ------------------------------------------------------

  // Smooth Scroll Up Down
  smoothScroll(400);
  function smoothScroll (duration) {
    $('a[href^="#"]').on('click', function(event) {

      var target = $( $(this).attr('href') );

      if (target.length) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, duration);
      }
    });
  }

  // Active header when scroll
  function onScroll (event) {
    var scrollPos = $(document).scrollTop();
    $('.all-site-nav').each(function() {
      var currLink = $(this),
          refElement = $(currLink.attr("href"));
      if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
        $('.all-site-nav').removeClass('active-nav');
        currLink.addClass('active-nav');
      }
    });
  }
});
