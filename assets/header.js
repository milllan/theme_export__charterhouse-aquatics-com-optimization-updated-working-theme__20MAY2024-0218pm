  class StickyHeader extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.header = document.getElementById('shopify-section-header');
      this.headerBounds = {};
      this.currentScrollTop = 0;
      this.preventReveal = false;
      this.predictiveSearch = this.querySelector('predictive-search');

      this.onScrollHandler = this.onScroll.bind(this);
      this.hideHeaderOnScrollUp = () => this.preventReveal = true;

      this.addEventListener('preventHeaderReveal', this.hideHeaderOnScrollUp);
      window.addEventListener('scroll', this.onScrollHandler, false);

      this.createObserver();
    }

    disconnectedCallback() {
      this.removeEventListener('preventHeaderReveal', this.hideHeaderOnScrollUp);
      window.removeEventListener('scroll', this.onScrollHandler);
    }

    createObserver() {
      let observer = new IntersectionObserver((entries, observer) => {
        this.headerBounds = entries[0].intersectionRect;
        observer.disconnect();
      });

      observer.observe(this.header);
    }

    onScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (this.predictiveSearch && this.predictiveSearch.isOpen) return;

      if (scrollTop > this.currentScrollTop && scrollTop > this.headerBounds.bottom) {
        if (this.preventHide) return;
        requestAnimationFrame(this.hide.bind(this));
      } else if (scrollTop < this.currentScrollTop && scrollTop > this.headerBounds.bottom) {
        if (!this.preventReveal) {
          requestAnimationFrame(this.reveal.bind(this));
        } else {
          window.clearTimeout(this.isScrolling);

          this.isScrolling = setTimeout(() => {
            this.preventReveal = false;
          }, 66);

          requestAnimationFrame(this.hide.bind(this));
        }
      } else if (scrollTop <= this.headerBounds.top) {
        requestAnimationFrame(this.reset.bind(this));
      }

      this.currentScrollTop = scrollTop;
    }

    hide() {
      this.header.classList.add('shopify-section-header-hidden', 'shopify-section-header-sticky');
      this.closeMenuDisclosure();
      this.closeSearchModal();
    }

    reveal() {
      this.header.classList.add('shopify-section-header-sticky', 'animate');
      this.header.classList.remove('shopify-section-header-hidden');
    }

    reset() {
      this.header.classList.remove('shopify-section-header-hidden', 'shopify-section-header-sticky', 'animate');
    }

    closeMenuDisclosure() {
      this.disclosures = this.disclosures || this.header.querySelectorAll('header-menu');
      this.disclosures.forEach(disclosure => disclosure.close());
    }

    closeSearchModal() {
      this.searchModal = this.searchModal || this.header.querySelector('details-modal');
      this.searchModal.close(false);
    }
  }

  customElements.define('sticky-header', StickyHeader);


////////////////////////////////////////////////////////////////


$('ul.list-unstyled .list-unstyled-li').mouseenter(function () {
       var index= $(this).index();
       $(this).parents('.header__inline-menu').find('.col-images .collection_image').eq(index).show(500);
     });
 $('ul.list-unstyled .list-unstyled-li').mouseleave(function () {
 var index= $(this).index();
       $(this).parents('.header__inline-menu').find('.col-images .collection_image').eq(index).hide(500);
     }
 ).mouseleave();

$('.list-menu--inline .list-menu-li .list-menu__item').mouseenter(function () {
       var index= $(this).parents('.list-menu-li').index();
       $(this).parents('.header__inline-menu').find('.main-col-images .collection_image').eq(index).show(500);
     });
 $('.list-menu--inline .list-menu-li .list-menu__item').mouseleave(function () {
 var index= $(this).parents('.list-menu-li').index();
       $(this).parents('.header__inline-menu').find('.main-col-images .collection_image').eq(index).hide(500);
     }
 ).mouseleave();

$('.mega-menu__list .mega-menu-li .mega-menu__link').mouseenter(function () {
       var index= $(this).parent('.mega-menu-li').index();
       $(this).parents('.header__inline-menu').find('.sec-main-col-images .collection_image').eq(index).show(500);
     });
 $('.mega-menu__list .mega-menu-li .mega-menu__link').mouseleave(function () {
var index= $(this).parent('.mega-menu-li').index();
       $(this).parents('.header__inline-menu').find('.sec-main-col-images .collection_image').eq(index).hide(500);
     }
 ).mouseleave(); 

      
       $('.mega-menu').hover(function(){
     //hover in
       var index= $(this).index();
       $(this).attr('open','open');
   },function(){
     //hover out
       $(this).removeAttr('open');
   });

/////////////////////////////////////////////////

$(document).ready(function() {
    $('.search__input').click(function () {
        $(this).parents('.header').find('.search-results-overlay').addClass('active');
    });
    $('.search-results-overlay').click(function () {
        $(this).removeClass('active');
    });
  });

//////////////////////////////////////////////////

function debounce(func, timeout = 300){
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
}
    
function trapFocus(element) {
      var focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
      var firstFocusableEl = focusableEls[0];  
      var lastFocusableEl = focusableEls[focusableEls.length - 1];
      var KEYCODE_TAB = 9;

      element.addEventListener('keydown', function(e) {
        var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

        if (!isTabPressed) { 
          return; 
      }

      if ( e.shiftKey ) /* shift + tab */ {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
              e.preventDefault();
            }
          } else /* tab */ {
            if (document.activeElement === lastFocusableEl) {
              firstFocusableEl.focus();
              e.preventDefault();
            }
        }
    });
}

//////////////////////////////////////////////////

$( document ).ready(function() {
    $('.list-menu-li').hover(
        function() {
    $('.mega-menu__list').css("display", "block");
  }, function() {
   $('.mega-menu__list').css("display", "none");
  }
    );
});

$( document ).ready(function() {
    $('.mega-menu-li').hover(
        function() {
    $(".header__inline-menu .mega-menu__content").css("width", "80%");
    $('.nav-child-wrapper').css("display", "block");
  }, function() {
   $(".header__inline-menu .mega-menu__content").css("width", "20%");
   $('.nav-child-wrapper').css("display", "none");
  }
    );

});

$('.header-wrapper .header .hide-desktop').on('click', function () {
    $('.boost-sd__search-bar-wrapper').removeClass('boost-sd__g-hide');
  $('.search-modal.modal__content.gradient').css("display", "none");
  $('.boost-sd__search-bar-input').trigger('click');
});



//////////////////////////////////////////////////