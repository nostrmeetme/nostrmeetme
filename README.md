# Meet Me On Nostr
an app for sharing Nostr wih friends


This is a "social onboarding" Nostr web client designed for Nostr advocates to "in person" invite their freiends to join them on Nostr.

CURRENTLY IN APLPHA DEVELOPMENT, not all features are available yet.

With a single QR code scan (or web link), the new friend will create an account, follow the advocate, and start a DM thread with the advocate in a single web app. New users will recieve an instant trust score, a list of reccomended follows, suggested clients and relays, introductions to private groups, and more. All configurable for each invite by the logged-in advocate in the app settings. 

See the live version 
[ostrmeet.me](https://nostrmeet.me)

Meet me on nostr:
[nostrmeet.me/manime](https://nostrmeet.me/manime)

## Developing

Once you've installed the project and dependencies with `npm install`, start a development server:

```bash
npm run dev
```
this will run `vite dev --host`
The client will now be available on your localhost and hosted locally on your LAN
http://localhost:5173/


## Testing

To test the production version locally, run

```bash
npm run build
```
You can preview the production build with `npm run preview`.

