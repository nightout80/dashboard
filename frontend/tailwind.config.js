/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                whoop: {
                    red: '#FF3B30',
                    green: '#34C759',
                    yellow: '#FFCC00'
                }
            }
        },
    },
    plugins: [],
}
