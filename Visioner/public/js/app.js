$(document).ready(function() {
    var cameraTable = $('#dataTable').DataTable();
    var auth = {}
    var sdata = {
      cameras: [],
      profile: {},
      users: [],
      cameraPrice: 0,
      isPlus: true
    }
    checkAuth = () => {
      let token = localStorage.getItem('token')
      if (!token){
        window.location.href = '/auth/login'
      } else {
        let user_id = localStorage.getItem('user_id')
        return {token, user_id}
      }
    }

    updateTable = () => {
      cameraTable.clear().draw()
      let renderValues = sdata.cameras.map((e) => [e.id, e.key, e.outputSource, e.outputType, 
        `<button class="btn btn-warning" onclick="modifyCamera('${e.id}')"><i class="fas fa-fw fa-wrench" ></i></button>`])
      cameraTable.rows.add(renderValues)
      cameraTable.draw()
    }

    loadCamera = () => {
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: app_base + 'user/' + auth.user_id + '/camera',
        headers: {"Authorization": "Bearer " + auth.token},
        dataType: "json",
        success: (data) => {
            if (!!data.error)
                $("#error").html(data.error)
            else {
                sdata.cameras = data.cameras
                updateTable()
            }
        }
    })
    }
    loadCameraPrice = () => {
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: app_base + 'camera/price',
        headers: {"Authorization": "Bearer " + auth.token},
        dataType: "json",
        success: (data) => {
            if (!!data.error)
                console.log("Can not get camera price")
            else {
                sdata.cameraPrice = data.price
                $("#txtCameraPrice").text(sdata.cameraPrice + " VND")
            }
        }
      })
    }

    updateViewUserInfo = () => {
      let data = sdata.profile
      $("#txtUsername").val(data.username) 
      $("#txtEmail").val(data.email) 
      $("#inputFullname").val(data.fullname)
      $("#inputCompanyName").val(data.companyName)
      $("#inputDoB").val(data.dob)
      $("#inputPhone").val(data.phone) 
      $("#inputAddress").val(data.address)
      $("#inputCitizenID").val(data.citizenID)
      $("#inputPassportID").val(data.passportID)
      $("#txtCredit").val(data.credit)
    }
    loadUserInfo = () => {
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: app_base + 'user/' + auth.user_id,
        headers: {"Authorization": "Bearer " + auth.token},
        dataType: "json",
        success: (data) => {
            if (!!data.error)
                $("#error").html(data.error)
            else {
                sdata.profile = data.user
                updateViewUserInfo()
            }
        }
      })

      
    }

    modifyCamera = (id) => {
      let camera = sdata.cameras.filter(cam => cam.id == id)[0]
      $("#camera_id").val(camera.id)
      $("#inputOutputSource").val(camera.outputSource)
      $("#inputOutputType").val(camera.outputType).change()
      $('#modifyCameraModal').modal('show')
    }

    btnClick = () => {
      $("#btn-update-info").on('click', () => {
        let fullname = $("#inputFullname").val()
        let companyName = $("#inputCompanyName").val()
        let dob = $("#inputDoB").val()
        let phone = $("#inputPhone").val() 
        let address = $("#inputAddress").val()
        let citizenID = $("#inputCitizenID").val()
        let passportID = $("#inputPassportID").val()
        $.ajax({
          type: "PUT",
          contentType: "application/json",
          url: app_base + 'user/' + auth.user_id,
          headers: {"Authorization": "Bearer " + auth.token},
          data: JSON.stringify({ 
            fullname,
            dob,
            companyName,
            phone,
            address,
            citizenID,
            passportID
           }),
          dataType: "json",
          success: (data) => {
              if (!!data.error)
                  alert('Failed!')
              else {
                  alert('Success!')
              }
          }
        })
      })
      $("#btn-confirm-save").on('click', () => {
        let camera_id = $("#camera_id").val()
        let outputSource = $("#inputOutputSource").val()
        let outputType = $("#inputOutputType").val()
        if (outputSource == "" || outputType == "")
          alert("Invalid value")
        else {
          $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: app_base + 'user/' + auth.user_id + "/camera/" + camera_id,
            headers: {"Authorization": "Bearer " + auth.token},
            data: JSON.stringify({ 
              outputSource,
              outputType
             }),
            dataType: "json",
            success: (data) => {
                if (!!data.error)
                    alert('Failed!')
                else {
                  for (let i = 0; i < sdata.cameras.length; i++)
                    if (sdata.cameras[i].id == camera_id){
                      sdata.cameras[i].outputSource = outputSource
                      sdata.cameras[i].outputType = outputType
                    }
                  updateTable()
                  $('#modifyCameraModal').modal('hide')
                }
            }
          })
        }
      })
      $("#btn-add-camera").on('click', () => {
        let r = confirm("Are you sure?")
        if (r) {
          $.ajax({
            type: "POST",
            contentType: "application/json",
            url: app_base + 'user/' + auth.user_id + "/camera",
            headers: {"Authorization": "Bearer " + auth.token},
            data: JSON.stringify({ 
             }),
            dataType: "json",
            success: (data) => {
                if (!!data.error)
                    alert('Error: ' + data.error)
                else {
                    alert('Success!')
                    loadCamera()
                }
            }
          })
        }
      })
    }

    modifyUser = (id, is_plus) => {
      sdata.isPlus = is_plus
      $("#user_id").val(id)
      $('#modifyCameraModal').modal('show')
    }

    updateTableUser = () => {
      cameraTable.clear().draw()
      let renderValues = sdata.users.map((e) => [e.id, e.username, e.credit, 
        `<button class="btn btn-warning" onclick="modifyUser('${e.id}', true)"><i class="fas fa-fw fa-plus" ></i></button>`,
        `<button class="btn btn-warning" onclick="modifyUser('${e.id}', false)"><i class="fas fa-fw fa-minus" ></i></button>`])
      cameraTable.rows.add(renderValues)
      cameraTable.draw()
    }
    adminFn = () => {
      let isAdmin = localStorage.getItem('isAdmin')
      console.log(isAdmin)
      if (isAdmin){
        $.ajax({
          type: "GET",
          contentType: "application/json",
          url: app_base + 'admin/user',
          headers: {"Authorization": "Bearer " + auth.token},
          dataType: "json",
          success: (data) => {
              if (!!data.error)
                  console.log("Can not get users")
              else {
                  sdata.users = data.users
                  updateTableUser()
              }
          }
        })
      }

      $("#btn-confirm-amount-save").on('click', () => {
        let i = 0
        let user_id = $("#user_id").val()
        let credit = $("#inputAmount").val()
        for (i = 0; i < sdata.users.length; i++)
          if (sdata.users[i].id == user_id)
            break
        if (credit == "" || isNaN(credit))
          alert("Invalid value")
        else {
          credit = parseInt(credit)
          console.log(sdata.isPlus, credit, sdata.users[i].credit)
          if (sdata.isPlus)
            credit = parseInt(sdata.users[i].credit) + credit
          else
            credit = parseInt(sdata.users[i].credit) - credit
          $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: app_base + 'admin/credit/user/' + user_id,
            headers: {"Authorization": "Bearer " + auth.token},
            data: JSON.stringify({ 
              credit
             }),
            dataType: "json",
            success: (data) => {
                if (!!data.error)
                    alert('Failed!')
                else {
                  sdata.users[i].credit = credit
                  updateTableUser()
                  $('#modifyCameraModal').modal('hide')
                }
            }
          })
        }
      })
    }
    main = () => {
      auth = checkAuth()
      loadCameraPrice()
      loadUserInfo()
      loadCamera()
      btnClick()
      adminFn()
    }

    main()
  });
  