// Petit bus d'événement pour ouvrir la roue depuis n'importe où (nav, landing).
export const WHEEL_EVENT = "map:open-wheel";
export const PENDING_WHEEL_KEY = "map_pending_wheel";
export const WHEEL_SEEN_KEY = "map_wheel_seen";

export function openWheel() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(WHEEL_EVENT));
}
