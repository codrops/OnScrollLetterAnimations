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

// Preload images and fonts
Promise.all([preloadImages(), preloadFonts('mmi7prs')]).then(() => {
    // Remove loader (loading class)
    document.body.classList.remove('loading');
    // update locomotive scroll
    lscroll.update();
    // keep track of the previous and current scroll values
    let scroll = {cache: 0, current: 0};

    // Locomotive Scroll event
    lscroll.on('scroll', obj => {
        scroll.current = obj.scroll.y;
        const distance = scroll.current - scroll.cache;
        scroll.cache = scroll.current;
        // translation value will be mapped in the interval of [-50,50] for a scroll distance of [150,-150]
        const transformVal = {
            translateY: map(distance, 150, -150, 30, -30),
            scale: map(Math.abs(distance), 0, 50, 1, 0.2)
        };
        // for every word from the splitting object...
        for (const [_,word] of splitting.entries()) {
            // total number of characters for this word
            const charsTotal = word.chars.length;
            // for every char from each word...
            for (const [j,char] of word.chars.entries()) {
                char.style.transform = `scale3d(${transformVal.scale},${transformVal.scale},1) translate3d(0,${transformVal.translateY*j}px,0)`;
            }
        }
    });
});
