/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        meta: {
          primary: '#1877F2',   // Meta blue
          secondary: '#42B72A', // Meta green
          background: '#F5F6F7',
          text: {
            primary: '#1C1E21',
            secondary: '#65676B'
          },
          border: '#CED0D4'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Oxygen', 
          'Ubuntu', 
          'Cantarell', 
          'Open Sans', 
          'Helvetica Neue', 
          'sans-serif'
        ]
      },
      boxShadow: {
        'meta-light': '0 1px 2px rgba(0,0,0,0.1)',
        'meta-hover': '0 2px 4px rgba(0,0,0,0.1)'
      },
      borderRadius: {
        'meta': '8px'
      }
    }
  },
  plugins: []
};
