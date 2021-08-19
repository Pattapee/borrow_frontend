angular.module("httpHeaders").service("httpHeadersService", ['$localStorage', function ($localStorage) {

  this.setHttpHeaders = function(http) {
    return http;
  };

}]);
