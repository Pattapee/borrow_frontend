"use strict"
angular.module("borrows").controller("typeborrowController", [
  "$scope",
  "$state",
  "borrowService",
  function ($scope, $state, borrowService, action) {
    var vm = $scope
    var typeEdit = {}

    this.getInformation = async () => {
      await getUserIP(async (ip) => {
        vm.userIP = ip
        if (await _.split(vm.userIP, '.')[2] !== '202') {
          // $state.go('accessdenied')
        }
      })
      vm.typeName = ""
      vm.typeNameEdit = ""
      try {
        let result = await borrowService.getAllTypeborrow()
        vm.informations = result.data
        vm.$apply()
      } catch (err) {
        console.error(err)
      }
    }

    this.showMenuEdit = async (id, type, day) => {
      vm.typeNameEdit = type
      vm.typeIdEdit = id
      vm.typeDayEdit = day
    }

    this.editType = async () => {
      if (!!vm.typeNameEdit && !!vm.typeIdEdit && !!vm.typeDayEdit) {
        try {
          let data = {
            id: vm.typeIdEdit,
            type: vm.typeNameEdit,
            day: vm.typeDayEdit
          }
          let result = await borrowService.editTypeborrow(data)
          await this.getInformation()
          await location.reload()
        } catch (err) {
          console.error(err)
        }
      } else {
        alert("กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน")
      }
    }

    this.createType = async () => {
      if (!!vm.typeName && !!vm.day) {
        try {
          let data = { type: vm.typeName, day: vm.day }
          let result = await borrowService.createTypeborrow(data)
          await this.getInformation()
          await location.reload()
        } catch (err) {
          console.error(err)
        }
      } else {
        alert("กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน")
      }
    }

    this.delType = async id => {
      if (confirm("ยืนยันข้อมูลการลบ")) {
        try {
          let result = await borrowService.deleteTypeborrow(id)
          await this.getInformation()
          await location.reload()
        } catch (err) {
          console.error(err)
        }
      }
    }
    getUserIP = (onNewIP) => { //  onNewIp - your listener function for new IPs
      var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
      var pc = new myPeerConnection({
        iceServers: []
      }),
        noop = () => { },
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key

      iterateIP = (ip) => {
        if (!localIPs[ip]) onNewIP(ip)
        localIPs[ip] = true
      }

      //create a bogus data channel
      pc.createDataChannel("")

      // create offer and set local description
      pc.createOffer((sdp) => {
        sdp.sdp.split('\n').forEach((line) => {
          if (line.indexOf('candidate') < 0) return
          line.match(ipRegex).forEach(iterateIP)
        })

        pc.setLocalDescription(sdp, noop, noop)
      }, noop)

      //listen for candidate events
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
      }
    }


  }
])
