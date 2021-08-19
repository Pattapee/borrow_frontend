angular.module("borrows").config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state("index", {
      url: "/",
      templateUrl: "/modules/borrow/managementborrow/borrow-view.html"
    });
    $stateProvider.state("statusborrow", {
      url: "/statusborrow",
      templateUrl: "/modules/borrow/managementborrow/statusborrow-view.html"
    });
    $stateProvider.state("typeborrow", {
      url: "/typeborrow",
      templateUrl: "/modules/borrow/managementborrow/typeborrow-view.html"
    });
    $stateProvider.state("accessdenied", {
      templateUrl: "/modules/borrow/managementborrow/accessdenied-view.html"
    });

  }
]);
