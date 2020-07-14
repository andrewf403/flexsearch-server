const {existsSync, mkdirSync} = require("fs");

[
    "./log",
    "./cert",
    "./public"

].forEach(function(dir){

    if(!existsSync(dir)){

        mkdirSync(dir);
    }
});