/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
            colors: {
                white: "#FAF8FD",
                violet_1: "#DC97FF",
                violet_2: "#BD68EE",
                violet_3: "#8B2FC9",
                violet_4: "#5A108F",
                bg_secondary: "#DAB6FC",
            },
            backgroundImage: {
                // "custom-gradient":
                //   "linear-gradient(135deg, #7B2CEF 0%, #4f1cd9 50%, #1d1d26 100%)",
                "purple-image":
                    "url('https://i.pinimg.com/736x/72/cd/84/72cd84d197d7e52728d5a3917b7fac18.jpg')",
            },
        },
    },
    plugins: [],
};
