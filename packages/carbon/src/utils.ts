export const splitCustomId = (
	customId: string
): [string, Record<string, string>] => {
	const [id, ...args] = customId.split(":")
	if (!id) throw new Error("Invalid custom ID was provided")
	const data = Object.fromEntries(
		args.map((arg) => {
			const [key, value] = arg.split("=")
			return [key, value]
		})
	)
	return [id, data]
}
