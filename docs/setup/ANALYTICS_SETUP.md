# 📊 GTM & Meta Pixel Setup Guide

To ensure tracking works correctly, you must configure your Google Tag Manager (GTM) container to listen to the events we are pushing.

## 1. Variables (Data Layer)
Create user-defined variables in GTM for the following Data Layer variables:
*   `event` (built-in)
*   `gigId`
*   `category`
*   `price`
*   `currency`
*   `status`
*   `utm_source`
*   `utm_medium`
*   `utm_campaign`
*   `consent_status` (for cookie consent)

## 2. Triggers
Create **Custom Event** triggers for our funnel steps:
1.  **Event Name:** `invite_opened`
2.  **Event Name:** `gig_create_start`
3.  **Event Name:** `gig_create_submit`
4.  **Event Name:** `profile_fill_submit` (This is your main **CONVERSION** event)

## 3. Tags Configuration

### Google Analytics 4 (GA4)
*   **Config Tag:** Fire on `Initialization`. Set field `user_id` if available.
*   **Event Tag:** Fire on the triggers above. Map parameters like `gig_category`, `value` (price), `currency`.

### Meta Pixel (Facebook)
Create a **Custom HTML** tag (or use a template) to fire `fbq('track')`.
*   **Base Pixel:** Fire on `All Pages` (Page View).
*   **CompleteRegistration:** Fire on `profile_fill_submit`.
    ```html
    <script>
      fbq('track', 'CompleteRegistration', {
        value: {{price}},
        currency: {{currency}},
        content_name: {{category}}
      });
    </script>
    ```
*   **Lead:** Fire on `gig_create_submit`.

## 4. Consent Mode (Cookies)
The app pushes a `consent_update` event with `consent_status: 'granted' | 'denied'`.
*   In GTM, go to Admin > Container Settings > Enable Consent Overview.
*   Use the `consent_update` event to update GTM consent state if using Google's native Consent Mode tags.

## 5. UTM Persistence
The application automatically captures UTM parameters from the URL (`utm_source`, etc.) and saves them to `sessionStorage`.
It re-attaches them to **EVERY** event sent via `trackEvent`. You just need to map them in GTM variables