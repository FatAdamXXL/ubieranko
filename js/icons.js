/* Inline SVG glyphs (currentColor). Clothing icons mirror the ported VectorDrawables 1:1;
   UI glyphs are simple original line/fill icons standing in for the Material Symbols used natively. */
const ICONS = {
  majtki: '<path fill="currentColor" d="M4,4 H20 V8 L16,9 L14,20 L10,20 L8,9 L4,8 Z"/>',
  podkoszulka: '<path fill="currentColor" d="M9,4 L8,4 L8,7 L6,7 L6,20 L18,20 L18,7 L16,7 L16,4 L15,4 Q12,7 9,4 Z"/>',
  koszulka: '<path fill="currentColor" d="M9,3 L7,3 L3,7 L6,9 L7,20 L17,20 L18,9 L21,7 L17,3 L15,3 L12,6 Z"/>',
  spodnie: '<path fill="currentColor" d="M6,2 H18 V7 L17,22 L13,22 L12,10 L11,22 L7,22 Z"/>',
  skarpetki: '<path fill="currentColor" d="M9,2 H14 V14 Q14,16 16,17 L20,19 Q22,20 21,22 H10 Q8,22 8,20 V4 Q8,2 9,2 Z"/>',
  bluza: '<path fill="currentColor" d="M8,4 L6,4 L2,9 L5,11 L5,21 L19,21 L19,11 L22,9 L18,4 L16,4 L16,2 Q12,0.5 8,2 Z"/><path fill="none" stroke="currentColor" stroke-width="0.8" d="M12,7 V21"/>',

  checkroom: '<path fill="currentColor" d="M12,2 a2,2 0 1 0 -1.9,2.83 L4,9 v2 l8,-3 l8,3 v-2 l-6.1,-4.17 A2,2 0 0 0 12,2 Z M4,14 v6 h16 v-6 l-8,-3 Z"/>',
  trophy: '<path fill="currentColor" d="M6,3 h12 v2 h2 a1,1 0 0 1 1,1 v1 c0,2.2 -1.6,4 -3.7,4.3 A6,6 0 0 1 13,15.9 V18 h3 v2 H8 v-2 h3 v-2.1 A6,6 0 0 1 6.7,11.3 C4.6,11 3,9.2 3,7 V6 a1,1 0 0 1 1,-1 h2 Z M6,7 V7 c0,1.1 0.7,2 1.7,2.3 A8,8 0 0 1 6,6 Z M18,7 a8,8 0 0 1 -1.7,3.3 C17.3,9 18,8.1 18,7 Z"/>',
  gear: '<path fill="currentColor" d="M12,8 a4,4 0 1 0 0,8 a4,4 0 0 0 0,-8 Z M2,13 v-2 l2.2,-0.4 c0.15,-0.6 0.36,-1.15 0.63,-1.68 L3.5,7.2 L4.9,5.8 l1.72,1.35 c0.53,-0.27 1.08,-0.48 1.68,-0.63 L8.7,4 h2 l0.4,2.2 c0.6,0.15 1.15,0.36 1.68,0.63 L14.5,5.8 l1.4,1.4 l-1.35,1.72 c0.27,0.53 0.48,1.08 0.63,1.68 L21,11 v2 l-2.2,0.4 c-0.15,0.6 -0.36,1.15 -0.63,1.68 l1.35,1.72 l-1.4,1.4 l-1.72,-1.35 c-0.53,0.27 -1.08,0.48 -1.68,0.63 L14.3,20 h-2 l-0.4,-2.2 c-0.6,-0.15 -1.15,-0.36 -1.68,-0.63 L8.5,18.5 l-1.4,-1.4 l1.35,-1.72 c-0.27,-0.53 -0.48,-1.08 -0.63,-1.68 Z"/>',
  exit: '<path fill="currentColor" d="M10,3 h8 a1,1 0 0 1 1,1 v16 a1,1 0 0 1 -1,1 h-8 v-2 h7 V5 h-7 Z M11.5,16 L9,12.5 l2.5,-3.5 h-2.2 L4.5,12.5 L9.3,16 Z M4,11.5 h9 v2 h-9 Z"/>',
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
  refresh: '<path fill="currentColor" d="M12,5 V2 L8,6 l4,4 V7 a5,5 0 1 1 -5,5 H5 a7,7 0 1 0 7,-7 Z"/>',
  celebration: '<path fill="currentColor" d="M5,19 l2,-8 l6,6 Z M9,9 l1.5,-4 l2 2 Z M14,6 l3,-2 l0.5,2.5 Z M17,10 l2.5,-0.5 L20,12 Z M12,13 l2,-1 l0.5,2 Z"/>',
  music_note: '<path fill="currentColor" d="M9,3 v10.2 a3.5,3.5 0 1 0 2,3.16 V8 h5 V3 Z"/>',
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
