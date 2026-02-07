type GtmEvent = {
  event: string;
  [key: string]: any;
};

// Declare the dataLayer on the window object
declare global {
  interface Window {
    dataLayer: GtmEvent[];
    fbq?: any; // Meta Pixel
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXX';

// Helper to set cookie
const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  // SameSite=Lax for normal navigation, Secure if HTTPS
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = name + "=" + (value || "") + expires + "; path=/" + secure + "; SameSite=Lax";
};

// Helper to get cookie
const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Helper to get UTM params from URL or persistent storage
export const getUtmParams = () => {
  if (typeof window === 'undefined') return {};

  const utms: Record<string, string | null> = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    ref: null, // User requested 'ref'
  };

  // 1. Try to read from current URL
  const searchParams = new URLSearchParams(window.location.search);
  let foundInUrl = false;
  const currentUtms: Record<string, string> = {};

  Object.keys(utms).forEach(key => {
    const val = searchParams.get(key);
    if (val) {
      currentUtms[key] = val;
      foundInUrl = true;
    }
  });

  // 2. If found in URL, save to Cookie (30 days) and localStorage
  if (foundInUrl) {
    try {
      const json = JSON.stringify(currentUtms);
      // Save to LocalStorage
      localStorage.setItem('traffic_source', json);
      // Save to Cookie (30 days)
      setCookie('traffic_source', encodeURIComponent(json), 30);
    } catch (e) {
      console.error('Failed to save UTMs', e);
    }
    return { ...utms, ...currentUtms };
  }

  // 3. Fallback to storage (Cookie first, then LocalStorage)
  try {
    // Try Cookie
    const cookieVal = getCookie('traffic_source');
    if (cookieVal) {
      return { ...utms, ...JSON.parse(decodeURIComponent(cookieVal)) };
    }

    // Try LocalStorage
    const stored = localStorage.getItem('traffic_source');
    if (stored) {
      return { ...utms, ...JSON.parse(stored) };
    }
  } catch (e) {
    // ignore
  }

  return utms;
};

export const pageview = (url: string) => {
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
    });
  }
};

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window.dataLayer !== 'undefined') {
    // Auto-attach UTMs to every event
    const utms = getUtmParams();

    // Auto-attach user_id if we have it locally (optional, better handled by GTM user_id var but good for direct PII events if consistent)
    // Note: Be careful with PII in GA4. usually user_id is set via config, not event params directly unless explicitly mapped.

    window.dataLayer.push({
      event: eventName,
      ...utms,
      ...params,
    });

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventName, { ...utms, ...params });
    }
  }
};

// Helper for Meta Pixel Standard Events
// Note: Usually GTM handles this trigger. But if you want manual control:
export const trackMetaEvent = (eventName: string, params: Record<string, any> = {}, eventID?: string) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params, { eventID });
  }
};


// Standard Events for Funnel
export const AnalyticsEvents = {
  INVITE_OPENED: 'invite_opened',
  GIG_CREATE_START: 'gig_create_start',
  GIG_CREATE_SUBMIT: 'gig_create_submit',
  PROFILE_FILL_START: 'profile_fill_start',
  PROFILE_FILL_SUBMIT: 'profile_fill_submit',
  GIG_PUBLISH_REQUEST: 'gig_publish_request',

  // Category Landing Page Events
  PAGE_VIEW_CATEGORY: 'page_view_category',
  CLICK_BOOK: 'click_book',
  START_BOOKING: 'start_booking',
  SUBMIT_BOOKING: 'submit_booking',
  CLICK_BECOME: 'click_become',
  CREATE_GIG_START: 'create_gig_start',
  CHATBOT_OPENED: 'chatbot_opened',
};
