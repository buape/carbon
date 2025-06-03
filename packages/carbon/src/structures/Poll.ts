import {
	type APIMessage,
	type APIPoll,
	type APIPollAnswer,
	type APIUser,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { Message } from "../index.js"
import { User } from "./User.js"

export class Poll extends Base {
	private channelId: string
	private messageId: string
	protected _rawData: APIPoll

	constructor(
		client: Client,
		{
			channelId,
			messageId,
			data
		}: { channelId: string; messageId: string; data: APIPoll }
	) {
		super(client)
		this.channelId = channelId
		this.messageId = messageId
		this._rawData = data
	}

	get rawData(): Readonly<APIPoll> {
		if (!this._rawData) throw new Error("Cannot get data without having data... smh")
		return this._rawData;
	}

	get question() {
		return this._rawData.question
	}

	get answers(): ReadonlyArray<APIPollAnswer> {
		return this._rawData.answers
	}

	get allowMultiselect(): boolean {
		return this._rawData.allow_multiselect
	}

	get layoutType(): APIPoll["layout_type"] {
		return this._rawData.layout_type
	}

	get results(): APIPoll["results"] | undefined {
		return this._rawData.results
	}

	get expiry(): string {
		return this._rawData.expiry
	}

	get isFinalized(): boolean {
		return this._rawData.results !== undefined
	}

	async getAnswerVoters(answerId: number): Promise<User[]> {
		const usersData = (await this.client.rest.get(
			Routes.pollAnswerVoters(this.channelId, this.messageId, answerId)
		)) as { users: APIUser[] }
		return usersData.users.map((userData) => new User(this.client, userData))
	}

	async end(): Promise<Message<false>> {
		const updatedMessage = (await this.client.rest.post(
			Routes.expirePoll(this.channelId, this.messageId),
			{}
		)) as APIMessage
		return new Message(this.client, updatedMessage)
	}
}
