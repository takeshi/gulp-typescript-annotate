var source = "\nlet Controller = (clazz:any)=>{\n   angular.module('sample')\n     .controller(clazz.$className,class);\n}\n\n@Controller\nclass TestController{\n\n   date:Date;\n\n   constructor(public $q:angular.IQService){\n     this.date = new Date();\n   }\n\n}\n\n";
var class_modify_1 = require('../lib/class-modify');
console.log(class_modify_1.transform(source));
