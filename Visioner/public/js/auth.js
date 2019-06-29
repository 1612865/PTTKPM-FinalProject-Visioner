$(document).ready(function() {
    var cameraTabel = $('#dataTable').DataTable();
    authFn = () => {
      $('#btn-login').on('click', () => {
        let username = $("#inputUsername").val()
        let password = $("#inputPassword").val()
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: app_base + 'auth/login',
            data: JSON.stringify({ username: username, password: password }),
            dataType: "json",
            success: (data) => {
                console.log(data)
                if (!!data.error)
                    $("#error").html(data.error)
                else {
                    localStorage.clear()
                    localStorage.setItem('user_id', data.user_id)
                    localStorage.setItem('token', data.token)
                    window.location.href = "/dashboard"
                }
            }
        })
      })

      $('#btn-register').on('click', () => {
        let username = $("#inputUsername").val()
        let email = $("#inputEmail").val()
        let password = $("#inputPassword").val()
        let confirmPassword = $("#confirmPassword").val()
        if (password != confirmPassword){
            $("#error").html("Password not match")
        } else {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: app_base + 'auth/register',
                data: JSON.stringify({ username: username, email: email, password: password }),
                dataType: "json",
                success: (data) => {
                    console.log(data)
                    if (!!data.error)
                        $("#error").html(data.error)
                    else {
                        window.location.href = "/auth/login"
                    }
                }
            })
        }
      })
    }

    main = () => {
      authFn()
    }

    main()
  });
  