(() => {
  // Header turns solid (and shows the small monogram) once past the hero logo
  const header = document.querySelector("[data-header]");
  const hero = document.querySelector(".hero");

  const onScroll = () => {
    const past = window.scrollY > hero.offsetHeight * 0.55;
    header.classList.toggle("is-solid", past || !menu.hidden);
  };

  // Mobile menu
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    onScroll();
  };
  toggle.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) setMenu(false);
  });

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Price tabs
  const tabs = [...document.querySelectorAll('[role="tab"]')];

  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (dir) selectTab(tabs[(i + dir + tabs.length) % tabs.length], true);
    });
  });

  // Treatment cards open the matching price tab
  document.querySelectorAll("[data-tab-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const tab = document.getElementById("tab-" + link.dataset.tabLink);
      if (tab) selectTab(tab);
    });
  });

  // Rotating review quotes
  const quotes = [...document.querySelectorAll("[data-quotes] .quote")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (quotes.length > 1 && !reduceMotion) {
    let current = 0;
    setInterval(() => {
      quotes[current].classList.remove("is-active");
      current = (current + 1) % quotes.length;
      quotes[current].classList.add("is-active");
    }, 5000);
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Opening hours: highlight today and show open/closed status (UK time)
  const OPEN_DAYS = [1, 3, 5];
  const OPEN = 16 * 60;
  const CLOSE = 20 * 60 + 30;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const mins = Number(get("hour")) * 60 + Number(get("minute"));

  const todayRow = document.querySelector(`.hours li[data-day="${day}"]`);
  if (todayRow) todayRow.classList.add("is-today");

  const status = document.querySelector("[data-status]");
  if (status) {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const openToday = OPEN_DAYS.includes(day);
    if (openToday && mins >= OPEN && mins < CLOSE) {
      status.textContent = "Open now";
      status.classList.add("is-open");
    } else if (openToday && mins < OPEN) {
      status.textContent = "Opens today at 4pm";
    } else {
      let next = (day + 1) % 7;
      while (!OPEN_DAYS.includes(next)) next = (next + 1) % 7;
      status.textContent = `Closed · opens ${next === (day + 1) % 7 ? "tomorrow" : names[next]} at 4pm`;
    }
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
