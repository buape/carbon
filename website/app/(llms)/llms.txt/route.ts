import { getTxt } from "../get"
import fg from "fast-glob"

export async function GET() {
	const paths = await fg(["content/**/*.mdx"])
	const docs = paths.filter((x) => !x.startsWith("content/api"))
	return getTxt(docs)
}
