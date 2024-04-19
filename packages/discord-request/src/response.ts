export async function parse(response: Response) {
	if (response.headers.get("Content-Type") === "application/json") {
		return response.json()
	}

	return response.arrayBuffer()
}
