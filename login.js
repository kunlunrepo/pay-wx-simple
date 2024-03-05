$(function(){
	// 登录表单
	$("#loginForm").submit(function() {
		console.log("登录按钮");
		$.ajax({
			url: wxUrl.login,
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({
				"username": $("#username").val(),
				"password": $("#password").val()
			}),
			success: function(resp) {
				if(resp.code == 0) {
					let token = resp.token
					localStorage.setItem("token", token)
					// 跳转其他页面
					// location.href="order.html"
					location.href="payment.html"
					console.log("SUCCESS");
				}
			}
		})
		return false; // 阻止提交表单
	})
})