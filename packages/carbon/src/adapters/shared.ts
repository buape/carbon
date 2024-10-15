export type PartialEnv = Record<string, string | undefined>

// biome-ignore lint/suspicious/noEmptyInterface: future-proofing
export interface SharedOptions {}

export interface ServerOptions extends SharedOptions {
	port: number
	hostname?: string
}

export interface HandlerOptions extends SharedOptions {}
