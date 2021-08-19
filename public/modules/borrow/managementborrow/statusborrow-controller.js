"use strict"
angular.module("borrows").controller("statusborrowController", [
  "lodash",
  "$scope",
  "$state",
  "borrowService",
  "$timeout",
  function (_, $scope, $state, borrowService, action) {
    var vm = $scope
    var statusEdit = {}

    this.getInformation = async () => {
      await getUserIP(async (ip) => {
        vm.userIP = ip
        if (await _.split(vm.userIP, '.')[2] !== '202') {
          // $state.go('accessdenied')
        }
      })
      vm.statusName = ""
      vm.statusNameEdit = ""
      let result = await borrowService.getAllStatus()
      vm.informations = result.data
      await vm.$apply()
    }

    this.showMenuEdit = async (information) => {
      vm.statusNameEdit = information.status
      vm.statusIdEdit = information.id
    }

    this.editStatus = async () => {
      if (!!vm.statusNameEdit && !!vm.statusIdEdit) {
        let data = { id: vm.statusIdEdit, status: vm.statusNameEdit }
        await borrowService.editStatus(data)
        await this.getInformation()
        await location.reload()
      } else {
        alert("กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน")
      }
    }
    this.createStatus = async () => {
      if (!!vm.statusName) {
        try {
          let result = await borrowService.createStatus({ status: vm.statusName })
          await this.getInformation()
          await location.reload()
        } catch (err) {
          console.error(err)
        }
      } else {
        alert("กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน")
      }
    }

    this.delStatus = async (id) => {
      if (confirm("ยืนยันข้อมูลการลบ")) {
        try {
          let result = await borrowService.deleteStatus(id)
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
