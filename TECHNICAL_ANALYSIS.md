# Deep Technical Analysis: Gig-First Onboarding & Analytics

## 1. Decompose (Understand)
**Problem:** The current flow is "Profile First" (Sign Up -> Create Vendor Profile -> Dashboard). The business requirement is "Gig First" (Invite -> Create Gig -> Create Profile -> Dashboard) to increase conversion by engaging the user with value creation immediately.
**Input:** User authenticated via Invite/Magic Link.
**Output:** A created Gig (draft/pending) and a filled Profile (associated with the user).
**Hidden Requirements:** 
- Analytics accuracy is critical (GTM/GA4/Meta).
- Data integrity: What if user quits after Step 1? (We must save the Draft).
- Performance: Steps must feel instant.

## 2. Context (Analyze)
**Stack:** Next.js 14+ (App Router), Supabase (Auth/DB), Tailwind CSS.
**Constraints:** 
- `vendors` table currently acts as the profile.
- `gigs` table exists but needs to be the primary entry point.
- Auth State: User is likely already authenticated via Magic Link when they hit this flow.

## 3. Reason (Model Solutions)

### Option A: Local State Wizard (Not Recommended)
Keep everything in memory (React State) until the end, then blast 2 API calls.
- *Pros:* No database trash.
- *Cons:* High risk of data loss. If analytics event fires "Gig Submit" but API fails later, data is discrepant.

### Option B: Progressive Persistence (Selected)
- **Step 1 (Gig):** User submits -> Call `POST /api/gigs`. Save as `status: draft`. Return `gig_id`.
- **Step 2 (Profile):** User submits -> Call `PATCH /api/vendors` (or `POST`). Link to User.
- *Pros:* "Gig Created" event aligns with DB reality. Drafts can be recovered.
- *Cons:* Need to manage "orphan" gigs (garbage collection later).

## 4. Integrate (Synthesize)
**Schema Changes:**
- Ensure `gigs` table supports `status` enum (`draft`, `pending`, `active`).
- Ensure `vendors` table allows partial updates if necessary.

**Code Structure:**
- `app/onboarding/page.tsx`: The main orchestrator (Wizard).
- `lib/analytics.ts`: Centralized event dispatcher.
- `components/GoogleTagManager.tsx`: Script injection.

## 5. Conclude (Implementation Plan)
1.  **Analytics Layer:** Implement GTM and helper functions first to ensure all steps are tracked.
2.  **Wizard Container:** A persistent state wrapper to manage `currentStep`.
3.  **Gig Form (Step 1):** Minimalist, high-conversion form. Autosave on submit.
4.  **Profile Form (Step 2):** Connects to the User entity.
5.  **Adoption:** Replaces `app/join` for invited users.

---
*Created by Antigravity AI*
