module.exports = {
  proxy: {
    prefix: "/api",
    url: "http://localhost:7070",
  },
  plugins: [
    'gatsby-plugin-react-helmet'
  ]
};
