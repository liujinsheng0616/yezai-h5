/**
 * Created by kingson·liu on 16/12/16.
 */
goceanApp.controller('HelloCtrl', function ($scope, $state, $timeout, $stateParams) {
    $scope.name = $stateParams.name;
});
