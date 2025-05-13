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
	private rawData: APIPoll

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
		this.rawData = data
	}

	get question() {
		return this.rawData.question
	}

	get answers(): ReadonlyArray<APIPollAnswer> {
		return this.rawData.answers
	}

	get allowMultiselect(): boolean {
		return this.rawData.allow_multiselect
	}

	get layoutType(): APIPoll["layout_type"] {
		return this.rawData.layout_type
	}

	get results(): APIPoll["results"] | undefined {
		return this.rawData.results
	}

	get expiry(): string {
		return this.rawData.expiry
	}

	get isFinalized(): boolean {
		return this.rawData.results !== undefined
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
