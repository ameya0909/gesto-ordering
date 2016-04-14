angular.module('menuService', [])

    // super simple service
    // each function returns a promise object 
    .factory('Menu', ['$http',function($http) {
        return {
            get : function() {
                return $http.get('/api/menu');
            }
        }
    }]);