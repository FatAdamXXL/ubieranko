const STORAGE_KEY = "ubieranko_settings";

function defaultSettings() {
  return {
    darkTheme: false,
    musicMuted: false,
    stepDurationSeconds: 45,
    stepsOrder: [...ClothingCatalog.DEFAULT_ORDER],
    completedCount: 0,
    selectedSongPack: SongPacks.DEFAULT_ID,
  };
}

const SettingsStore = {
  _listeners: [],
  _settings: null,

  load() {
    if (this._settings) return this._settings;
    const defaults = defaultSettings();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._settings = raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch {
      this._settings = defaults;
    }
    return this._settings;
  },

  get() {
    return this.load();
  },

  _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._settings));
    this._listeners.forEach((fn) => fn(this._settings));
  },

  subscribe(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== fn);
    };
  },

  update(partial) {
    this.load();
    this._settings = { ...this._settings, ...partial };
    this._persist();
  },

  setDarkTheme(enabled) {
    this.update({ darkTheme: enabled });
  },

  setMusicMuted(muted) {
    this.update({ musicMuted: muted });
  },

  incrementCompletedCount() {
    this.load();
    this.update({ completedCount: this._settings.completedCount + 1 });
  },

  setSelectedSongPack(id) {
    this.update({ selectedSongPack: id });
  },

  setStepDuration(seconds) {
    this.update({ stepDurationSeconds: seconds });
  },

  addStep(id) {
    this.load();
    const current = this._settings.stepsOrder;
    if (current.includes(id)) return;

    let updated;
    if (id === "podkoszulka") {
      const koszulkaIndex = current.indexOf("koszulka");
      if (koszulkaIndex >= 0) {
        updated = [...current];
        updated.splice(koszulkaIndex, 0, id);
      } else {
        updated = [...current, id];
      }
    } else {
      updated = [...current, id];
    }
    this.update({ stepsOrder: updated });
  },

  removeStep(id) {
    this.load();
    this.update({ stepsOrder: this._settings.stepsOrder.filter((s) => s !== id) });
  },

  moveStep(index, delta) {
    this.load();
    const current = [...this._settings.stepsOrder];
    const target = index + delta;
    if (index < 0 || index >= current.length || target < 0 || target >= current.length) return;
    const [item] = current.splice(index, 1);
    current.splice(target, 0, item);
    this.update({ stepsOrder: current });
  },

  resetSteps() {
    this.update({ stepsOrder: [...ClothingCatalog.DEFAULT_ORDER] });
  },
};
