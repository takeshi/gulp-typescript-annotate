/// <reference path="../../.tmp/typings/tsd.d.ts" />

module examples {
    'use strict';

    var module = angular.module('examples', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router']);


    function removeCtrl(name: string) {
        return name.replace(/Controller/, '').replace(/Ctrl$/,'');
    }

    function toFirstLowerCase(name: string) {
        return name.toLowerCase()[0] + name.substring(1);
    }

    export function State(state: ng.ui.IState) {
        return function(clazz: any) {
            module.controller(clazz.$className, clazz);
            module.config(function($stateProvider: ng.ui.IStateProvider) {
             var name = toFirstLowerCase(clazz.$className);
             name = removeCtrl(name);
             state.controller = clazz.$className;
             state.controllerAs = name;
             state.templateUrl = 'app/' + state.name + '/' + name + '.html';
             $stateProvider.state(state);
            });
        }
    }

    export function Component(clazz:any){
     module.controller(clazz.$className, clazz);
     var name = toFirstLowerCase(clazz.$className);
     name = removeCtrl(name);
     module.directive(name,()=>{
      return {
       templateUrl:'app/components/' + name + '/' + name +'.html',
       controller:clazz.$className,
       controllerName:name
      }
     });
    }

    module.config(function($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });

}
