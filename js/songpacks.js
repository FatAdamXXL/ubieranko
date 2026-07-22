/** Testing-only override: while true, every song pack shows as unlocked regardless of points —
 *  points still accumulate normally underneath. Set back to false to re-enable the point gate
 *  before a public launch. */
const FORCE_UNLOCK_ALL_PACKS = true;

const SongPacks = {
  DEFAULT_ID: "domyslny",

  ALL: [
    { id: "domyslny", name: "Domyślny", unlockAtPoints: 0 },
    { id: "country", name: "Country", unlockAtPoints: 10 },
    { id: "disco", name: "Disco", unlockAtPoints: 20 },
    { id: "kids_rock", name: "Kids Rock", unlockAtPoints: 30 },
    { id: "opera", name: "Opera", unlockAtPoints: 40 },
  ],

  byId(id) {
    return this.ALL.find((pack) => pack.id === id) || this.ALL[0];
  },

  isUnlocked(pack, completedCount) {
    if (FORCE_UNLOCK_ALL_PACKS) return true;
    return completedCount >= pack.unlockAtPoints;
  },
};

/**
 * Per-pack track paths: clothing item id -> mp3 path for that pack.
 * Filename convention: default pack uses unprefixed names, every other
 * pack is assets/audio/<packId>_<itemId>.mp3 (mirrors the Android res/raw layout).
 */
const packTracks = {
  domyslny: {
    majtki: "assets/audio/majtki.mp3",
    podkoszulka: "assets/audio/podkoszulka.mp3",
    koszulka: "assets/audio/koszulka.mp3",
    spodnie: "assets/audio/spodnie.mp3",
    skarpetki: "assets/audio/skarpetki.mp3",
    buty: "assets/audio/buty.mp3",
    bluza: "assets/audio/bluza.mp3",
  },
  country: {
    majtki: "assets/audio/country_majtki.mp3",
    podkoszulka: "assets/audio/country_podkoszulka.mp3",
    koszulka: "assets/audio/country_koszulka.mp3",
    spodnie: "assets/audio/country_spodnie.mp3",
    skarpetki: "assets/audio/country_skarpetki.mp3",
    buty: "assets/audio/country_buty.mp3",
    bluza: "assets/audio/country_bluza.mp3",
  },
  disco: {
    majtki: "assets/audio/disco_majtki.mp3",
    podkoszulka: "assets/audio/disco_podkoszulka.mp3",
    koszulka: "assets/audio/disco_koszulka.mp3",
    spodnie: "assets/audio/disco_spodnie.mp3",
    skarpetki: "assets/audio/disco_skarpetki.mp3",
    buty: "assets/audio/disco_buty.mp3",
    bluza: "assets/audio/disco_bluza.mp3",
  },
  kids_rock: {
    majtki: "assets/audio/kids_rock_majtki.mp3",
    podkoszulka: "assets/audio/kids_rock_podkoszulka.mp3",
    koszulka: "assets/audio/kids_rock_koszulka.mp3",
    spodnie: "assets/audio/kids_rock_spodnie.mp3",
    skarpetki: "assets/audio/kids_rock_skarpetki.mp3",
    buty: "assets/audio/kids_rock_buty.mp3",
    bluza: "assets/audio/kids_rock_bluza.mp3",
  },
  opera: {
    majtki: "assets/audio/opera_majtki.mp3",
    podkoszulka: "assets/audio/opera_podkoszulka.mp3",
    koszulka: "assets/audio/opera_koszulka.mp3",
    spodnie: "assets/audio/opera_spodnie.mp3",
    skarpetki: "assets/audio/opera_skarpetki.mp3",
    buty: "assets/audio/opera_buty.mp3",
    bluza: "assets/audio/opera_bluza.mp3",
  },
};

const packMenuThemes = {
  domyslny: "assets/audio/menu_theme.mp3",
  country: "assets/audio/country_menu.mp3",
  disco: "assets/audio/disco_menu.mp3",
  kids_rock: "assets/audio/kids_rock_menu.mp3",
  opera: "assets/audio/opera_menu.mp3",
};

/** Resolves a clothing item's track for the given pack, falling back to the
 *  default pack if that pack's track for this item hasn't been recorded yet. */
function stepMusicFor(clothingId, packId) {
  const packTrack = packTracks[packId] && packTracks[packId][clothingId];
  if (packTrack) return packTrack;
  return packTracks[SongPacks.DEFAULT_ID][clothingId] || null;
}

/** Resolves the menu theme for the given pack, falling back to the default pack's theme. */
function menuThemeFor(packId) {
  return packMenuThemes[packId] || packMenuThemes[SongPacks.DEFAULT_ID];
}
