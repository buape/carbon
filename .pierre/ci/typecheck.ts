import { run } from "pierre"

export const label = "Typechecks"

export default async () => {
	await run(`pnpm run typecheck`)
}
