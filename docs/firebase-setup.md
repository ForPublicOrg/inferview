# Firebase setup

Inferview uses two Firebase products: Authentication with the Google provider, and Cloud Firestore for one progress document per user. Everything else stays off. The web config values are public identifiers, not secrets; access is controlled by `firestore.rules` and by the list of authorised domains.

## 1. Create the project

1. In the [Firebase console](https://console.firebase.google.com/), create a project. Turn Google Analytics off when asked: the site ships no analytics.
2. Under Project settings, General, add a Web app. Do not enable Firebase Hosting; the site is hosted on Vercel.
3. Copy `apiKey`, `authDomain`, `projectId` and `appId` from the config snippet into `.env` (copy `.env.example` first) and into the Vercel environment variables:

```
PUBLIC_FIREBASE_API_KEY=...
PUBLIC_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=<project-id>
PUBLIC_FIREBASE_APP_ID=...
```

If any of the four is empty, the build still works: the sign-in button reads "Sign-in not configured" and progress stays in the browser.

4. Pin the auth frame host in `vercel.json`. The page CSP ships with `frame-src ... https://*.firebaseapp.com` because the project id is not known in the repository. Replace that wildcard with your exact `authDomain`, for example `https://<project-id>.firebaseapp.com`. The post-build check warns while the wildcard is still there and `PUBLIC_FIREBASE_AUTH_DOMAIN` is set.

## 2. Enable Google sign-in

Authentication, Sign-in method, Add new provider, Google. Set the public-facing name to Inferview and a support email you read.

## 3. Authorised domains

Authentication, Settings, Authorised domains. Add:

- `inferview.io`
- `www.inferview.io`
- `localhost` (present by default)
- the Vercel preview domain for the project, for example `inferview-<team>.vercel.app`; add each preview host you want to test sign-in on

Sign-in fails with `auth/unauthorized-domain` on any host not in this list, which is the intended behaviour.

## 4. Create Firestore and deploy the rules

1. Firestore Database, Create database, production mode. Pick the location once; it cannot be changed later. Write the chosen location into `src/pages/privacy.astro`, where the placeholder says "region to be filled in".
2. Install the Firebase CLI and deploy the rules from the repository root:

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # pick the project, alias "default"
firebase deploy --only firestore:rules
```

`firebase.json` points the CLI at `firestore.rules` and nothing else. The rules allow a signed-in user to read, write and delete only `users/{their uid}`, require the document to have exactly the keys `v`, `streak` and `items` with `v == 1`, cap `items` at 5,000 entries, and deny every other path. Rules cannot loop over map values, so each item's shape is checked by the client (`validateProgress` in `src/lib/progress.ts`) rather than by the rules.

To test the rules before deploying, run the emulator with `firebase emulators:start --only firestore` and use the Rules Playground in the console.

## 5. The authDomain choice

The site uses `signInWithPopup` and falls back to `signInWithRedirect` when the browser blocks popups. With `authDomain` set to `<project-id>.firebaseapp.com`, the popup runs on Firebase's own handler at `https://<project-id>.firebaseapp.com/__/auth/handler`, so Vercel does not need to serve `/__/auth`. The CSP in `vercel.json` allows frames from that host for this reason; pin it as described in section 1, item 4.

The redirect fallback is less reliable on browsers that block third-party storage (Safari, and Chrome with third-party cookies off), because the redirect returns to inferview.io while the auth state lives on firebaseapp.com. If the redirect flow matters to you, follow Firebase's guide "Best practices for using signInWithRedirect on browsers that block third-party storage": proxy `/__/auth/*` to `<project-id>.firebaseapp.com` with a rewrite in `vercel.json`, set `PUBLIC_FIREBASE_AUTH_DOMAIN=inferview.io`, and add `https://inferview.io/__/auth/handler` as an authorised redirect URI on the OAuth client in Google Cloud. The auth frames are then same-origin, which the CSP already allows (`frame-src` includes `'self'`).

## 6. Optional: App Check

App Check with reCAPTCHA v3 makes it harder for scripts outside the site to call Firestore with your config. It is off by default because it needs a site key and a script from Google.

1. Create a reCAPTCHA v3 key for `inferview.io` and `www.inferview.io`.
2. In Firebase, App Check, register the web app with that key, and leave enforcement off at first.
3. In `src/lib/firebase.ts`, after `initializeApp`, call `initializeAppCheck(app, { provider: new ReCaptchaV3Provider(siteKey), isTokenAutoRefreshEnabled: true })` from `firebase/app-check`.
4. Extend the CSP in `vercel.json`: add `https://www.google.com https://www.gstatic.com` to `script-src` and `frame-src`, and `https://content-firebaseappcheck.googleapis.com` to `connect-src`.
5. Watch the App Check metrics for a few days, then turn on enforcement for Firestore.

## What is stored

See `src/pages/privacy.astro`. In short: the Firebase Authentication user record for the Google sign-in, and one Firestore document per user with the progress shape from SPEC section 8. The account page deletes both.
