"use strict"
angular.module("borrows").controller("loginController", [
  "lodash",
  "$scope",
  "$state",
  "borrowService",
  "$timeout",
  function (_, $scope, $state, borrowService, action) {

    this.initalRunModal = () => {
      $('#myModal').modal('show')
    }
    this.closefn = async () => {
      await window.location.reload()
    }
  }
])
