let source = `
let Controller = (clazz:any)=>{
   angular.module('sample')
     .controller(clazz.$className,class);
}

@Controller
class TestController{

   date:Date;

   constructor(public $q:angular.IQService){
     this.date = new Date();
   }

}

`
import {transform} from '../lib/class-modify';

console.log(transform(source));
