import { createBrowserRouter, Navigate } from "react-router"
import { RouterProvider } from "react-router/dom"
import { ApiPage } from "./components/api-page"
import { DocPage } from "./components/doc-page"
import { DocsShell } from "./components/docs-shell"
import { docsData } from "./content/docs-data"

const router = createBrowserRouter([
	{
		element: <DocsShell />,
		children: [
			{
				index: true,
				element: <Navigate to={`/${docsData.defaultSlug}`} replace />
			},
			{
				path: "api/*",
				element: <ApiPage />
			},
			{
				path: "*",
				element: <DocPage />
			}
		]
	}
])

export function AppRouter() {
	return <RouterProvider router={router} />
}
