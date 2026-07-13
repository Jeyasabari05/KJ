/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                govBlue: {
                    light: '#f0f5ff',
                    DEFAULT: '#003399', // TN Gov e-Sevai Blue
                    dark: '#002266',
                },
                govGreen: {
                    light: '#f0fdf4',
                    DEFAULT: '#0f766e', // NHM Deep Teal Green
                    dark: '#115e59',
                },
                govOrange: {
                    DEFAULT: '#ea580c', // Minimal orange warning
                },
                govGrey: {
                    light: '#f3f4f6',
                    DEFAULT: '#6b7280',
                }
            },
            fontFamily: {
                sans: ['Excon', 'Inter', 'Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
