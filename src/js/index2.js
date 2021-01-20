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
Promise.all([preloadImages(), preloadFonts('xha3hij')]).then(() => {
    // remove loader (loading class)
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
            translateY: map(distance, 150, -150, -90, 90),
            rotate: map(distance, 150, -150, -15, 15),
            scale: map(Math.abs(distance), 0, 50, 1, 0.5)
        };
        // for every word from the splitting object...
        for (const [_,word] of splitting.entries()) {
            // total number of characters for this word
            const charsTotal = word.chars.length;
            // for every char from each word...
            for (const [j,char] of word.chars.entries()) {
                // we want the middle chars to have a higher translationY value so it gives the illusion the word is bending
                const factor = j < Math.ceil(charsTotal/2) ? j : Math.ceil(charsTotal/2) - Math.abs(Math.floor(charsTotal/2) - j) - 1;
                char.style.transform = `scale3d(${transformVal.scale},${transformVal.scale},${transformVal.scale}) rotate3d(0,0,1,${j < charsTotal/2 ? Math.abs(factor-charsTotal/2)*transformVal.rotate : -1*Math.abs(factor-charsTotal/2)*transformVal.rotate}deg) translate3d(0,${factor*transformVal.translateY}px,0)`;
            }
        }

        // also rotate the images...
        for (const key of Object.keys(obj.currentElements)) {
            if ( obj.currentElements[key].el.classList.contains('content__img') ) {
                let progress = obj.currentElements[key].progress;
                const rotate = map(progress,0,1,-5,5);
                obj.currentElements[key].el.style.transform = `rotate3d(0,0,1,${rotate}deg)`
            }
        }
    });
});