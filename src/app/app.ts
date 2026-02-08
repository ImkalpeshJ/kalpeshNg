import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  isDarkMode = false;
  isMobileMenuOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initTheme();
      this.initAnimations();
      this.initProgressBar();
    }
  }

  toggleTheme(event: any) {
    const isChecked = event.target.checked;
    this.isDarkMode = isChecked;
    this.applyTheme(this.isDarkMode);
  }

  applyTheme(isDark: boolean) {
    const html = document.documentElement;
    if (isDark) {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.isDarkMode = true;
      this.applyTheme(true);
    } else {
      this.isDarkMode = false;
      // Ensure default light
      this.applyTheme(false);
    }
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  initProgressBar() {
    window.addEventListener("scroll", () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      const pb = document.getElementById("progressBar");
      if (pb) pb.style.width = scrolled + "%";
    });
  }

  initAnimations() {
    const safeSelect = (sel: string) => {
      const els = document.querySelectorAll(sel);
      return els.length > 0 ? gsap.utils.toArray(els) : [];
    };

    /* NAV INTRO */
    const nav = document.querySelector(".navbar");
    if (nav) {
      gsap.from(nav, {
        y: -80,
        opacity: 0,
        duration: 1,
        clearProps: "all"
      });
    }

    /* HERO ANIMATION */
    gsap.from(safeSelect(".hero-title"), {
      y: 100,
      opacity: 0,
      filter: "blur(20px)",
      duration: 1.5,
      ease: "power4.out",
      clearProps: "all"
    });

    gsap.from(safeSelect(".hero-sub"), {
      y: 50,
      opacity: 0,
      filter: "blur(10px)",
      duration: 1.2,
      delay: .3,
      ease: "power3.out",
      clearProps: "all"
    });

    gsap.from(safeSelect(".hero-desc"), {
      y: 40,
      opacity: 0,
      filter: "blur(10px)",
      duration: 1.2,
      delay: .5,
      ease: "power3.out",
      clearProps: "all"
    });

    const ctaLinks = safeSelect(".hero-cta a");
    if (ctaLinks.length > 0) {
      gsap.from(ctaLinks, {
        y: 30,
        opacity: 0,
        filter: "blur(5px)",
        stagger: .2,
        duration: 1,
        delay: .7,
        ease: "power3.out",
        clearProps: "all"
      });
    }

    /* SECTION REVEAL */
    gsap.utils.toArray(".section").forEach((sec: any) => {
      const children = sec.querySelectorAll(".card, .project-card, .skill");
      if (children.length > 0) {
        gsap.from(gsap.utils.toArray(children), {
          scrollTrigger: {
            trigger: sec,
            start: "top 85%"
          },
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: .8,
          clearProps: "y,opacity"
        });
      }
    });

    /* SKILL METERS */
    document.querySelectorAll(".meter div").forEach((bar: any) => {
      gsap.to(bar, {
        width: (bar as HTMLElement).dataset['width'],
        duration: 1.4,
        scrollTrigger: {
          trigger: bar,
          start: "top 90%"
        }
      });
    });

    /* PARALLAX BG */
    gsap.to(".hero-bg", {
      y: 120,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        scrub: true
      }
    });

    /* TIMELINE ANIMATION */
    const timelineItems = safeSelect(".timeline-item");
    if (timelineItems.length > 0) {
      gsap.from(timelineItems, {
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 80%"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        clearProps: "all"
      });
    }

    /* MARQUEE ANIMATION */
    const row1 = document.querySelector("#marquee-left .tech-track");
    const row2 = document.querySelector("#marquee-right .tech-track");

    if (row1 && row2) {
      // Row 1
      const t1 = gsap.to(row1, {
        x: "-50%",
        duration: 20,
        ease: "none",
        repeat: -1
      });

      // Row 2
      gsap.set(row2, { x: "-50%" });
      const t2 = gsap.to(row2, {
        x: "0%",
        duration: 20,
        ease: "none",
        repeat: -1
      });

      const wrapper = document.querySelector(".tech-marquee-wrapper");
      if (wrapper) {
        wrapper.addEventListener("mouseenter", () => {
          gsap.to([t1, t2], { timeScale: 0.1, duration: 0.5 });
        });
        wrapper.addEventListener("mouseleave", () => {
          gsap.to([t1, t2], { timeScale: 1, duration: 0.5 });
        });
      }
    }
  }
}
