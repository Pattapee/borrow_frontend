angular.module("borrows").service("borrowService", [
  "lodash",
  "$localStorage",
  "$http",
  "$q",
  function (_, $localStorage, $http, $q) {
    var urlstatusborrow = "http://192.168.2.18:8080/statusborrow";
    var urlborrow = "http://192.168.2.18:8080/borrow";
    var urltypeborrow = "http://192.168.2.18:8080/typeborrow";
    var urlbhm = "http://192.168.2.18:8080/borrowhistorymoneyborrow";

    // Start Service Statusborrow //
    this.getAllStatus = async () => {
      try {
        return await $http.get(urlstatusborrow + "/getall");
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    this.createStatus = async (data) => {
      try {
        return await $http.post(urlstatusborrow + "/create", data);
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    this.deleteStatus = async (id) => {
      try {
        return await $http.delete(urlstatusborrow + "/delete/" + id);
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    this.getOneStatus = async (id) => {
      try {
        return await $http.get(urlstatusborrow + "/get/" + id);
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    this.editStatus = async (data) => {
      try {
        return await $http.put(urlstatusborrow + "/update", data);
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    // End Service Statusborrow //
    // Start Service typeborrow //
    this.getAllTypeborrow = async () => {
      try {
        return await $http.get(urltypeborrow + "/getall");
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    this.createTypeborrow = async (data) => {
      try {
        return await $http.post(urltypeborrow + "/create", data);
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    this.deleteTypeborrow = async (id) => {
      try {
        return await $http.delete(urltypeborrow + "/delete/" + id);
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    this.getOneTypeborrow = async (id) => {
      try {
        return await $http.get(urltypeborrow + "/get/" + id);
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    this.editTypeborrow = async (data) => {
      try {
        return await $http.put(urltypeborrow + "/update", data);
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    // End Service typeborrow //
    // Start Service Borrow //
    this.getAllBorrow = async () => {
      return $http
        .get(urlborrow + "/getall")
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    this.getAllBorrowByDate = async (data) => {
      return $http
        .post(urlborrow + "/getallByDate",data)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    this.createBorrow = async (data) => {
      return $http
        .post(urlborrow + "/create", data)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    this.deleteBorrow = async (data) => {
      return $http
        .post(urlborrow + "/delete", data)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    this.getOneBorrow = async (id) => {
      return $http
        .get(urlborrow + "/get/" + id)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    this.editBorrow = async (data) => {
      return $http
        .put(urlborrow + "/update", data)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    this.getUserbyName = async (name) => {
      return $http
        .get(urlborrow + "/finduserbyname/" + name)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    this.getUserbyID = async (id) => {
      return $http
        .get(urlborrow + "/finduserbyid/" + id)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    // End Service Borrow //
    // Start Service Borrow History moneyBorrow (bhm)
    this.createbhm = async (data) => {
      return $http
        .post(urlbhm + "/create", data)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    this.getAllbhmByIdBorrow = async (id) => {
      return $http
        .get(urlbhm + "/get/borrow/" + id)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
          return $q.reject(err.data);
        });
    };
    this.deletebhmById = async (id) => {
      try {
        return await $http.delete(urlbhm + "/delete/" + id);
      } catch (err) {
        console.error(err);
        return $q.reject(err.data);
      }
    };
    // End Service Borrow History moneyBorrow (bhm)
  },
]);
