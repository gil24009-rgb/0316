const KEY = "birthday_adventure_save_v1";

const defaultState = () => ({
  equipped: {
    tshirt: false,
    guitar: false,
    hat: false
  },
  opened: {
    tshirt: false,
    guitar: false,
    hat: false
  },
  progress: {
    overworldDone: false,
    fellToUnderground: false,
    partyUnlocked: false,
    videoWatchedOrClosed: false
  }
});

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);

    const d = defaultState();
    return {
      equipped: { ...d.equipped, ...(parsed.equipped || {}) },
      opened: { ...d.opened, ...(parsed.opened || {}) },
      progress: { ...d.progress, ...(parsed.progress || {}) }
    };
  } catch (e) {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
  }
}

export function resetState() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
  }
}