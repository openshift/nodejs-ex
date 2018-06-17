//example of merging libraries by using require to add more build based dependacies
//think of this is where you put all your libraries and imagine this is the main that will be build by webpack see at package.json
//theirs a library to recursivly search require but we rather have control with the specifics which is used and not
require('./tryingwebpack2')
console.log('webpack main library  worked');

