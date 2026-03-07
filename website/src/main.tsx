import { MDXProvider } from "@mdx-js/react"
import { createRoot } from "react-dom/client"
import { mdxComponents } from "./components/mdx-components"
import { AppRouter } from "./router"
import "./styles.css"

const root = document.getElementById("root")
if (!root) throw new Error("Failed to find root element")

createRoot(root).render(
	<MDXProvider components={mdxComponents}>
		<AppRouter />
	</MDXProvider>
)
