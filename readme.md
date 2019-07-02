## Multipage Webpack Starter Kit

Setting up Webpack for your new project can be a nightmare. 

This template aims to get you up and running with a best in class setup that covers all the features a modern multipage website needs.

### Out of the box you will get:
- HTML partials and optimisation with EJS templates
- Sass compilation
- Automatic creation of WebP and fallback images
- Optimisation of all images based on format 
- ES6 compilation to all browsers
- Cache busting with file hashes 

### Configuration

Editing the `./config.js` file you may configure your project and define the entry points and bundles for each of the HTML pages you will be building. 

**You should never need to modify the `webpack.babel.js` configuration file directly.**


### File structure

For each page, you will likely want a standalone `.ejs` template as well as a specific `.js` file and a specific `.scss` file.

For example, to create a page called `about-us.html` I would create the following in the `./src` directory:

    ./src/pages/about-us.ejs
    ./src/js/pages/about-us.js
    ./src/scss/pages/about-us.scss
    
In the root `./config.js` file I would add an entry to the pages array that looks like:
    
        {
          file: 'about-us.html',
          template: 'about-us.ejs',
          entry: {'about-us': './src/js/pages/about-us.js'},
          chunks: ['main', 'about-us'],
          title: 'My about page'
        }
       

### Concepts
Below are the suggested concepts for making the most of the optimisations and plugins included in this build package.

#### HTML picture element (using webp)
Using the HTML picture element we can utilise webp assets while providing a fallback to older browsers. 

Below is the picture tag from the example `index.ejs` file. 

    <picture>
        <source srcset="/img/large-image-example.webp" type="image/webp">
        <source srcset="/img/large-image-example.png" type="image/jpeg">
        <img class="image-example" src="<%- require('../assets/img/large-image-example.png')%>" alt="">
    </picture>
         
Notice that we require the source image in the standard `img` tag and then hardcode the pictures' source tags, this is an important step to clue webpack to process the image.

#### CSS bundling
We are not including any css frameworks (thank you flex) and so our CSS files are tiny. 
Because of this we bundle our styles into one file to reduce HTTP requests.

Don't forget to append your page specific `scss` files to the `./src/scss/app.scss` file like the example page:

    @import 'pages/index';

#### Image inliner
Any image which is under 8kb will be converted to base64 and included inline. 
This happens automatically as long as images are required like the logo example:

    <img src="<%- require('../assets/img/logo.png')%>" alt="">    

#### Favicon
Currently the `./favicon.png` in the root of the project is built into all known types of favicon.

The meta tags are added automatically to each page. Just update the image file to your own icon at least 512px square.
   
### Usage

`npm run dev` - Start a development server on localhost

`npm run build` - Create a production build in the `./dist` folder

`npm run lint` - Runs the eslint autofixer which cleans up source files

Built with :rage: 
