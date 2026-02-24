# Dance Treasure Hunt PWA - MVP Estimates

## Project Overview

**Project Name:** Dance Treasure Hunt  
**Type:** Progressive Web App (PWA)  
**Core Functionality:** A treasure hunt app where users scan QR codes at physical locations to unlock dance/exercise videos. Completing all 8-10 points completes the full dance sequence.  
**Deadline:** June 1st, 2026 (MVP mid-June)

---

## Client Requirements (MVP Phase 1)

- ✅ Web-based solution (PWA) - not native app
- ✅ Simple registration (name + email + consent)
- ✅ Firebase backend + GA4 for statistics
- ✅ No advanced admin functionality (use Firebase Console + data export)
- ⚠️ Location check - dropped in MVP
- ⚠️ Social login - dropped in MVP

---

## Technical Stack

| Category | Technology |
|----------|------------|
| Framework | React + Vite |
| PWA | vite-plugin-pwa |
| Backend | Firebase (Auth, Firestore) |
| Analytics | Google Analytics 4 (GA4) |
| QR Scanning | html5-qrcode |
| Geolocation | navigator.geolocation (available if needed later) |

---

## Detailed Task Breakdown

### Phase 1: Project Setup & Infrastructure

| Task | Description | Est. Hours |
|------|-------------|------------|
| 1.1 | Initialize React + Vite project with PWA support | 2h |
| 1.2 | Configure vite-plugin-pwa (manifest, service worker) | 3h |
| 1.3 | Set up Firebase project (Auth, Firestore, Storage) | 2h |
| 1.4 | Configure GA4 property and tracking | 2h |
| 1.5 | Set up project structure and routing | 2h |
| **Phase 1 Total** | | **11h** |

---

### Phase 2: Authentication & User Management

| Task | Description | Est. Hours |
|------|-------------|------------|
| 2.1 | Registration form (name, email, password) | 3h |
| 2.2 | Consent checkbox with text | 1h |
| 2.3 | Firebase Authentication integration | 3h |
| 2.4 | User profile creation in Firestore | 2h |
| 2.5 | Login/logout flows | 2h |
| 2.6 | Session management and protected routes | 2h |
| 2.7 | Consent logging and storage | 1h |
| **Phase 2 Total** | | **14h** |

---

### Phase 3: QR Code Scanning (CORE FEATURE)

| Task | Description | Est. Hours |
|------|-------------|------------|
| 3.1 | Camera permission handling | 2h |
| 3.2 | QR scanner component setup | 4h |
| 3.3 | QR code validation logic | 3h |
| 3.4 | Error handling (invalid QR, camera denied) | 2h |
| 3.5 | Scan success feedback UI | 1h |
| **Phase 3 Total** | | **12h** |

---

### Phase 4: Content & Progress System

| Task | Description | Est. Hours |
|------|-------------|------------|
| 4.1 | Video player component | 3h |
| 4.2 | Progress tracking in Firestore | 4h |
| 4.3 | Progress UI (completed/current/total) | 2h |
| 4.4 | Completion detection logic | 2h |
| 4.5 | Confetti celebration on completion | 3h |
| 4.6 | Completion state persistence | 2h |
| **Phase 4 Total** | | **16h** |

---

### Phase 5: Statistics & Reporting

| Task | Description | Est. Hours |
|------|-------------|------------|
| 5.1 | GA4 event tracking (scans, completions) | 3h |
| 5.2 | User statistics in Firestore | 3h |
| 5.3 | Basic user dashboard (personal stats) | 3h |
| 5.4 | Data export script (JSON/CSV) | 4h |
| **Phase 5 Total** | | **13h** |

---

### Phase 6: UI/UX Polish & Testing

| Task | Description | Est. Hours |
|------|-------------|------------|
| 6.1 | Responsive mobile-first styling | 4h |
| 6.2 | Onboarding flow / how-it-works | 3h |
| 6.3 | Error states and messages | 3h |
| 6.4 | Loading states (spinners, skeletons) | 2h |
| 6.5 | PWA install prompt | 2h |
| 6.6 | Cross-browser testing (iOS Safari, Android Chrome) | 4h |
| 6.7 | Basic offline support (progress caching) | 3h |
| **Phase 6 Total** | | **21h** |

---

## Time Summary

| Phase | Description | Hours |
|-------|-------------|-------|
| 1 | Project Setup & Infrastructure | 11h |
| 2 | Authentication & User Management | 14h |
| 3 | QR Code Scanning | 12h |
| 4 | Content & Progress System | 16h |
| 5 | Statistics & Reporting | 13h |
| 6 | UI/UX Polish & Testing | 21h |
| **TOTAL** | | **87h** |

### Timeline Estimate

| Scenario | Duration | Notes |
|----------|----------|-------|
| Optimistic | 3 weeks | 8h/day, smooth delivery |
| Realistic | 3.5 weeks | Account for review cycles |
| Conservative | 4 weeks | Buffer for issues |

**Estimated: 3-4 weeks**

---

## "Must Have" Technical Features

Even in a tight MVP, these are essential:

1. **Camera/QR scanning** - Core functionality, cannot be replaced
2. **Firebase Auth** - User accounts + consent tracking (required for reporting)
3. **Firestore** - Store progress per user
4. **GA4** - Statistics for September reporting
5. **PWA manifest** - Installable on home screen
6. **Data export** - CSV export for September reporting

---

## What's NOT in MVP (Future Phases)

| Feature | Description | Phase |
|---------|-------------|-------|
| Location verification | GPS check at QR locations | Phase 2 |
| Social login | Google/Apple sign-in | Phase 2 |
| Admin panel | CMS for managing content | Phase 2 |
| Multiple tracks | Different dance routes | Phase 2 |
| Offline video caching | Full offline support | Phase 2 |
| Live event mode | Real-time group dancing | Phase 2 |
| Push notifications | Reminders, updates | Phase 2 |

---

## Questions & Assumptions

1. **QR Code Content:** Client provides URLs to videos (no CMS needed)
2. **QR Code Generation:** Handled by client (physical stickers)
3. **Data Export:** Manual Firebase export is sufficient
4. **Offline Support:** Online-focused (basic offline for progress caching only)

---

## Platform Notes

### iOS (Safari/PWA)
- Camera access works via `navigator.mediaDevices.getUserMedia()` (iOS 11+)
- Must use HTTPS (camera blocked on HTTP)
- html5-qrcode library handles iOS quirks well

### Android (Chrome/PWA)
- Full Web Camera API support
- Works seamlessly with html5-qrcode

### Geolocation
- Native `navigator.geolocation` works in PWA
- Available if needed in future phases
- Dropped in MVP as per client request

---

## Client Meeting Notes - Thursday

- Present MVP scope with confidence
- Emphasize foundation can be extended in Phase 2
- Clarify QR code video URLs format before development
- Request well-developed Figma sketches before start

---

*Last Updated: February 24, 2026*
