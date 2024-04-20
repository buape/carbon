import { existsSync, mkdirSync, readdirSync } from "node:fs"

/**
 * Get all the files in all the subdirectories of a directory.
 * @param directory - The directory to get the files from.
 * @param fileExtension - The extension to search for.
 * @param createDirIfNotFound - Whether or not the parent directory should be created if it doesn't exist.
 * @returns The files in the directory.
 */
export const getFiles = (
	directory: string,
	fileExtension: string,
	createDirIfNotFound = false
): string[] => {
	if (createDirIfNotFound && !existsSync(directory)) mkdirSync(directory)
	return readdirSync(directory).filter((file) => file.endsWith(fileExtension))
}
