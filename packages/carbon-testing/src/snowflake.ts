const discordEpoch = 1420070400000n
export type SnowflakeGeneratorOptions = {
	/**
	 * Millisecond timestamp to encode. Defaults to a stable 2024 timestamp so tests are deterministic.
	 */
	timestamp?: number | Date
	/**
	 * Discord internal worker id bits. Must fit in 5 bits.
	 */
	workerId?: number
	/**
	 * Discord internal process id bits. Must fit in 5 bits.
	 */
	processId?: number
	/**
	 * Starting increment. Must fit in 12 bits.
	 */
	increment?: number
}

const defaultTimestamp = Date.UTC(2024, 0, 1)

const assertBitRange = (name: string, value: number, max: number) => {
	if (!Number.isInteger(value) || value < 0 || value > max) {
		throw new Error(`${name} must be an integer between 0 and ${max}`)
	}
}

export function generateSnowflake(options: SnowflakeGeneratorOptions = {}) {
	const timestampValue =
		options.timestamp instanceof Date
			? options.timestamp.getTime()
			: (options.timestamp ?? defaultTimestamp)
	const workerId = options.workerId ?? 0
	const processId = options.processId ?? 0
	const increment = options.increment ?? 0

	assertBitRange("workerId", workerId, 31)
	assertBitRange("processId", processId, 31)
	assertBitRange("increment", increment, 4095)

	const timestamp = BigInt(timestampValue)
	if (timestamp < discordEpoch) {
		throw new Error("timestamp must be at or after the Discord epoch")
	}

	return String(
		((timestamp - discordEpoch) << 22n) |
			(BigInt(workerId) << 17n) |
			(BigInt(processId) << 12n) |
			BigInt(increment)
	)
}

export function createSnowflakeGenerator(
	options: Omit<SnowflakeGeneratorOptions, "increment"> = {}
) {
	let increment = 0
	return () => {
		const snowflake = generateSnowflake({ ...options, increment })
		increment = (increment + 1) & 4095
		return snowflake
	}
}
