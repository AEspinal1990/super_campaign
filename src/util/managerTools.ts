import * as fs from 'fs';


let rawdata = fs.readFileSync('../globals.json');
// @ts-ignore - [ts] Argument of type 'Buffer' is not assignable to parameter of type 'string'.
let globals = JSON.parse(rawdata);

console.log(globals);