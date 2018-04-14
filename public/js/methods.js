console.log('methods some dependable libray or custom library');
//all defines can call other defines but you must assign it in config file
//imagine this is the end of the file or some seperated functionality of a custom library or a dependable library
define(function(require) {//the name require is needed
    'use strict';
    var methods ={};
    methods.somemethod=function somefun(){
        console.log('someFunction');
    }
    methods.somemethod2=function somefun2(args){
        console.log('someFunction with params '+args);
    }
    return methods;
});
