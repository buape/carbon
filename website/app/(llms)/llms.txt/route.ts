import fg from "fast-glob"
import { getTxt } from "../get"

export async function GET() {
	const paths = await fg(["content/**/*.mdx"])
	const docs = paths.filter((x) => !x.startsWith("content/api"))
	return getTxt(docs)
}
