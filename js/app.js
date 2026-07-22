/* Version convention mirrors the Android original: MAJOR.MILESTONE.PATCH starting at 0.000.001.
   Bump the third group for routine fixes, the second (resetting the third to 000) for
   milestones/new features. This PWA has its own independent history from the Android app. */
const APP_VERSION = "0.002.002";

/* ---------- Audio (mirrors AppMusicPlayer: one looping player, swap src, volume-based mute) ---------- */
class AudioController {
  constructor() {
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.preload = "auto";
    this.currentSrc = null;
    this.muted = false;
  }
  play(src) {
    if (!src) { this.stop(); return; }
    if (this.currentSrc === src && !this.audio.paused) return;
    this.currentSrc = src;
    this.audio.src = src;
    this.audio.volume = this.muted ? 0 : 1;
    this.audio.play().catch(() => {});
  }
  setMuted(muted) {
    this.muted = muted;
    this.audio.volume = muted ? 0 : 1;
  }
  stop() {
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.audio.load();
    this.currentSrc = null;
  }
}
const musicPlayer = new AudioController();

/* ---------- Install prompt (Chrome/Android via beforeinstallprompt; iOS Safari has no such
   API, so it gets a manual-steps hint instead) ---------- */
const InstallController = {
  deferredEvent: null,
  iosHint: false,
  _listeners: [],

  init() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredEvent = e;
      this._notify();
    });
    window.addEventListener("appinstalled", () => {
      this.deferredEvent = null;
      this._notify();
    });
    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    this.iosHint = isIos && isSafari;
  },

  isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  },

  canPromptInstall() {
    return !!this.deferredEvent && !this.isStandalone();
  },

  showIosHint() {
    return this.iosHint && !this.isStandalone() && !this.deferredEvent;
  },

  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter((l) => l !== fn); };
  },

  _notify() { this._listeners.forEach((fn) => fn()); },

  async promptInstall() {
    if (!this.deferredEvent) return;
    this.deferredEvent.prompt();
    try { await this.deferredEvent.userChoice; } catch {}
    this.deferredEvent = null;
    this._notify();
  },
};

/* ---------- Theme ---------- */
function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#1F1B16" : "#FFF8E1");
}

/* ---------- Toast (fallback message for the "Zakończ" button) ---------- */
function showToast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2500);
}

function onExit() {
  window.close();
  setTimeout(() => showToast("Możesz teraz zamknąć tę kartę lub aplikację."), 300);
}

/* ---------- Screen: Main Menu ---------- */
function renderMainMenu(root) {
  root.innerHTML = `
    <div class="screen mainmenu">
      <button class="icon-btn mainmenu__mute" id="muteBtn"></button>
      <div class="mainmenu__title" id="title">Ubieranko</div>
      <div class="mainmenu__install" id="installBanner"></div>
      <div class="mainmenu__buttons" id="buttons">
        <button class="btn" id="btnStart">${iconHtml("checkroom")}<span>Zacznij się ubierać</span></button>
        <button class="btn btn--tertiary" id="btnProgress">${iconHtml("trophy")}<span>Mapa nagród</span></button>
        <button class="btn btn--secondary" id="btnSettings">${iconHtml("gear")}<span>Ustawienia</span></button>
        <button class="btn btn--error" id="btnExit">${iconHtml("exit")}<span>Zakończ</span></button>
      </div>
      <div class="mainmenu__counter" id="globalCounter"></div>
    </div>`;

  const title = root.querySelector("#title");
  const buttons = root.querySelector("#buttons");
  requestAnimationFrame(() => {
    title.classList.add("in");
    buttons.classList.add("in");
  });

  const muteBtn = root.querySelector("#muteBtn");
  function syncMuteIcon() {
    const s = SettingsStore.get();
    muteBtn.innerHTML = "";
    muteBtn.appendChild(iconEl(s.musicMuted ? "volume_off" : "volume_up"));
    muteBtn.title = s.musicMuted ? "Włącz muzykę" : "Wycisz muzykę";
  }
  muteBtn.addEventListener("click", () => {
    SettingsStore.setMusicMuted(!SettingsStore.get().musicMuted);
  });

  let lastPack = SettingsStore.get().selectedSongPack;
  musicPlayer.play(menuThemeFor(lastPack));
  musicPlayer.setMuted(SettingsStore.get().musicMuted);
  syncMuteIcon();

  const unsub = SettingsStore.subscribe((s) => {
    syncMuteIcon();
    musicPlayer.setMuted(s.musicMuted);
    if (s.selectedSongPack !== lastPack) {
      lastPack = s.selectedSongPack;
      musicPlayer.play(menuThemeFor(lastPack));
    }
  });

  root.querySelector("#btnStart").addEventListener("click", () => navigate("dressing"));
  root.querySelector("#btnProgress").addEventListener("click", () => navigate("progression"));
  root.querySelector("#btnSettings").addEventListener("click", () => navigate("settings"));
  root.querySelector("#btnExit").addEventListener("click", onExit);

  const installBanner = root.querySelector("#installBanner");
  function renderInstallBanner() {
    if (InstallController.canPromptInstall()) {
      installBanner.innerHTML = `<button class="install-banner" id="installBtn">${iconHtml("download")}<span>Zainstaluj aplikację</span></button>`;
      installBanner.querySelector("#installBtn").addEventListener("click", () => InstallController.promptInstall());
    } else if (InstallController.showIosHint()) {
      installBanner.innerHTML = `<div class="install-banner install-banner--hint">${iconHtml("ios_share")}<span>Aby zainstalować: Udostępnij &rarr; Dodaj do ekranu początkowego</span></div>`;
    } else {
      installBanner.innerHTML = "";
    }
  }
  renderInstallBanner();
  const unsubInstall = InstallController.subscribe(renderInstallBanner);

  let mounted = true;
  const counterEl = root.querySelector("#globalCounter");
  GlobalStats.fetchRoutinesCompleted().then((count) => {
    if (!mounted || count === null) return;
    counterEl.textContent = `Na całym świecie ubrano się już ${count} ${polishTimesWord(count)} z aplikacją Ubieranko`;
  });

  return { unmount() { mounted = false; unsub(); unsubInstall(); } };
}

/** "raz" only for exactly 1, "razy" for every other count (2, 5, 21, ...) — "razy" doesn't
 *  inflect further, unlike most Polish count nouns. */
function polishTimesWord(count) {
  return count === 1 ? "raz" : "razy";
}

/* ---------- Screen: Dressing ---------- */
const RING_R = 80;
const RING_CIRC = 2 * Math.PI * RING_R;

function renderDressing(root) {
  const initialOrder = SettingsStore.get().stepsOrder;
  const steps = initialOrder.map((id) => ClothingCatalog.byId(id)).filter(Boolean);

  if (steps.length === 0) {
    root.innerHTML = `
      <div class="screen no-steps">
        <div style="font-size:22px;font-weight:600;">Brak kroków do wykonania.</div>
        <button class="btn-outline" id="toMenu">Menu</button>
      </div>`;
    root.querySelector("#toMenu").addEventListener("click", () => navigate("mainmenu"));
    return { unmount() {} };
  }

  let stepIndex = 0;
  let isComplete = false;
  let isPaused = false;
  let elapsedSeconds = 0;
  let completeTimeout = null;
  let lastSyncedPack = SettingsStore.get().selectedSongPack;

  root.innerHTML = `
    <div class="screen">
      <div class="dressing-topbar" id="topbar"></div>
      <div class="progressbar"><div class="progressbar__fill" id="overallFill" style="width:0%"></div></div>
      <div id="stepFrame"></div>
    </div>`;

  const topbarEl = root.querySelector("#topbar");
  const overallFillEl = root.querySelector("#overallFill");
  const stepFrameEl = root.querySelector("#stepFrame");

  const stepDuration = () => SettingsStore.get().stepDurationSeconds;

  function syncAudio() {
    const s = SettingsStore.get();
    if (isComplete) {
      musicPlayer.play(menuThemeFor(s.selectedSongPack));
    } else {
      const track = stepMusicFor(steps[stepIndex].id, s.selectedSongPack);
      if (track) musicPlayer.play(track); else musicPlayer.stop();
    }
    musicPlayer.setMuted(isPaused || s.musicMuted);
  }

  function updateOverallProgress() {
    const target = ((stepIndex + 1) / steps.length) * 100 + "%";
    requestAnimationFrame(() => { overallFillEl.style.width = target; });
  }

  function updateRing() {
    if (isComplete) return;
    const ring = stepFrameEl.querySelector("#ringFill");
    if (!ring) return;
    const progress = Math.min(1, elapsedSeconds / stepDuration());
    ring.style.strokeDashoffset = String(RING_CIRC * (1 - progress));
  }

  function updateTopbar() {
    topbarEl.innerHTML = "";
    if (!isComplete) {
      const pauseBtn = document.createElement("button");
      pauseBtn.className = "btn-outline";
      pauseBtn.innerHTML = `${iconHtml(isPaused ? "play" : "pause")}<span>${isPaused ? "Wznów" : "Przerwa"}</span>`;
      pauseBtn.addEventListener("click", togglePause);
      topbarEl.appendChild(pauseBtn);
    }
    const homeBtn = document.createElement("button");
    homeBtn.className = "icon-btn";
    homeBtn.title = "Menu";
    homeBtn.appendChild(iconEl("home"));
    homeBtn.addEventListener("click", () => navigate("mainmenu"));
    topbarEl.appendChild(homeBtn);
  }

  function renderStepFrame() {
    if (isComplete) {
      stepFrameEl.innerHTML = `
        <div class="done-content">
          <div class="done-content__badge">${iconHtml("celebration", 72)}</div>
          <div class="done-content__title">Brawo! Jesteś ubrany!</div>
          <button class="btn-action" id="doneBtn">Wróć do menu</button>
        </div>`;
      stepFrameEl.querySelector("#doneBtn").addEventListener("click", () => {
        clearTimeout(completeTimeout);
        navigate("mainmenu");
      });
      return;
    }

    const step = steps[stepIndex];
    const isLast = stepIndex === steps.length - 1;
    stepFrameEl.innerHTML = `
      <div class="dressing-content">
        <div class="dressing-content__step-count">Krok ${stepIndex + 1} z ${steps.length}</div>
        <div class="dressing-ring-wrap">
          <svg class="ring" viewBox="0 0 180 180" width="180" height="180">
            <circle class="track" cx="90" cy="90" r="${RING_R}" fill="none" stroke-width="6"/>
            <circle class="fill" id="ringFill" cx="90" cy="90" r="${RING_R}" fill="none" stroke-width="6" stroke-linecap="round"/>
          </svg>
          <div class="dressing-container"></div>
          <div class="dressing-icon">${iconHtml(step.icon, 84)}</div>
        </div>
        <div class="dressing-label animate" id="stepLabel">${step.label}</div>
        <div class="dressing-actions">
          <button class="btn-action" id="nextBtn">${isLast ? "Gotowe" : "Dalej"}</button>
          ${stepIndex > 0 ? '<button class="btn-action btn-action--secondary-container" id="backBtn">Wstecz</button>' : ""}
        </div>
      </div>`;

    const ringFill = stepFrameEl.querySelector("#ringFill");
    ringFill.style.strokeDasharray = String(RING_CIRC);
    ringFill.style.strokeDashoffset = String(RING_CIRC);

    stepFrameEl.querySelector("#nextBtn").addEventListener("click", goNext);
    const backBtn = stepFrameEl.querySelector("#backBtn");
    if (backBtn) backBtn.addEventListener("click", goBack);

    updateRing();
  }

  function goNext() {
    if (stepIndex < steps.length - 1) {
      stepIndex++;
      isPaused = false;
      elapsedSeconds = 0;
      renderStepFrame();
      updateTopbar();
      updateOverallProgress();
      syncAudio();
    } else {
      completeRoutine();
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      stepIndex--;
      isPaused = false;
      elapsedSeconds = 0;
      renderStepFrame();
      updateTopbar();
      updateOverallProgress();
      syncAudio();
    }
  }

  function togglePause() {
    isPaused = !isPaused;
    updateTopbar();
    syncAudio();
  }

  function completeRoutine() {
    isComplete = true;
    renderStepFrame();
    updateTopbar();
    syncAudio();
    SettingsStore.incrementCompletedCount();
    GlobalStats.incrementRoutinesCompleted();
    completeTimeout = setTimeout(() => navigate("mainmenu"), 2200);
  }

  updateTopbar();
  renderStepFrame();
  updateOverallProgress();
  syncAudio();

  const intervalId = setInterval(() => {
    if (isPaused || isComplete) return;
    if (elapsedSeconds < stepDuration()) {
      elapsedSeconds++;
      updateRing();
    }
  }, 1000);

  const unsub = SettingsStore.subscribe((s) => {
    musicPlayer.setMuted(isPaused || s.musicMuted);
    if (s.selectedSongPack !== lastSyncedPack) {
      lastSyncedPack = s.selectedSongPack;
      syncAudio();
    }
  });

  return {
    unmount() {
      clearInterval(intervalId);
      clearTimeout(completeTimeout);
      unsub();
    },
  };
}

/* ---------- Screen: Settings ---------- */
function renderSettings(root) {
  root.innerHTML = `
    <div class="screen">
      <div class="topbar">
        <button class="icon-btn" id="backBtn"></button>
        <div class="topbar__title">Ustawienia</div>
      </div>
      <div class="settings-body">
        <div class="card">
          <div class="settings-row">
            <span class="settings-row__label">Ciemny motyw</span>
            <button class="switch" id="darkSwitch"></button>
          </div>
          <hr class="divider"/>
          <div>
            <div class="slider-label" id="durationLabel"></div>
            <input type="range" id="durationSlider" min="15" max="120" step="5" />
          </div>
        </div>
        <div class="steps-title">Kolejność ubierania</div>
        <div class="steps-list" id="stepsList"></div>
        <div class="settings-add-row">
          <div class="dropdown-wrap">
            <button class="btn-outline" id="addBtn">${iconHtml("add")}<span>Dodaj ubranie</span></button>
            <div class="dropdown" id="addDropdown"></div>
          </div>
          <button class="btn-outline" id="resetBtn">${iconHtml("refresh")}<span>Przywróć domyślne</span></button>
        </div>
      </div>
    </div>`;

  root.querySelector("#backBtn").appendChild(iconEl("arrow_back"));
  root.querySelector("#backBtn").addEventListener("click", () => navigate("mainmenu"));

  const darkSwitch = root.querySelector("#darkSwitch");
  function syncDarkSwitch() {
    darkSwitch.classList.toggle("on", SettingsStore.get().darkTheme);
  }
  darkSwitch.addEventListener("click", () => {
    SettingsStore.setDarkTheme(!SettingsStore.get().darkTheme);
  });

  const durationLabel = root.querySelector("#durationLabel");
  const durationSlider = root.querySelector("#durationSlider");
  function syncDuration() {
    const val = SettingsStore.get().stepDurationSeconds;
    durationLabel.textContent = `Czas na krok (sekundy): ${val}s`;
    durationSlider.value = String(val);
  }
  durationSlider.addEventListener("input", () => {
    SettingsStore.setStepDuration(parseInt(durationSlider.value, 10));
  });

  const stepsList = root.querySelector("#stepsList");
  function renderStepsList() {
    const order = SettingsStore.get().stepsOrder;
    stepsList.innerHTML = "";
    order.forEach((id, index) => {
      const item = ClothingCatalog.byId(id);
      if (!item) return;
      const card = document.createElement("div");
      card.className = "step-card";
      card.innerHTML = `${iconHtml(item.icon)}<span class="step-card__label">${item.label}</span>`;

      const upBtn = document.createElement("button");
      upBtn.className = "icon-btn";
      upBtn.disabled = index === 0;
      upBtn.title = "Przesuń w górę";
      upBtn.appendChild(iconEl("arrow_up"));
      upBtn.addEventListener("click", () => SettingsStore.moveStep(index, -1));

      const downBtn = document.createElement("button");
      downBtn.className = "icon-btn";
      downBtn.disabled = index === order.length - 1;
      downBtn.title = "Przesuń w dół";
      downBtn.appendChild(iconEl("arrow_down"));
      downBtn.addEventListener("click", () => SettingsStore.moveStep(index, 1));

      const delBtn = document.createElement("button");
      delBtn.className = "icon-btn";
      delBtn.title = "Usuń";
      delBtn.appendChild(iconEl("delete"));
      delBtn.addEventListener("click", () => SettingsStore.removeStep(id));

      card.appendChild(upBtn);
      card.appendChild(downBtn);
      card.appendChild(delBtn);
      stepsList.appendChild(card);
    });
  }

  const addBtn = root.querySelector("#addBtn");
  const addDropdown = root.querySelector("#addDropdown");
  function renderDropdown() {
    const order = SettingsStore.get().stepsOrder;
    const available = ClothingCatalog.ALL.filter((i) => !order.includes(i.id));
    addBtn.disabled = available.length === 0;
    addDropdown.innerHTML = "";
    available.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "dropdown-item";
      btn.textContent = item.label;
      btn.addEventListener("click", () => {
        SettingsStore.addStep(item.id);
        addDropdown.classList.remove("open");
      });
      addDropdown.appendChild(btn);
    });
  }

  function closeDropdownOnOutsideClick(e) {
    if (!addDropdown.contains(e.target) && e.target !== addBtn && !addBtn.contains(e.target)) {
      addDropdown.classList.remove("open");
    }
  }
  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addDropdown.classList.toggle("open");
  });
  document.addEventListener("click", closeDropdownOnOutsideClick);

  root.querySelector("#resetBtn").addEventListener("click", () => SettingsStore.resetSteps());

  let lastPack = SettingsStore.get().selectedSongPack;
  musicPlayer.play(menuThemeFor(lastPack));
  musicPlayer.setMuted(SettingsStore.get().musicMuted);

  syncDarkSwitch();
  syncDuration();
  renderStepsList();
  renderDropdown();

  const unsub = SettingsStore.subscribe((s) => {
    syncDarkSwitch();
    syncDuration();
    renderStepsList();
    renderDropdown();
    musicPlayer.setMuted(s.musicMuted);
    if (s.selectedSongPack !== lastPack) {
      lastPack = s.selectedSongPack;
      musicPlayer.play(menuThemeFor(lastPack));
    }
  });

  return {
    unmount() {
      unsub();
      document.removeEventListener("click", closeDropdownOnOutsideClick);
    },
  };
}

/* ---------- Screen: Progression ---------- */
function renderProgression(root) {
  root.innerHTML = `
    <div class="screen">
      <div class="topbar">
        <button class="icon-btn" id="backBtn"></button>
        <div class="topbar__title">Mapa nagród</div>
      </div>
      <div class="progression-header">
        <div class="progression-header__points" id="pointsLine"></div>
        <div class="progression-header__next" id="nextLine"></div>
      </div>
      <div class="progression-body" id="nodesWrap"></div>
    </div>`;

  root.querySelector("#backBtn").appendChild(iconEl("arrow_back"));
  root.querySelector("#backBtn").addEventListener("click", () => navigate("mainmenu"));

  const pointsLine = root.querySelector("#pointsLine");
  const nextLine = root.querySelector("#nextLine");
  const nodesWrap = root.querySelector("#nodesWrap");

  function render() {
    const s = SettingsStore.get();
    pointsLine.textContent = `Punkty: ${s.completedCount}`;
    const nextLocked = SongPacks.ALL.find((p) => !SongPacks.isUnlocked(p, s.completedCount));
    nextLine.textContent = nextLocked
      ? `Jeszcze ${nextLocked.unlockAtPoints - s.completedCount} pkt do: ${nextLocked.name}`
      : "Wszystkie zestawy odblokowane!";

    nodesWrap.innerHTML = "";
    SongPacks.ALL.forEach((pack, index) => {
      const unlocked = SongPacks.isUnlocked(pack, s.completedCount);
      const selected = pack.id === s.selectedSongPack;

      const node = document.createElement("div");
      node.className = "pack-node";

      const circle = document.createElement("div");
      circle.className = "pack-node__circle" + (!unlocked ? " locked" : selected ? " selected" : "");
      circle.appendChild(iconEl(unlocked ? "music_note" : "lock", 36));
      if (unlocked) circle.addEventListener("click", () => SettingsStore.setSelectedSongPack(pack.id));
      node.appendChild(circle);

      const label = document.createElement("div");
      label.className = "pack-node__label";
      label.textContent = pack.name;
      node.appendChild(label);

      if (!unlocked) {
        const sub = document.createElement("div");
        sub.className = "pack-node__sub";
        sub.textContent = `Odblokowane przy ${pack.unlockAtPoints} pkt`;
        node.appendChild(sub);
      } else if (selected) {
        const sel = document.createElement("div");
        sel.className = "pack-node__selected";
        sel.appendChild(iconEl("check", 14));
        const txt = document.createElement("span");
        txt.textContent = "Wybrany";
        sel.appendChild(txt);
        node.appendChild(sel);
      }

      nodesWrap.appendChild(node);

      if (index !== SongPacks.ALL.length - 1) {
        const nextUnlocked = SongPacks.isUnlocked(SongPacks.ALL[index + 1], s.completedCount);
        const connector = document.createElement("div");
        connector.className = "pack-connector" + (nextUnlocked ? " unlocked" : "");
        nodesWrap.appendChild(connector);
      }
    });
  }

  render();
  const unsub = SettingsStore.subscribe(render);
  return { unmount() { unsub(); } };
}

/* ---------- Router ---------- */
const SCREENS = {
  mainmenu: renderMainMenu,
  dressing: renderDressing,
  settings: renderSettings,
  progression: renderProgression,
};

let currentController = null;
function navigate(screen) {
  if (currentController && currentController.unmount) currentController.unmount();
  const root = document.getElementById("app");
  currentController = SCREENS[screen](root);
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("versionBadge").textContent = "dev_v" + APP_VERSION;

  InstallController.init();
  applyTheme(SettingsStore.get().darkTheme);
  SettingsStore.subscribe((s) => applyTheme(s.darkTheme));

  // Mirrors MainActivity's onPause/onResume: mute while backgrounded, restore per setting on return.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      musicPlayer.setMuted(true);
    } else {
      musicPlayer.setMuted(SettingsStore.get().musicMuted);
    }
  });

  // Autoplay policies block audio.play() before a user gesture; retry once one arrives.
  document.addEventListener("pointerdown", function resume() {
    if (musicPlayer.audio.paused && musicPlayer.audio.src) {
      musicPlayer.audio.play().catch(() => {});
    }
  });

  navigate("mainmenu");

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    // Retries any audio tracks that failed to cache on a previous visit (e.g. flaky mobile
    // data) — cheap when everything is already cached since the SW skips existing entries.
    navigator.serviceWorker.ready.then((reg) => {
      if (reg.active) reg.active.postMessage("cache-audio");
    }).catch(() => {});
  }
});
