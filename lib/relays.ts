/**
 * relays.ts: every relay this site reads, and why each is here.
 *
 * The site only ever reads. It never signs anything and holds no key, so a
 * relay that requires NIP-42 AUTH before it serves a REQ is reported as
 * "needs sign-in" and skipped, never answered.
 */

/**
 * Where cyberspace events (movement, bags, objects) are read from.
 *
 * - cyberspace.nostr1.com is ONOSENDAI's canonical relay (useRelays
 *   DEFAULT_RELAY). It requires AUTH for reads, so today it is listed but
 *   skipped. If it ever serves reads openly, the site counts it with no change.
 * - relay.onosendai.tech is the dedicated relay ruled on 2026-10-11, required
 *   to serve reads without AUTH. Until it exists it shows as unreachable; the
 *   day it opens, the stats light up without a redeploy.
 * - wheat.oslim.dev and onosendai.feeds.relay.tools serve reads without AUTH
 *   and carry part of the world (the relays some players and agents publish
 *   to as well). Drop them here once relay.onosendai.tech carries everything.
 */
export const CYBERSPACE_RELAYS: readonly string[] = [
  'wss://relay.onosendai.tech',
  'wss://cyberspace.nostr1.com',
  'wss://wheat.oslim.dev',
  'wss://onosendai.feeds.relay.tools',
]

/**
 * General relays: where profiles (kind 0) live, and where snocrash publishes
 * public objects (sno-core FEED_RELAYS). ONOSENDAI reads profiles from the
 * same three (src/lib/contacts.ts GENERAL_RELAYS).
 */
export const GENERAL_RELAYS: readonly string[] = [
  'wss://relay.primal.net',
  'wss://relay.damus.io',
  'wss://nos.lol',
]

/** Public shards (kind 33331) are read from both sets. */
export const SHARD_RELAYS: readonly string[] = [...CYBERSPACE_RELAYS, ...GENERAL_RELAYS]

/** Profiles are read from both sets too: an agent's profile is often only on a cyberspace relay. */
export const PROFILE_RELAYS: readonly string[] = [...GENERAL_RELAYS, ...CYBERSPACE_RELAYS]

/** Every relay the page may open, deduplicated, for the status strip. */
export const ALL_RELAYS: readonly string[] = [...new Set([...CYBERSPACE_RELAYS, ...GENERAL_RELAYS])]

/** A relay's host, for display. */
export function relayHost(url: string): string {
  return url.replace(/^wss?:\/\//, '').replace(/\/$/, '')
}
