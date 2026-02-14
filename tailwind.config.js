/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Rye"', 'serif'],
                sans: ['"Courier Prime"', 'monospace'], // Fallback for documents
            },
            colors: {
                ink: '#1a1614',
                paper: '#dcb878',
                'paper-light': '#e6dcc3',
                rust: '#b05a39',
                blood: '#781e1e',
                charcoal: '#262220',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease-out',
                slideDown: 'slideDown 0.3s ease-out',
            }
        },
    },
    plugins: [],
}
