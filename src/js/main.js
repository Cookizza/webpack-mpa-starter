// Import any global libs required here and they will be available in all other JS files
import $ from 'jquery';

// Root scss imported here to be picked up by webpack and extracted
require('../scss/main.scss');

window.jQuery = $;
window.$ = $;
