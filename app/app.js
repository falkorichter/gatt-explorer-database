'use strict';

angular.module('gattApp', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'index.html',
                controller: 'scripts/gattController',
                controllerAs: 'main'
            })
    });
