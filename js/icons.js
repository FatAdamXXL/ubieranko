/* Inline SVG glyphs (currentColor). Clothing icons mirror the ported VectorDrawables 1:1;
   UI glyphs are simple original line/fill icons standing in for the Material Symbols used natively. */
const ICONS = {
  majtki: '<path fill="currentColor" d="M4,4 H20 V8 L16,9 L14,20 L10,20 L8,9 L4,8 Z"/>',
  podkoszulka: '<path fill="currentColor" d="M9,4 L8,4 L8,7 L6,7 L6,20 L18,20 L18,7 L16,7 L16,4 L15,4 Q12,7 9,4 Z"/>',
  koszulka: '<path fill="currentColor" d="M9,3 L7,3 L3,7 L6,9 L7,20 L17,20 L18,9 L21,7 L17,3 L15,3 L12,6 Z"/>',
  spodnie: '<path fill="currentColor" d="M6,2 H18 V7 L17,22 L13,22 L12,10 L11,22 L7,22 Z"/>',
  skarpetki: '<path fill="currentColor" d="M9,2 H14 V14 Q14,16 16,17 L20,19 Q22,20 21,22 H10 Q8,22 8,20 V4 Q8,2 9,2 Z"/>',
  bluza: '<path fill="currentColor" d="M8,4 L6,4 L2,9 L5,11 L5,21 L19,21 L19,11 L22,9 L18,4 L16,4 L16,2 Q12,0.5 8,2 Z"/><path fill="none" stroke="currentColor" stroke-width="0.8" d="M12,7 V21"/>',
  buty: '<path fill="currentColor" d="M3,17 Q2,14 3,11 Q6,9 10,10 L13,7 L17,7 Q20,7 20,11 L21,14 L21,17 Z"/>',

  checkroom: '<circle cx="12" cy="4" r="1.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12,5.4 V9"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4,17 L12,9 L20,17"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M5,18.3 H19"/>',
  trophy: '<path fill="currentColor" d="M6,4 H18 L16,11 H8 Z"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M6,5.5 H3.5 V8 L7.5,10"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M18,5.5 H20.5 V8 L16.5,10"/><rect x="11" y="11" width="2" height="4" fill="currentColor"/><rect x="8" y="15" width="8" height="2" fill="currentColor"/>',
  gear: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4,7 H20 M4,12 H20 M4,17 H20"/><circle cx="9" cy="7" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="9" cy="17" r="2" fill="currentColor"/>',
  exit: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14,4 H7 V20 H14"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9,12 H20 M16,8 L20,12 L16,16"/>',
  volume_up: '<path fill="currentColor" d="M4,9 v6 h4 l5,5 V4 L8,9 Z M16,8 a5,5 0 0 1 0,8 v-2 a3,3 0 0 0 0,-4 Z M16,4.5 a9,9 0 0 1 0,15 v-2.1 a7,7 0 0 0 0,-10.8 Z"/>',
  volume_off: '<path fill="currentColor" d="M4,9 v6 h4 l5,5 V4 L8,9 Z M17.7,7.6 L16.3,9 L18.3,11 l-2,2 l1.4,1.4 l2,-2 l2,2 l1.4,-1.4 l-2,-2 l2,-2 L21.7,7.6 l-2,2 Z"/>',
  home: '<path fill="currentColor" d="M12,3 L2,12 h3 v8 h5 v-6 h4 v6 h5 v-8 h3 Z"/>',
  pause: '<path fill="currentColor" d="M7,4 h4 v16 H7 Z M13,4 h4 v16 h-4 Z"/>',
  play: '<path fill="currentColor" d="M6,4 L20,12 L6,20 Z"/>',
  arrow_back: '<path fill="currentColor" d="M20,11 H8.8 l4.6,-4.6 L12,5 l-7,7 l7,7 l1.4,-1.4 L8.8,13 H20 Z"/>',
  add: '<path fill="currentColor" d="M11,5 h2 v6 h6 v2 h-6 v6 h-2 v-6 H5 v-2 h6 Z"/>',
  delete: '<path fill="currentColor" d="M6,7 h12 l-1,14 H7 Z M9,2 h6 l1,2 h4 v2 H4 V4 h4 Z"/>',
  arrow_up: '<path fill="currentColor" d="M12,7 l6,6 l-1.4,1.4 L12,9.8 l-4.6,4.6 L6,13 Z"/>',
  arrow_down: '<path fill="currentColor" d="M12,17 l-6,-6 l1.4,-1.4 L12,14.2 l4.6,-4.6 L18,11 Z"/>',
  refresh: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12,4 A8,8 0 0 1 20,12 A8,8 0 0 1 12,20 A8,8 0 0 1 4,12"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8,5.5 L12,4 L13,8"/>',
  celebration: '<path fill="currentColor" d="M5,19 l2,-8 l6,6 Z M9,9 l1.5,-4 l2 2 Z M14,6 l3,-2 l0.5,2.5 Z M17,10 l2.5,-0.5 L20,12 Z M12,13 l2,-1 l0.5,2 Z"/>',
  music_note: '<circle cx="7" cy="17" r="3" fill="currentColor"/><rect x="9" y="4" width="1.6" height="13" fill="currentColor"/><rect x="10.6" y="4" width="5.4" height="4" fill="currentColor"/>',
  lock: '<path fill="currentColor" d="M7,10 V8 a5,5 0 0 1 10,0 v2 h1 a1,1 0 0 1 1,1 v9 a1,1 0 0 1 -1,1 H6 a1,1 0 0 1 -1,-1 v-9 a1,1 0 0 1 1,-1 Z M9,10 h6 V8 a3,3 0 0 0 -6,0 Z"/>',
  check: '<path fill="currentColor" d="M9,16.2 L4.8,12 L3.4,13.4 L9,19 L21,7 L19.6,5.6 Z"/>',
  download: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12,3 v10 M7,9 l5,5 l5,-5 M5,19 h14"/>',
  ios_share: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12,2 v13 M8,6 l4,-4 l4,4 M5,10 v10 h14 v-10"/>',
};

function iconEl(name, size) {
  const span = document.createElement("span");
  span.className = "icon";
  if (size) { span.style.width = size + "px"; span.style.height = size + "px"; }
  span.innerHTML = `<svg viewBox="0 0 24 24">${ICONS[name] || ""}</svg>`;
  return span;
}

function iconHtml(name, size) {
  const style = size ? ` style="width:${size}px;height:${size}px"` : "";
  return `<span class="icon"${style}><svg viewBox="0 0 24 24">${ICONS[name] || ""}</svg></span>`;
}
