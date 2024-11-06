
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Nếu dự án của bạn nằm trong thư mục src
    "./app/**/*.{js,ts,jsx,tsx}", // Nếu bạn sử dụng thư mục app
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

