/* ═══════════════════════════════════════
   GRANDMARK.EVENT — script.js
   Mobile-Optimized & Performance-Tuned
   ═══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  /* ── Detect touch/mobile ── */
  const isTouchDevice = () =>
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const isReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Navbar scroll effect (throttled) ── */
  const navbar = document.getElementById("navbar");
  let scrollTicking = false;

  const handleNavScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        requestAnimationFrame(handleNavScroll);
        scrollTicking = true;
      }
    },
    { passive: true },
  );

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  const closeMenu = () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    hamburger.classList.add("open");
    navLinks.classList.add("open");
    document.body.style.overflow = "hidden";
    hamburger.setAttribute("aria-expanded", "true");
  };

  hamburger.addEventListener("click", () => {
    if (navLinks.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on nav link click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on outside tap (mobile)
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Swipe-up to close mobile menu
  let touchStartY = 0;
  navLinks.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  navLinks.addEventListener(
    "touchend",
    (e) => {
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (deltaY < -60) closeMenu();
    },
    { passive: true },
  );

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll(".reveal");

  if (isReducedMotion()) {
    // Instantly show all for reduced motion
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    // Assign stagger delays based on sibling index
    revealEls.forEach((el) => {
      const siblings = Array.from(el.parentElement.querySelectorAll(".reveal"));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = idx * 75 + "ms";
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ── Hero elements auto-reveal on load ── */
  if (!isReducedMotion()) {
    setTimeout(() => {
      document.querySelectorAll(".hero .reveal").forEach((el, i) => {
        setTimeout(() => el.classList.add("visible"), i * 160);
      });
    }, 150);
  }

  /* ── Active nav link highlight (throttled) ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');
  let navTicking = false;

  const highlightNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navLinkEls.forEach((a) => {
          const isActive = a.getAttribute("href") === "#" + id;
          a.style.color = isActive ? "var(--gold-light)" : "";
        });
      }
    });
    navTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!navTicking) {
        requestAnimationFrame(highlightNav);
        navTicking = true;
      }
    },
    { passive: true },
  );

  /* ── Contact form (EmailJS) ── */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;

      btn.textContent = "Sending...";
      btn.style.opacity = "0.7";
      btn.disabled = true;

      emailjs
        .sendForm("service_tmd7w7q", "template_9f3ycej", form)
        .then(() => {
          btn.textContent = "✦ Message Sent! We'll be in touch.";
          btn.style.background = "linear-gradient(135deg, #5a7a5a, #7aaa7a)";
          btn.style.opacity = "1";
          setTimeout(() => {
            btn.textContent = original;
            btn.style.background = "";
            btn.disabled = false;
            form.reset();
          }, 3500);
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          btn.textContent = "Failed. Please try again.";
          btn.style.background = "linear-gradient(135deg, #7a3a3a, #aa5a5a)";
          btn.style.opacity = "1";
          setTimeout(() => {
            btn.textContent = original;
            btn.style.background = "";
            btn.disabled = false;
          }, 3000);
        });
    });
  }

  /* ── Gallery placeholder patterns ── */
  const placeholders = document.querySelectorAll(".gi-placeholder");
  const patterns = [
    "radial-gradient(ellipse at 30% 40%, #3a2f10 0%, #1a1508 60%, #0f0d06 100%)",
    "radial-gradient(ellipse at 70% 30%, #2a2518 0%, #12100a 60%, #0a0908 100%)",
    "radial-gradient(ellipse at 40% 70%, #251510 0%, #150c0a 60%, #0d0805 100%)",
    "radial-gradient(ellipse at 60% 50%, #102018 0%, #081008 60%, #050a05 100%)",
    "radial-gradient(ellipse at 50% 30%, #201018 0%, #100810 60%, #080508 100%)",
  ];
  placeholders.forEach((el, i) => {
    el.style.background = patterns[i % patterns.length];
    el.style.position = "relative";
    const star = document.createElement("div");
    star.setAttribute("aria-hidden", "true");
    star.innerHTML = "✦";
    star.style.cssText = `
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
      color:rgba(201,168,76,0.1);
      font-size:3.5rem;
      pointer-events:none;
      user-select:none;
    `;
    el.appendChild(star);
  });

  /* ── Parallax on hero glow orbs (desktop only, throttled) ── */
  if (!isTouchDevice() && !isReducedMotion()) {
    const glows = document.querySelectorAll(".hero-glow");
    let parallaxTicking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (!parallaxTicking) {
          requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            glows.forEach((glow, i) => {
              const speed = 0.06 + i * 0.03;
              glow.style.transform = `translateY(${scrolled * speed}px)`;
            });
            parallaxTicking = false;
          });
          parallaxTicking = true;
        }
      },
      { passive: true },
    );
  }

  /* ── Number counter animation for hero stats ── */
  if (!isReducedMotion()) {
    const statNums = document.querySelectorAll(".stat-num");
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const raw = el.textContent;
          if (!/\d/.test(raw) || raw.includes("100")) {
            countObserver.unobserve(el);
            return;
          }
            const num = parseInt(raw.replace(/\D/g, ""), 10);
            const suffix = raw.replace(/\d/g, "");
            let start = 0;
            const duration = 1400;
            const steps = Math.ceil(duration / 16);
            const increment = Math.ceil(num / steps);
            const counter = setInterval(() => {
              start = Math.min(start + increment, num);
              el.textContent = start + suffix;
              if (start >= num) clearInterval(counter);
            }, 16);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );
    statNums.forEach((el) => countObserver.observe(el));
  }

  /* ── Cursor gold trail (desktop only) ── */
  if (!isTouchDevice() && !isReducedMotion() && window.innerWidth > 1024) {
    const trail = document.createElement("div");
    trail.setAttribute("aria-hidden", "true");
    trail.style.cssText = `
      position:fixed;width:7px;height:7px;border-radius:50%;
      background:var(--gold);opacity:0;pointer-events:none;
      z-index:9999;transition:opacity 0.3s ease;
      mix-blend-mode:screen;transform:translate(-50%,-50%);
      will-change:left,top;
    `;
    document.body.appendChild(trail);

    let mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    let trailHideTimer;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      trail.style.opacity = "0.55";
      clearTimeout(trailHideTimer);
      trailHideTimer = setTimeout(() => (trail.style.opacity = "0"), 1200);
    });

    const animTrail = () => {
      tx += (mx - tx) * 0.1;
      ty += (my - ty) * 0.1;
      trail.style.left = tx + "px";
      trail.style.top = ty + "px";
      requestAnimationFrame(animTrail);
    };
    animTrail();
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ── Fix viewport height for mobile browsers (address bar issue) ── */
  const setVh = () => {
    document.documentElement.style.setProperty(
      "--vh",
      window.innerHeight * 0.01 + "px",
    );
  };
  setVh();
  window.addEventListener("resize", setVh, { passive: true });
});
/* ── Floating Contact Widget ── */
(function () {
  const toggle   = document.getElementById("floatToggle");
  const floatWA  = document.getElementById("floatWA");
  const floatCall= document.getElementById("floatCall");
  const widget   = document.getElementById("floatContact");
  if (!toggle) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    toggle.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    floatCall.classList.add("visible");
    floatWA.classList.add("visible");
  };

  const close = () => {
    isOpen = false;
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    floatCall.classList.remove("visible");
    floatWA.classList.remove("visible");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen ? close() : open();
  });

  // Close when clicking outside the widget
  document.addEventListener("click", (e) => {
    if (isOpen && !widget.contains(e.target)) close();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) close();
  });
})();