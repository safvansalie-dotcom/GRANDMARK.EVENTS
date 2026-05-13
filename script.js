/* ═══════════════════════════════════════
   GRANDMAKER.EVENT — script.js
   ═══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
    document.body.style.overflow = navLinks.classList.contains("open")
      ? "hidden"
      : "";
  });

  // Close menu on nav link click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children of the same parent
          const siblings = entry.target.parentElement.querySelectorAll(
            ".reveal:not(.visible)",
          );
          let delay = 0;
          siblings.forEach((sib) => {
            if (sib === entry.target) {
              entry.target.style.transitionDelay = delay + "ms";
            }
          });
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, 60);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el, i) => {
    // Add slight delay based on position among siblings
    const siblings = Array.from(el.parentElement.querySelectorAll(".reveal"));
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = idx * 80 + "ms";
    revealObserver.observe(el);
  });

  /* ── Hero elements auto-reveal on load ── */
  setTimeout(() => {
    document.querySelectorAll(".hero .reveal").forEach((el, i) => {
      setTimeout(() => {
        el.classList.add("visible");
      }, i * 180);
    });
  }, 200);

  /* ── Smooth active nav link highlight ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');
  const highlightNav = () => {
    let scrollY = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navLinkEls.forEach((a) => {
          a.style.color = "";
          if (a.getAttribute("href") === "#" + id) {
            a.style.color = "var(--gold-light)";
          }
        });
      }
    });
  };
  window.addEventListener("scroll", highlightNav, { passive: true });

  /* ── Contact form ── */
  /* ── Contact form ── */
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
        .sendForm(
          "service_tmd7w7q", // 🔑 replace this
          "template_9f3ycej", // 🔑 replace this
          form,
        )
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
          btn.textContent = "Failed. Try again.";
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

  /* ── Gallery items — add gold shimmer placeholder patterns ── */
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
    // Add gold star overlay
    const star = document.createElement("div");
    star.innerHTML = "✦";
    star.style.cssText = `
      position:absolute; top:50%; left:50%;
      transform:translate(-50%,-50%);
      color:rgba(201,168,76,0.12);
      font-size:4rem;
      pointer-events:none;
      user-select:none;
    `;
    el.style.position = "relative";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.appendChild(star);
  });

  /* ── Parallax on hero glow orbs ── */
  const glows = document.querySelectorAll(".hero-glow");
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      glows.forEach((glow, i) => {
        const speed = 0.08 + i * 0.04;
        glow.style.transform = `translateY(${scrolled * speed}px)`;
      });
    },
    { passive: true },
  );

  /* ── Number counter animation for hero stats ── */
  const statNums = document.querySelectorAll(".stat-num");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.textContent;
          // Skip non-numeric stats like ∞
          if (!/\d/.test(raw)) {
            countObserver.unobserve(el);
            return;
          }
          const num = parseInt(raw.replace(/\D/g, ""), 10);
          const suffix = raw.replace(/[\d]/g, "");
          let start = 0;
          const duration = 1600;
          const step = Math.ceil(num / (duration / 16));
          const counter = setInterval(() => {
            start = Math.min(start + step, num);
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

  /* ── Cursor gold trail (desktop only) ── */
  if (window.innerWidth > 768) {
    const trail = document.createElement("div");
    trail.style.cssText = `
      position:fixed; width:8px; height:8px; border-radius:50%;
      background:var(--gold); opacity:0; pointer-events:none;
      z-index:9999; transition:opacity 0.3s ease;
      mix-blend-mode:screen; transform:translate(-50%,-50%);
    `;
    document.body.appendChild(trail);
    let mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      trail.style.opacity = "0.6";
      clearTimeout(trail._hide);
      trail._hide = setTimeout(() => (trail.style.opacity = "0"), 1500);
    });
    const animTrail = () => {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = tx + "px";
      trail.style.top = ty + "px";
      requestAnimationFrame(animTrail);
    };
    animTrail();
  }
});
