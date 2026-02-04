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

// Helper to get UTM params from URL or persistent storage
const getUtmParams = () => {
  if (typeof window === 'undefined') return {};

  const utms: Record<string, string | null> = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
  };

  // 1. Try to read from current URL
  const searchParams = new URLSearchParams(window.location.search);
  let foundInUrl = false;

  Object.keys(utms).forEach(key => {
    const val = searchParams.get(key);
    if (val) {
      utms[key] = val;
      foundInUrl = true;
    }
  });

  // 2. If found in URL, save to sessionStorage for session persistence
  if (foundInUrl) {
    try {
      sessionStorage.setItem('last_utms', JSON.stringify(utms));
    } catch (e) {
      // ignore
    }
    return utms;
  }

  // 3. Fallback to storage
  try {
    const stored = sessionStorage.getItem('last_utms');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // ignore
  }

  return {};
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
};
