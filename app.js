/* =========================================================
   IshaqBangash.dev — Portfolio Interactions
   ========================================================= */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Toast helper ---------- */
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2400);
  }

  /* ---------- Nav: scrolled background ---------- */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Nav: mobile menu toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
  }
  function openMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "true");
    navLinks.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Smooth-scroll anchors + close mobile menu on click ---------- */
  var allNavAnchors = document.querySelectorAll('a[href^="#"]');
  allNavAnchors.forEach(function (a) {
    a.addEventListener("click", function () {
      closeMenu();
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sectionEls = document.querySelectorAll("main section[id]");
  var navLinkEls = document.querySelectorAll(".nav-link");

  function setActiveLink(id) {
    navLinkEls.forEach(function (link) {
      var match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("active", match);
    });
  }

  if ("IntersectionObserver" in window && sectionEls.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sectionEls.forEach(function (sec) {
      navObserver.observe(sec);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- Hero code-editor typewriter ---------- */
  var codeLines = [
    [
      { t: "const ", c: "tok-kw" },
      { t: "developer", c: "tok-var" },
      { t: " = ", c: "tok-punc" },
      { t: "{", c: "tok-punc" },
    ],
    [
      { t: "  name", c: "tok-prop" },
      { t: ": ", c: "tok-punc" },
      { t: "'Ishaq Bangash'", c: "tok-str" },
      { t: ",", c: "tok-punc" },
    ],
    [
      { t: "  role", c: "tok-prop" },
      { t: ": ", c: "tok-punc" },
      { t: "'Frontend Developer'", c: "tok-str" },
      { t: ",", c: "tok-punc" },
    ],
    [
      { t: "  stack", c: "tok-prop" },
      { t: ": ", c: "tok-punc" },
      { t: "[", c: "tok-punc" },
      { t: "'React'", c: "tok-str" },
      { t: ", ", c: "tok-punc" },
      { t: "'Tailwind'", c: "tok-str" },
      { t: ", ", c: "tok-punc" },
      { t: "'JavaScript'", c: "tok-str" },
      { t: ", ", c: "tok-punc" },
      { t: "'WordPress'", c: "tok-str" },
      { t: "]", c: "tok-punc" },
      { t: ",", c: "tok-punc" },
    ],
    [
      { t: "  focus", c: "tok-prop" },
      { t: ": ", c: "tok-punc" },
      { t: "'clean code, fast UI'", c: "tok-str" },
      { t: ",", c: "tok-punc" },
    ],
    [
      { t: "  available", c: "tok-prop" },
      { t: ": ", c: "tok-punc" },
      { t: "true", c: "tok-kw" },
      { t: ",", c: "tok-punc" },
    ],
    [{ t: "};", c: "tok-punc" }],
  ];

  function renderLineStatic(container, segs) {
    segs.forEach(function (seg) {
      var span = document.createElement("span");
      if (seg.c) span.className = seg.c;
      span.textContent = seg.t;
      container.appendChild(span);
    });
  }

  function typeCode() {
    var el = document.getElementById("typewriter");
    if (!el) return;
    el.innerHTML = "";

    if (reducedMotion) {
      codeLines.forEach(function (segs, i) {
        var lineEl = document.createElement("div");
        renderLineStatic(lineEl, segs);
        el.appendChild(lineEl);
      });
      return;
    }

    var lineIndex = 0;
    var segIndex = 0;
    var charIndex = 0;
    var currentLineEl = document.createElement("div");
    el.appendChild(currentLineEl);
    var currentSpan = null;

    function step() {
      if (lineIndex >= codeLines.length) return;
      var segs = codeLines[lineIndex];

      if (segIndex >= segs.length) {
        lineIndex++;
        segIndex = 0;
        charIndex = 0;
        if (lineIndex < codeLines.length) {
          currentLineEl = document.createElement("div");
          el.appendChild(currentLineEl);
        }
        setTimeout(step, 90);
        return;
      }

      var seg = segs[segIndex];
      if (charIndex === 0) {
        currentSpan = document.createElement("span");
        if (seg.c) currentSpan.className = seg.c;
        currentLineEl.appendChild(currentSpan);
      }
      charIndex++;
      currentSpan.textContent = seg.t.slice(0, charIndex);

      if (charIndex >= seg.t.length) {
        segIndex++;
        charIndex = 0;
      }
      setTimeout(step, 14 + Math.random() * 26);
    }
    step();
  }
  typeCode();

  /* ---------- Email copy chip ---------- */
  var emailChip = document.getElementById("emailChip");
  var copyPill = document.getElementById("copyPill");
  if (emailChip) {
    emailChip.addEventListener("click", function () {
      var email = emailChip.getAttribute("data-email") || "";
      var originalLabel = copyPill ? copyPill.textContent : "";

      function markCopied() {
        emailChip.classList.add("copied");
        if (copyPill) copyPill.textContent = "Copied!";
        showToast("Email address copied to clipboard");
        setTimeout(function () {
          emailChip.classList.remove("copied");
          if (copyPill) copyPill.textContent = originalLabel || "Copy";
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(email)
          .then(markCopied)
          .catch(function () {
            showToast("Could not copy — email: " + email);
          });
      } else {
        showToast("Email: " + email);
      }
    });
  }

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameField = contactForm.querySelector("#name");
      var emailField = contactForm.querySelector("#email");
      var messageField = contactForm.querySelector("#message");

      var name = nameField ? nameField.value.trim() : "";
      var email = emailField ? emailField.value.trim() : "";
      var message = messageField ? messageField.value.trim() : "";

      if (!name || !email || !message) {
        if (formNote)
          formNote.textContent = "Please fill in every field before sending.";
        return;
      }

      var recipient =
        (emailChip && emailChip.getAttribute("data-email")) ||
        "hello@example.com";
      var subject = encodeURIComponent("Portfolio inquiry from " + name);
      var body = encodeURIComponent(
        message + "\n\n— " + name + " (" + email + ")",
      );
      var mailto =
        "mailto:" + recipient + "?subject=" + subject + "&body=" + body;

      if (formNote) formNote.textContent = "Opening your email app…";
      window.location.href = mailto;

      setTimeout(function () {
        if (formNote) {
          formNote.textContent =
            "Nothing happened? Email me directly at " + recipient + ".";
        }
      }, 1400);
    });
  }

  /* ---------- Back to top ---------- */
  var toTopBtn = document.getElementById("toTop");
  function onScrollToTop() {
    if (!toTopBtn) return;
    if (window.scrollY > 480) toTopBtn.classList.add("visible");
    else toTopBtn.classList.remove("visible");
  }
  onScrollToTop();
  window.addEventListener("scroll", onScrollToTop, { passive: true });
  if (toTopBtn) {
    toTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }
})();
