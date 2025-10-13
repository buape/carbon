// I called this the BabyCache because eventually, one way, carbon will have a more
// proper caching setup. For now, this is the toddler of that cache.

export class BabyCache {
	guildCache: Map<string, { available: boolean; lastEvent: number }> = new Map()
}
