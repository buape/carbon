export type IfPartial<T, U, V = U | undefined> = T extends true ? V : U
import type { MessagePayload } from "./types.js"

export const splitCustomId = (
	customId: string
): [string, Record<string, string>] => {
	const [id, ...args] = customId.split(":")
	if (!id) throw new Error("Invalid custom ID was provided")
	const data = Object.fromEntries(
		args.map((arg) => {
			const [key, value] = arg.split("=")
			return [key, value]
		})
	)
	return [id, data]
}

// Used from https://github.com/discord/discord-interactions-js

function getSubtleCrypto(): SubtleCrypto {
	if (typeof window !== "undefined" && window.crypto) {
		return window.crypto.subtle
	}
	if (typeof globalThis !== "undefined" && globalThis.crypto) {
		return globalThis.crypto.subtle
	}
	if (typeof crypto !== "undefined") {
		return crypto.subtle
	}
	if (typeof require === "function") {
		const cryptoPackage = "node:crypto"
		const crypto = require(cryptoPackage)
		return crypto.webcrypto.subtle
	}
	throw new Error("No Web Crypto API implementation found")
}

export const subtleCrypto = getSubtleCrypto()

export function valueToUint8Array(
	value: Uint8Array | ArrayBuffer | Buffer | string,
	format?: string
): Uint8Array {
	if (value == null) {
		return new Uint8Array()
	}
	if (typeof value === "string") {
		if (format === "hex") {
			const matches = value.match(/.{1,2}/g)
			if (matches == null) {
				throw new Error("Value is not a valid hex string")
			}
			const hexVal = matches.map((byte: string) => Number.parseInt(byte, 16))
			return new Uint8Array(hexVal)
		}

		return new TextEncoder().encode(value)
	}
	try {
		if (Buffer.isBuffer(value)) {
			return new Uint8Array(value)
		}
	} catch (_) {}
	if (value instanceof ArrayBuffer) {
		return new Uint8Array(value)
	}
	if (value instanceof Uint8Array) {
		return value
	}
	throw new Error(
		"Unrecognized value type, must be one of: string, Buffer, ArrayBuffer, Uint8Array"
	)
}

export function concatUint8Arrays(
	arr1: Uint8Array,
	arr2: Uint8Array
): Uint8Array {
	const merged = new Uint8Array(arr1.length + arr2.length)
	merged.set(arr1)
	merged.set(arr2, arr1.length)
	return merged
}

export const serializePayload = (
	payload: MessagePayload,
	defaultEphemeral = false
) => {
	if (typeof payload === "string") {
		return { content: payload, flags: defaultEphemeral ? 64 : undefined }
	}
	const data = {
		...payload,
		embeds: payload.embeds?.map((embed) => embed.serialize()),
		components: payload.components?.map((row) => row.serialize())
	}
	if (defaultEphemeral) {
		data.flags = 64
	}
	return data
}
