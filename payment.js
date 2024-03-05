//文档就绪代码
$(function() {
	// 查询订单列表
	$.ajax({
		url: wxUrl.searchOrderById,
		type: "post",
		dataType: "json",
		contentType: "application/json",
		beforeSend: function(request) {
			request.setRequestHeader("token", localStorage.getItem("token"));
		},
		data: JSON.stringify({
			"orderId": 2,
		}),
		success: function(resp) {
			let order = resp.order
			let status = order.status
			if(status==1) {
				status="未付款"
			} else if(status==2) {
				status="已付款"
			} else if(status==3) {
				status="已发货"
			} else if(status==4) {
				status="已签收"
			}
			let amount = order.amount
			let date = order.createTime
			let code = order.code
			$("#code").text(code)
			$("#status").text(status)
			$("#date").text(date)
			$("#amount").text(amount)
			$("#pay").text(amount)
			$(".pay-btn").attr("data-order-id", order.id)
			if(status=="已付款") {
				$('.pay-btn').attr("disabled", true)
				$('.pay-btn').css({
					"background-color": "#666"
				})
			}
			$('.pay-btn').click(function() {
				$(this).attr("disabled", true)
				$('.message').text("扫码中，请勿操作")
				let authCode=""
				$(document).bind("keydown", function(event) {
					if(event.keyCode==13) { // 回车
						$(document).unbind("keydown")
						$(this).css({
							"background-color": "red"
						})
						// $('.message').text("扫码完成")
						console.log(authCode);
						let orderId=$(".pay-btn").data("order-id")
						$.ajax({
							url: wxUrl.scanCodePayOrder,
							type: "post",
							dataType: "json",
							contentType: "application/json",
							beforeSend: function(request) {
								request.setRequestHeader("token", localStorage.getItem("token"));
							},
							data: JSON.stringify({
								"orderId": orderId,
								"authCode": authCode
							}),
							success: function(resp) {
								let msg = resp.msg
								if(msg=="付款成功") {
									$(document).unbind("keydown")
									$('.message').text("付款成功")
									setTimeout(function(){
										location.reload()
									},1000)
								} else {
									$('.message').text("付款失败")
								}
							}
						})
					} else if(event.keyCode==27) {
						// ESC键
						$(document).unbind("keydown")
						$('.message').text("支付设备已经准备好")
						$('.pay-btn').removeAttr("disabled")
					}
					let ch = String.fromCharCode(event.keyCode)
					authCode+=ch
				})
			})
		}
	})
})