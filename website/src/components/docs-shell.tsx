import { Outlet } from "react-router"
import { Sidebar } from "./sidebar"

export function DocsShell() {
	return (
		<div className="docs-shell">
			<Sidebar />
			<main className="docs-main">
				<Outlet />
			</main>
		</div>
	)
}
