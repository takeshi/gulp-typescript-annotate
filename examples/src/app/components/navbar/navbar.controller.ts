module examples {
  'use strict';

  interface INavbarScope extends ng.IScope {
    date: Date
  }

  @Component
  export class NavbarCtrl {
    constructor ($scope: INavbarScope) {
      $scope.date = new Date();
    }
  }

}
