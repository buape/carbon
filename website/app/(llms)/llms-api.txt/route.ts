import fg from "fast-glob"
import { getTxt } from "../get"

export async function GET() {
	const paths = await fg(["content/api/**/*.mdx"])
	return getTxt(paths)
}
