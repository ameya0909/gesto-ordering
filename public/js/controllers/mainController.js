angular.module('mainController', [])

    // inject the Foods and Menu service factories into our controller
    .controller('mainController', ['$scope', '$http', 'Foods', 'Menu', function ($scope, $http, Foods, Menu) {
        $scope.formData = {};
        $scope.loading = true;

        // GET =====================================================================
        // when landing on the page, get all foods and show them
        // use the service to get all the foods
        Foods.get()
            .success(function(data) {
                $scope.foods = data;
                $scope.loading = false;
            });

        Menu.get()
            .success(function (data) {
                $scope.menu = data;
                $scope.loading = false;
            });


        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createOrder = function() {

            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.item != undefined) {
                $scope.loading = true;
                //console.log($scope.item.name);
                // call the create function from our service (returns a promise object)
                Foods.create($scope.item)

                    // if successful creation, call our get function to get all the new foods
                    .success(function(data) {
                        $scope.loading = false;
                        //$scope.formData = {}; // clear the form so our user is ready to enter another
                        //console.log(data);
                        $scope.foods = data; // assign our new list of foods
                        $scope.calculateTotal();
                    });
            }
        };

        // DELETE ==================================================================
        // delete a food after checking it
        $scope.deleteFood = function (id) {
            $scope.loading = true;

            Foods.delete(id)
                // if successful creation, call our get function to get all the new foods
                .success(function (data) {
                    $scope.loading = false;
                    $scope.foods = data; // assign our new list of foods
                    $scope.calculateTotal();
                    if ($scope.foods.length === 0) {
                        $scope.item.name = "Pizza";
                        $scope.item.quantity = 1;
                    }
                });
        };

        //TOTAL
        // calculate order total
        $scope.calculateTotal = function () {
            $scope.loading = true;

            Foods.calculate()
                .success(function (data) {
                    $scope.loading = false;
                    $scope.total = data; // assign our new list of foods
                });
        };

        // DELETE ==================================================================
        // delete entire order
        $scope.clearOrder = function (id) {
            $scope.loading = true;

            Foods.clear(id)
                // if successful creation, call our get function to get all the new foods
                .success(function (data) {
                    $scope.loading = false;
                    $scope.foods = data; // assign our new list of foods
                    $scope.calculateTotal();
                    $scope.item.name = "Pizza";
                    $scope.item.quantity = 1;
                });
        };
    }]);