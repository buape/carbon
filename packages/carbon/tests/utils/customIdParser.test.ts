import { describe, expect, test } from "vitest"
import { parseCustomId } from "../../src/utils/customIdParser.js"

describe("parseCustomId", () => {
	test("parses simple key without data", () => {
		const result = parseCustomId("mykey")
		expect(result).toEqual({
			key: "mykey",
			data: {}
		})
	})

	test("parses key with empty data", () => {
		const result = parseCustomId("mykey:")
		expect(result).toEqual({
			key: "mykey",
			data: {}
		})
	})

	test("parses single key-value pair", () => {
		const result = parseCustomId("mykey:arg1=value1")
		expect(result).toEqual({
			key: "mykey",
			data: { arg1: "value1" }
		})
	})

	test("parses multiple semicolon-delimited pairs", () => {
		const result = parseCustomId("mykey:arg1=true;arg2=2;arg3=cheese")
		expect(result).toEqual({
			key: "mykey",
			data: {
				arg1: true,
				arg2: 2,
				arg3: "cheese"
			}
		})
	})

	test("handles boolean values", () => {
		const result = parseCustomId("test:enabled=true;disabled=false")
		expect(result).toEqual({
			key: "test",
			data: {
				enabled: true,
				disabled: false
			}
		})
	})

	test("handles numeric values", () => {
		const result = parseCustomId("test:count=42;price=19.99;negative=-5")
		expect(result).toEqual({
			key: "test",
			data: {
				count: 42,
				price: 19.99,
				negative: -5
			}
		})
	})

	test("preserves empty string values", () => {
		const result = parseCustomId("test:empty=;nonempty=value")
		expect(result).toEqual({
			key: "test",
			data: {
				empty: "",
				nonempty: "value"
			}
		})
	})

	test("handles keys without values (missing =)", () => {
		const result = parseCustomId("test:flag1;flag2=value;flag3")
		expect(result).toEqual({
			key: "test",
			data: {
				flag1: "flag1",
				flag2: "value",
				flag3: "flag3"
			}
		})
	})

	test("handles keys with colons in data values", () => {
		const result = parseCustomId(
			"test:url=https://example.com:8080;time=12:30:45"
		)
		expect(result).toEqual({
			key: "test",
			data: {
				url: "https://example.com:8080",
				time: "12:30:45"
			}
		})
	})

	test("filters out empty pairs from trailing semicolons", () => {
		const result = parseCustomId("test:arg1=value1;;arg2=value2;")
		expect(result).toEqual({
			key: "test",
			data: {
				arg1: "value1",
				arg2: "value2"
			}
		})
	})

	test("handles complex mixed data types", () => {
		const result = parseCustomId(
			"complex:userId=123;admin=true;name=John Doe;score=95.5;empty=;flag"
		)
		expect(result).toEqual({
			key: "complex",
			data: {
				userId: 123,
				admin: true,
				name: "John Doe",
				score: 95.5,
				empty: "",
				flag: "flag"
			}
		})
	})

	test("throws error for empty key", () => {
		expect(() => parseCustomId("")).toThrow("Invalid component ID: ")
		expect(() => parseCustomId(":data")).toThrow("Invalid component ID: :data")
	})

	test("handles string that looks like number but has leading/trailing spaces", () => {
		const result = parseCustomId("test:num= 42 ;clean=42")
		expect(result).toEqual({
			key: "test",
			data: {
				num: 42, // Numbers with spaces get parsed as numbers
				clean: 42
			}
		})
	})

	test("handles long numeric strings (like Discord snowflake IDs) as strings", () => {
		const result = parseCustomId(
			"test:userId=123456789012345678;channelId=987654321098765432;small=123"
		)
		expect(result).toEqual({
			key: "test",
			data: {
				userId: "123456789012345678",
				channelId: "987654321098765432",
				small: 123
			}
		})
	})
})
