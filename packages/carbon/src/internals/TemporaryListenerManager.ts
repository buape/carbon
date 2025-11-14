import type { BaseListener } from "../abstracts/BaseListener.js"
import type { Client } from "../classes/Client.js"

interface TemporaryListenerEntry {
	listener: BaseListener
	timeout: ReturnType<typeof setTimeout>
	timestamp: number
}

export class TemporaryListenerManager {
	private client: Client
	private listeners: Map<string, TemporaryListenerEntry> = new Map()
	private defaultTimeout: number

	constructor(client: Client, defaultTimeout = 300000) {
		this.client = client
		this.defaultTimeout = defaultTimeout
	}

	register(listener: BaseListener, timeoutMs?: number): () => void {
		const id = this.generateId(listener)
		const timeout = timeoutMs ?? this.defaultTimeout

		this.unregister(id)

		const timeoutHandle = setTimeout(() => {
			this.unregister(id)
			console.warn(
				`[TemporaryListenerManager] Listener ${listener.constructor.name} (${id}) timed out after ${timeout}ms and was automatically removed`
			)
		}, timeout)

		this.listeners.set(id, {
			listener,
			timeout: timeoutHandle,
			timestamp: Date.now()
		})

		this.client.listeners.push(listener)

		return () => this.unregister(id)
	}

	unregister(id: string | BaseListener): boolean {
		const listenerId = typeof id === "string" ? id : this.generateId(id)
		const entry = this.listeners.get(listenerId)

		if (!entry) return false

		clearTimeout(entry.timeout)

		const idx = this.client.listeners.indexOf(entry.listener)
		if (idx > -1) {
			this.client.listeners.splice(idx, 1)
		}

		this.listeners.delete(listenerId)

		return true
	}

	private generateId(listener: BaseListener): string {
		return `${listener.type}_${listener.constructor.name}_${Date.now()}_${Math.random().toString(36).substring(7)}`
	}

	getCount(): number {
		return this.listeners.size
	}

	cleanup(): void {
		for (const id of this.listeners.keys()) {
			this.unregister(id)
		}
	}

	getMetrics() {
		const ages = Array.from(this.listeners.values()).map(
			(entry) => Date.now() - entry.timestamp
		)

		return {
			count: this.listeners.size,
			oldestAge: ages.length > 0 ? Math.max(...ages) : 0,
			newestAge: ages.length > 0 ? Math.min(...ages) : 0,
			averageAge:
				ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0
		}
	}
}
