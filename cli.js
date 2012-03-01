var Optimizer = require('./optimizer').Optimizer;

function main(path)
{   
    optimizer = new Optimizer;
    var result = optimizer.optimize(path);
    console.log(result);
 }

if (process.argv.length !== 3)
{   
    console.log("usage:");
    console.log("    node optimize.js [javascript-source-path]");
}
else
{   
     main(process.argv[2]);
}
