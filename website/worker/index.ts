export default {
	async fetch(request: Request) {
		const url = new URL(request.url)

		if (url.pathname === "/api/health") {
			return new Response(JSON.stringify({ ok: true }), {
				headers: { "content-type": "application/json" }
			})
		}

		return new Response("Not Found", { status: 404 })
	}
}
