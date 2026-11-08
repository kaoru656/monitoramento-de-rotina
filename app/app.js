/* ============================================================
   Monitoramento de rotina
   ============================================================ */

(function () {
  "use strict";

  if (!Element.prototype.replaceChildren) {
    Element.prototype.replaceChildren = function () {
      while (this.firstChild) this.removeChild(this.firstChild);
      for (let index = 0; index < arguments.length; index += 1) {
        const node = arguments[index];
        this.appendChild(
          typeof node === "string"
            ? document.createTextNode(node)
            : node
        );
      }
    };
  }

  /* ---------- Constants ---------------------------------- */

  const STORE = {
    profiles: "dia.profiles.v1",
    session: "dia.session.v1",
    onboarded: "dia.onboarded.v1",
    legacyEvents: ["dia.events.v3", "dia.events.v2", "dia.events.v1"],
    legacySettings: "dia.settings.v1",
    legacyFired: "dia.fired.v1",
  };

  const PIX_KEY = "41997164699";

  const ACCENTS = {
    green: {
      label: "Verde",
      light: { accent: "#14664b", strong: "#0d4b37", soft: "#e0efe7", on: "#ffffff", hero: ["#186c50", "#0b4633"] },
      dark: { accent: "#65dbaa", strong: "#8ae9c4", soft: "#1b3529", on: "#07251b", hero: ["#1d6b50", "#103e2e"] },
    },
    blue: {
      label: "Azul",
      light: { accent: "#2f5fd0", strong: "#244aa8", soft: "#e4ebff", on: "#ffffff", hero: ["#2f5fd0", "#1c3f96"] },
      dark: { accent: "#8ab4ff", strong: "#a9c8ff", soft: "#1b2a45", on: "#07182e", hero: ["#2b5bb5", "#173b7a"] },
    },
    purple: {
      label: "Roxo",
      light: { accent: "#6d4bc9", strong: "#5537a8", soft: "#efeaff", on: "#ffffff", hero: ["#6a45c7", "#43258f"] },
      dark: { accent: "#c3b1ff", strong: "#d6c9ff", soft: "#2a2345", on: "#1a1030", hero: ["#6c4bc4", "#3d2478"] },
    },
    coral: {
      label: "Coral",
      light: { accent: "#c14f3d", strong: "#9d3a2c", soft: "#fbe8e4", on: "#ffffff", hero: ["#b84432", "#7c2a1f"] },
      dark: { accent: "#ff9b8a", strong: "#ffb6a9", soft: "#3a211d", on: "#2b0f0a", hero: ["#c0553f", "#7c2f22"] },
    },
    pink: {
      label: "Rosa",
      light: { accent: "#b53a6c", strong: "#8f2a53", soft: "#fbe8f0", on: "#ffffff", hero: ["#a83262", "#6f1f42"] },
      dark: { accent: "#ff9cc2", strong: "#ffb8d4", soft: "#3a2030", on: "#2b0a18", hero: ["#b23a68", "#6f1f42"] },
    },
  };

  const BANNERS = {
    accent: { label: "Cor de destaque", css: null },
    aurora: { label: "Aurora", css: "linear-gradient(135deg, #0f766e 0%, #2563eb 100%)" },
    sunset: { label: "Pôr do sol", css: "linear-gradient(135deg, #f97316 0%, #db2777 100%)" },
    ocean: { label: "Oceano", css: "linear-gradient(135deg, #0ea5e9 0%, #0f766e 100%)" },
    lavender: { label: "Lavanda", css: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" },
    forest: { label: "Floresta", css: "linear-gradient(135deg, #166534 0%, #65a30d 100%)" },
    graphite: { label: "Grafite", css: "linear-gradient(135deg, #334155 0%, #0f172a 100%)" },
  };

  const DEFAULT_AVATAR =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
        '<circle cx="32" cy="23" r="11.5" fill="#a7b1ab"/>' +
        '<path d="M10 58c1.6-12 10.6-19 22-19s20.4 7 22 19" fill="#a7b1ab"/>' +
      "</svg>"
    );

  const MEALS = {
    cafe: "Café da manhã",
    almoco: "Almoço",
    lanche: "Lanche",
    jantar: "Jantar",
  };

  const FOOD_GROUPS = ["Proteínas", "Carboidratos", "Frutas", "Vegetais", "Outros"];

  const FOODS = [
    { id: "frango", name: "Frango grelhado", group: "Proteínas", protein: 31, carbs: 0 },
    { id: "ovo", name: "Ovo cozido", group: "Proteínas", protein: 13, carbs: 1.1 },
    { id: "carne", name: "Carne bovina magra", group: "Proteínas", protein: 26, carbs: 0 },
    { id: "tilapia", name: "Tilápia", group: "Proteínas", protein: 26, carbs: 0 },
    { id: "atum", name: "Atum", group: "Proteínas", protein: 29, carbs: 0 },
    { id: "whey", name: "Whey protein", group: "Proteínas", protein: 80, carbs: 8 },
    { id: "tofu", name: "Tofu", group: "Proteínas", protein: 8, carbs: 1.9 },
    { id: "queijo", name: "Queijo minas", group: "Proteínas", protein: 17, carbs: 3.2 },
    { id: "iogurte", name: "Iogurte natural", group: "Proteínas", protein: 3.5, carbs: 4.7 },
    { id: "leite", name: "Leite integral", group: "Proteínas", protein: 3.2, carbs: 4.8 },
    { id: "arroz", name: "Arroz branco cozido", group: "Carboidratos", protein: 2.5, carbs: 28 },
    { id: "arroz-integral", name: "Arroz integral cozido", group: "Carboidratos", protein: 2.6, carbs: 23 },
    { id: "macarrao", name: "Macarrão cozido", group: "Carboidratos", protein: 5.8, carbs: 25 },
    { id: "pao-frances", name: "Pão francês", group: "Carboidratos", protein: 8, carbs: 58 },
    { id: "pao-integral", name: "Pão integral", group: "Carboidratos", protein: 9, carbs: 41 },
    { id: "aveia", name: "Aveia", group: "Carboidratos", protein: 13.9, carbs: 66 },
    { id: "batata", name: "Batata cozida", group: "Carboidratos", protein: 2, carbs: 17 },
    { id: "batata-doce", name: "Batata-doce", group: "Carboidratos", protein: 1.6, carbs: 20 },
    { id: "feijao", name: "Feijão cozido", group: "Carboidratos", protein: 4.8, carbs: 13.6 },
    { id: "lentilha", name: "Lentilha cozida", group: "Carboidratos", protein: 9, carbs: 20 },
    { id: "grao-de-bico", name: "Grão-de-bico cozido", group: "Carboidratos", protein: 8.9, carbs: 27 },
    { id: "granola", name: "Granola", group: "Carboidratos", protein: 10, carbs: 64 },
    { id: "tapioca", name: "Tapioca", group: "Carboidratos", protein: 0, carbs: 88 },
    { id: "cuscuz", name: "Cuscuz", group: "Carboidratos", protein: 2, carbs: 25 },
    { id: "banana", name: "Banana", group: "Frutas", protein: 1.1, carbs: 23 },
    { id: "maca", name: "Maçã", group: "Frutas", protein: 0.3, carbs: 14 },
    { id: "laranja", name: "Laranja", group: "Frutas", protein: 0.9, carbs: 11.8 },
    { id: "brocolis", name: "Brócolis", group: "Vegetais", protein: 2.8, carbs: 7 },
    { id: "salada", name: "Salada verde", group: "Vegetais", protein: 1.4, carbs: 2.9 },
    { id: "amendoim", name: "Amendoim", group: "Outros", protein: 25, carbs: 16 },
    { id: "pasta-amendoim", name: "Pasta de amendoim", group: "Outros", protein: 25, carbs: 20 },
    { id: "chocolate", name: "Chocolate ao leite", group: "Outros", protein: 7.6, carbs: 59 },
    { id: "refrigerante", name: "Refrigerante", group: "Outros", protein: 0, carbs: 10.6 },
    { id: "suco-laranja", name: "Suco de laranja", group: "Outros", protein: 0.7, carbs: 10.4 },
    { id: "mel", name: "Mel", group: "Outros", protein: 0.3, carbs: 82 },
  ];

  const DEFAULT_NUTRITION_GOALS = { protein: 120, carbs: 250 };

  const CATEGORIES = {
    work: { label: "Trabalho" },
    personal: { label: "Pessoal" },
    health: { label: "Saúde" },
    study: { label: "Estudos" },
    other: { label: "Outro" },
  };

  const REMINDER_SHORT = {
    5: "5 min",
    15: "15 min",
    30: "30 min",
    60: "1 h",
    1440: "1 dia",
  };

  const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const DAY_MS = 86400000;

  /* ---------- State -------------------------------------- */

  let profiles = [];
  let activeProfile = null;
  let pendingPinProfile = null;
  let pinBuffer = "";
  let pinBusy = false;
  let createAccent = "green";
  let createAvatarImage = null;
  let editAccent = "green";
  let editAvatarImage = null;
  let editBannerImage = null;
  let editBannerPreset = "accent";
  let pendingOpen = null;

  let events = [];
  let settings = defaultSettings();
  let selectedDate = todayISO();
  let editingId = null;
  let selectedCategory = "work";
  let activeView = "day";
  let searchQuery = "";
  let firedReminders = {};
  let deferredInstallPrompt = null;
  let toastTimer = null;
  let deleteConfirmTimer = null;
  let clearConfirmTimer = null;
  let lastKnownToday = todayISO();

  let nutritionEntries = [];
  let nutritionGoals = { ...DEFAULT_NUTRITION_GOALS };
  let nutritionDate = todayISO();

  /* ---------- Element references ------------------------- */

  const $ = (id) => document.getElementById(id);

  const el = {
    appRoot: document.querySelector(".app"),
    greeting: $("greeting"),
    todayBtn: $("todayBtn"),
    installBtn: $("installBtn"),
    profileBtn: $("profileBtn"),
    topAvatar: $("topAvatar"),
    settingsAvatar: $("settingsAvatar"),
    settingsName: $("settingsName"),
    settingsBio: $("settingsBio"),
    settingsProfileSub: $("settingsProfileSub"),
    settingsBanner: $("settingsBanner"),
    editProfileBtn: $("editProfileBtn"),
    logoutBtn: $("logoutBtn"),
    profileBackdrop: $("profileBackdrop"),
    profileSheet: $("profileSheet"),
    profileSheetTitle: $("profileSheetTitle"),
    closeProfileSheet: $("closeProfileSheet"),
    profileForm: $("profileForm"),
    editProfileName: $("editProfileName"),
    editProfileBio: $("editProfileBio"),
    editAccentPicker: $("editAccentPicker"),
    editBannerPicker: $("editBannerPicker"),
    editBannerPreview: $("editBannerPreview"),
    editAvatarPreview: $("editAvatarPreview"),
    avatarGalleryBtn: $("avatarGalleryBtn"),
    avatarUrlBtn: $("avatarUrlBtn"),
    avatarRemoveBtn: $("avatarRemoveBtn"),
    avatarUrlRow: $("avatarUrlRow"),
    avatarUrlInput: $("avatarUrlInput"),
    avatarUrlApply: $("avatarUrlApply"),
    avatarHint: $("avatarHint"),
    bannerGalleryBtn: $("bannerGalleryBtn"),
    bannerUrlBtn: $("bannerUrlBtn"),
    bannerRemoveBtn: $("bannerRemoveBtn"),
    bannerUrlRow: $("bannerUrlRow"),
    bannerUrlInput: $("bannerUrlInput"),
    bannerUrlApply: $("bannerUrlApply"),
    bannerHint: $("bannerHint"),
    avatarImageFile: $("avatarImageFile"),
    bannerImageFile: $("bannerImageFile"),
    editProfilePinEnabled: $("editProfilePinEnabled"),
    editProfilePinField: $("editProfilePinField"),
    editProfilePin: $("editProfilePin"),
    editProfileError: $("editProfileError"),
    deleteProfileBtn: $("deleteProfileBtn"),
    saveProfileBtn: $("saveProfileBtn"),
    authScreen: $("authScreen"),
    authProfiles: $("authProfiles"),
    authCreate: $("authCreate"),
    authCreateTitle: $("authCreateTitle"),
    authPin: $("authPin"),
    profileList: $("profileList"),
    newProfileBtn: $("newProfileBtn"),
    createBack: $("createBack"),
    createProfileForm: $("createProfileForm"),
    newProfileName: $("newProfileName"),
    createAccentPicker: $("createAccentPicker"),
    createAvatarPreview: $("createAvatarPreview"),
    createAvatarGalleryBtn: $("createAvatarGalleryBtn"),
    createAvatarUrlBtn: $("createAvatarUrlBtn"),
    createAvatarRemoveBtn: $("createAvatarRemoveBtn"),
    createAvatarUrlRow: $("createAvatarUrlRow"),
    createAvatarUrlInput: $("createAvatarUrlInput"),
    createAvatarUrlApply: $("createAvatarUrlApply"),
    createAvatarHint: $("createAvatarHint"),
    createAvatarImageFile: $("createAvatarImageFile"),
    newProfilePinEnabled: $("newProfilePinEnabled"),
    newProfilePinField: $("newProfilePinField"),
    newProfilePin: $("newProfilePin"),
    createError: $("createError"),
    createProfileBtn: $("createProfileBtn"),
    pinBack: $("pinBack"),
    pinAvatar: $("pinAvatar"),
    pinName: $("pinName"),
    pinDots: $("pinDots"),
    pinError: $("pinError"),
    pinPad: $("pinPad"),
    forgotPin: $("forgotPin"),
    prevWeek: $("prevWeek"),
    nextWeek: $("nextWeek"),
    weekStrip: $("weekStrip"),
    dateEyebrow: $("dateEyebrow"),
    dateTitle: $("dateTitle"),
    openDate: $("openDate"),
    hiddenDate: $("hiddenDate"),
    hero: $("hero"),
    demoBanner: $("demoBanner"),
    clearDemo: $("clearDemo"),
    dayCount: $("dayCount"),
    dayList: $("dayList"),
    viewDay: $("view-day"),
    viewUpcoming: $("view-upcoming"),
    viewNutrition: $("view-nutrition"),
    viewSettings: $("view-settings"),
    nutritionCount: $("nutritionCount"),
    nutritionPrev: $("nutritionPrev"),
    nutritionNext: $("nutritionNext"),
    nutritionTodayBtn: $("nutritionTodayBtn"),
    nutritionDayTitle: $("nutritionDayTitle"),
    nutritionDaySub: $("nutritionDaySub"),
    proteinTotal: $("proteinTotal"),
    carbsTotal: $("carbsTotal"),
    proteinGoalLabel: $("proteinGoalLabel"),
    carbsGoalLabel: $("carbsGoalLabel"),
    proteinBar: $("proteinBar"),
    carbsBar: $("carbsBar"),
    nutritionAnalysis: $("nutritionAnalysis"),
    proteinGoalInput: $("proteinGoalInput"),
    carbsGoalInput: $("carbsGoalInput"),
    nutritionForm: $("nutritionForm"),
    mealSelect: $("mealSelect"),
    foodGrams: $("foodGrams"),
    foodSelect: $("foodSelect"),
    foodMacroPreview: $("foodMacroPreview"),
    customFoodFields: $("customFoodFields"),
    customFoodName: $("customFoodName"),
    customProtein: $("customProtein"),
    customCarbs: $("customCarbs"),
    nutritionList: $("nutritionList"),
    clearNutritionDay: $("clearNutritionDay"),
    searchInput: $("searchInput"),
    upcomingList: $("upcomingList"),
    upCount: $("upCount"),
    tabs: Array.from(document.querySelectorAll(".tab")),
    fab: $("fab"),
    backdrop: $("backdrop"),
    sheet: $("sheet"),
    sheetTitle: $("sheetTitle"),
    sheetKicker: $("sheetKicker"),
    closeSheet: $("closeSheet"),
    form: $("eventForm"),
    formError: $("formError"),
    conflictHint: $("conflictHint"),
    fTitle: $("fTitle"),
    fAllDay: $("fAllDay"),
    fDate: $("fDate"),
    fEndDate: $("fEndDate"),
    fStart: $("fStart"),
    fEnd: $("fEnd"),
    timeRow: $("timeRow"),
    fLocation: $("fLocation"),
    fNotes: $("fNotes"),
    fReminder: $("fReminder"),
    catPicker: $("catPicker"),
    deleteBtn: $("deleteBtn"),
    saveBtn: $("saveBtn"),
    themePicker: $("themePicker"),
    notifStatus: $("notifStatus"),
    notifBtn: $("notifBtn"),
    installRow: $("installRow"),
    installRowBtn: $("installRowBtn"),
    pixKey: $("pixKey"),
    copyPixBtn: $("copyPixBtn"),
    exportBtn: $("exportBtn"),
    exportIcsBtn: $("exportIcsBtn"),
    importBtn: $("importBtn"),
    importFile: $("importFile"),
    clearBtn: $("clearBtn"),
    eventCount: $("eventCount"),
    toast: $("toast"),
    toastMessage: $("toastMessage"),
    toastAction: $("toastAction"),
  };

  /* ---------- Date and time helpers ---------------------- */

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function toISO(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function todayISO() {
    return toISO(new Date());
  }

  function fromISO(iso) {
    const [year, month, day] = String(iso).split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function addDays(date, amount) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  }

  function startOfWeek(date) {
    return addDays(date, -date.getDay());
  }

  function daysBetween(isoA, isoB) {
    const a = fromISO(isoA);
    const b = fromISO(isoB);
    return Math.round(
      (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
        Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
        DAY_MS
    );
  }

  function minutesFromTime(value) {
    const [hours, minutes] = String(value).split(":").map(Number);
    return hours * 60 + minutes;
  }

  function timeFromMinutes(total) {
    const safe = Math.max(0, Math.min(1439, total));
    return `${pad(Math.floor(safe / 60))}:${pad(safe % 60)}`;
  }

  function nowMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  function clockTime() {
    const now = new Date();
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  function timeFromDate(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function localDateTime(dateISO, time) {
    const date = fromISO(dateISO);
    const minutes = minutesFromTime(time);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      Math.floor(minutes / 60),
      minutes % 60,
      0,
      0
    );
  }

  function eventStartDate(event) {
    return localDateTime(event.date, event.allDay ? "00:00" : event.start);
  }

  function eventEndDate(event) {
    if (event.allDay) {
      return localDateTime(event.endDate || event.date, "23:59");
    }
    return localDateTime(event.endDate || event.date, event.end);
  }

  function occursOn(event, iso) {
    const endDate = event.endDate || event.date;
    if (iso < event.date || iso > endDate) return false;
    if (!event.allDay && iso === endDate && endDate > event.date && event.end === "00:00") {
      return false;
    }
    return true;
  }

  function displayTimes(event, iso) {
    if (event.allDay) {
      return { allDay: true, start: "", end: "" };
    }
    const endDate = event.endDate || event.date;
    const continuedBefore = iso > event.date;
    const continuedAfter = iso < endDate;
    return {
      allDay: false,
      start: continuedBefore ? "00:00" : event.start,
      end: continuedAfter ? "23:59" : event.end,
      continuedBefore,
      continuedAfter,
    };
  }

  function dayCountFor(event) {
    return Math.max(1, daysBetween(event.date, event.endDate || event.date) + 1);
  }

  function capitalize(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  }

  function weekdayName(iso) {
    return capitalize(
      new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(fromISO(iso))
    );
  }

  function monthDay(iso) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
    }).format(fromISO(iso));
  }

  function shortDate(iso) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "short",
    })
      .format(fromISO(iso))
      .replace(".", "");
  }

  function relativeDayName(iso) {
    const diff = daysBetween(todayISO(), iso);
    if (diff === 0) return "Hoje";
    if (diff === 1) return "Amanhã";
    if (diff === -1) return "Ontem";
    return weekdayName(iso);
  }

  function dateTitleFor(iso) {
    return relativeDayName(iso);
  }

  function relativeChip(iso) {
    const diff = daysBetween(todayISO(), iso);
    if (diff === 0) return "hoje";
    if (diff === 1) return "amanhã";
    if (diff < 0) return `há ${Math.abs(diff)} dias`;
    return `em ${diff} dias`;
  }

  function durationLabel(event) {
    if (event.allDay) {
      const days = dayCountFor(event);
      return days === 1 ? "Dia inteiro" : `${days} dias`;
    }
    const total = Math.round(
      (eventEndDate(event).getTime() - eventStartDate(event).getTime()) / 60000
    );
    if (total <= 0) return "";
    const days = Math.floor(total / 1440);
    const hours = Math.floor((total % 1440) / 60);
    const minutes = total % 60;
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes && !days) parts.push(`${pad(minutes)}min`);
    return parts.join(" ") || `${total}min`;
  }

  function countdownLabel(target) {
    const diff = target.getTime() - Date.now();
    if (diff <= 30000) return "agora";
    const minutes = Math.max(1, Math.round(diff / 60000));
    if (minutes < 60) return `em ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    if (hours < 24) {
      return remaining ? `em ${hours}h ${remaining}min` : `em ${hours}h`;
    }
    const days = Math.round(hours / 24);
    return `em ${days} ${days === 1 ? "dia" : "dias"}`;
  }

  function uid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function vibrate(ms) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (error) {
        /* ignore */
      }
    }
  }

  async function copyText(value) {
    if (
      window.AndroidDia &&
      typeof window.AndroidDia.copyText === "function"
    ) {
      try {
        if (window.AndroidDia.copyText(value)) return true;
      } catch (error) {
        /* fallback below */
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (error) {
        /* fallback below */
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, value.length);

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    textarea.remove();

    if (!copied) throw new Error("copy failed");
    return true;
  }

  async function copyPixKey() {
    try {
      await copyText(PIX_KEY);
      showToast("Chave PIX copiada");
    } catch (error) {
      showToast(`Não foi possível copiar. Chave: ${PIX_KEY}`);
    }
  }

  /* ---------- Validation / normalization ----------------- */

  function isValidISODate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  function isValidTime(value) {
    const match = /^(\d{2}):(\d{2})$/.exec(value || "");
    if (!match) return false;
    return Number(match[1]) < 24 && Number(match[2]) < 60;
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function normalizedEndDate(event) {
    const date = event.date;
    const endDate = event.endDate || date;
    return isValidISODate(endDate) && endDate >= date ? endDate : date;
  }

  function isValidEvent(event) {
    if (
      !event ||
      typeof event !== "object" ||
      typeof event.title !== "string" ||
      !event.title.trim() ||
      !isValidISODate(event.date)
    ) {
      return false;
    }

    const endDate = normalizedEndDate(event);
    if (event.allDay) return true;

    if (!isValidTime(event.start) || !isValidTime(event.end)) return false;
    const start = localDateTime(event.date, event.start);
    const end = localDateTime(endDate, event.end);
    return end.getTime() > start.getTime();
  }

  function normalizeEvent(event) {
    const allDay = Boolean(event.allDay);
    const category = Object.prototype.hasOwnProperty.call(
      CATEGORIES,
      event.category
    )
      ? event.category
      : "other";
    const reminderValue = Number(event.reminder);
    const reminder =
      !allDay && [5, 15, 30, 60, 1440].includes(reminderValue)
        ? reminderValue
        : null;
    return {
      id: typeof event.id === "string" && event.id ? event.id : uid(),
      title: String(event.title).trim().slice(0, 90),
      date: event.date,
      endDate: normalizedEndDate(event),
      allDay,
      start: allDay ? "00:00" : event.start.slice(0, 5),
      end: allDay ? "23:59" : event.end.slice(0, 5),
      category,
      location:
        typeof event.location === "string" ? event.location.slice(0, 100) : "",
      notes: typeof event.notes === "string" ? event.notes.slice(0, 500) : "",
      reminder,
      done: Boolean(event.done),
      demo: Boolean(event.demo),
      createdAt: Number(event.createdAt) || Date.now(),
      updatedAt: Number(event.updatedAt) || Number(event.createdAt) || Date.now(),
    };
  }

  /* ---------- Settings / persistence --------------------- */

  function defaultSettings() {
    return { theme: "auto" };
  }

  function mergeSettings(stored) {
    const result = defaultSettings();
    if (!stored || typeof stored !== "object") return result;
    if (["auto", "light", "dark"].includes(stored.theme)) {
      result.theme = stored.theme;
    }
    return result;
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function profileKey(name) {
    return activeProfile ? `dia.profile.${activeProfile.id}.${name}` : null;
  }

  function sanitizeProfileImage(value) {
    if (typeof value !== "string" || !value) return null;
    if (value.startsWith("data:image/")) return value;
    if (/^https:\/\//i.test(value)) return value;
    return null;
  }

  function loadProfiles() {
    const stored = readJSON(STORE.profiles, []);
    if (!Array.isArray(stored)) return [];
    return stored
      .filter(
        (profile) =>
          profile &&
          typeof profile.id === "string" &&
          profile.id &&
          typeof profile.name === "string"
      )
      .map((profile) => ({
        id: profile.id,
        name: String(profile.name).trim().slice(0, 30) || "Perfil",
        accent: Object.prototype.hasOwnProperty.call(ACCENTS, profile.accent)
          ? profile.accent
          : "green",
        pinHash:
          typeof profile.pinHash === "string" && profile.pinHash
            ? profile.pinHash
            : null,
        pinSalt: typeof profile.pinSalt === "string" ? profile.pinSalt : null,
        avatarImage: sanitizeProfileImage(profile.avatarImage),
        bannerImage: sanitizeProfileImage(profile.bannerImage),
        bannerPreset: Object.prototype.hasOwnProperty.call(
          BANNERS,
          profile.bannerPreset
        )
          ? profile.bannerPreset
          : "accent",
        bio:
          typeof profile.bio === "string"
            ? profile.bio.trim().slice(0, 60)
            : "",
        createdAt: Number(profile.createdAt) || Date.now(),
        lastUsed: Number(profile.lastUsed) || Number(profile.createdAt) || 0,
      }));
  }

  function saveProfiles(list) {
    try {
      localStorage.setItem(STORE.profiles, JSON.stringify(list || profiles));
      return true;
    } catch (error) {
      if (activeProfile) {
        showToast("Não foi possível salvar o perfil. O armazenamento está cheio.");
      } else {
        showAuthError(
          el.createError,
          "Não foi possível salvar o perfil. O armazenamento está cheio."
        );
      }
      return false;
    }
  }

  function makeProfileRecord({ name, accent }) {
    return {
      id: uid(),
      name,
      accent,
      pinHash: null,
      pinSalt: null,
      avatarImage: null,
      bannerImage: null,
      bannerPreset: "accent",
      bio: "",
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };
  }

  function updateProfileRecord(profile) {
    const index = profiles.findIndex((item) => item.id === profile.id);
    if (index === -1) return false;
    profiles[index] = profile;
    return saveProfiles(profiles);
  }

  function clearProfileData(id) {
    ["events", "settings", "fired", "nutrition.v1", "nutritionGoals.v1"].forEach((name) => {
      try {
        localStorage.removeItem(`dia.profile.${id}.${name}`);
      } catch (error) {
        /* ignore */
      }
    });
  }

  function migrateLegacyData() {
    let legacyEvents = null;

    for (const key of STORE.legacyEvents) {
      let raw = null;
      try {
        raw = localStorage.getItem(key);
      } catch (error) {
        raw = null;
      }
      if (raw === null) continue;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          legacyEvents = parsed;
          break;
        }
      } catch (error) {
        /* try next */
      }
    }

    if (legacyEvents === null) return [];

    const profile = makeProfileRecord({
      name: "Meu perfil",
      accent: "green",
    });
    const migratedEvents = legacyEvents
      .filter(isValidEvent)
      .map(normalizeEvent);
    const legacySettings = mergeSettings(readJSON(STORE.legacySettings, {}));
    const legacyFired = readJSON(STORE.legacyFired, {});

    try {
      localStorage.setItem(
        `dia.profile.${profile.id}.events`,
        JSON.stringify(migratedEvents)
      );
      localStorage.setItem(
        `dia.profile.${profile.id}.settings`,
        JSON.stringify(legacySettings)
      );
      localStorage.setItem(
        `dia.profile.${profile.id}.fired`,
        JSON.stringify(legacyFired)
      );
      localStorage.setItem(STORE.profiles, JSON.stringify([profile]));
      localStorage.setItem(STORE.onboarded, "1");
      STORE.legacyEvents.forEach((key) => localStorage.removeItem(key));
      localStorage.removeItem(STORE.legacySettings);
      localStorage.removeItem(STORE.legacyFired);
      return [profile];
    } catch (error) {
      return [];
    }
  }

  function loadProfilesWithMigration() {
    const existing = loadProfiles();
    if (existing.length) return existing;
    return migrateLegacyData();
  }

  function loadSettings() {
    if (!activeProfile) return defaultSettings();
    return mergeSettings(readJSON(profileKey("settings"), {}));
  }

  function saveSettings() {
    if (!activeProfile) return;
    try {
      localStorage.setItem(profileKey("settings"), JSON.stringify(settings));
    } catch (error) {
      /* ignore */
    }
  }

  function loadEvents() {
    if (!activeProfile) return [];
    const raw = readJSON(profileKey("events"), null);
    if (raw === null || !Array.isArray(raw)) return [];
    return raw.filter(isValidEvent).map(normalizeEvent);
  }

  function saveEvents(list) {
    if (!activeProfile) return false;
    const data = list || events;
    try {
      localStorage.setItem(profileKey("events"), JSON.stringify(data));
      return true;
    } catch (error) {
      showToast("Não foi possível salvar. O armazenamento está cheio.");
      return false;
    }
  }

  function normalizeNutritionEntry(entry) {
    if (!entry || typeof entry !== "object" || !isValidISODate(entry.date)) {
      return null;
    }
    return {
      id: typeof entry.id === "string" && entry.id ? entry.id : uid(),
      date: entry.date,
      meal: Object.prototype.hasOwnProperty.call(MEALS, entry.meal)
        ? entry.meal
        : "lanche",
      name:
        String(entry.name || "")
          .trim()
          .slice(0, 60) || "Alimento",
      grams: clampNumber(entry.grams, 1, 2000, 100),
      proteinPer100: clampNumber(entry.proteinPer100, 0, 100, 0),
      carbsPer100: clampNumber(entry.carbsPer100, 0, 100, 0),
      createdAt: Number(entry.createdAt) || Date.now(),
    };
  }

  function loadNutrition() {
    if (!activeProfile) return [];
    const raw = readJSON(profileKey("nutrition.v1"), []);
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeNutritionEntry).filter(Boolean);
  }

  function saveNutrition() {
    if (!activeProfile) return false;
    try {
      localStorage.setItem(
        profileKey("nutrition.v1"),
        JSON.stringify(nutritionEntries)
      );
      return true;
    } catch (error) {
      showToast("Não foi possível salvar a alimentação. O armazenamento está cheio.");
      return false;
    }
  }

  function normalizeNutritionGoals(value) {
    const source = value && typeof value === "object" ? value : {};
    const proteinEmpty =
      source.protein === "" || source.protein === null || source.protein === undefined;
    const carbsEmpty =
      source.carbs === "" || source.carbs === null || source.carbs === undefined;
    return {
      protein: Math.round(
        proteinEmpty
          ? DEFAULT_NUTRITION_GOALS.protein
          : clampNumber(source.protein, 0, 500, DEFAULT_NUTRITION_GOALS.protein)
      ),
      carbs: Math.round(
        carbsEmpty
          ? DEFAULT_NUTRITION_GOALS.carbs
          : clampNumber(source.carbs, 0, 600, DEFAULT_NUTRITION_GOALS.carbs)
      ),
    };
  }

  function loadNutritionGoals() {
    if (!activeProfile) return { ...DEFAULT_NUTRITION_GOALS };
    return normalizeNutritionGoals(
      readJSON(profileKey("nutritionGoals.v1"), null)
    );
  }

  function saveNutritionGoals() {
    if (!activeProfile) return;
    try {
      localStorage.setItem(
        profileKey("nutritionGoals.v1"),
        JSON.stringify(nutritionGoals)
      );
    } catch (error) {
      /* ignore */
    }
  }

  function loadFired() {
    if (!activeProfile) return {};
    const stored = readJSON(profileKey("fired"), {});
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
    const result = {};
    Object.keys(stored).forEach((key) => {
      if (typeof stored[key] === "number") result[key] = stored[key];
    });
    return result;
  }

  function saveFired() {
    if (!activeProfile) return;
    try {
      localStorage.setItem(profileKey("fired"), JSON.stringify(firedReminders));
    } catch (error) {
      /* ignore */
    }
  }

  function seedDemoEvents() {
    const today = todayISO();
    const tomorrow = toISO(addDays(fromISO(today), 1));
    const base = Date.now();
    return [
      {
        id: uid(),
        title: "Café e planejamento",
        date: today,
        endDate: today,
        allDay: false,
        start: "08:30",
        end: "09:00",
        category: "personal",
        location: "",
        notes: "Rever as prioridades do dia.",
        reminder: null,
        done: false,
        demo: true,
        createdAt: base,
      },
      {
        id: uid(),
        title: "Reunião de equipe",
        date: today,
        endDate: today,
        allDay: false,
        start: "10:00",
        end: "11:00",
        category: "work",
        location: "Sala de reunião",
        notes: "",
        reminder: 15,
        done: false,
        demo: true,
        createdAt: base + 1,
      },
      {
        id: uid(),
        title: "Almoço com Ana",
        date: today,
        endDate: today,
        allDay: false,
        start: "12:30",
        end: "13:30",
        category: "personal",
        location: "Cantina da esquina",
        notes: "",
        reminder: null,
        done: false,
        demo: true,
        createdAt: base + 2,
      },
      {
        id: uid(),
        title: "Estudar para a prova",
        date: today,
        endDate: today,
        allDay: false,
        start: "15:00",
        end: "16:30",
        category: "study",
        location: "",
        notes: "",
        reminder: 30,
        done: false,
        demo: true,
        createdAt: base + 3,
      },
      {
        id: uid(),
        title: "Academia",
        date: today,
        endDate: today,
        allDay: false,
        start: "18:30",
        end: "19:30",
        category: "health",
        location: "Smart Fit",
        notes: "",
        reminder: null,
        done: false,
        demo: true,
        createdAt: base + 4,
      },
      {
        id: uid(),
        title: "Consulta médica",
        date: tomorrow,
        endDate: tomorrow,
        allDay: false,
        start: "09:00",
        end: "10:00",
        category: "health",
        location: "Clínica Vida",
        notes: "Levar carteirinha do convênio.",
        reminder: 60,
        done: false,
        demo: true,
        createdAt: base + 5,
      },
    ].map(normalizeEvent);
  }

  /* ---------- Theme -------------------------------------- */

  const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");

  function syncAndroidSystemBars(isDark) {
    if (
      !window.AndroidDia ||
      typeof window.AndroidDia.setSystemBars !== "function"
    ) {
      return;
    }
    try {
      window.AndroidDia.setSystemBars(
        Boolean(isDark),
        isDark ? "#0f1512" : "#f6f5f1"
      );
    } catch (error) {
      /* running outside the Android wrapper */
    }
  }

  function applyTheme(mode, persist) {
    settings.theme = mode;
    if (persist !== false) saveSettings();

    const isDark = mode === "dark" || (mode === "auto" && darkMedia.matches);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    document.documentElement.dataset.themeMode = mode;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#0f1512" : "#f6f5f1");
    syncAndroidSystemBars(isDark);

    Array.from(el.themePicker.querySelectorAll("button")).forEach((button) => {
      const active = button.dataset.themeValue === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    applyAccent();
    if (activeProfile) updateProfileUI();
  }

  function resetAccent() {
    const style = document.documentElement.style;
    ["--accent", "--accent-strong", "--accent-soft", "--on-accent", "--hero-bg"].forEach(
      (name) => style.removeProperty(name)
    );
  }

  function applyAccent() {
    if (!activeProfile) {
      resetAccent();
      return;
    }

    const preset = ACCENTS[activeProfile.accent] || ACCENTS.green;
    const isDark = document.documentElement.dataset.theme === "dark";
    const colors = isDark ? preset.dark : preset.light;
    const style = document.documentElement.style;

    style.setProperty("--accent", colors.accent);
    style.setProperty("--accent-strong", colors.strong);
    style.setProperty("--accent-soft", colors.soft);
    style.setProperty("--on-accent", colors.on);
    style.setProperty(
      "--hero-bg",
      `linear-gradient(135deg, ${colors.hero[0]} 0%, ${colors.hero[1]} 100%)`
    );
  }

  function profileAccentColors(profile) {
    const preset = ACCENTS[profile && profile.accent] || ACCENTS.green;
    return document.documentElement.dataset.theme === "dark"
      ? preset.dark
      : preset.light;
  }

  function cssImageUrl(value) {
    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, "%22")
      .replace(/\n/g, "");
  }

  function bannerGradientFor(accentKey, presetKey) {
    const preset = BANNERS[presetKey] || BANNERS.accent;
    if (preset.css) return preset.css;
    const colors = profileAccentColors({ accent: accentKey || "green" });
    return `linear-gradient(135deg, ${colors.hero[0]} 0%, ${colors.hero[1]} 100%)`;
  }

  function applyBannerToElement(element, image, gradient) {
    if (!element) return;
    if (image) {
      element.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.2)), url("${cssImageUrl(image)}"), ${gradient}`;
    } else {
      element.style.backgroundImage = gradient;
    }
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
  }

  function applyBannerBackground(element, profile) {
    applyBannerToElement(
      element,
      profile && profile.bannerImage,
      bannerGradientFor(
        profile && profile.accent,
        profile && profile.bannerPreset
      )
    );
  }

  function renderAvatarElement(element, image) {
    if (!element) return;
    element.replaceChildren();
    const img = document.createElement("img");
    let fallbackApplied = false;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    img.src = image || DEFAULT_AVATAR;
    img.addEventListener("error", () => {
      if (fallbackApplied) return;
      fallbackApplied = true;
      img.src = DEFAULT_AVATAR;
    });
    element.append(img);
  }

  function renderAvatar(element, profile) {
    renderAvatarElement(element, profile && profile.avatarImage);
  }

  function updateProfileEditorPreview() {
    renderAvatarElement(el.editAvatarPreview, editAvatarImage);
    applyBannerToElement(
      el.editBannerPreview,
      editBannerImage,
      bannerGradientFor(editAccent, editBannerPreset)
    );
    if (el.avatarRemoveBtn) el.avatarRemoveBtn.hidden = !editAvatarImage;
    if (el.bannerRemoveBtn) el.bannerRemoveBtn.hidden = !editBannerImage;
  }

  function updateProfileUI() {
    if (!activeProfile) return;
    const pinProtected = Boolean(activeProfile.pinHash);

    renderAvatar(el.topAvatar, activeProfile);
    renderAvatar(el.settingsAvatar, activeProfile);
    applyBannerBackground(el.settingsBanner, activeProfile);

    if (el.profileBtn) {
      el.profileBtn.setAttribute(
        "aria-label",
        `Abrir perfil de ${activeProfile.name}`
      );
      el.profileBtn.title = activeProfile.name;
    }
    if (el.settingsName) el.settingsName.textContent = activeProfile.name;
    if (el.settingsBio) {
      el.settingsBio.textContent = activeProfile.bio || "";
      el.settingsBio.hidden = !activeProfile.bio;
    }
    if (el.settingsProfileSub) {
      el.settingsProfileSub.textContent = pinProtected
        ? "Perfil protegido com PIN"
        : "Perfil local";
    }
  }

  /* ---------- Auth / profile helpers --------------------- */

  function showAuthError(node, message) {
    if (!node) return;
    node.textContent = message;
    node.hidden = false;
  }

  function hideAuthError(node) {
    if (!node) return;
    node.hidden = true;
    node.textContent = "";
  }

  function randomSalt() {
    try {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("");
    } catch (error) {
      return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    }
  }

  async function hashPin(pin, salt) {
    const input = `${salt || ""}:${pin}`;
    try {
      if (window.crypto && window.crypto.subtle) {
        const data = new TextEncoder().encode(input);
        const digest = await window.crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(digest), (byte) =>
          byte.toString(16).padStart(2, "0")
        ).join("");
      }
    } catch (error) {
      /* fall back to the simple hash below */
    }

    let hash = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }

  function buildAccentPicker(container, selected, onSelect) {
    if (!container) return;
    container.replaceChildren();
    Object.entries(ACCENTS).forEach(([key, preset]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "accent-option";
      button.dataset.accent = key;
      button.style.background = preset.light.accent;
      button.setAttribute("aria-label", `Cor ${preset.label}`);
      button.setAttribute(
        "aria-pressed",
        key === selected ? "true" : "false"
      );
      button.classList.toggle("is-active", key === selected);
      button.addEventListener("click", () => {
        onSelect(key);
        Array.from(container.querySelectorAll(".accent-option")).forEach(
          (option) => {
            const active = option.dataset.accent === key;
            option.classList.toggle("is-active", active);
            option.setAttribute("aria-pressed", active ? "true" : "false");
          }
        );
      });
      container.append(button);
    });
  }

  function buildBannerPicker(container, selected, onSelect, accentKey) {
    if (!container) return;
    container.replaceChildren();
    Object.entries(BANNERS).forEach(([key, preset]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "banner-option";
      button.dataset.banner = key;
      button.style.backgroundImage = bannerGradientFor(accentKey, key);
      button.style.backgroundSize = "cover";
      button.style.backgroundPosition = "center";
      button.setAttribute("aria-label", `Banner ${preset.label}`);
      button.setAttribute("aria-pressed", key === selected ? "true" : "false");
      button.classList.toggle("is-active", key === selected);
      button.addEventListener("click", () => {
        onSelect(key);
        Array.from(container.querySelectorAll(".banner-option")).forEach(
          (option) => {
            const active = option.dataset.banner === key;
            option.classList.toggle("is-active", active);
            option.setAttribute("aria-pressed", active ? "true" : "false");
          }
        );
      });
      container.append(button);
    });
  }

  function setImageHint(element, message, isError) {
    if (!element) return;
    element.textContent = message || "";
    element.hidden = !message;
    element.classList.toggle("is-error", Boolean(isError));
  }

  function loadImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Imagem inválida."));
      };
      image.src = url;
    });
  }

  function imageToDataUrl(image, width, height) {
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    if (!sourceWidth || !sourceHeight) {
      throw new Error("Imagem inválida.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const cropWidth = width / scale;
    const cropHeight = height / scale;
    const sourceX = (sourceWidth - cropWidth) / 2;
    const sourceY = (sourceHeight - cropHeight) / 2;

    context.drawImage(
      image,
      sourceX,
      sourceY,
      cropWidth,
      cropHeight,
      0,
      0,
      width,
      height
    );

    let data = canvas.toDataURL("image/webp", 0.82);
    if (!data.startsWith("data:image/webp")) {
      data = canvas.toDataURL("image/jpeg", 0.82);
    }
    return data;
  }

  async function processImageFile(file, width, height) {
    if (!file || !file.type || !file.type.startsWith("image/")) {
      throw new Error("Escolha um arquivo de imagem.");
    }
    const image = await loadImageFromBlob(file);
    return imageToDataUrl(image, width, height);
  }

  async function fetchImageAsDataUrl(url, width, height) {
    const response = await fetch(url, {
      mode: "cors",
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });
    if (!response.ok) throw new Error("Não foi possível baixar a imagem.");
    const blob = await response.blob();
    if (!blob.type || !blob.type.startsWith("image/")) {
      throw new Error("O link não é uma imagem.");
    }
    const image = await loadImageFromBlob(blob);
    return imageToDataUrl(image, width, height);
  }

  function validateRemoteImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const timer = window.setTimeout(() => {
        image.src = "";
        reject(new Error("Tempo esgotado ao carregar a imagem."));
      }, 12000);

      image.referrerPolicy = "no-referrer";
      image.onload = () => {
        window.clearTimeout(timer);
        resolve();
      };
      image.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error("Não foi possível carregar a imagem."));
      };
      image.src = url;
    });
  }

  async function applyProfileImageUrl(kind) {
    const isAvatar = kind === "avatar";
    const input = isAvatar ? el.avatarUrlInput : el.bannerUrlInput;
    const button = isAvatar ? el.avatarUrlApply : el.bannerUrlApply;
    const row = isAvatar ? el.avatarUrlRow : el.bannerUrlRow;
    const hint = isAvatar ? el.avatarHint : el.bannerHint;
    const width = isAvatar ? 256 : 900;
    const height = isAvatar ? 256 : 360;
    const url = input.value.trim();

    setImageHint(hint, "", false);

    if (!/^https:\/\//i.test(url)) {
      setImageHint(hint, "Use um link https:// para a imagem.", true);
      input.focus();
      return;
    }

    button.disabled = true;
    setImageHint(hint, "Carregando imagem...", false);

    let imageValue = null;
    let remote = false;

    try {
      imageValue = await fetchImageAsDataUrl(url, width, height);
    } catch (error) {
      try {
        await validateRemoteImage(url);
        imageValue = url;
        remote = true;
      } catch (secondError) {
        button.disabled = false;
        setImageHint(hint, "Não foi possível carregar essa imagem.", true);
        return;
      }
    }

    if (isAvatar) {
      editAvatarImage = imageValue;
    } else {
      editBannerImage = imageValue;
    }

    button.disabled = false;
    input.value = "";
    row.hidden = true;
    updateProfileEditorPreview();
    setImageHint(
      hint,
      remote
        ? "Imagem por link: precisa de internet para aparecer."
        : "Imagem baixada e salva no aparelho.",
      false
    );
  }

  async function handleProfileImageFile(kind, file) {
    const isAvatar = kind === "avatar";
    const hint = isAvatar ? el.avatarHint : el.bannerHint;
    const width = isAvatar ? 256 : 900;
    const height = isAvatar ? 256 : 360;

    setImageHint(hint, "Processando imagem...", false);

    try {
      const data = await processImageFile(file, width, height);
      if (isAvatar) {
        editAvatarImage = data;
      } else {
        editBannerImage = data;
      }
      updateProfileEditorPreview();
      setImageHint(hint, "Imagem salva no aparelho.", false);
    } catch (error) {
      setImageHint(hint, "Não foi possível usar essa imagem.", true);
    }
  }

  function openProfileUrlRow(kind) {
    const isAvatar = kind === "avatar";
    const row = isAvatar ? el.avatarUrlRow : el.bannerUrlRow;
    const input = isAvatar ? el.avatarUrlInput : el.bannerUrlInput;
    row.hidden = false;
    input.focus();
  }

  function removeProfileImage(kind) {
    const isAvatar = kind === "avatar";
    const hint = isAvatar ? el.avatarHint : el.bannerHint;
    if (isAvatar) {
      editAvatarImage = null;
      setImageHint(hint, "Foto removida. Usando o avatar escolhido.", false);
    } else {
      editBannerImage = null;
      setImageHint(hint, "Banner removido. Usando a cor/preset escolhido.", false);
    }
    updateProfileEditorPreview();
  }

  function updateCreateAvatarPreview() {
    renderAvatarElement(el.createAvatarPreview, createAvatarImage);
    if (el.createAvatarRemoveBtn) {
      el.createAvatarRemoveBtn.hidden = !createAvatarImage;
    }
  }

  async function handleCreateAvatarFile(file) {
    setImageHint(el.createAvatarHint, "Processando imagem...", false);
    try {
      const data = await processImageFile(file, 256, 256);
      createAvatarImage = data;
      updateCreateAvatarPreview();
      setImageHint(el.createAvatarHint, "Imagem salva no aparelho.", false);
    } catch (error) {
      setImageHint(
        el.createAvatarHint,
        "Não foi possível usar essa imagem.",
        true
      );
    }
  }

  function openCreateAvatarUrlRow() {
    el.createAvatarUrlRow.hidden = false;
    el.createAvatarUrlInput.focus();
  }

  async function applyCreateAvatarUrl() {
    const url = el.createAvatarUrlInput.value.trim();
    setImageHint(el.createAvatarHint, "", false);

    if (!/^https:\/\//i.test(url)) {
      setImageHint(
        el.createAvatarHint,
        "Use um link https:// para a imagem.",
        true
      );
      el.createAvatarUrlInput.focus();
      return;
    }

    el.createAvatarUrlApply.disabled = true;
    setImageHint(el.createAvatarHint, "Carregando imagem...", false);

    let imageValue = null;
    let remote = false;

    try {
      imageValue = await fetchImageAsDataUrl(url, 256, 256);
    } catch (error) {
      try {
        await validateRemoteImage(url);
        imageValue = url;
        remote = true;
      } catch (secondError) {
        el.createAvatarUrlApply.disabled = false;
        setImageHint(
          el.createAvatarHint,
          "Não foi possível carregar essa imagem.",
          true
        );
        return;
      }
    }

    createAvatarImage = imageValue;
    el.createAvatarUrlApply.disabled = false;
    el.createAvatarUrlInput.value = "";
    el.createAvatarUrlRow.hidden = true;
    updateCreateAvatarPreview();
    setImageHint(
      el.createAvatarHint,
      remote
        ? "Imagem por link: precisa de internet para aparecer."
        : "Imagem baixada e salva no aparelho.",
      false
    );
  }

  function removeCreateAvatar() {
    createAvatarImage = null;
    setImageHint(
      el.createAvatarHint,
      "Foto removida. Usando o avatar escolhido.",
      false
    );
    updateCreateAvatarPreview();
  }

  function showAuthView(view) {
    el.authProfiles.hidden = view !== "profiles";
    el.authCreate.hidden = view !== "create";
    el.authPin.hidden = view !== "pin";
  }

  function renderAuthProfiles() {
    el.profileList.replaceChildren();

    const sorted = profiles
      .slice()
      .sort((a, b) => b.lastUsed - a.lastUsed || b.createdAt - a.createdAt);

    sorted.forEach((profile) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "profile-option";

      const banner = document.createElement("span");
      banner.className = "profile-option-banner";
      applyBannerBackground(banner, profile);

      const body = document.createElement("span");
      body.className = "profile-option-body";

      const avatar = document.createElement("span");
      avatar.className = "profile-avatar";
      avatar.style.background = profileAccentColors(profile).soft;
      renderAvatar(avatar, profile);

      const text = document.createElement("span");
      text.className = "profile-option-text";
      const name = document.createElement("b");
      name.textContent = profile.name;
      const sub = document.createElement("span");
      sub.textContent =
        profile.bio ||
        (profile.pinHash ? "Protegido com PIN" : "Perfil local");
      text.append(name, sub);

      body.append(avatar, text);

      if (profile.pinHash) {
        const lock = document.createElement("span");
        lock.innerHTML =
          '<svg class="icon" aria-hidden="true"><use href="#i-lock"/></svg>';
        body.append(lock);
      }

      const chevron = document.createElement("span");
      chevron.innerHTML =
        '<svg class="icon" aria-hidden="true"><use href="#i-chevron-right"/></svg>';
      body.append(chevron);

      button.append(banner, body);

      button.addEventListener("click", () => {
        if (profile.pinHash) {
          showAuthPin(profile);
        } else {
          enterProfile(profile);
        }
      });

      el.profileList.append(button);
    });

    showAuthView("profiles");
    el.createBack.hidden = true;
  }

  function showAuthCreate(first) {
    showAuthView("create");
    el.authScreen.scrollTop = 0;
    el.authCreateTitle.textContent =
      profiles.length > 0 ? "Novo perfil" : "Criar seu perfil";
    el.createBack.hidden = Boolean(first) || profiles.length === 0;
    el.createProfileForm.reset();
    hideAuthError(el.createError);
    el.newProfilePinField.hidden = true;
    el.newProfilePin.value = "";
    el.createProfileBtn.disabled = false;
    createAccent = "green";
    createAvatarImage = null;
    el.createAvatarUrlRow.hidden = true;
    el.createAvatarUrlInput.value = "";
    el.createAvatarHint.hidden = true;
    el.createAvatarHint.classList.remove("is-error");
    el.createAvatarImageFile.value = "";
    el.createAvatarUrlApply.disabled = false;
    updateCreateAvatarPreview();
    buildAccentPicker(el.createAccentPicker, createAccent, (accent) => {
      createAccent = accent;
    });
    window.setTimeout(() => {
      if (!el.authCreate.hidden) el.newProfileName.focus();
    }, 80);
  }

  function showAuthPin(profile) {
    pendingPinProfile = profile;
    pinBuffer = "";
    pinBusy = false;
    hideAuthError(el.pinError);
    el.pinDots.classList.remove("is-wrong");
    renderAvatarElement(el.pinAvatar, profile.avatarImage);
    el.pinAvatar.style.background = profileAccentColors(profile).soft;
    el.pinName.textContent = profile.name;
    renderPinDots();
    el.pinPad
      .querySelectorAll("button")
      .forEach((button) => (button.disabled = false));
    showAuthView("pin");
    el.authScreen.scrollTop = 0;
    window.setTimeout(() => {
      const firstKey = el.pinPad.querySelector(".pin-key");
      if (firstKey) firstKey.focus();
    }, 80);
  }

  function renderPinDots() {
    Array.from(el.pinDots.children).forEach((dot, index) => {
      dot.classList.toggle("is-filled", index < pinBuffer.length);
    });
  }

  function handlePinDigit(digit) {
    if (!pendingPinProfile || pinBusy || pinBuffer.length >= 4) return;
    pinBuffer += digit;
    hideAuthError(el.pinError);
    renderPinDots();
    if (pinBuffer.length === 4) submitPin();
  }

  function handlePinBackspace() {
    if (pinBusy) return;
    pinBuffer = pinBuffer.slice(0, -1);
    renderPinDots();
  }

  function handlePinClear() {
    if (pinBusy) return;
    pinBuffer = "";
    hideAuthError(el.pinError);
    renderPinDots();
  }

  async function submitPin() {
    if (!pendingPinProfile || pinBusy) return;
    const profile = pendingPinProfile;
    const pin = pinBuffer;

    pinBusy = true;
    el.pinPad
      .querySelectorAll("button")
      .forEach((button) => (button.disabled = true));

    const hash = await hashPin(pin, profile.pinSalt);

    if (hash === profile.pinHash) {
      enterProfile(profile);
      return;
    }

    pinBusy = false;
    pinBuffer = "";
    renderPinDots();
    el.pinDots.classList.remove("is-wrong");
    void el.pinDots.offsetWidth;
    el.pinDots.classList.add("is-wrong");
    showAuthError(el.pinError, "PIN incorreto. Tente novamente.");
    el.pinPad
      .querySelectorAll("button")
      .forEach((button) => (button.disabled = false));
  }

  function showAuth() {
    closeEditor();
    closeProfileSheet();

    activeProfile = null;
    events = [];
    settings = defaultSettings();
    firedReminders = {};
    nutritionEntries = [];
    nutritionGoals = { ...DEFAULT_NUTRITION_GOALS };
    nutritionDate = todayISO();
    selectedDate = todayISO();
    searchQuery = "";
    pendingPinProfile = null;
    pinBuffer = "";
    pinBusy = false;
    pendingOpen = null;
    cancelAndroidReminders();

    try {
      sessionStorage.removeItem(STORE.session);
    } catch (error) {
      /* ignore */
    }

    el.toast.classList.remove("is-visible");
    el.dayList.replaceChildren();
    el.upcomingList.replaceChildren();
    el.hero.replaceChildren();
    el.dayCount.textContent = "0 eventos";
    el.upCount.textContent = "0 eventos";
    el.eventCount.textContent = "0 eventos salvos";
    el.searchInput.value = "";

    resetAccent();
    applyTheme("auto", false);

    document.body.classList.add("auth-open");
    el.authScreen.classList.add("is-open");
    el.authScreen.setAttribute("aria-hidden", "false");
    el.appRoot.inert = true;
    el.appRoot.setAttribute("aria-hidden", "true");

    if (profiles.length === 0) {
      showAuthCreate(true);
    } else {
      el.authScreen.scrollTop = 0;
      renderAuthProfiles();
    }

    window.setTimeout(() => {
      const target =
        el.profileList.querySelector(".profile-option") || el.newProfileName;
      if (target) target.focus();
    }, 120);
  }

  function hideAuth() {
    document.body.classList.remove("auth-open");
    el.authScreen.classList.remove("is-open");
    el.authScreen.setAttribute("aria-hidden", "true");
    el.appRoot.inert = false;
    el.appRoot.removeAttribute("aria-hidden");
  }

  function enterProfile(profile, options) {
    const opts = options || {};
    activeProfile = profile;
    pendingPinProfile = null;
    pinBuffer = "";
    pinBusy = false;
    profile.lastUsed = Date.now();
    updateProfileRecord(profile);

    settings = loadSettings();
    events = loadEvents();
    firedReminders = loadFired();
    nutritionEntries = loadNutrition();
    nutritionGoals = loadNutritionGoals();
    nutritionDate = todayISO();

    if (opts.seedDemo && events.length === 0) {
      events = seedDemoEvents();
      saveEvents();
    }

    selectedDate = todayISO();
    activeView = "day";
    searchQuery = "";
    el.searchInput.value = "";
    editingId = null;

    applyTheme(settings.theme, false);
    updateProfileUI();
    updateGreeting();
    renderAll({ animate: true });

    activeView = "day";
    el.tabs.forEach((tab) => {
      const active = tab.dataset.view === "day";
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-current", active ? "page" : "false");
    });
    el.viewDay.classList.add("is-active");
    el.viewUpcoming.classList.remove("is-active");
    el.viewNutrition.classList.remove("is-active");
    el.viewSettings.classList.remove("is-active");
    el.fab.classList.remove("is-hidden");
    window.scrollTo({ top: 0, behavior: "auto" });

    try {
      sessionStorage.setItem(STORE.session, profile.id);
    } catch (error) {
      /* ignore */
    }

    hideAuth();
    document.body.classList.remove("booting");

    scheduleAndroidReminders();
    maybeRequestAndroidNotificationPermission();

    const usedDeepLink = applyDeepLink();
    if (usedDeepLink) {
      pendingOpen = null;
    } else if (pendingOpen) {
      const data = pendingOpen;
      pendingOpen = null;
      if (data.date && isValidISODate(data.date)) selectedDate = data.date;
      switchView("day");
      renderAll();
      if (events.some((event) => event.id === data.eventId)) {
        openEditor(data.eventId);
      }
    }
  }

  async function createProfile() {
    const name = el.newProfileName.value.trim();
    const pinEnabled = el.newProfilePinEnabled.checked;
    const pin = el.newProfilePin.value.replace(/\D/g, "").slice(0, 4);

    hideAuthError(el.createError);

    if (!name) {
      showAuthError(el.createError, "Digite seu nome.");
      el.newProfileName.focus();
      return;
    }
    if (pinEnabled && !/^\d{4}$/.test(pin)) {
      showAuthError(el.createError, "O PIN precisa ter 4 dígitos.");
      el.newProfilePin.focus();
      return;
    }

    el.createProfileBtn.disabled = true;
    let pinHash = null;
    let pinSalt = null;

    if (pinEnabled) {
      pinSalt = randomSalt();
      pinHash = await hashPin(pin, pinSalt);
    }

    const firstEver =
      profiles.length === 0 && !localStorage.getItem(STORE.onboarded);
    const profile = makeProfileRecord({
      name,
      accent: createAccent,
    });
    profile.avatarImage = createAvatarImage;
    profile.pinHash = pinHash;
    profile.pinSalt = pinSalt;

    profiles.push(profile);
    if (!saveProfiles(profiles)) {
      el.createProfileBtn.disabled = false;
      return;
    }
    try {
      localStorage.setItem(STORE.onboarded, "1");
    } catch (error) {
      /* ignore */
    }

    el.createProfileBtn.disabled = false;
    enterProfile(profile, { seedDemo: firstEver });
  }

  function deleteProfileRecord(profile) {
    clearProfileData(profile.id);
    profiles = profiles.filter((item) => item.id !== profile.id);
    saveProfiles(profiles);

    if (activeProfile && activeProfile.id === profile.id) {
      showAuth();
    } else if (pendingPinProfile && pendingPinProfile.id === profile.id) {
      pendingPinProfile = null;
      showAuth();
    } else if (profiles.length === 0) {
      showAuth();
    } else {
      renderAuthProfiles();
    }
  }

  function openProfileSheet() {
    if (!activeProfile) return;
    if (el.sheet.classList.contains("is-open")) closeEditor();

    hideAuthError(el.editProfileError);
    el.editProfileName.value = activeProfile.name;
    el.editProfileBio.value = activeProfile.bio || "";
    el.editProfilePin.value = "";
    el.editProfilePinEnabled.checked = Boolean(activeProfile.pinHash);
    el.editProfilePinField.hidden = !el.editProfilePinEnabled.checked;
    editAccent = activeProfile.accent;
    editAvatarImage = activeProfile.avatarImage;
    editBannerImage = activeProfile.bannerImage;
    editBannerPreset = activeProfile.bannerPreset || "accent";

    el.avatarUrlRow.hidden = true;
    el.bannerUrlRow.hidden = true;
    el.avatarUrlInput.value = "";
    el.bannerUrlInput.value = "";
    el.avatarHint.hidden = true;
    el.bannerHint.hidden = true;
    el.avatarHint.classList.remove("is-error");
    el.bannerHint.classList.remove("is-error");
    el.avatarImageFile.value = "";
    el.bannerImageFile.value = "";
    el.avatarUrlApply.disabled = false;
    el.bannerUrlApply.disabled = false;

    const onBannerSelect = (key) => {
      editBannerPreset = key;
      editBannerImage = null;
      updateProfileEditorPreview();
    };

    const rebuildBannerPicker = () => {
      buildBannerPicker(
        el.editBannerPicker,
        editBannerPreset,
        onBannerSelect,
        editAccent
      );
    };

    buildAccentPicker(el.editAccentPicker, editAccent, (accent) => {
      editAccent = accent;
      rebuildBannerPicker();
      updateProfileEditorPreview();
    });

    rebuildBannerPicker();
    updateProfileEditorPreview();

    el.profileSheet.scrollTop = 0;
    el.profileBackdrop.classList.add("is-open");
    el.profileSheet.classList.add("is-open");
    el.profileBackdrop.setAttribute("aria-hidden", "false");
    el.profileSheet.setAttribute("aria-hidden", "false");
    document.body.classList.add("sheet-open");

    window.setTimeout(() => {
      if (el.profileSheet.classList.contains("is-open")) {
        el.editProfileName.focus({ preventScroll: true });
      }
    }, 280);
  }

  function closeProfileSheet() {
    el.profileBackdrop.classList.remove("is-open");
    el.profileSheet.classList.remove("is-open");
    el.profileBackdrop.setAttribute("aria-hidden", "true");
    el.profileSheet.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sheet-open");
    hideAuthError(el.editProfileError);
  }

  async function saveProfileForm(submitEvent) {
    submitEvent.preventDefault();
    if (!activeProfile) return;

    const name = el.editProfileName.value.trim();
    const bio = el.editProfileBio.value.trim().slice(0, 60);
    const pinEnabled = el.editProfilePinEnabled.checked;
    const pin = el.editProfilePin.value.replace(/\D/g, "").slice(0, 4);

    hideAuthError(el.editProfileError);

    if (!name) {
      showAuthError(el.editProfileError, "Digite seu nome.");
      el.editProfileName.focus();
      return;
    }

    let pinHash = activeProfile.pinHash;
    let pinSalt = activeProfile.pinSalt;

    if (!pinEnabled) {
      pinHash = null;
      pinSalt = null;
    } else if (pin) {
      if (!/^\d{4}$/.test(pin)) {
        showAuthError(el.editProfileError, "O PIN precisa ter 4 dígitos.");
        el.editProfilePin.focus();
        return;
      }
      pinSalt = randomSalt();
      pinHash = await hashPin(pin, pinSalt);
    } else if (!pinHash) {
      showAuthError(el.editProfileError, "Digite um PIN de 4 dígitos.");
      el.editProfilePin.focus();
      return;
    }

    activeProfile.name = name;
    activeProfile.bio = bio;
    activeProfile.accent = editAccent;
    activeProfile.avatarImage = editAvatarImage;
    activeProfile.bannerImage = editBannerImage;
    activeProfile.bannerPreset = editBannerPreset;
    activeProfile.pinHash = pinHash;
    activeProfile.pinSalt = pinSalt;

    if (!updateProfileRecord(activeProfile)) return;

    applyAccent();
    updateProfileUI();
    updateGreeting();
    renderSettings();
    closeProfileSheet();
    showToast("Perfil atualizado");
  }

  function requestDeleteProfile() {
    if (!activeProfile) return;
    const confirmed = window.confirm(
      `Apagar o perfil "${activeProfile.name}"? Todos os eventos desse perfil serão perdidos.`
    );
    if (!confirmed) return;

    const profile = activeProfile;
    closeProfileSheet();
    deleteProfileRecord(profile);
  }

  function bindAuthEvents() {
    el.newProfileBtn.addEventListener("click", () => showAuthCreate(false));

    el.createBack.addEventListener("click", () => {
      if (profiles.length === 0) return;
      renderAuthProfiles();
    });

    el.createProfileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      createProfile();
    });

    el.createAvatarGalleryBtn.addEventListener("click", () => {
      el.createAvatarImageFile.value = "";
      el.createAvatarImageFile.click();
    });
    el.createAvatarImageFile.addEventListener("change", () => {
      const file =
        el.createAvatarImageFile.files && el.createAvatarImageFile.files[0];
      if (file) handleCreateAvatarFile(file);
    });
    el.createAvatarUrlBtn.addEventListener("click", openCreateAvatarUrlRow);
    el.createAvatarUrlApply.addEventListener("click", applyCreateAvatarUrl);
    el.createAvatarUrlInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyCreateAvatarUrl();
      }
    });
    el.createAvatarRemoveBtn.addEventListener("click", removeCreateAvatar);

    el.newProfilePinEnabled.addEventListener("change", () => {
      el.newProfilePinField.hidden = !el.newProfilePinEnabled.checked;
      if (!el.newProfilePinEnabled.checked) el.newProfilePin.value = "";
    });

    el.newProfilePin.addEventListener("input", () => {
      el.newProfilePin.value = el.newProfilePin.value
        .replace(/\D/g, "")
        .slice(0, 4);
      hideAuthError(el.createError);
    });

    el.newProfileName.addEventListener("input", () => {
      hideAuthError(el.createError);
    });

    el.pinPad.addEventListener("click", (event) => {
      const key = event.target.closest("[data-pin]");
      if (!key) return;
      const value = key.dataset.pin;
      if (value === "backspace") {
        handlePinBackspace();
      } else if (value === "clear") {
        handlePinClear();
      } else {
        handlePinDigit(value);
      }
    });

    el.pinBack.addEventListener("click", () => {
      if (profiles.length === 0) {
        showAuthCreate(true);
      } else {
        renderAuthProfiles();
      }
    });

    el.forgotPin.addEventListener("click", () => {
      if (!pendingPinProfile) return;
      const profile = pendingPinProfile;
      const confirmed = window.confirm(
        `Esqueceu o PIN de "${profile.name}"? Para continuar, esse perfil e seus eventos precisam ser apagados. Deseja apagar?`
      );
      if (!confirmed) return;
      deleteProfileRecord(profile);
    });

    document.addEventListener("keydown", (event) => {
      if (el.authPin.hidden) return;
      const target = event.target;
      if (target && target.closest && target.closest("input, textarea, select")) {
        return;
      }

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        handlePinDigit(event.key);
      } else if (event.key === "Backspace") {
        event.preventDefault();
        handlePinBackspace();
      } else if (event.key === "Escape") {
        event.preventDefault();
        el.pinBack.click();
      }
    });
  }

  function bindProfileEvents() {
    el.profileBtn.addEventListener("click", openProfileSheet);
    el.editProfileBtn.addEventListener("click", openProfileSheet);
    el.logoutBtn.addEventListener("click", showAuth);
    el.closeProfileSheet.addEventListener("click", closeProfileSheet);
    el.profileBackdrop.addEventListener("click", closeProfileSheet);
    el.profileForm.addEventListener("submit", saveProfileForm);
    el.deleteProfileBtn.addEventListener("click", requestDeleteProfile);

    el.avatarGalleryBtn.addEventListener("click", () => {
      el.avatarImageFile.value = "";
      el.avatarImageFile.click();
    });
    el.bannerGalleryBtn.addEventListener("click", () => {
      el.bannerImageFile.value = "";
      el.bannerImageFile.click();
    });
    el.avatarImageFile.addEventListener("change", () => {
      const file = el.avatarImageFile.files && el.avatarImageFile.files[0];
      if (file) handleProfileImageFile("avatar", file);
    });
    el.bannerImageFile.addEventListener("change", () => {
      const file = el.bannerImageFile.files && el.bannerImageFile.files[0];
      if (file) handleProfileImageFile("banner", file);
    });

    el.avatarUrlBtn.addEventListener("click", () => openProfileUrlRow("avatar"));
    el.bannerUrlBtn.addEventListener("click", () => openProfileUrlRow("banner"));
    el.avatarUrlApply.addEventListener("click", () =>
      applyProfileImageUrl("avatar")
    );
    el.bannerUrlApply.addEventListener("click", () =>
      applyProfileImageUrl("banner")
    );
    el.avatarUrlInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyProfileImageUrl("avatar");
      }
    });
    el.bannerUrlInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyProfileImageUrl("banner");
      }
    });

    el.avatarRemoveBtn.addEventListener("click", () =>
      removeProfileImage("avatar")
    );
    el.bannerRemoveBtn.addEventListener("click", () =>
      removeProfileImage("banner")
    );

    el.editProfilePinEnabled.addEventListener("change", () => {
      el.editProfilePinField.hidden = !el.editProfilePinEnabled.checked;
      if (!el.editProfilePinEnabled.checked) el.editProfilePin.value = "";
    });

    el.editProfilePin.addEventListener("input", () => {
      el.editProfilePin.value = el.editProfilePin.value
        .replace(/\D/g, "")
        .slice(0, 4);
    });

    el.profileForm.addEventListener("input", () => {
      hideAuthError(el.editProfileError);
    });
  }

  /* ---------- Rendering: week strip ---------------------- */

  function renderWeek() {
    const weekStart = startOfWeek(fromISO(selectedDate));
    const today = todayISO();
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 7; index += 1) {
      const date = addDays(weekStart, index);
      const iso = toISO(date);
      const hasEvents = events.some((event) => occursOn(event, iso));

      const button = document.createElement("button");
      button.type = "button";
      button.className = "daychip";
      button.dataset.date = iso;
      button.classList.toggle("is-today", iso === today);
      button.classList.toggle("is-selected", iso === selectedDate);
      button.classList.toggle("has-events", hasEvents);
      button.setAttribute("aria-pressed", iso === selectedDate ? "true" : "false");
      button.setAttribute(
        "aria-label",
        `${weekdayName(iso)}, ${monthDay(iso)}${hasEvents ? ", com eventos" : ""}`
      );

      const dow = document.createElement("span");
      dow.className = "dow";
      dow.textContent = WEEKDAYS[date.getDay()];

      const num = document.createElement("span");
      num.className = "num";
      num.textContent = String(date.getDate());

      const dot = document.createElement("span");
      dot.className = "dot";

      button.append(dow, num, dot);
      fragment.append(button);
    }

    el.weekStrip.replaceChildren(fragment);
  }

  /* ---------- Rendering: day ----------------------------- */

  function eventsForDate(iso) {
    return events
      .filter((event) => occursOn(event, iso))
      .sort((a, b) => {
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
        const aContinued = !a.allDay && a.date < iso;
        const bContinued = !b.allDay && b.date < iso;
        if (aContinued !== bContinued) return aContinued ? -1 : 1;
        const aStart = a.allDay || aContinued ? 0 : minutesFromTime(a.start);
        const bStart = b.allDay || bContinued ? 0 : minutesFromTime(b.start);
        if (aStart !== bStart) return aStart - bStart;
        return a.createdAt - b.createdAt;
      });
  }

  function isOngoing(event) {
    if (event.done || event.allDay) return false;
    const now = new Date();
    return now >= eventStartDate(event) && now < eventEndDate(event);
  }

  function renderDay(options) {
    const opts = options || {};
    const dayEvents = eventsForDate(selectedDate);
    const isToday = selectedDate === todayISO();

    el.dateEyebrow.textContent = `${weekdayName(selectedDate)} · ${monthDay(selectedDate)}`;
    el.dateTitle.textContent = dateTitleFor(selectedDate);
    el.dayCount.textContent = `${dayEvents.length} ${
      dayEvents.length === 1 ? "evento" : "eventos"
    }`;

    el.demoBanner.hidden = !dayEvents.some((event) => event.demo);

    renderHero(dayEvents, isToday);

    const list = document.createDocumentFragment();
    let markerPlaced = false;
    const nowMin = nowMinutes();

    if (isToday && dayEvents.some((event) => !event.allDay)) {
      const marker = document.createElement("div");
      marker.className = "now-marker";
      const markerLabel = document.createElement("span");
      markerLabel.textContent = `Agora · ${clockTime()}`;
      marker.append(markerLabel);
      marker.dataset.marker = "now";

      dayEvents.forEach((event) => {
        const startsToday = !event.allDay && event.date === selectedDate;
        if (
          !markerPlaced &&
          startsToday &&
          minutesFromTime(event.start) > nowMin
        ) {
          list.append(marker.cloneNode(true));
          markerPlaced = true;
        }
        list.append(buildEventCard(event, selectedDate));
      });

      if (!markerPlaced) list.append(marker.cloneNode(true));
    } else {
      dayEvents.forEach((event) =>
        list.append(buildEventCard(event, selectedDate))
      );
    }

    if (dayEvents.length === 0) {
      list.append(buildEmptyDay());
    }

    el.dayList.classList.toggle("no-anim", opts.animate !== true);
    el.dayList.replaceChildren(list);
  }

  function buildEventCard(event, iso) {
    const ongoing = iso === todayISO() && isOngoing(event);
    const times = displayTimes(event, iso);
    const multiDay = dayCountFor(event) > 1;

    const wrapper = document.createElement("article");
    wrapper.className = "event";
    wrapper.dataset.id = event.id;
    wrapper.dataset.cat = event.category;
    wrapper.classList.toggle("is-done", event.done);
    wrapper.classList.toggle("is-now", ongoing);

    const time = document.createElement("div");
    time.className = "event-time";

    if (event.allDay) {
      const label = document.createElement("b");
      label.className = "all-day-label";
      label.textContent = "Dia";
      const sub = document.createElement("span");
      sub.className = "all-day-sub";
      sub.textContent = multiDay ? `${dayCountFor(event)} dias` : "inteiro";
      time.append(label, sub);
    } else {
      const start = document.createElement("b");
      start.textContent = times.start;
      const end = document.createElement("span");
      end.textContent = times.end;
      time.append(start, end);
    }

    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    const timeLabel = event.allDay
      ? "dia inteiro"
      : `das ${times.start} às ${times.end}`;
    card.setAttribute(
      "aria-label",
      `Editar ${event.title}, ${timeLabel}`
    );

    const top = document.createElement("div");
    top.className = "ev-top";

    const title = document.createElement("div");
    title.className = "ev-title";
    title.append(document.createTextNode(event.title));
    if (ongoing) {
      const chip = document.createElement("span");
      chip.className = "ev-now";
      chip.textContent = "agora";
      title.append(chip);
    }

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = "done-btn";
    doneBtn.setAttribute(
      "aria-label",
      event.done ? "Marcar como não concluído" : "Marcar como concluído"
    );
    doneBtn.setAttribute("aria-pressed", event.done ? "true" : "false");
    doneBtn.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';

    top.append(title, doneBtn);

    const meta = document.createElement("div");
    meta.className = "ev-meta";

    const chip = document.createElement("span");
    chip.className = "cat-chip";
    chip.textContent = CATEGORIES[event.category].label;
    meta.append(chip);

    if (event.location) {
      const location = document.createElement("span");
      location.className = "ev-loc";
      location.innerHTML =
        '<svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>';
      const locationText = document.createElement("span");
      locationText.textContent = event.location;
      location.append(locationText);
      meta.append(location);
    }

    if (event.reminder && !event.done) {
      const reminder = document.createElement("span");
      reminder.className = "ev-reminder";
      reminder.innerHTML =
        '<svg class="icon" aria-hidden="true"><use href="#i-bell"/></svg>';
      reminder.append(
        document.createTextNode(REMINDER_SHORT[event.reminder] || "lembrete")
      );
      meta.append(reminder);
    }

    if (times.continuedBefore || times.continuedAfter) {
      const cont = document.createElement("span");
      cont.className = "ev-cont";
      cont.textContent =
        times.continuedBefore && times.continuedAfter
          ? "em andamento"
          : times.continuedBefore
            ? "continuação"
            : "continua";
      meta.append(cont);
    }

    card.append(top, meta);

    if (event.notes) {
      const notes = document.createElement("p");
      notes.className = "ev-notes";
      notes.textContent = event.notes;
      card.append(notes);
    }

    doneBtn.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      toggleDone(event.id);
    });

    card.addEventListener("click", () => openEditor(event.id));
    card.addEventListener("keydown", (keyEvent) => {
      if (keyEvent.target !== card) return;
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        keyEvent.preventDefault();
        openEditor(event.id);
      }
    });

    wrapper.append(time, card);
    return wrapper;
  }

  function buildEmptyDay() {
    const empty = document.createElement("div");
    empty.className = "empty";

    const art = document.createElement("div");
    art.className = "empty-art";
    art.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="#i-calendar"/></svg>';

    const title = document.createElement("h4");
    title.textContent =
      selectedDate === todayISO() ? "Seu dia está livre" : "Nada marcado aqui";

    const text = document.createElement("p");
    text.textContent =
      "Aproveite o tempo livre ou adicione um compromisso para organizar o dia.";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn soft";
    button.textContent = "Adicionar evento";
    button.addEventListener("click", () => openEditor());

    empty.append(art, title, text, button);
    return empty;
  }

  /* ---------- Rendering: hero ---------------------------- */

  function renderHero(dayEvents, isToday) {
    el.hero.replaceChildren();

    if (selectedDate < todayISO()) {
      return;
    }

    let event = null;
    let label = "";
    let chip = "";
    let ongoing = false;

    const timed = dayEvents.filter((item) => !item.allDay);
    const allDay = dayEvents.filter((item) => item.allDay);

    if (isToday) {
      ongoing = timed.find((item) => isOngoing(item)) || null;
      if (ongoing) {
        event = ongoing;
        label = "Acontecendo agora";
        chip = countdownLabel(eventEndDate(event));
      } else {
        const now = new Date();
        event =
          timed.find((item) => !item.done && eventStartDate(item) > now) ||
          allDay.find((item) => !item.done) ||
          null;
        if (event) {
          label = event.allDay ? "Dia inteiro" : "Próximo evento";
          chip = event.allDay ? relativeChip(selectedDate) : countdownLabel(eventStartDate(event));
        }
      }
    } else {
      event =
        timed.find((item) => !item.done) ||
        allDay.find((item) => !item.done) ||
        null;
      if (event) {
        label = event.allDay ? "Dia inteiro" : "Primeiro evento do dia";
        chip = relativeChip(selectedDate);
      }
    }

    if (!event) {
      el.hero.append(buildHeroEmpty(isToday, dayEvents));
      return;
    }

    const times = displayTimes(event, selectedDate);
    const hero = document.createElement("div");
    hero.className = "hero is-clickable";
    hero.setAttribute("role", "button");
    hero.tabIndex = 0;
    hero.setAttribute("aria-label", `Abrir ${event.title}`);

    const top = document.createElement("div");
    top.className = "hero-top";

    const heroLabel = document.createElement("span");
    heroLabel.className = "hero-label";
    if (ongoing) {
      const pulse = document.createElement("span");
      pulse.className = "pulse";
      heroLabel.append(pulse);
    }
    heroLabel.append(document.createTextNode(label));

    const heroChip = document.createElement("span");
    heroChip.className = "hero-chip";
    heroChip.textContent = chip;

    top.append(heroLabel, heroChip);

    const title = document.createElement("p");
    title.className = "hero-title";
    title.textContent = event.title;

    const meta = document.createElement("div");
    meta.className = "hero-meta";

    const time = document.createElement("span");
    time.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="#i-clock"/></svg>';
    if (event.allDay) {
      time.append(
        document.createTextNode(
          dayCountFor(event) > 1
            ? `Dia inteiro · ${dayCountFor(event)} dias`
            : "Dia inteiro"
        )
      );
    } else {
      time.append(
        document.createTextNode(
          `${times.start} – ${times.end} · ${durationLabel(event)}`
        )
      );
    }
    meta.append(time);

    if (event.location) {
      const location = document.createElement("span");
      location.innerHTML =
        '<svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>';
      const locationText = document.createElement("em");
      locationText.textContent = event.location;
      location.append(locationText);
      meta.append(location);
    }

    hero.append(top, title, meta);

    if (ongoing && !event.allDay) {
      const startDate = eventStartDate(event);
      const endDate = eventEndDate(event);
      const total = endDate.getTime() - startDate.getTime();
      const elapsed = Date.now() - startDate.getTime();
      const percent =
        total > 0 ? Math.max(0, Math.min(100, (elapsed / total) * 100)) : 0;

      const progress = document.createElement("div");
      progress.className = "hero-progress";
      const bar = document.createElement("span");
      bar.style.width = `${percent.toFixed(1)}%`;
      progress.append(bar);
      hero.append(progress);
    }

    const open = () => openEditor(event.id);
    hero.addEventListener("click", open);
    hero.addEventListener("keydown", (keyEvent) => {
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        keyEvent.preventDefault();
        open();
      }
    });

    el.hero.append(hero);
  }

  function buildHeroEmpty(isToday, dayEvents) {
    const doneCount = dayEvents.filter((event) => event.done).length;
    const allDone = dayEvents.length > 0 && doneCount === dayEvents.length;
    const now = new Date();
    const allPast =
      isToday &&
      dayEvents.length > 0 &&
      dayEvents.every((event) => eventEndDate(event) <= now);

    const hero = document.createElement("div");
    hero.className = "hero hero-empty";

    const text = document.createElement("div");
    text.className = "hero-empty-text";

    const label = document.createElement("span");
    label.className = "hero-label";
    label.textContent = allDone
      ? "Dia concluído"
      : allPast
        ? "Dia encerrado"
        : isToday
          ? "Dia livre"
          : "Sem eventos";

    const title = document.createElement("p");
    title.className = "hero-title";
    title.textContent = allDone
      ? "Tudo pronto por aqui"
      : allPast
        ? "Por hoje é isso"
        : isToday
          ? "Nada marcado para hoje"
          : "Este dia ainda está livre";

    const description = document.createElement("p");
    description.textContent = allDone
      ? `${doneCount} ${
          doneCount === 1 ? "evento concluído" : "eventos concluídos"
        }. Aproveite o resto do dia.`
      : allPast
        ? `${dayEvents.length} ${
            dayEvents.length === 1 ? "evento hoje" : "eventos hoje"
          }. Descanse ou planeje o próximo dia.`
        : isToday
          ? "Você tem o dia todo. Que tal planejar algo?"
          : "Adicione um compromisso quando quiser.";

    text.append(label, title, description);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "hero-add";
    if (allPast && !allDone) {
      const tomorrow = toISO(addDays(fromISO(todayISO()), 1));
      button.textContent = "Planejar amanhã";
      button.addEventListener("click", () => openEditor(null, tomorrow));
    } else {
      button.textContent = "Adicionar";
      button.addEventListener("click", () => openEditor());
    }

    hero.append(text, button);
    return hero;
  }

  /* ---------- Rendering: upcoming ------------------------ */

  function normalizeQuery(text) {
    return String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function renderUpcoming(options) {
    const opts = options || {};
    const today = todayISO();
    const query = normalizeQuery(searchQuery);

    const upcoming = events
      .filter((event) => (event.endDate || event.date) >= today)
      .map((event) => ({
        event,
        displayDate: event.date >= today ? event.date : today,
      }))
      .sort((a, b) => {
        if (a.displayDate !== b.displayDate) {
          return a.displayDate < b.displayDate ? -1 : 1;
        }
        if (a.event.allDay !== b.event.allDay) {
          return a.event.allDay ? -1 : 1;
        }
        const diff =
          minutesFromTime(a.event.start) - minutesFromTime(b.event.start);
        return diff !== 0 ? diff : a.event.createdAt - b.event.createdAt;
      })
      .filter(({ event }) => {
        if (!query) return true;
        const haystack = normalizeQuery(
          [
            event.title,
            event.location,
            event.notes,
            CATEGORIES[event.category].label,
            event.date,
            event.endDate,
            event.allDay ? "dia inteiro" : "",
          ].join(" ")
        );
        return query
          .split(/\s+/)
          .filter(Boolean)
          .every((token) => haystack.includes(token));
      });

    el.upCount.textContent = `${upcoming.length} ${
      upcoming.length === 1 ? "evento" : "eventos"
    }`;

    const list = document.createDocumentFragment();
    let currentDate = null;
    let group = null;

    upcoming.forEach(({ event, displayDate }) => {
      if (displayDate !== currentDate) {
        currentDate = displayDate;
        group = document.createElement("section");
        group.className = "up-group";

        const head = document.createElement("div");
        head.className = "up-group-head";

        const heading = document.createElement("h3");
        heading.textContent = relativeDayName(displayDate);
        heading.classList.toggle("is-today", displayDate === today);

        const dateLabel = document.createElement("span");
        dateLabel.textContent = monthDay(displayDate);

        head.append(heading, dateLabel);
        group.append(head);
        list.append(group);
      }
      group.append(buildUpcomingItem(event, displayDate));
    });

    if (upcoming.length === 0) {
      list.append(buildUpcomingEmpty(Boolean(query)));
    }

    el.upcomingList.classList.toggle("no-anim", opts.animate !== true);
    el.upcomingList.replaceChildren(list);
  }

  function buildUpcomingItem(event, displayDate) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "up-item";
    button.dataset.id = event.id;
    button.dataset.cat = event.category;
    button.classList.toggle("is-done", event.done);
    button.setAttribute(
      "aria-label",
      `${event.title}, ${relativeDayName(displayDate)}${
        event.allDay ? ", dia inteiro" : ` às ${event.start}`
      }`
    );

    const time = document.createElement("div");
    time.className = "up-time";
    if (event.allDay) {
      const start = document.createElement("b");
      start.textContent = "Dia";
      const end = document.createElement("small");
      end.textContent = dayCountFor(event) > 1 ? `${dayCountFor(event)} dias` : "inteiro";
      time.append(start, end);
    } else {
      const start = document.createElement("b");
      start.textContent = event.start;
      const end = document.createElement("small");
      end.textContent = event.end;
      time.append(start, end);
    }

    const main = document.createElement("div");
    main.className = "up-main";

    const title = document.createElement("p");
    title.className = "up-title";
    title.textContent = event.title;

    const meta = document.createElement("p");
    meta.className = "up-meta";
    meta.append(document.createTextNode(CATEGORIES[event.category].label));
    if (event.allDay) {
      const sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "·";
      meta.append(sep, document.createTextNode("Dia inteiro"));
    }
    if ((event.endDate || event.date) > event.date) {
      const separator = document.createElement("span");
      separator.className = "sep";
      separator.textContent = "·";
      meta.append(
        separator,
        document.createTextNode(`até ${shortDate(event.endDate || event.date)}`)
      );
    }
    if (event.location) {
      const separator = document.createElement("span");
      separator.className = "sep";
      separator.textContent = "·";
      meta.append(separator, document.createTextNode(event.location));
    }
    main.append(title, meta);

    const category = document.createElement("span");
    category.className = "up-cat";
    category.setAttribute("aria-hidden", "true");

    button.append(time, main, category);
    button.addEventListener("click", () => openEditor(event.id));
    return button;
  }

  function buildUpcomingEmpty(isSearching) {
    const empty = document.createElement("div");
    empty.className = "up-empty";

    const title = document.createElement("h4");
    title.textContent = isSearching ? "Nenhum resultado" : "Tudo em dia";

    const text = document.createElement("p");
    text.textContent = isSearching
      ? "Tente buscar por outro título, local ou categoria."
      : "Você não tem eventos futuros. Toque no + para criar o próximo.";

    empty.append(title, text);
    return empty;
  }

  /* ---------- Rendering: settings ------------------------ */

  function renderSettings() {
    updateProfileUI();
    if (el.pixKey) el.pixKey.textContent = PIX_KEY;

    Array.from(el.themePicker.querySelectorAll("button")).forEach((button) => {
      const active = button.dataset.themeValue === settings.theme;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    el.eventCount.textContent = `${events.length} ${
      events.length === 1 ? "evento salvo" : "eventos salvos"
    }`;

    renderNotificationState();

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true ||
      window.location.protocol === "file:";
    el.installRow.hidden = standalone;
    el.installBtn.hidden = standalone || !deferredInstallPrompt;
  }

  /* ---------- Nutrition -------------------------------- */

  function buildFoodOptions() {
    if (!el.foodSelect) return;
    const previous = el.foodSelect.value;
    el.foodSelect.replaceChildren();

    FOOD_GROUPS.forEach((groupName) => {
      const foods = FOODS.filter((food) => food.group === groupName);
      if (!foods.length) return;
      const group = document.createElement("optgroup");
      group.label = groupName;
      foods.forEach((food) => {
        const option = document.createElement("option");
        option.value = food.id;
        option.textContent = food.name;
        group.append(option);
      });
      el.foodSelect.append(group);
    });

    const custom = document.createElement("option");
    custom.value = "__custom__";
    custom.textContent = "Outro / personalizado";
    el.foodSelect.append(custom);

    if (previous && el.foodSelect.querySelector(`option[value="${previous}"]`)) {
      el.foodSelect.value = previous;
    }
    updateCustomFoodFields();
  }

  function selectedFood() {
    return FOODS.find((food) => food.id === el.foodSelect.value) || null;
  }

  function isCustomFood() {
    return el.foodSelect.value === "__custom__";
  }

  function updateCustomFoodFields() {
    if (!el.customFoodFields) return;
    el.customFoodFields.hidden = !isCustomFood();
    updateFoodPreview();
  }

  function updateFoodPreview() {
    if (!el.foodMacroPreview) return;
    const grams = clampNumber(el.foodGrams.value, 0, 2000, 0);
    let name = "";
    let protein = 0;
    let carbs = 0;

    if (isCustomFood()) {
      name = el.customFoodName.value.trim() || "Alimento personalizado";
      protein = clampNumber(el.customProtein.value, 0, 100, 0);
      carbs = clampNumber(el.customCarbs.value, 0, 100, 0);
    } else {
      const food = selectedFood();
      if (!food) {
        el.foodMacroPreview.textContent = "";
        return;
      }
      name = food.name;
      protein = food.protein;
      carbs = food.carbs;
    }

    const factor = grams / 100;
    el.foodMacroPreview.textContent =
      `${name}: ${formatMacro(protein * factor)} g de proteína e ` +
      `${formatMacro(carbs * factor)} g de carboidratos em ${formatMacro(grams)} g.`;
  }

  function nutritionEntriesForDate(iso) {
    return nutritionEntries
      .filter((entry) => entry.date === iso)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  function nutritionTotals(entries) {
    return entries.reduce(
      (totals, entry) => {
        const factor = entry.grams / 100;
        totals.protein += entry.proteinPer100 * factor;
        totals.carbs += entry.carbsPer100 * factor;
        return totals;
      },
      { protein: 0, carbs: 0 }
    );
  }

  function formatMacro(value) {
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded)
      ? String(rounded)
      : rounded.toFixed(1).replace(".", ",");
  }

  function setMacroBar(node, percent) {
    if (!node) return;
    node.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    node.classList.toggle("is-over", percent > 100);
  }

  function nutritionAnalysisText(totals, entries) {
    if (!entries.length) {
      return "Registre os alimentos do dia para ver a análise de proteínas e carboidratos.";
    }

    const parts = [];
    const proteinGoal = nutritionGoals.protein;
    const carbsGoal = nutritionGoals.carbs;

    if (proteinGoal) {
      parts.push(
        `Proteína em ${Math.round((totals.protein / proteinGoal) * 100)}% da meta ` +
          `(${formatMacro(totals.protein)} de ${formatMacro(proteinGoal)} g).`
      );
    } else {
      parts.push(`Proteína: ${formatMacro(totals.protein)} g.`);
    }

    if (carbsGoal) {
      parts.push(
        `Carboidratos em ${Math.round((totals.carbs / carbsGoal) * 100)}% da meta ` +
          `(${formatMacro(totals.carbs)} de ${formatMacro(carbsGoal)} g).`
      );
    } else {
      parts.push(`Carboidratos: ${formatMacro(totals.carbs)} g.`);
    }

    if (proteinGoal && totals.protein < proteinGoal) {
      parts.push(`Faltam ${formatMacro(proteinGoal - totals.protein)} g de proteína.`);
    }
    if (carbsGoal && totals.carbs > carbsGoal) {
      parts.push(
        `${formatMacro(totals.carbs - carbsGoal)} g de carboidratos acima da meta.`
      );
    } else if (carbsGoal && totals.carbs < carbsGoal) {
      parts.push(`Faltam ${formatMacro(carbsGoal - totals.carbs)} g de carboidratos.`);
    }
    if (
      proteinGoal &&
      totals.protein >= proteinGoal &&
      (!carbsGoal || totals.carbs <= carbsGoal)
    ) {
      parts.push("Bom equilíbrio para as metas do dia.");
    }

    return parts.join(" ");
  }

  function updateNutritionSummary() {
    if (!activeProfile) return;
    const entries = nutritionEntriesForDate(nutritionDate);
    const totals = nutritionTotals(entries);

    el.nutritionCount.textContent = `${entries.length} ${
      entries.length === 1 ? "item" : "itens"
    }`;
    el.proteinTotal.textContent = `${formatMacro(totals.protein)} g`;
    el.carbsTotal.textContent = `${formatMacro(totals.carbs)} g`;
    el.proteinGoalLabel.textContent = `meta ${formatMacro(nutritionGoals.protein)} g`;
    el.carbsGoalLabel.textContent = `meta ${formatMacro(nutritionGoals.carbs)} g`;
    el.nutritionAnalysis.textContent = nutritionAnalysisText(totals, entries);

    const proteinPercent = nutritionGoals.protein
      ? (totals.protein / nutritionGoals.protein) * 100
      : 0;
    const carbsPercent = nutritionGoals.carbs
      ? (totals.carbs / nutritionGoals.carbs) * 100
      : 0;
    setMacroBar(el.proteinBar, proteinPercent);
    setMacroBar(el.carbsBar, carbsPercent);
  }

  function renderNutritionList(entries) {
    el.nutritionList.replaceChildren();
    el.clearNutritionDay.hidden = !entries.length;

    if (!entries.length) {
      const empty = document.createElement("div");
      empty.className = "nutrition-empty";
      empty.textContent = "Nenhum alimento registrado neste dia.";
      el.nutritionList.append(empty);
      return;
    }

    Object.keys(MEALS).forEach((mealKey) => {
      const mealEntries = entries.filter((entry) => entry.meal === mealKey);
      if (!mealEntries.length) return;
      const mealTotals = nutritionTotals(mealEntries);

      const group = document.createElement("div");
      group.className = "nutrition-meal";

      const head = document.createElement("div");
      head.className = "nutrition-meal-head";
      const title = document.createElement("h4");
      title.textContent = MEALS[mealKey];
      const summary = document.createElement("span");
      summary.textContent =
        `${formatMacro(mealTotals.protein)} g P · ` +
        `${formatMacro(mealTotals.carbs)} g C`;
      head.append(title, summary);
      group.append(head);

      mealEntries.forEach((entry) => {
        const protein = (entry.proteinPer100 * entry.grams) / 100;
        const carbs = (entry.carbsPer100 * entry.grams) / 100;

        const item = document.createElement("div");
        item.className = "nutrition-item";

        const main = document.createElement("div");
        main.className = "nutrition-item-main";
        const name = document.createElement("b");
        name.textContent = entry.name;
        const detail = document.createElement("span");
        detail.textContent =
          `${formatMacro(entry.grams)} g · ${formatMacro(protein)} g de proteína · ` +
          `${formatMacro(carbs)} g de carboidratos`;
        main.append(name, detail);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "icon-btn nutrition-delete";
        remove.dataset.nutritionDelete = entry.id;
        remove.setAttribute("aria-label", `Remover ${entry.name}`);
        remove.innerHTML =
          '<svg class="icon" aria-hidden="true"><use href="#i-trash"/></svg>';

        item.append(main, remove);
        group.append(item);
      });

      el.nutritionList.append(group);
    });
  }

  function renderNutrition() {
    if (!activeProfile) return;

    el.nutritionDayTitle.textContent = relativeDayName(nutritionDate);
    el.nutritionDaySub.textContent = monthDay(nutritionDate);

    if (document.activeElement !== el.proteinGoalInput) {
      el.proteinGoalInput.value = String(nutritionGoals.protein);
    }
    if (document.activeElement !== el.carbsGoalInput) {
      el.carbsGoalInput.value = String(nutritionGoals.carbs);
    }

    updateNutritionSummary();
    renderNutritionList(nutritionEntriesForDate(nutritionDate));
    updateFoodPreview();
  }

  function handleNutritionSubmit(event) {
    event.preventDefault();

    const grams = Number(el.foodGrams.value);
    if (!Number.isFinite(grams) || grams < 1 || grams > 2000) {
      showToast("Informe uma quantidade entre 1 e 2000 g.");
      el.foodGrams.focus();
      return;
    }

    let name = "";
    let proteinPer100 = 0;
    let carbsPer100 = 0;

    if (isCustomFood()) {
      name = el.customFoodName.value.trim().slice(0, 60);
      if (!name) {
        showToast("Dê um nome ao alimento personalizado.");
        el.customFoodName.focus();
        return;
      }
      proteinPer100 = Number(el.customProtein.value || 0);
      carbsPer100 = Number(el.customCarbs.value || 0);
      if (
        !Number.isFinite(proteinPer100) ||
        !Number.isFinite(carbsPer100) ||
        proteinPer100 < 0 ||
        proteinPer100 > 100 ||
        carbsPer100 < 0 ||
        carbsPer100 > 100
      ) {
        showToast("Informe proteína e carboidratos entre 0 e 100 g por 100 g.");
        return;
      }
    } else {
      const food = selectedFood();
      if (!food) {
        showToast("Escolha um alimento.");
        el.foodSelect.focus();
        return;
      }
      name = food.name;
      proteinPer100 = food.protein;
      carbsPer100 = food.carbs;
    }

    const entry = {
      id: uid(),
      date: nutritionDate,
      meal: el.mealSelect.value,
      name,
      grams,
      proteinPer100,
      carbsPer100,
      createdAt: Date.now(),
    };

    nutritionEntries.push(entry);
    if (!saveNutrition()) {
      nutritionEntries.pop();
      return;
    }

    el.foodGrams.value = "100";
    if (isCustomFood()) {
      el.customFoodName.value = "";
      el.customProtein.value = "";
      el.customCarbs.value = "";
    }
    renderNutrition();
    showToast("Alimento adicionado");
    vibrate(6);
  }

  function handleNutritionDelete(id) {
    const before = nutritionEntries.length;
    nutritionEntries = nutritionEntries.filter((entry) => entry.id !== id);
    if (nutritionEntries.length === before) return;
    saveNutrition();
    renderNutrition();
    showToast("Alimento removido");
  }

  function shiftNutritionDate(amount) {
    nutritionDate = toISO(addDays(fromISO(nutritionDate), amount));
    renderNutrition();
  }

  function updateNutritionGoalsFromInputs() {
    nutritionGoals = normalizeNutritionGoals({
      protein: el.proteinGoalInput.value,
      carbs: el.carbsGoalInput.value,
    });
    saveNutritionGoals();
    updateNutritionSummary();
  }

  function commitNutritionGoals() {
    updateNutritionGoalsFromInputs();
    renderNutrition();
  }

  function renderNotificationState() {
    if (androidNotificationsAvailable()) {
      const enabled = androidNotificationsEnabled();
      el.notifStatus.textContent = enabled
        ? "Notificações do sistema ativas"
        : "Ative para receber lembretes";
      el.notifBtn.hidden = false;
      el.notifBtn.textContent = enabled ? "Testar" : "Ativar";
      return;
    }

    const supported = "Notification" in window;

    if (!supported) {
      el.notifStatus.textContent = "Notificações não são suportadas aqui";
      el.notifBtn.hidden = true;
      return;
    }

    el.notifBtn.hidden = false;
    const permission = Notification.permission;

    if (permission === "granted") {
      el.notifStatus.textContent = "Ativos neste dispositivo";
      el.notifBtn.textContent = "Testar";
    } else if (permission === "denied") {
      el.notifStatus.textContent = "Bloqueados nas configurações do navegador";
      el.notifBtn.hidden = true;
    } else {
      el.notifStatus.textContent = "Permita avisos para não perder nada";
      el.notifBtn.textContent = "Ativar";
    }
  }

  /* ---------- Render all --------------------------------- */

  function renderAll(options) {
    const opts = options || {};
    renderWeek();
    renderDay(opts);
    renderUpcoming(opts);
    renderSettings();
    renderNutrition();
  }

  /* ---------- Navigation --------------------------------- */

  function selectDate(iso) {
    selectedDate = iso;
    renderWeek();
    renderDay({ animate: true });
  }

  function switchView(view) {
    activeView = view;

    el.tabs.forEach((tab) => {
      const active = tab.dataset.view === view;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-current", active ? "page" : "false");
    });

    el.viewDay.classList.toggle("is-active", view === "day");
    el.viewUpcoming.classList.toggle("is-active", view === "upcoming");
    el.viewNutrition.classList.toggle("is-active", view === "nutrition");
    el.viewSettings.classList.toggle("is-active", view === "settings");
    el.fab.classList.toggle("is-hidden", view === "settings" || view === "nutrition");

    if (view === "day") {
      renderWeek();
      renderDay({ animate: true });
    } else if (view === "upcoming") {
      renderUpcoming({ animate: true });
      renderSettings();
    } else if (view === "nutrition") {
      renderNutrition();
    } else {
      renderSettings();
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function shiftSelectedDay(amount) {
    selectDate(toISO(addDays(fromISO(selectedDate), amount)));
    vibrate(6);
  }

  /* ---------- Event form --------------------------------- */

  function defaultTimesForDate(iso) {
    let startMin = 9 * 60;

    if (iso === todayISO()) {
      startMin = Math.ceil((nowMinutes() + 10) / 30) * 30;
      if (startMin >= 23 * 60) startMin = 23 * 60;
    }

    const endMin = Math.min(startMin + 60, 1439);
    return { start: timeFromMinutes(startMin), end: timeFromMinutes(endMin) };
  }

  function selectCategory(category) {
    selectedCategory = category;
    Array.from(el.catPicker.querySelectorAll("button")).forEach((button) => {
      const active = button.dataset.cat === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function buildCategoryPicker() {
    Object.keys(CATEGORIES).forEach((key) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cat-option";
      button.dataset.cat = key;
      button.textContent = CATEGORIES[key].label;
      button.addEventListener("click", () => selectCategory(key));
      el.catPicker.append(button);
    });
  }

  function setAllDayUI(allDay) {
    el.fAllDay.checked = allDay;
    el.timeRow.hidden = allDay;
    el.fStart.disabled = allDay;
    el.fEnd.disabled = allDay;
    el.fReminder.disabled = allDay;
    if (allDay) el.fReminder.value = "";
  }

  function openEditor(id, presetDate) {
    const event = id ? events.find((item) => item.id === id) : null;
    editingId = event ? event.id : null;

    el.formError.hidden = true;
    el.conflictHint.hidden = true;
    el.form.reset();
    resetDeleteConfirm();

    if (event) {
      el.sheetKicker.textContent = "Alterar compromisso";
      el.sheetTitle.textContent = "Editar evento";
      el.saveBtn.textContent = "Salvar alterações";
      el.deleteBtn.hidden = false;

      el.fTitle.value = event.title;
      el.fDate.value = event.date;
      el.fEndDate.value = event.endDate || event.date;
      el.fStart.value = event.start;
      el.fEnd.value = event.end;
      el.fLocation.value = event.location || "";
      el.fNotes.value = event.notes || "";
      el.fReminder.value = event.reminder ? String(event.reminder) : "";
      selectCategory(event.category);
      setAllDayUI(event.allDay);
    } else {
      el.sheetKicker.textContent = "Novo compromisso";
      el.sheetTitle.textContent = "Adicionar evento";
      el.saveBtn.textContent = "Adicionar evento";
      el.deleteBtn.hidden = true;

      const baseDate =
        presetDate ||
        (selectedDate === todayISO() && nowMinutes() >= 23 * 60
          ? toISO(addDays(fromISO(todayISO()), 1))
          : selectedDate);
      const defaults = defaultTimesForDate(baseDate);
      el.fDate.value = baseDate;
      el.fEndDate.value = baseDate;
      el.fStart.value = defaults.start;
      el.fEnd.value = defaults.end;
      el.fLocation.value = "";
      el.fNotes.value = "";
      el.fReminder.value = "";
      selectCategory("work");
      setAllDayUI(false);
    }

    el.backdrop.classList.add("is-open");
    el.sheet.classList.add("is-open");
    el.backdrop.setAttribute("aria-hidden", "false");
    el.sheet.setAttribute("aria-hidden", "false");
    document.body.classList.add("sheet-open");

    window.setTimeout(() => {
      if (el.sheet.classList.contains("is-open")) {
        el.fTitle.focus({ preventScroll: true });
      }
    }, 320);
  }

  function closeEditor() {
    el.backdrop.classList.remove("is-open");
    el.sheet.classList.remove("is-open");
    el.backdrop.setAttribute("aria-hidden", "true");
    el.sheet.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sheet-open");
    editingId = null;
    resetDeleteConfirm();
    el.formError.hidden = true;
    el.conflictHint.hidden = true;
  }

  function showFormError(message, field) {
    el.formError.textContent = message;
    el.formError.hidden = false;
    if (field) field.focus({ preventScroll: false });
  }

  function findConflict(candidate) {
    if (candidate.allDay) return null;
    const start = eventStartDate(candidate);
    const end = eventEndDate(candidate);

    return (
      events.find((other) => {
        if (other.id === candidate.id || other.done || other.allDay) return false;
        if ((other.endDate || other.date) < candidate.date) return false;
        if (other.date > (candidate.endDate || candidate.date)) return false;
        return eventStartDate(other) < end && eventEndDate(other) > start;
      }) || null
    );
  }

  function saveForm(submitEvent) {
    submitEvent.preventDefault();

    const title = el.fTitle.value.trim();
    const date = el.fDate.value;
    const endDate = el.fEndDate.value;
    const allDay = el.fAllDay.checked;
    const start = allDay ? "00:00" : el.fStart.value;
    const end = allDay ? "23:59" : el.fEnd.value;
    const location = el.fLocation.value.trim();
    const notes = el.fNotes.value.trim();
    const reminderValue = el.fReminder.value;
    const reminder = !allDay && reminderValue ? Number(reminderValue) : null;

    if (!title) {
      showFormError("Dê um título ao evento.", el.fTitle);
      return;
    }
    if (!isValidISODate(date)) {
      showFormError("Escolha uma data válida.", el.fDate);
      return;
    }
    if (!isValidISODate(endDate) || endDate < date) {
      showFormError("A data final precisa ser igual ou depois do início.", el.fEndDate);
      return;
    }
    if (!allDay) {
      if (!isValidTime(start) || !isValidTime(end)) {
        showFormError("Informe os horários de início e fim.", el.fStart);
        return;
      }
      const startAt = localDateTime(date, start);
      const endAt = localDateTime(endDate, end);
      if (endAt.getTime() <= startAt.getTime()) {
        showFormError("O horário final precisa ser depois do início.", el.fEnd);
        return;
      }
    }

    const existing = editingId
      ? events.find((item) => item.id === editingId)
      : null;

    if (existing) {
      existing.title = title;
      existing.date = date;
      existing.endDate = endDate;
      existing.allDay = allDay;
      existing.start = start;
      existing.end = end;
      existing.category = selectedCategory;
      existing.location = location;
      existing.notes = notes;
      existing.reminder = reminder;
      existing.demo = false;
      existing.updatedAt = Date.now();
    } else {
      const newEvent = normalizeEvent({
        id: uid(),
        title,
        date,
        endDate,
        allDay,
        start,
        end,
        category: selectedCategory,
        location,
        notes,
        reminder,
        done: false,
        demo: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      events.push(newEvent);
    }

    saveEvents();
    const saved = existing || events[events.length - 1];
    const conflict = findConflict(saved);

    selectedDate = date;
    closeEditor();
    renderAll();
    vibrate(8);

    const baseMessage = existing ? "Evento atualizado" : "Evento adicionado";
    if (conflict) {
      showToast(`${baseMessage} · conflito com "${conflict.title}"`, {
        duration: 5200,
      });
    } else {
      showToast(baseMessage);
    }

    checkReminders();
    scheduleAndroidReminders({ allowImmediate: true });
    maybeRequestAndroidNotificationPermission();
  }

  function resetDeleteConfirm() {
    window.clearTimeout(deleteConfirmTimer);
    el.deleteBtn.classList.remove("is-confirming");
    el.deleteBtn.textContent = "Excluir";
  }

  function requestDelete() {
    if (!editingId) return;

    if (!el.deleteBtn.classList.contains("is-confirming")) {
      el.deleteBtn.classList.add("is-confirming");
      el.deleteBtn.textContent = "Confirmar exclusão";
      deleteConfirmTimer = window.setTimeout(resetDeleteConfirm, 3500);
      return;
    }

    const index = events.findIndex((item) => item.id === editingId);
    if (index === -1) {
      closeEditor();
      return;
    }

    const removed = events[index];
    deleteEvent(removed);
  }

  function deleteEvent(event) {
    events = events.filter((item) => item.id !== event.id);

    saveEvents();
    closeEditor();
    renderAll();
    vibrate(10);
    scheduleAndroidReminders();

    showToast("Evento excluído", {
      actionLabel: "Desfazer",
      duration: 6000,
      action: () => {
        events.push(event);
        saveEvents();
        renderAll();
        scheduleAndroidReminders();
        showToast("Evento restaurado");
      },
    });
  }

  function toggleDone(id) {
    const event = events.find((item) => item.id === id);
    if (!event) return;
    event.done = !event.done;
    event.updatedAt = Date.now();
    saveEvents();
    renderDay();
    renderUpcoming();
    renderSettings();
    vibrate(8);
    showToast(event.done ? "Evento concluído" : "Evento reaberto", {
      duration: 1800,
    });
    scheduleAndroidReminders();
  }

  /* ---------- Reminders ---------------------------------- */

  function reminderKey(event) {
    return `${event.id}|${event.date}|${event.start}|${event.reminder}`;
  }

  function pruneFired() {
    const cutoff = Date.now() - 7 * DAY_MS;
    let changed = false;
    Object.keys(firedReminders).forEach((key) => {
      if (firedReminders[key] < cutoff) {
        delete firedReminders[key];
        changed = true;
      }
    });
    if (changed) saveFired();
  }

  async function checkReminders() {
    if (!activeProfile) return;
    const now = new Date();
    let changed = false;

    for (const event of events) {
      if (event.done || !event.reminder || event.allDay) continue;

      const start = eventStartDate(event);
      const trigger = new Date(start.getTime() - event.reminder * 60000);
      const key = reminderKey(event);

      const reachedTrigger = now >= trigger;
      const beforeStart = now < start;
      const recent = now.getTime() - trigger.getTime() <= 15 * 60000;

      if (reachedTrigger && beforeStart && recent && !firedReminders[key]) {
        const delivered = await deliverReminder(event, key);
        if (delivered) {
          firedReminders[key] = now.getTime();
          changed = true;
        }
      }
    }

    if (changed) {
      saveFired();
      pruneFired();
    }
  }

  async function deliverReminder(event, key) {
    if (androidNotificationsEnabled()) {
      return true;
    }

    const title = `Lembrete: ${event.title}`;
    const body = `${event.start} – ${event.end}${
      event.location ? ` · ${event.location}` : ""
    }`;
    const icon = new URL("icons/icon-192.png", window.location.href).href;

    if (
      document.visibilityState === "hidden" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration && typeof registration.showNotification === "function") {
            await registration.showNotification(title, {
              body,
              icon,
              tag: key,
              data: { eventId: event.id, date: event.date },
            });
            vibrate([80, 60, 80]);
            return true;
          }
        } catch (error) {
          /* fall through */
        }
      }

      try {
        const notification = new Notification(title, { body, icon, tag: key });
        notification.onclick = () => {
          window.focus();
          selectDate(event.date);
          switchView("day");
          openEditor(event.id);
          notification.close();
        };
        vibrate([80, 60, 80]);
        return true;
      } catch (error) {
        /* fall through */
      }
    }

    if (document.visibilityState === "hidden") return false;

    vibrate([80, 60, 80]);
    showToast(`Lembrete: ${event.title} às ${event.start}`, {
      actionLabel: "Ver",
      duration: 7000,
      action: () => {
        selectedDate = event.date;
        switchView("day");
        renderAll();
        openEditor(event.id);
      },
    });
    return true;
  }

  function androidNotificationsAvailable() {
    return Boolean(
      window.AndroidDia &&
        typeof window.AndroidDia.areNotificationsEnabled === "function"
    );
  }

  function androidNotificationsEnabled() {
    if (!androidNotificationsAvailable()) return false;
    try {
      return Boolean(window.AndroidDia.areNotificationsEnabled());
    } catch (error) {
      return false;
    }
  }

  function cancelAndroidReminders() {
    if (
      window.AndroidDia &&
      typeof window.AndroidDia.cancelAllReminders === "function"
    ) {
      try {
        window.AndroidDia.cancelAllReminders();
      } catch (error) {
        /* ignore */
      }
    }
  }

  function scheduleAndroidReminders(options) {
    const opts = options || {};
    if (
      !window.AndroidDia ||
      typeof window.AndroidDia.cancelAllReminders !== "function" ||
      typeof window.AndroidDia.scheduleReminder !== "function"
    ) {
      return;
    }

    try {
      window.AndroidDia.cancelAllReminders();
    } catch (error) {
      return;
    }

    if (!activeProfile) return;

    const now = Date.now();
    events.forEach((event) => {
      if (event.done || !event.reminder || event.allDay) return;

      const startAt = eventStartDate(event).getTime();
      if (startAt <= now) return;

      let triggerAt = startAt - event.reminder * 60000;
      if (triggerAt <= now) {
        if (!opts.allowImmediate) return;
        if (now - triggerAt > 15 * 60000) return;
        triggerAt = now + 1500;
      }

      const body = `${event.start} – ${event.end}${
        event.location ? ` · ${event.location}` : ""
      }`;

      try {
        window.AndroidDia.scheduleReminder(
          String(event.id),
          event.title,
          body,
          triggerAt,
          event.date
        );
      } catch (error) {
        /* ignore */
      }
    });
  }

  function maybeRequestAndroidNotificationPermission() {
    if (!androidNotificationsAvailable() || androidNotificationsEnabled()) {
      return;
    }

    let asked = false;
    try {
      asked = localStorage.getItem("dia.androidNotifAsked") === "1";
    } catch (error) {
      asked = false;
    }
    if (asked) return;

    if (!events.some((event) => event.reminder && !event.done && !event.allDay)) {
      return;
    }

    try {
      localStorage.setItem("dia.androidNotifAsked", "1");
    } catch (error) {
      /* ignore */
    }

    window.setTimeout(() => {
      if (
        window.AndroidDia &&
        typeof window.AndroidDia.requestNotificationPermission === "function" &&
        !androidNotificationsEnabled()
      ) {
        try {
          window.AndroidDia.requestNotificationPermission();
        } catch (error) {
          /* ignore */
        }
      }
    }, 1200);
  }

  function handleNotificationButton() {
    if (androidNotificationsAvailable()) {
      if (androidNotificationsEnabled()) {
        if (typeof window.AndroidDia.showTestNotification === "function") {
          window.AndroidDia.showTestNotification();
        }
        showToast("Notificação de teste enviada");
      } else if (
        typeof window.AndroidDia.requestNotificationPermission === "function"
      ) {
        window.AndroidDia.requestNotificationPermission();
        showToast("Confirme a permissão de notificações do Android.");
      }
      return;
    }

    if (!("Notification" in window)) {
      showToast("Seu navegador não oferece notificações do sistema.");
      return;
    }

    if (Notification.permission === "granted") {
      const notify = async () => {
        const icon = new URL("icons/icon-192.png", window.location.href).href;
        try {
          if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            const registration = await navigator.serviceWorker.ready;
            if (registration && typeof registration.showNotification === "function") {
              await registration.showNotification("Monitoramento de rotina — teste", {
                body: "Tudo certo! Seus lembretes vão aparecer assim.",
                icon,
                tag: "dia-test",
              });
              showToast("Notificação de teste enviada");
              return;
            }
          }

          new Notification("Monitoramento de rotina — teste", {
            body: "Tudo certo! Seus lembretes vão aparecer assim.",
            icon,
          });
          showToast("Notificação de teste enviada");
        } catch (error) {
          showToast(
            "Notificações do sistema não são suportadas aqui. Os lembretes dentro do app continuam funcionando."
          );
        }
      };
      notify();
      return;
    }

    if (Notification.permission === "denied") {
      showToast(
        "Os avisos estão bloqueados. Libere nas configurações do navegador."
      );
      return;
    }

    Promise.resolve(Notification.requestPermission())
      .then((permission) => {
        renderNotificationState();
        renderSettings();
        if (permission === "granted") {
          showToast("Lembretes ativados!");
        } else {
          showToast(
            "Sem permissão para notificações. Os avisos dentro do app continuam funcionando."
          );
        }
      })
      .catch(() => {
        showToast("Não foi possível ativar as notificações.");
      });
  }

  /* ---------- Data actions ------------------------------- */

  function exportData() {
    const payload = {
      app: "Monitoramento de rotina",
      version: 4,
      profile: activeProfile ? activeProfile.name : null,
      exportedAt: new Date().toISOString(),
      events,
      nutrition: nutritionEntries,
      nutritionGoals,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, `monitoramento-de-rotina-${todayISO()}.json`);
    showToast("Backup exportado");
  }

  function icsEscape(value) {
    return String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function icsDate(date) {
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
      date.getDate()
    )}`;
  }

  function icsDateTime(date) {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  }

  function foldIcsLine(line) {
    if (line.length <= 74) return line;
    const parts = [];
    let rest = line;
    while (rest.length > 74) {
      parts.push(rest.slice(0, 74));
      rest = ` ${rest.slice(74)}`;
    }
    parts.push(rest);
    return parts.join("\r\n");
  }

  function exportIcs() {
    if (events.length === 0) {
      showToast("Não há eventos para exportar.");
      return;
    }

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Monitoramento de rotina//Agenda//PT-BR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    events
      .slice()
      .sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
        return minutesFromTime(a.start) - minutesFromTime(b.start);
      })
      .forEach((event) => {
        const endDate = event.endDate || event.date;
        lines.push("BEGIN:VEVENT");
        lines.push(
          `UID:${String(event.id).replace(/[^\w.-]/g, "_")}@monitoramento.local`
        );
        lines.push(`DTSTAMP:${icsDateTime(new Date())}`);

        if (event.allDay) {
          lines.push(`DTSTART;VALUE=DATE:${icsDate(fromISO(event.date))}`);
          lines.push(
            `DTEND;VALUE=DATE:${icsDate(
              addDays(fromISO(endDate), 1)
            )}`
          );
        } else {
          lines.push(`DTSTART:${icsDateTime(eventStartDate(event))}`);
          lines.push(`DTEND:${icsDateTime(eventEndDate(event))}`);
        }

        lines.push(`SUMMARY:${icsEscape(event.title)}`);
        if (event.location) {
          lines.push(`LOCATION:${icsEscape(event.location)}`);
        }
        if (event.notes) {
          lines.push(`DESCRIPTION:${icsEscape(event.notes)}`);
        }
        lines.push("STATUS:CONFIRMED");
        lines.push("END:VEVENT");
      });

    lines.push("END:VCALENDAR");
    const content = lines.map(foldIcsLine).join("\r\n") + "\r\n";
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    downloadBlob(blob, `monitoramento-de-rotina-${todayISO()}.ics`);
    showToast("Arquivo .ics exportado");
  }

  function downloadBlob(blob, filename) {
    if (
      window.AndroidDia &&
      typeof window.AndroidDia.saveText === "function"
    ) {
      const saveText = (text) => {
        window.AndroidDia.saveText(
          filename,
          blob.type || "text/plain",
          text
        );
      };

      if (typeof blob.text === "function") {
        blob
          .text()
          .then(saveText)
          .catch(() => showToast("Não foi possível salvar o arquivo."));
      } else {
        const reader = new FileReader();
        reader.onload = () => saveText(String(reader.result || ""));
        reader.onerror = () => showToast("Não foi possível salvar o arquivo.");
        reader.readAsText(blob);
      }
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function importData(file) {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const list = Array.isArray(parsed) ? parsed : parsed.events;
        const hasNutrition =
          !Array.isArray(parsed) &&
          parsed &&
          Array.isArray(parsed.nutrition);
        if (!Array.isArray(list) && !hasNutrition) {
          throw new Error("formato inválido");
        }

        const imported = [];
        const usedIds = new Set();

        (Array.isArray(list) ? list : [])
          .filter(isValidEvent)
          .forEach((event) => {
            const normalized = normalizeEvent({ ...event, demo: false });
            if (usedIds.has(normalized.id)) normalized.id = uid();
            usedIds.add(normalized.id);
            imported.push(normalized);
          });

        if (imported.length === 0 && !hasNutrition) {
          showToast("Nenhum evento válido encontrado no arquivo.");
          return;
        }

        const confirmed = window.confirm(
          `Importar ${imported.length} ${
            imported.length === 1 ? "evento" : "eventos"
          }${hasNutrition ? " e os registros alimentares" : ""}? ` +
            "Isso substitui os dados atuais."
        );
        if (!confirmed) return;

        events = imported;
        saveEvents();

        if (hasNutrition) {
          nutritionEntries = parsed.nutrition
            .map(normalizeNutritionEntry)
            .filter(Boolean);
          saveNutrition();
          if (parsed.nutritionGoals) {
            nutritionGoals = normalizeNutritionGoals(parsed.nutritionGoals);
            saveNutritionGoals();
          }
        }

        selectedDate = todayISO();
        nutritionDate = todayISO();
        renderAll({ animate: true });
        showToast(
          `${imported.length} ${
            imported.length === 1 ? "evento importado" : "eventos importados"
          }${hasNutrition ? " com alimentação" : ""}`
        );
        checkReminders();
        scheduleAndroidReminders({ allowImmediate: true });
        maybeRequestAndroidNotificationPermission();
      } catch (error) {
        showToast("Arquivo inválido. Use um backup exportado pelo app.");
      }
    };

    reader.onerror = () => {
      showToast("Não foi possível ler o arquivo.");
    };

    reader.readAsText(file);
  }

  function requestClearAll() {
    if (!el.clearBtn.classList.contains("is-confirming")) {
      el.clearBtn.classList.add("is-confirming");
      el.clearBtn.textContent = "Confirmar";
      clearConfirmTimer = window.setTimeout(() => {
        el.clearBtn.classList.remove("is-confirming");
        el.clearBtn.textContent = "Limpar";
      }, 3500);
      return;
    }

    window.clearTimeout(clearConfirmTimer);
    el.clearBtn.classList.remove("is-confirming");
    el.clearBtn.textContent = "Limpar";

    if (events.length === 0) {
      showToast("A agenda já está vazia.");
      return;
    }

    const snapshot = events.slice();
    const firedSnapshot = { ...firedReminders };
    events = [];
    firedReminders = {};
    saveEvents();
    saveFired();
    renderAll({ animate: true });
    scheduleAndroidReminders();
    showToast("Agenda limpa", {
      actionLabel: "Desfazer",
      duration: 6000,
      action: () => {
        events = snapshot;
        firedReminders = firedSnapshot;
        saveEvents();
        saveFired();
        renderAll({ animate: true });
        scheduleAndroidReminders();
        showToast("Agenda restaurada");
      },
    });
  }

  function clearDemoEvents() {
    events = events.filter((event) => !event.demo);
    saveEvents();
    renderAll();
    scheduleAndroidReminders();
    showToast("Eventos de exemplo removidos");
  }

  /* ---------- Install ------------------------------------ */

  function handleInstall() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      Promise.resolve(deferredInstallPrompt.userChoice)
        .then((choice) => {
          if (choice && choice.outcome === "accepted") {
            showToast("App instalado! Até já.");
          }
          deferredInstallPrompt = null;
          renderSettings();
        })
        .catch(() => {
          deferredInstallPrompt = null;
          renderSettings();
        });
      return;
    }

    const isIOS =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1);

    showToast(
      isIOS
        ? 'No iPhone: toque em Compartilhar e escolha "Adicionar à Tela de Início".'
        : 'Abra o menu do navegador e escolha "Instalar app" ou "Adicionar à tela inicial".',
      { duration: 6500 }
    );
  }

  /* ---------- Toast -------------------------------------- */

  function showToast(message, options) {
    const opts = options || {};
    window.clearTimeout(toastTimer);

    el.toastMessage.textContent = message;
    el.toastAction.onclick = null;

    if (opts.actionLabel && typeof opts.action === "function") {
      el.toastAction.hidden = false;
      el.toastAction.textContent = opts.actionLabel;
      el.toastAction.onclick = () => {
        el.toast.classList.remove("is-visible");
        opts.action();
      };
    } else {
      el.toastAction.hidden = true;
    }

    el.toast.classList.add("is-visible");

    toastTimer = window.setTimeout(
      () => {
        el.toast.classList.remove("is-visible");
      },
      opts.duration || 3200
    );
  }

  /* ---------- Clock / live updates ----------------------- */

  function updateGreeting() {
    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
    const firstName = activeProfile
      ? activeProfile.name.trim().split(/\s+/)[0]
      : "";
    el.greeting.textContent = firstName ? `${greeting}, ${firstName}` : greeting;
  }

  function tick() {
    if (!activeProfile) return;
    updateGreeting();

    const today = todayISO();
    if (today !== lastKnownToday) {
      if (selectedDate === lastKnownToday) selectedDate = today;
      lastKnownToday = today;
      renderAll();
    } else if (activeView === "day") {
      renderDay();
    }

    checkReminders();
  }

  /* ---------- Deep links / query params ------------------ */

  function applyDeepLink() {
    if (!activeProfile) return false;

    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) return false;

    const date = params.get("date");
    const view = params.get("view");
    const isNew = params.get("new");
    const eventId = params.get("event");

    if (date && isValidISODate(date)) {
      selectedDate = date;
      renderWeek();
      renderDay({ animate: true });
    }
    if (
      view === "day" ||
      view === "upcoming" ||
      view === "nutrition" ||
      view === "settings"
    ) {
      switchView(view);
    }
    if (eventId) {
      if (events.some((event) => event.id === eventId)) {
        openEditor(eventId);
      } else {
        showToast("O evento não está mais na agenda.");
      }
    } else if (isNew === "1") {
      openEditor();
    }

    try {
      window.history.replaceState(null, "", window.location.pathname);
    } catch (error) {
      /* ignore */
    }

    return true;
  }

  /* ---------- Bindings ----------------------------------- */

  function bindEvents() {
    el.todayBtn.addEventListener("click", () => {
      selectedDate = todayISO();
      switchView("day");
      renderWeek();
      renderDay({ animate: true });
    });

    el.prevWeek.addEventListener("click", () => shiftSelectedDay(-7));
    el.nextWeek.addEventListener("click", () => shiftSelectedDay(7));

    el.weekStrip.addEventListener("click", (event) => {
      const button = event.target.closest(".daychip");
      if (!button) return;
      selectDate(button.dataset.date);
      vibrate(6);
    });

    el.openDate.addEventListener("click", () => {
      el.hiddenDate.value = selectedDate;
      try {
        if (typeof el.hiddenDate.showPicker === "function") {
          el.hiddenDate.showPicker();
        } else {
          el.hiddenDate.focus();
          el.hiddenDate.click();
        }
      } catch (error) {
        el.hiddenDate.focus();
        el.hiddenDate.click();
      }
    });

    el.hiddenDate.addEventListener("change", () => {
      if (el.hiddenDate.value) selectDate(el.hiddenDate.value);
    });

    el.fab.addEventListener("click", () => openEditor());
    el.closeSheet.addEventListener("click", closeEditor);
    el.backdrop.addEventListener("click", closeEditor);
    el.form.addEventListener("submit", saveForm);
    el.deleteBtn.addEventListener("click", requestDelete);

    el.form.addEventListener("input", () => {
      el.formError.hidden = true;
      resetDeleteConfirm();
    });

    el.catPicker.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-cat]");
      if (button) selectCategory(button.dataset.cat);
    });

    el.fAllDay.addEventListener("change", () => {
      setAllDayUI(el.fAllDay.checked);
    });

    el.fDate.addEventListener("change", () => {
      if (el.fEndDate.value < el.fDate.value) {
        el.fEndDate.value = el.fDate.value;
      }
    });

    el.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        switchView(tab.dataset.view);
        vibrate(5);
      });
    });

    el.nutritionForm.addEventListener("submit", handleNutritionSubmit);
    el.foodSelect.addEventListener("change", updateCustomFoodFields);
    el.foodGrams.addEventListener("input", updateFoodPreview);
    el.customFoodName.addEventListener("input", updateFoodPreview);
    el.customProtein.addEventListener("input", updateFoodPreview);
    el.customCarbs.addEventListener("input", updateFoodPreview);
    el.nutritionPrev.addEventListener("click", () => shiftNutritionDate(-1));
    el.nutritionNext.addEventListener("click", () => shiftNutritionDate(1));
    el.nutritionTodayBtn.addEventListener("click", () => {
      nutritionDate = todayISO();
      renderNutrition();
    });
    el.nutritionList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-nutrition-delete]");
      if (button) handleNutritionDelete(button.dataset.nutritionDelete);
    });
    el.clearNutritionDay.addEventListener("click", () => {
      const entries = nutritionEntriesForDate(nutritionDate);
      if (!entries.length) return;
      const confirmed = window.confirm(
        `Remover ${entries.length} ${
          entries.length === 1 ? "registro" : "registros"
        } de ${relativeDayName(nutritionDate).toLowerCase()}?`
      );
      if (!confirmed) return;
      const ids = new Set(entries.map((entry) => entry.id));
      nutritionEntries = nutritionEntries.filter((entry) => !ids.has(entry.id));
      saveNutrition();
      renderNutrition();
      showToast("Registros do dia removidos");
    });
    el.proteinGoalInput.addEventListener("input", updateNutritionGoalsFromInputs);
    el.carbsGoalInput.addEventListener("input", updateNutritionGoalsFromInputs);
    el.proteinGoalInput.addEventListener("change", commitNutritionGoals);
    el.carbsGoalInput.addEventListener("change", commitNutritionGoals);

    el.searchInput.addEventListener("input", () => {
      searchQuery = el.searchInput.value;
      renderUpcoming();
    });

    el.themePicker.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-theme-value]");
      if (!button) return;
      applyTheme(button.dataset.themeValue);
    });

    el.notifBtn.addEventListener("click", handleNotificationButton);
    el.installBtn.addEventListener("click", handleInstall);
    el.installRowBtn.addEventListener("click", handleInstall);
    el.copyPixBtn.addEventListener("click", copyPixKey);

    el.exportBtn.addEventListener("click", exportData);
    el.exportIcsBtn.addEventListener("click", exportIcs);
    el.importBtn.addEventListener("click", () => {
      el.importFile.value = "";
      el.importFile.click();
    });
    el.importFile.addEventListener("change", () => {
      const file = el.importFile.files && el.importFile.files[0];
      if (file) importData(file);
    });

    el.clearBtn.addEventListener("click", requestClearAll);
    el.clearDemo.addEventListener("click", clearDemoEvents);

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      renderSettings();
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      renderSettings();
      showToast("App instalado!");
    });

    const handleThemeChange = () => {
      if (settings.theme === "auto") {
        applyTheme("auto", false);
        if (document.body.classList.contains("auth-open")) {
          if (!el.authProfiles.hidden) renderAuthProfiles();
          if (!el.authPin.hidden && pendingPinProfile) {
            el.pinAvatar.style.background =
              profileAccentColors(pendingPinProfile).soft;
          }
        }
      }
    };
    if (typeof darkMedia.addEventListener === "function") {
      darkMedia.addEventListener("change", handleThemeChange);
    } else if (typeof darkMedia.addListener === "function") {
      darkMedia.addListener(handleThemeChange);
    }

    document.addEventListener("keydown", (keyEvent) => {
      if (document.body.classList.contains("auth-open")) return;

      if (el.profileSheet.classList.contains("is-open")) {
        if (keyEvent.key === "Escape") closeProfileSheet();
        return;
      }

      if (el.sheet.classList.contains("is-open")) {
        if (keyEvent.key === "Escape") closeEditor();
        return;
      }

      const target = keyEvent.target;
      if (
        target &&
        (target.closest("input, textarea, select, [contenteditable]") ||
          target.closest("button, a"))
      ) {
        return;
      }

      if (keyEvent.key === "ArrowLeft") {
        shiftSelectedDay(-1);
      } else if (keyEvent.key === "ArrowRight") {
        shiftSelectedDay(1);
      } else if (keyEvent.key === "t" || keyEvent.key === "T") {
        selectedDate = todayISO();
        switchView("day");
      } else if (keyEvent.key === "n" || keyEvent.key === "N") {
        openEditor();
      } else if (keyEvent.key === "/") {
        keyEvent.preventDefault();
        switchView("upcoming");
        el.searchInput.focus();
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let tracking = false;

    el.viewDay.addEventListener(
      "touchstart",
      (touchEvent) => {
        if (touchEvent.touches.length !== 1) return;
        if (el.sheet.classList.contains("is-open")) return;
        tracking = true;
        touchStartX = touchEvent.touches[0].clientX;
        touchStartY = touchEvent.touches[0].clientY;
      },
      { passive: true }
    );

    el.viewDay.addEventListener(
      "touchend",
      (touchEvent) => {
        if (!tracking) return;
        tracking = false;
        const touch = touchEvent.changedTouches[0];
        if (!touch) return;
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.6) {
          shiftSelectedDay(deltaX < 0 ? 1 : -1);
        }
      },
      { passive: true }
    );

    window.addEventListener("offline", () => {
      showToast("Você está offline. O app continua funcionando.");
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tick();
    });
  }

  /* ---------- Service worker ----------------------------- */

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* running from file:// or SW unavailable */
      });

      navigator.serviceWorker.addEventListener("message", (messageEvent) => {
        const data = messageEvent.data || {};
        if (data.type !== "open-event") return;

        if (!activeProfile) {
          pendingOpen = data;
          return;
        }

        if (data.date && isValidISODate(data.date)) {
          selectedDate = data.date;
        }
        switchView("day");
        renderAll();
        if (events.some((event) => event.id === data.eventId)) {
          openEditor(data.eventId);
        }
      });
    }
  }

  /* ---------- Init --------------------------------------- */

  function init() {
    profiles = loadProfilesWithMigration();
    settings = defaultSettings();
    events = [];
    selectedDate = todayISO();

    buildCategoryPicker();
    buildFoodOptions();
    bindEvents();
    bindAuthEvents();
    bindProfileEvents();
    applyTheme("auto", false);
    updateGreeting();

    const sessionId = (() => {
      try {
        return sessionStorage.getItem(STORE.session);
      } catch (error) {
        return null;
      }
    })();
    const sessionProfile = profiles.find((profile) => profile.id === sessionId);

    if (sessionProfile) {
      enterProfile(sessionProfile);
    } else {
      showAuth();
    }

    document.body.classList.remove("booting");

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) el.installBtn.hidden = true;

    registerServiceWorker();

    window.setInterval(tick, 20000);
    window.setTimeout(checkReminders, 1200);
  }

  window.diaNotificationPermissionChanged = function (granted) {
    renderNotificationState();
    renderSettings();
    if (granted) {
      showToast("Notificações ativadas!");
    } else {
      showToast(
        "Notificações bloqueadas. Os lembretes ainda aparecem com o app aberto."
      );
    }
  };

  window.diaRefreshNotificationState = function (enabled) {
    renderNotificationState();
    renderSettings();
  };

  window.diaOpenEventFromAndroid = function (eventId, date) {
    if (!activeProfile) {
      pendingOpen = { type: "open-event", eventId, date };
      return;
    }

    closeEditor();
    closeProfileSheet();

    if (date && isValidISODate(date)) {
      selectedDate = date;
    }

    switchView("day");
    renderAll();

    if (events.some((event) => event.id === eventId)) {
      openEditor(eventId);
    } else {
      showToast("O evento não está mais na agenda.");
    }
  };

  window.diaHandleBack = function () {
    if (el.sheet.classList.contains("is-open")) {
      closeEditor();
      return true;
    }
    if (el.profileSheet.classList.contains("is-open")) {
      closeProfileSheet();
      return true;
    }
    if (document.body.classList.contains("auth-open")) {
      if (!el.authPin.hidden) {
        el.pinBack.click();
        return true;
      }
      if (!el.authCreate.hidden && profiles.length > 0) {
        renderAuthProfiles();
        return true;
      }
      return false;
    }
    if (activeView !== "day") {
      switchView("day");
      return true;
    }
    return false;
  };

  init();
})();
