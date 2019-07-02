const config = {
  pages: [
    {
      file: 'index.html',
      template: 'index.ejs',
      entry: {'index': './src/js/pages/index.js'},
      chunks: ['main', 'index'],
      title: 'My index page',
      meta: {
        description: 'Great meta description'
      }
    }
  ]
};

export default config;
