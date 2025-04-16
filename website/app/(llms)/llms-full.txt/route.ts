import { getTxt } from "../get"
import fg from "fast-glob"

export async function GET() {
	const paths = await fg(["content/**/*.mdx"])
	return getTxt(paths)
}
