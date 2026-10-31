# Straylight Café

The community hub for cyberspace: live stats from the cyberspace relays, and the way in to ONOSENDAI, snocrash, the spec, the MCP server for AI agents, and the cli.

## What is on the page

- **Live from cyberspace**: stats, recently active avatars, popular places and a shard feed, read straight from public nostr relays in the visitor's browser.
- **Explore**: ONOSENDAI (with its guided tour at onosendai.tech/demo), snocrash, the SNO spec, a line naming other clients that render SNO (Ditto and Grimoire), cyberspace-mcp and cyberspace-cli. ONOSENDAI, snocrash, the SNO spec and cyberspace.international are shown with their own Open Graph cards, copied into `public/og/` (re-encoded as WebP) so they never break.
- **Welcome, the protocol, Learn**: what cyberspace is, the spec and its DECKs, cyberspace.international.
- **Archive** and **Support Development**.

## Live stats

All of it is computed client-side (`lib/world.ts`, `lib/places.ts`, `lib/useCyberspace.ts`). The site only reads: the relay client (`lib/relayClient.ts`) can send REQ, COUNT and CLOSE and nothing else, so it cannot publish an event or answer an AUTH challenge, and it holds no key.

### Relays (`lib/relays.ts`)

| Relay | Why | Today |
|---|---|---|
| `relay.onosendai.tech` | The dedicated ONOSENDAI relay, required to serve reads without AUTH | Not live yet: shown as unreachable, counted automatically once it opens |
| `cyberspace.nostr1.com` | ONOSENDAI's canonical relay | Requires NIP-42 AUTH for reads, so it is skipped and the page says so |
| `wheat.oslim.dev` | Carries part of the world and serves reads without AUTH | Read |
| `relay.primal.net`, `relay.damus.io`, `nos.lol` | Profiles (kind 0), and public objects snocrash publishes there | Read |

So every number is "on the relays this page can read". Until a relay that carries the whole world serves reads openly, the numbers undercount.

### Definitions

Kinds are from the cyberspace kinds reference (spec, DECK-0001, DECK-0003).

| Stat | Definition | Window |
|---|---|---|
| Avatars active | Distinct pubkeys that published a movement event (kind 3333: spawn, hop, sidestep, enter-hyperspace, hyperjump, ...) | Last 24 h, and last 7 d |
| Moves | Movement events (kind 3333), deduplicated by id across relays | Last 24 h, and last 7 d |
| Bots active | Avatars active in the last 7 d whose profile (kind 0) says `"bot": true` (NIP-24), the same test ONOSENDAI uses | Last 7 d |
| Bags placed | Distinct bags (kind 33330, by author and `d`), counted without decrypting anything. The caption adds large shards hidden by reference (encrypted kind 33331) separately | On record, and new in the last 7 d |
| Shards published | Distinct public SNO objects (kind 33331 with no `encrypted` tag, `d` not `avatar`, a payload sno-core accepts), minus any their author deleted (NIP-09) | On record, and new in the last 7 d |
| Blocks explored | Distinct Bitcoin block heights named by rides: the destination `B` and the station `from_height` of every hyperjump | Every ride on record |
| Recently active | Avatars from the 7 d read, newest move first, with name and picture from kind 0 | Last 7 d |
| Popular places | Hyperspace stops ranked by distinct riders, and regions ranked by distinct avatars, each named only above a threshold of non-bot avatars (see Privacy) | Stops: every ride on record. Regions: last 7 d |
| Shard feed | The 12 newest public objects, drawn with sno-core geometry on a small canvas; each opens in snocrash at `/workshop/<naddr>` | Newest |

"On record" means everything the readable relays return within the read limits below. A number shown with ≥ means a read hit its limit, so the true count is at least that. Where a relay supports NIP-45, the page also shows its COUNT of all movement events on record (the largest any relay reports, since counts from different relays cannot be merged).

### Read limits

- Movement: `since` 7 days ago, pages of 500, at most 4 pages per relay.
- Rides: one filter with one tag (`#A: ["hyperjump"]`), 500 per relay.
- Bags: 2 pages of 500 per relay. Public objects: 2 pages of 200 per relay.
- Deletions: the object authors' kind 5 events, 500 per relay.
- Profiles: only for the avatars and shard authors shown.

No filter carries more than one tag (strfry refuses more than three). Each relay is read on its own with a 4 s connect deadline and a 9 s read deadline, so a slow or dead relay never holds up the others. After the first load, one live subscription per relay (new events only) keeps the page current; the rolling windows recompute every 30 s. Movement events are stripped to the few tags a stat reads as they arrive, so a ride's proof never stays in memory. The computed stats are kept in sessionStorage, so a reload in the same tab paints at once.

Signatures are checked on what the page displays (profiles and public objects). Movement and bag counts trust the relays' own signature checks.

### Privacy

A movement event's sector tags locate an avatar to about 12 cm. The page never shows a coordinate, and it names a place only when enough different people were there that the name cannot point at one of them.

- **Regions.** Moves are reduced to large regions: ideaspace as a whole; on Earth, 30 by 30 degree cells; under the surface; near Earth; deep dataspace. A region is named only when **3 or more distinct non-bot avatars** moved in it during the 7-day window. Earth cells below that are folded into one unnamed "Elsewhere on Earth" row; any other region below it is left out.
- **Hyperspace stops.** A stop is listed only when **2 or more distinct non-bot avatars** rode to or boarded from it; otherwise it is skipped. Listed stops link to the stop in ONOSENDAI (every rider to a block lands on the same, public stop coordinate).
- **Bots never count toward a threshold**, so an operator's own agent cannot make the operator's region or stop nameable. For this purpose a pubkey is a bot if its profile says `"bot": true` or any of its moves came from cyberspace-mcp (the agents' server), which catches an agent before its profile loads or when it has none. This is deliberately wider than the "Bots active" stat, which uses the profile flag alone.

Recently active avatars are listed with their last action and when, never where.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static export to out/
```

Next.js 16 (static export), TypeScript, Tailwind CSS 4, framer-motion, nostr-tools (signature checks and bech32 only), and sno-core (pinned git dependency) for SNO parsing and geometry.

## Deployment

Nothing deploys automatically. There is no CI and no hosting integration: merging to `main` changes nothing on straylight.cafe. The live site is static files on an Apache host, uploaded by hand:

1. `npm run build`
2. Zip the contents of `out/` (not the folder itself)
3. Upload to the host

## License

MIT

Inspired by William Gibson's Neuromancer and the concept of cyberspace.
