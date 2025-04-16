import fg from "fast-glob"
import { getTxt } from "../get"

export async function GET() {
	const paths = await fg(["content/**/*.mdx"])
	return getTxt(paths)
}
