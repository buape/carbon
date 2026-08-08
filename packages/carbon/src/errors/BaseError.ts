export class BaseError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options)
		this.name = new.target.name
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message
		}
	}
}
