import type { MessagePayloadFile } from "../types/index.js"

export type SerializableRequestData = {
	body?: unknown
	rawBody?: boolean
}

export function serializeRequestBody(
	data: SerializableRequestData | undefined,
	headers: Headers
): BodyInit | undefined {
	if (data?.body && typeof data.body === "object") {
		const bodyObject = data.body as Record<string, unknown>
		const topLevelFiles =
			"files" in bodyObject
				? (bodyObject.files as MessagePayloadFile[] | undefined)
				: undefined
		const nestedData =
			"data" in bodyObject &&
			bodyObject.data &&
			typeof bodyObject.data === "object"
				? (bodyObject.data as Record<string, unknown>)
				: undefined
		const nestedFiles =
			nestedData && "files" in nestedData
				? (nestedData.files as MessagePayloadFile[] | undefined)
				: undefined

		let payloadJson: Record<string, unknown> | null = null
		let filesContainer: Record<string, unknown> | null = null
		let files: MessagePayloadFile[] = []

		if (topLevelFiles !== undefined) {
			payloadJson = { ...bodyObject }
			filesContainer = payloadJson
			files = topLevelFiles ?? []
		} else if (nestedFiles !== undefined && nestedData) {
			payloadJson = { ...bodyObject, data: { ...nestedData } }
			filesContainer = payloadJson.data as Record<string, unknown>
			files = nestedFiles ?? []
		}

		if (payloadJson && filesContainer && files.length > 0) {
			const formData = new FormData()
			const existingAttachments = Array.isArray(filesContainer.attachments)
				? [...(filesContainer.attachments as Array<Record<string, unknown>>)]
				: []

			const uploadedAttachments: Array<Record<string, unknown>> = []
			for (const [index, file] of files.entries()) {
				let { data: fileData } = file
				if (!(fileData instanceof Blob)) {
					fileData = new Blob([fileData])
				}

				const attachmentId = existingAttachments.length + index
				formData.append(`files[${attachmentId}]`, fileData, file.name)
				uploadedAttachments.push({
					id: attachmentId,
					filename: file.name,
					...(file.description !== undefined
						? { description: file.description }
						: {}),
					...(file.duration_secs !== undefined
						? { duration_secs: file.duration_secs }
						: {}),
					...(file.waveform !== undefined ? { waveform: file.waveform } : {})
				})
			}

			filesContainer.attachments = [
				...existingAttachments,
				...uploadedAttachments
			]
			delete filesContainer.files

			formData.append("payload_json", JSON.stringify(payloadJson))
			return formData
		}

		headers.set("Content-Type", "application/json")
		return data.rawBody
			? (data.body as unknown as BodyInit)
			: JSON.stringify(data.body)
	}

	if (data?.body != null) {
		headers.set("Content-Type", "application/json")
		return data.rawBody
			? (data.body as unknown as BodyInit)
			: JSON.stringify(data.body)
	}

	return undefined
}
