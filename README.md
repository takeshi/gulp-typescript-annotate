# gulp-typescript-annotate
gulp plugin to append class name & constructor parameter names  to TypeScript CLass. Appended class name & constructor parameter names are useful to minimized AngularJs Dependency Injection.

## Motivation
Working with TypeScript 1.5 Decorator, we can write component-based programing code for AngularJS.

```typescript:Input
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
```

gulp-typescript-annotate append $className and $inject.

```tyepscript:Output
let Controller = (clazz:any)=>{
   angular.module('sample')
     .controller(clazz.$className,class);
}

@Controller
class TestController{

   date:Date;

   constructor(public $q:angular.IQService){
     this.date = new Date();
   }/*<generated>*/static $className = 'TestController';static $inject = ['$q'];/*</generated>*/

}
```

### [see more examples](https://github.com/takeshi/gulp-typescript-annotate/blob/master/examples)


## Install
Install with [npm](https://npmjs.org/package/gulp-typescript-annotate)

```
$ npm install gulp-typescript-annotate
```

## Usage
### Modify gulpfile.js
Add gulp-typescript-annotate plugin to gulp pipe before gulp-typescript plugin.

```javascript
var gulp = require('gulp');

var typescript = require('gulp-typescript');
var typescriptAnnotate = require('gulp-typescript-annotate');

gulp.task('scripts', function () {
  return gulp.src('./**/*.ts')
    .pipe(typescriptAnnotate())
    .pipe(typescript())
    .pipe(gulp.dest('./dist'));
});
```
