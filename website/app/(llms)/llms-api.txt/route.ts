import { getTxt } from "../get"
import fg from "fast-glob"

export async function GET() {
	const paths = await fg(["content/api/**/*.mdx"])
	return getTxt(paths)
}
