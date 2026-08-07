import { PermissionFlagsBits } from "discord-api-types/v10"
export const Permission = PermissionFlagsBits

export const maxPermissions = Object.values(Permission)
export const allPermissions = maxPermissions.reduce(
	(permissions, permission) => permissions | permission,
	0n
)

export class PermissionsBitField {
	constructor(readonly value: bigint) {}

	has(permission: bigint | bigint[]) {
		const permissions = Array.isArray(permission) ? permission : [permission]
		return permissions.every(
			(permissionToCheck) =>
				(this.value & permissionToCheck) === permissionToCheck
		)
	}

	toString() {
		return this.value.toString()
	}

	valueOf() {
		return this.value
	}
}
