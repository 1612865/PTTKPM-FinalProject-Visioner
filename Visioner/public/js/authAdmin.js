$(document).ready(function() {
    var cameraTabel = $('#dataTable').DataTable();
    authFn = () => {
      $('#btn-login').on('click', () => {
        let username = $("#inputUsername").val()
        let password = $("#inputPassword").val()
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: app_base + 'auth/admin/login',
            data: JSON.stringify({ email: username, password: password }),
            dataType: "json",
            success: (data) => {
                console.log(data)
                if (!!data.error)
                    $("#error").html(data.error)
                else {
                    localStorage.clear()
                    localStorage.setItem('isAdmin', true)
                    localStorage.setItem('token', data.token)
                    window.location.href = "/dashboard/admin"
                }
            }
        })
      })

    }

    main = () => {
      authFn()
    }

    main()
  });
  