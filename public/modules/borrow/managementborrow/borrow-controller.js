angular.module("borrows").controller("borrowController", [
  "lodash",
  "$scope",
  "$state",
  "borrowService",
  function (_, $scope, $state, borrowService) {
    var vm = $scope;
    vm.orderByField = "number";
    var reverseSort = false;
    vm.userIP = "";
    vm.dataEditbhm = {};
    vm.filenamexlsx = `Report_SystemBorrow_${new Date().getTime()}.xlsx`;
    $("#borrowDatetxt").datepicker();
    $("#report1startdate").datepicker();
    $("#report1enddate").datepicker();
    vm.filterStatusborrowid3 = 3;

    vm.myFilter = (item) => {
      return item.statusBorrow.id !== 3;
    };
    this.filterstatusBorrow3 = async ($event) => {
      if ($event) {
        vm.filterStatusborrowid3 = 0;
      } else {
        vm.filterStatusborrowid3 = 3;
      }
    };
    this.getInformation = async () => {
      //fn IP local user
      await getUserIP(async (ip) => {
        vm.userIP = ip;
        if ((await _.split(vm.userIP, ".")[2]) !== "202") {
          // $state.go('accessdenied')
        }
      });
      vm.searchText = "";
      await this.getAllBorrow();
      await this.getAllTypeborrow();
      await this.getAllStatus();
    };

    this.delBorrow = async (borrow) => {
      let data = {
        id: borrow,
        userIP: vm.userIP,
      };
      if (confirm("ยืนยันข้อมูลการลบ")) {
        try {
          let result = await borrowService.deleteBorrow(data);
          await this.getInformation();
          await location.reload();
        } catch (err) {
          console.error(err);
        }
      }
    };

    this.changedValuetypeBorrow = (item) => {
      Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
      var date = new Date(vm.borrowDatetxt);
      let date2 = date.addDays(item.day - 1);
      vm.deadlineDatetxt = `${
        date2.getMonth() + 1
      }/${date2.getDate()}/${date2.getFullYear()}`;
      vm.typeborrow = item;
    };

    this.changedValuestatusBorrow = (item, borrowdate) => {
      if (borrowdate !== undefined) {
        let conreturndate = new Date(borrowdate);
        $("#returnDateEdit").datepicker({
          minDate: new Date(
            conreturndate.getFullYear(),
            conreturndate.getMonth(),
            conreturndate.getDate()
          ),
        });
      }
      vm.statusborrow = item;
    };

    this.checkNameuser = async () => {
      var name = prompt("ระบุ User ผู้ยืม");
      if (name == null || name == "") {
        alert("ไม่ได้กรอกชื่อผู้ยืมเงิน");
      } else {
        try {
          let result = await borrowService.getUserbyName(name);
          if (
            result.data.FULLNAME == undefined ||
            result.data.FULLNAME == "" ||
            result.data.FULLNAME == null
          ) {
            alert("ไม่พบผู้ใช้งาน");
          } else {
            vm.usertxt = result.data.FULLNAME;
            vm.useridtxt = result.data.USERID;
            await $scope.$apply();
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkFormAdd = () => {
      if (
        vm.numbertxt == null ||
        vm.numbertxt == "" ||
        vm.useridtxt == null ||
        vm.useridtxt == "" ||
        vm.usertxt == null ||
        vm.useridtxt == "" ||
        angular.element("#borrowDatetxt").val() == null ||
        angular.element("#borrowDatetxt").val() == "" ||
        angular.element("#deadlineDatetxt").val() == null ||
        angular.element("#deadlineDatetxt").val() == "" ||
        vm.objecttivetxt == null ||
        vm.objecttivetxt == "" ||
        vm.typeborrow == null ||
        vm.typeborrow == "" ||
        // (vm.referencetxt == null || vm.referencetxt == "") ||
        vm.moneyBorrowtxt == null ||
        vm.moneyBorrowtxt == "" ||
        vm.remarktxt == null ||
        vm.remarktxt == "" ||
        vm.statusborrow == null ||
        vm.statusborrow == ""
      ) {
        return true;
      } else {
        return false;
      }
    };
    checkFormEdit = () => {
      if (
        vm.dataEdit.number == null ||
        vm.dataEdit.number == "" ||
        vm.dataEdit.userID == null ||
        vm.dataEdit.userID == "" ||
        vm.dataEdit.userName == null ||
        vm.dataEdit.userName == "" ||
        vm.dataEdit.objecttive == null ||
        vm.dataEdit.objecttive == "" ||
        vm.dataEdit.typeBorrow == null ||
        vm.dataEdit.typeBorrow == "" ||
        vm.dataEdit.statusBorrow == null ||
        vm.dataEdit.statusBorrow == "" ||
        vm.dataEdit.moneyBorrow == null ||
        vm.dataEdit.moneyBorrow == "" ||
        vm.dataEdit.deadlineDate == null ||
        vm.dataEdit.deadlineDate == "" ||
        vm.dataEdit.borrowDate == null ||
        vm.dataEdit.borrowDate == "" ||
        // (vm.dataEdit.reference == null || vm.dataEdit.reference == "") ||
        vm.dataEdit.remark == null ||
        vm.dataEdit.remark == "" ||
        (vm.dataEdit.returnDate = null || vm.dataEdit.returnDate == "")
      ) {
        return true;
      } else {
        return false;
      }
    };
    checkFormEditbhm = () => {
      if (
        vm.dataEditbhm.moneyBorrow == null ||
        vm.dataEditbhm.moneyBorrow == "" ||
        (vm.dataEditbhm.moneyBorrow == undefined &&
          vm.dataEditbhm.billNumber == null) ||
        vm.dataEditbhm.billNumber == "" ||
        vm.dataEditbhm.billNumber == undefined
      ) {
        return true;
      } else {
        return false;
      }
    };
    this.createBorrow = async () => {
      var item = {
        number: vm.numbertxt,
        userID: vm.useridtxt,
        userName: vm.usertxt,
        borrowDate: angular.element("#borrowDatetxt").val(),
        deadlineDate: angular.element("#deadlineDatetxt").val(),
        objecttive: vm.objecttivetxt,
        typeborrow: vm.typeborrow,
        reference: vm.referencetxt,
        moneyBorrow: vm.moneyBorrowtxt,
        remark: vm.remarktxt,
        statusborrow: vm.statusborrow,
        usercreated: vm.userIP,
        userupdated: vm.userIP,
      };
      if (checkFormAdd()) {
        alert("กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน");
      } else {
        try {
          await borrowService.createBorrow(item);
          await this.getInformation();
          await location.reload();
        } catch (err) {
          console.error(err);
        }
      }
    };
    this.editBorrow = async () => {
      vm.dataEdit.statusBorrow = vm.statusborrow;
      vm.dataEdit.userupdated = vm.userIP;
      let returnDate = new Date(vm.returnDateEdit);
      if (checkFormEdit()) {
        alert("กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน");
      } else {
        if (confirm("ยืนยันข้อมูลการอัพเดท")) {
          try {
            if (!checkFormEditbhm()) {
              vm.dataEditbhm.usercreated = vm.userIP;
              vm.dataEditbhm.borrowid = vm.dataEdit.id;
              await borrowService.createbhm(vm.dataEditbhm);
            }
            vm.dataEdit.returnDate = returnDate;
            let result = await borrowService.editBorrow(vm.dataEdit);
            if ((result.status = "202")) {
              await this.getInformation();
              await location.reload();
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
    };
    $("#exampleModal").on("show.bs.modal", async (event) => {
      var button = $(event.relatedTarget);
      var id = button.data("whatever");
      try {
        vm.dataEdit = (await borrowService.getOneBorrow(id)).data;
        vm.databhms = (await borrowService.getAllbhmByIdBorrow(id)).data;
        _.map(vm.databhms, (value) => {
          value.created =
            new Date(value.created).getDate() +
            "/" +
            new Date(value.created).getMonth() +
            1 +
            "/" +
            Math.round(new Date(value.created).getFullYear() + 543);
        });
        vm.$apply();
      } catch (err) {
        console.error(err);
      }
    });
    this.exportTable = () => {
      var wb = XLSX.utils.table_to_book(document.getElementById("mainTable"));
      XLSX.writeFile(wb, vm.filenamexlsx);
    };
    this.getDataExport = async () => {
      let item = await _.map(vm.informationBorrows, (value) => {
        return _.omit(value, [
          "userID",
          "balance",
          "usercreated",
          "userupdated",
          "id",
          "billNumber",
          "removed",
          "$$hashKey",
        ]);
      });
      let result = await _.map(item, (value) => {
        value.typeBorrow = value.typeBorrow.type;
        value.statusBorrow = value.statusBorrow.status;
        value.borrowDate =
          new Date(value.borrowDate).getDate() +
          "/" +
          (new Date(value.borrowDate).getMonth() + 1) +
          "/" +
          Math.round(new Date(value.borrowDate).getFullYear() + 543);
        value.deadlineDate =
          new Date(value.deadlineDate).getDate() +
          "/" +
          (new Date(value.deadlineDate).getMonth() + 1) +
          "/" +
          Math.round(new Date(value.deadlineDate).getFullYear() + 543);
        if (value.returnDate != null || value.returnDate != undefined) {
          value.returnDate =
            new Date(value.returnDate).getDate() +
            "/" +
            (new Date(value.returnDate).getMonth() + 1) +
            "/" +
            Math.round(new Date(value.returnDate).getFullYear() + 543);
        } else {
          value.returnDate = value.returnDate;
        }
        value.created =
          new Date(value.created).getDate() +
          "/" +
          (new Date(value.created).getMonth() + 1) +
          "/" +
          Math.round(new Date(value.created).getFullYear() + 543);
        value.updated =
          new Date(value.updated).getDate() +
          "/" +
          (new Date(value.updated).getMonth() + 1) +
          "/" +
          Math.round(new Date(value.updated).getFullYear() + 543);
        let arraybillNumber = [];
        let arraymoneyBorrow = [];
        if (value.borrowHistoryMoneyborrows.length > 0) {
          _.forEach(value.borrowHistoryMoneyborrows, (value) => {
            arraybillNumber.push(value.billNumber);
            arraymoneyBorrow.push(value.moneyBorrow);
          });
        }
        if (value.borrowHistoryMoneyborrows.length > 0) {
          value.bhmShowBillNumber = _.join(arraybillNumber, ", ");
          value.bhmShowmoneyBorrow = _.join(arraymoneyBorrow, ", ");
        } else {
          value.bhmShowBillNumber = "-";
          value.bhmShowmoneyBorrow = "-";
        }
        return value;
      });
      return await _.sortBy(result, ["number"]);
    };
    this.getDataExportByDateAll = async (startdate, enddate) => {
      let body = { startdate, enddate };
      let information = await borrowService.getAllBorrowByDate(body);
      let data = await _.map(information.data, (value) => {
        if (value.statusBorrow.id != "3") {
          value.dayDifference = this.dayDifference(
            value.borrowDate,
            value.deadlineDate
          );
        } else {
          value.dayDifference = 0;
        }
        let arraybillNumber = [];
        let arraymoneyBorrow = [];
        if (value.borrowHistoryMoneyborrows.length > 0) {
          _.forEach(value.borrowHistoryMoneyborrows, (value) => {
            arraybillNumber.push(value.billNumber);
            arraymoneyBorrow.push(value.moneyBorrow);
          });
        }
        if (value.borrowHistoryMoneyborrows.length > 0) {
          value.bhmShowBillNumber = _.join(arraybillNumber, ", ");
          value.bhmShowmoneyBorrow = _.join(arraymoneyBorrow, ", ");
        } else {
          value.bhmShowBillNumber = "-";
          value.bhmShowmoneyBorrow = "-";
        }
        return value;
      });
      let item = await _.map(data, (value) => {
        return _.omit(value, [
          "userID",
          "balance",
          "usercreated",
          "userupdated",
          "id",
          "billNumber",
          "removed",
          "$$hashKey",
        ]);
      });
      let result = await _.map(item, (value) => {
        value.typeBorrow = value.typeBorrow.type;
        value.statusBorrow = value.statusBorrow.status;
        value.borrowDate =
          new Date(value.borrowDate).getDate() +
          "/" +
          (new Date(value.borrowDate).getMonth() + 1) +
          "/" +
          Math.round(new Date(value.borrowDate).getFullYear() + 543);
        value.deadlineDate =
          new Date(value.deadlineDate).getDate() +
          "/" +
          (new Date(value.deadlineDate).getMonth() + 1) +
          "/" +
          Math.round(new Date(value.deadlineDate).getFullYear() + 543);
        if (value.returnDate != null || value.returnDate != undefined) {
          value.returnDate =
            new Date(value.returnDate).getDate() +
            "/" +
            (new Date(value.returnDate).getMonth() + 1) +
            "/" +
            Math.round(new Date(value.returnDate).getFullYear() + 543);
        } else {
          value.returnDate = value.returnDate;
        }
        value.created =
          new Date(value.created).getDate() +
          "/" +
          (new Date(value.created).getMonth() + 1) +
          "/" +
          Math.round(new Date(value.created).getFullYear() + 543);
        value.updated =
          new Date(value.updated).getDate() +
          "/" +
          (new Date(value.updated).getMonth() + 1) +
          "/" +
          Math.round(new Date(value.updated).getFullYear() + 543);
        let arraybillNumber = [];
        let arraymoneyBorrow = [];
        if (value.borrowHistoryMoneyborrows.length > 0) {
          _.forEach(value.borrowHistoryMoneyborrows, (value) => {
            arraybillNumber.push(value.billNumber);
            arraymoneyBorrow.push(value.moneyBorrow);
          });
        }
        if (value.borrowHistoryMoneyborrows.length > 0) {
          value.bhmShowBillNumber = _.join(arraybillNumber, ", ");
          value.bhmShowmoneyBorrow = _.join(arraymoneyBorrow, ", ");
        } else {
          value.bhmShowBillNumber = "-";
          value.bhmShowmoneyBorrow = "-";
        }
        return value;
      });
      return await _.sortBy(result, ["number"]);
    };
    this.delBhm = async (id) => {
      try {
        await borrowService.deletebhmById(id);
        await this.getInformation();
        await location.reload();
      } catch (err) {
        console.log(err);
      }
    };
    this.ExportXlsx = async (value) => {
      let result = await _.map(value, (value, key) => {
        let data = {
          สัญญาเลขที่: value.number,
          วันที่ยืม: value.borrowDate,
          "ชื่อ - สกุล": value.userName,
          วัตถุประสงค์: value.objecttive,
          จำนวนเงินยืม: value.moneyBorrow,
          วันที่ต้องคืน: value.deadlineDate,
          ยอดใบสำคัญจ่าย: value.reference,
          วันที่คืนเงิน: value.returnDate,
          เงินคงเหลือ: value.bhmShowmoneyBorrow,
          เลขที่ใบเสร็จ: value.bhmShowBillNumber,
          หมายเหตุ: value.remark,
        };
        return data;
      });
      var ws = XLSX.utils.json_to_sheet(result);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Omb_System_Borrow");
      XLSX.writeFile(wb, vm.filenamexlsx);
    };
    this.Report1 = async () => {
      var report1startdate = new Date(vm.report1startdate);
      var report1enddate = new Date(vm.report1enddate);
      console.log(report1startdate);
      console.log(report1enddate);
      let result = await this.getDataExportByDateAll(
        report1startdate,
        report1enddate
      );
      // let result = await this.getDataExport()
      await this.ExportXlsx(result);
    };
    this.Report2 = async () => {
      let result = _.filter(await this.getDataExport(), (value) => {
        return value.statusBorrow !== "ส่งคืนเงินยืมเรียบร้อยแล้ว";
      });
      await this.ExportXlsx(result);
    };
    this.Report3 = async () => {
      let result = _.filter(await this.getDataExport(), (value) => {
        return (
          value.statusBorrow !== "ส่งคืนเงินยืมเรียบร้อยแล้ว" &&
          value.dayDifference <= 0
        );
      });
      await this.ExportXlsx(result);
    };
    this.Report4 = async () => {
      let result = _.filter(await this.getDataExport(), (value) => {
        return (
          value.statusBorrow === "รอตรวจสอบเอกสาร" && value.dayDifference >= 0
        );
      });
      await this.ExportXlsx(result);
    };
    this.getAllBorrow = async () => {
      try {
        let result = await borrowService.getAllBorrow();
        vm.informationBorrows = await _.map(result.data, (value) => {
          if (value.statusBorrow.id != "3") {
            value.dayDifference = this.dayDifference(
              value.borrowDate,
              value.deadlineDate
            );
          } else {
            value.dayDifference = 0;
          }
          let arraybillNumber = [];
          let arraymoneyBorrow = [];
          if (value.borrowHistoryMoneyborrows.length > 0) {
            _.forEach(value.borrowHistoryMoneyborrows, (value) => {
              arraybillNumber.push(value.billNumber);
              arraymoneyBorrow.push(value.moneyBorrow);
            });
          }
          if (value.borrowHistoryMoneyborrows.length > 0) {
            value.bhmShowBillNumber = _.join(arraybillNumber, ", ");
            value.bhmShowmoneyBorrow = _.join(arraymoneyBorrow, ", ");
          } else {
            value.bhmShowBillNumber = "-";
            value.bhmShowmoneyBorrow = "-";
          }
          return value;
        });
        await $scope.$apply();
      } catch (err) {
        console.error(err);
      }
    };
    this.getAllTypeborrow = async () => {
      try {
        let result = await borrowService.getAllTypeborrow();
        vm.informationTypeborrows = result.data;
        vm.$apply();
      } catch (err) {
        console.error(err);
      }
    };
    this.getAllStatus = async () => {
      try {
        let result = await borrowService.getAllStatus();
        vm.informationStatus = result.data;
        vm.$apply();
      } catch (err) {
        console.error(err);
      }
    };
    this.dayDifference = (borrowDate, deadlineDate) => {
      var date2 = new Date(deadlineDate);
      var date1 = new Date();
      var timeDiff = date2.getTime() - date1.getTime();
      var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return dayDifference;
    };
    getUserIP = (onNewIP) => {
      //  onNewIp - your listener function for new IPs
      var myPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      var pc = new myPeerConnection({
          iceServers: [],
        }),
        noop = () => {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

      iterateIP = (ip) => {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
      };

      //create a bogus data channel
      pc.createDataChannel("");

      // create offer and set local description
      pc.createOffer((sdp) => {
        sdp.sdp.split("\n").forEach((line) => {
          if (line.indexOf("candidate") < 0) return;
          line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
      }, noop);

      //listen for candidate events
      pc.onicecandidate = (ice) => {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    };
  },
]);
