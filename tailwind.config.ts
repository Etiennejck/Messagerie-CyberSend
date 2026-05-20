import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#020403",
        terminal: "#05ff8a",
        cyanwire: "#22d3ee",
        neonviolet: "#a855f7",
        panel: "#06110d",
        phosphor: "#d6ffe9"
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      boxShadow: {
        terminal: "0 0 0 1px rgba(5, 255, 138, 0.14), 0 18px 70px rgba(0, 0, 0, 0.45), 0 0 34px rgba(5, 255, 138, 0.16), inset 0 0 28px rgba(34, 211, 238, 0.055)",
        command: "0 0 18px rgba(34, 211, 238, 0.20)",
        focusRing: "0 0 0 3px rgba(34, 211, 238, 0.18), 0 0 26px rgba(34, 211, 238, 0.16)"
      },
      animation: {
        blink: "blink 1s steps(2, start) infinite",
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite",
        scan: "scan 8s linear infinite"
      },
      keyframes: {
        blink: {
          "0%, 45%": { opacity: "1" },
          "46%, 100%": { opacity: "0" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.76" },
          "50%": { opacity: "1" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
