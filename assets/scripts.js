class ImageBanner extends HTMLElement {
    constructor() {
        super();
      
        this.currentSlide = 0;
        this.slides = this.querySelectorAll('.image-banner__slide');

        this.autoplayDelay = this.dataset.autoplay;
      
        this.selectors = {
        	arrows: this.querySelectorAll('[data-slide-change]'),
            scrollBottom: this.querySelector('[data-scroll-down]')
        };

        const options = {
            root: document,
            rootMargin: '0px',
            threshold: 1.0
        };
        const callback = function() {
            this._renderSlide(this.currentSlide);
        };
        new IntersectionObserver(callback.bind(this), options).observe(this);
        
        this._bindEvents();
    }
    _autoplay() {
        setInterval(() => {
            if (window.innerWidth > 767) return;
            this._changeSlide('next');
        }, this.autoplayDelay);
    }
    _bindEvents() {
        this.selectors.arrows.forEach(btn => {
          	btn.addEventListener('click', () => {
            	this._changeSlide(btn.dataset.slideChange);                
			});
        });

        this._autoplay();

        if (this.selectors.scrollBottom) {
          this.selectors.scrollBottom.addEventListener('click', () => window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
          }));
        }
    }
    _renderSlide() {
        let currentSlide = this.querySelector('.animated');
        if (currentSlide !== null) currentSlide.classList.remove('animated');

    	this.slides[this.currentSlide].classList.add('animated');
    }
    _changeSlide(arg) {
        arg === 'next' ? this.currentSlide += 1 : this.currentSlide -= 1;
      
        if (this.currentSlide >= this.slides.length) {
        	this.currentSlide = 0;
        } else if (this.currentSlide < 0) {
        	this.currentSlide = this.slides.length - 1;
        }
     
        this._renderSlide();
      
    }
}
customElements.define('image-banner', ImageBanner);

(function () {
    // Helpers
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();

        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight);
    }
    function detectBrowser() {
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
            return 'safari';
        }
    }

    // Global varianles
    let headerHeight = document.querySelector('.header').offsetHeight;
    document.addEventListener('resize', () => {
        headerHeight = document.querySelector('.header').offsetHeight;
    });
    document.addEventListener('scroll', () => {
        headerHeight = document.querySelector('.header').offsetHeight;
    });

    // Main
    function initTemplate() {
        // Featured collection section
        (function () {
            const sections = document.querySelectorAll('.featured-collection');

            sections.forEach(section => {
                const slider = Flickity.data(section.querySelector('[data-flickity]'));

                section.querySelectorAll('[data-slider-change]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        btn.dataset.sliderChange === 'next'
                            ? slider.next()
                            : slider.previous();
                    });
                });
            })
        })();

        // Parallax
        (function () {
            const parallax = document.querySelectorAll('[data-parallax]');
            if (parallax === null) return;
            parallax.forEach(obj => {
                let state = 0;
                let lastScrollTop = 0;
                let amplifier = parseFloat(obj.dataset.parallaxAmplifier) || 1;
                window.addEventListener('scroll', () => {

                    if (window.innerWidth < 992) return;

                    if (isElementInViewport(obj)) {

                        let st = window.pageYOffset || document.documentElement.scrollTop;
                        st > lastScrollTop
                            ? state += 0.5 * amplifier
                            : state -= 0.5 * amplifier;

                        obj.style.transform = `translateY(${state}px)`;
                        lastScrollTop = st <= 0 ? 0 : st;
                    }
                });
            });
        })();

        // Anchor links handle
        (function() {
            const links = document.querySelectorAll('a');

            function safariPolyfill() {
                let url = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
                let script = document.createElement('script');
                script.src = url;
                document.getElementsByTagName('head')[0].appendChild(script);
            }

            if (links.length < 1) return;

            if (detectBrowser() === 'safari') safariPolyfill();

            links.forEach(link => {
                let href = link.getAttribute('href');

                if (href.charAt(0) !== '#') return;

                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    let hrefTarget = document.querySelector(href),
                        topOffset = hrefTarget.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scroll({
                        top: topOffset,
                        left: 0,
                        behavior: "smooth"
                    });
                });
            });
        })();
    }

    document.addEventListener('DOMContentLoaded', initTemplate);
    // document.addEventListener('shopify:section:load', initTemplate)
})();