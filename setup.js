const {existsSync, mkdirSync} = require("fs");

[
    "./store",
    "./log",
    "./cert",
    "./public"

].forEach(function(dir){

    if(!existsSync(dir)){

        mkdirSync(dir);
    }
});