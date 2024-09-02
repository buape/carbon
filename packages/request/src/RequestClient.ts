import { DiscordError } from "./errors/DiscordError.js"
import { RateLimitError } from "./errors/RatelimitError.js"

/**
 * The options used to initialize the RequestClient
 */
export type RequestClientOptions = {
	/**
	 * The header used to send the token in the request.
	 * This should generally always be "Bot" unless you are working with OAuth.
	 *
	 * @default "Bot"
	 */
	tokenHeader?: "Bot" | "Bearer"
	/**
	 * The base URL of the API.
	 * @default https://discord.com/api
	 */
	baseUrl?: string
	/**
	 * The version of the API to use.
	 * @default 10
	 */
	apiVersion?: number
	/**
	 * The user agent to use when making requests.
	 * @default DiscordBot (https://github.com/buape/carbon, v0.0.0)
	 */
	userAgent?: string
	/**
	 * The timeout for requests.
	 * @default 15000
	 */
	timeout?: number
	/**
	 * Whether or not to queue requests if you are rate limited.
	 * If this is true, requests will be queued and wait for the ratelimit to clear.
	 * If this is false, requests will be made immediately and will throw a RateLimitError if you are rate limited.
	 *
	 * @default true
	 */
	queueRequests?: boolean
}

const defaultOptions: Required<RequestClientOptions> = {
	tokenHeader: "Bot",
	baseUrl: "https://discord.com/api",
	apiVersion: 10,
	userAgent: "DiscordBot (https://github.com/buape/carbon, v0.0.0)",
	timeout: 15000,
	queueRequests: true
}

export type QueuedRequest = {
	method: string
	path: string
	data?: RequestData
	resolve: (value?: unknown) => void
	reject: (reason?: unknown) => void
}

export type RequestData = {
	body?: unknown
	files?: Attachment[]
	rawBody?: boolean
}

export type Attachment = {
	id?: string
	name: string
	data: Blob
}

/**
 * This is the main class that handles making requests to the Discord API.
 * It is used internally by Carbon, and you should not need to use it directly, but feel free to if you feel like living dangerously.
 */
export class RequestClient {
	/**
	 * The options used to initialize the client
	 */
	readonly options: RequestClientOptions
	protected queue: QueuedRequest[] = []
	private token: string
	private rateLimitResetTime: number
	private abortController: AbortController | null = null

	constructor(token: string, options?: RequestClientOptions) {
		this.token = token
		this.options = {
			...defaultOptions,
			...options
		}
		this.rateLimitResetTime = 0
	}

	private async waitForRateLimit() {
		const delay = this.rateLimitResetTime - Date.now()
		if (delay > 0) {
			await new Promise((resolve) => setTimeout(resolve, delay))
		}
	}

	async get(path: string) {
		return await this.request("GET", path)
	}

	async post(path: string, data?: RequestData) {
		return await this.request("POST", path, data)
	}

	async patch(path: string, data?: RequestData) {
		return await this.request("PATCH", path, data)
	}

	async put(path: string, data?: RequestData) {
		return await this.request("PUT", path, data)
	}

	async delete(path: string, data?: RequestData) {
		return await this.request("DELETE", path, data)
	}
	private async request(
		method: string,
		path: string,
		data?: RequestData
	): Promise<unknown> {
		if (this.options.queueRequests) {
			return new Promise((resolve, reject) => {
				this.queue.push({ method, path, data, resolve, reject })
				this.processQueue()
			})
		}
		return new Promise((resolve, reject) => {
			this.executeRequest({ method, path, data, resolve, reject })
				.then(resolve)
				.catch((err) => {
					reject(err)
				})
		})
	}

	private async executeRequest(request: QueuedRequest): Promise<unknown> {
		await this.waitForRateLimit()

		const { method, path, data } = request
		const url = `${this.options.baseUrl}${path}`
		const headers = new Headers({
			Authorization: `${this.options.tokenHeader} ${this.token}`,
			...(data?.files ? {} : { "Content-Type": "application/json" })
		})
		this.abortController = new AbortController()
		let body: BodyInit | undefined

		if (data?.files != null) {
			const formData = new FormData()

			for (const [index, file] of data.files.entries()) {
				let { data: fileData } = file

				if (!(fileData instanceof Blob)) {
					fileData = new Blob([fileData])
				}

				formData.append(`files[${file.id ?? index}]`, fileData, file.name)
			}

			if (data.body != null) {
				formData.append("payload_json", JSON.stringify(data.body))
			}

			body = formData
		} else if (data?.body != null) {
			if (data.rawBody) {
				body = data.body as unknown as BodyInit
			} else {
				body = JSON.stringify(data.body)
			}
		}

		const response = await fetch(url, {
			method,
			headers,
			body,
			signal: this.abortController.signal
		})

		if (response.status === 429) {
			const responseBody = await response.json()
			const rateLimitError = new RateLimitError(response, responseBody)
			if (this.options.queueRequests) {
				const rateLimitResetTime =
					Number(response.headers.get("Retry-After")) * 1000
				this.rateLimitResetTime = Date.now() + rateLimitResetTime
				if (rateLimitError.scope === "global") {
					await new Promise((res) => setTimeout(res, rateLimitResetTime))
					this.queue.unshift(request)
				}
			}
			throw rateLimitError
		}

		if (response.status >= 400 && response.status < 600) {
			throw new DiscordError(response, await response.json())
		}

		try {
			return await response.json()
		} catch (err) {
			if (err instanceof SyntaxError) {
				// If there is no JSON
				return await response.text()
			}
			throw err
		}
	}

	private async processQueue() {
		if (this.queue.length === 0) return

		const queueItem = this.queue.shift()
		if (!queueItem) return

		const { method, path, data, resolve, reject } = queueItem

		try {
			const result = await this.executeRequest({
				method,
				path,
				data,
				resolve,
				reject
			})
			resolve(result)
		} catch (error) {
			if (
				error instanceof RateLimitError &&
				this.options.queueRequests &&
				error.scope === "global"
			) {
				this.queue.unshift(queueItem)
			} else {
				if (error instanceof Error) {
					reject(error)
				} else {
					reject(new Error("Unknown error during request", { cause: error }))
				}
			}
		} finally {
			this.abortController = null
			this.processQueue()
		}
	}

	abortAllRequests() {
		if (this.abortController) {
			this.abortController.abort()
		}
		this.queue = []
	}
}
