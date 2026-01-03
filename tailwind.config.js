/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)'],
                serif: ['var(--font-serif)'],
            },
            colors: {
                blue: {
                    50: '#eff6ff',
                    500: '#3B82F6',
                    600: '#2563eb',
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
