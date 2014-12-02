var json = require('./gulp/util/readJsonFiles');

var result = json.getArray("test/data", false);
console.log("Array", result);

result = json.getArray("test/data", true);
console.log("Flat Array", result);

result = json.getObject("test/data");
console.log("Object", result);