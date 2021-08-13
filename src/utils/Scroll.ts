import { useEffect } from 'react'
// @ts-ignore
import LocomotiveScroll from "locomotive-scroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const scrollOptions = {
  smooth: true,
  getSpeed: true,
  touchMultiplier: 2.5,
  lerp: 0.1,
  firefoxMultiplier: 100,
};

const Scroll = () => {
  useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll({
      el: document.querySelector(".smooth-scroll"),
      ...scrollOptions,
    });
    locomotiveScroll.update();
    // Exposing to the global scope for ease of use.
    window.scroll = locomotiveScroll;

    ScrollTrigger.scrollerProxy(".smooth-scroll", {
      scrollTop(value) {
        return arguments.length ? locomotiveScroll.scrollTo(value, 0, 0) : locomotiveScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      //@ts-ignore
      pinType: document.querySelector(".smooth-scroll").style.transform ? "transform" : "fixed",
    });
    ScrollTrigger.addEventListener("refresh", () => locomotiveScroll.update());
    ScrollTrigger.refresh();

    return () => {
      if (locomotiveScroll) locomotiveScroll.destroy();
    };
  }, []);

  return null
};

export default Scroll;
