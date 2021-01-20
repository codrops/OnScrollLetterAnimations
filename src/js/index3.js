import {map, preloadImages, preloadFonts} from './utils';
import LocomotiveScroll from 'locomotive-scroll';
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

// initialize Splitting
const splitting = Splitting();

// initialize Locomotive Scroll
const lscroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smartphone: {smooth: true},
    tablet: {smooth: true}
});

// all images
const images = [...document.querySelectorAll('.content__img')];

// Preload images and fonts
Promise.all([preloadImages(), preloadFonts('api4rrx')]).then(() => {
    // Remove loader (loading class)
    document.body.classList.remove('loading');
    // keep track of the previous and current scroll values
    let scroll = {cache: 0, current: 0};

    // Locomotive Scroll event
    lscroll.on('scroll', (obj) => {
        scroll.current = obj.scroll.y;
        const distance = scroll.current - scroll.cache;
        scroll.cache = scroll.current;
        
        // stretch the words when scrolling down
        const scaleY = map(distance, 0, 150, 1, 3);
        for (const [_,word] of splitting.entries()) {
            word.el.style.transform = `scale3d(1,${scaleY},1)`;
        }
        // scale down the images
        const scale = map(Math.abs(distance), 0, 150, 1, 0.8);
        images.forEach(imgEl => imgEl.style.transform=`scale3d(${scale},${scale},1)`);
    });

    // set up the parallax movement of the chars individually (need to set the Locomotive scroll data-scroll-speed option)
    for (const [_,word] of splitting.entries()) {
        if (word.el.classList.contains('content__text')) {
            const charsTotal = word.chars.length;
            for (const [j,char] of word.chars.entries()) {
                char.dataset.scroll = '';
                char.dataset.scrollSpeed = 1 + (j < Math.ceil(charsTotal/2) ? j : Math.ceil(charsTotal/2) - Math.abs(Math.floor(charsTotal/2) - j) - 1);
            }
        }
    }
    
    // update locomotive scroll
    lscroll.update();
});
