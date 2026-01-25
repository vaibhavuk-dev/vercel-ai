"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="p-2 rounded-lg bg-ghost hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <span className="w-5 h-5 block" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-foreground"
            title="Toggle theme"
        >
            {theme === "dark" ? (
                <Moon className="w-5 h-5" />
            ) : (
                <Sun className="w-5 h-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
