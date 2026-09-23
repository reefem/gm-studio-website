(() => {
  const root = document.documentElement;
  root.classList.add("js");

  // Header border once the page scrolls; mobile "Book now" bar after the hero
  const header = document.querySelector("[data-header]");
  const sticky = document.querySelector("[data-sticky-book]");
  const hero = document.querySelector(".hero");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    if (sticky && hero) {
      const pastHero = y > hero.offsetTop + hero.offsetHeight - 120;
      const nearFooter = window.innerHeight + y > document.body.scrollHeight - 260;
      sticky.classList.toggle("is-visible", pastHero && !nearFooter);
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
  };
  toggle.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) setMenu(false);
  });
  window.matchMedia("(min-width: 1081px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Opening hours: highlight today and show open/closed status (UK time)
  const OPEN_DAYS = [1, 3, 5];
  const OPEN = 16 * 60;
  const CLOSE = 20 * 60 + 30;

  const ukNow = () => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, mins: Number(get("hour")) * 60 + Number(get("minute")) };
  };

  const { day, mins } = ukNow();
  const todayRow = document.querySelector(`.hours tr[data-day="${day}"]`);
  if (todayRow) todayRow.classList.add("is-today");

  const status = document.querySelector("[data-status]");
  const dot = document.querySelector("[data-status-dot]");
  if (status) {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const openToday = OPEN_DAYS.includes(day);

    if (openToday && mins >= OPEN && mins < CLOSE) {
      status.textContent = "Open now · until 8.30pm";
      dot.classList.add("is-open");
    } else if (openToday && mins < OPEN) {
      status.textContent = "Opens today at 4pm";
    } else {
      let next = (day + 1) % 7;
      while (!OPEN_DAYS.includes(next)) next = (next + 1) % 7;
      const label = next === (day + 1) % 7 ? "tomorrow" : dayNames[next];
      status.textContent = `Closed · opens ${label} at 4pm`;
    }
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
