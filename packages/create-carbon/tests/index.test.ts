import { expect, test } from "vitest"
import { hello } from "../src"

test("It works", () => expect(hello()).toBe("Hello world"))
