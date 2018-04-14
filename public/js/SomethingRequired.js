console.log('finally imported');
//imagine this is the main library connected to the config used by requirejs
//all defines can call other defines but you must assign it in config file
define(['require','./methods'],function (require) {//the name require is needed
    console.log('defined');
    //here you do your additional imports if you want to acccess it 
    var namedModule = require('./methods');
    namedModule.somemethod();//to call function of another defined
    namedModule.somemethod2(' some paramsz');//with paramz
});