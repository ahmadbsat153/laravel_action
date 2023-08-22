const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
        
    ],

    theme: {
        extend: {
            backgroundImage: {
                loginbackground:
                    "url('/resources/js/assets/backgrounds/loginBackground.webp')",
                header:"url('/resources/js/assets/backgrounds/backgroundop.webp')",
                world:"url('/resources/js/assets/backgrounds/world.webp')",
                career:"url('/resources/js/assets/pictures/careersvector.webp')",
                tiremark:"url('/resources/js/assets/backgrounds/tiremark.webp')"
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                "goldt2" : "#ebcb7a",
                goldt:"#ebcb7a",
                goldd:"#e2b540",
                goldo:"#f1dba238",
                goldl:"#f1dba2",  // customColor is the name of the color
                dark: "#1A1E21",
                smooth:"#f6f8f9"
            },
            animation: {
                bounce200: 'bounce 1s infinite 200ms',
                bounce400: 'bounce 1s infinite 400ms',
            },
        },
    },

    plugins: [
        require("@tailwindcss/forms"),
        require('@tailwindcss/line-clamp'),
        require("@tailwindcss/aspect-ratio"),
        require('tailwindcss-animated'),
    ],
};
