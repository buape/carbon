export async function parse(response: Response): Promise<ArrayBuffer | JSON> {
	if (response.headers.get("Content-Type") === "application/json") {
		return response.json()
	}

	return response.arrayBuffer()
}
