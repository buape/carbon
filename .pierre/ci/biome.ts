import { run } from "pierre";

export const label = "Run Biome";

export default async () => {
	await run(`biome ci .`);
};