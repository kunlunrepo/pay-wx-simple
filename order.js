//文档就绪代码
$(function() {
	// 查询订单列表
	$.ajax({
		url: wxUrl.searchUserOrderList,
		type: "post",
		dataType: "json",
		contentType: "application/json",
		beforeSend: function(request) {
			request.setRequestHeader("token", localStorage.getItem("token"));
		},
		data: JSON.stringify({
			"page": 1,
			"length": 20
		}),
		success: function(resp) {
			if(resp.code==0) {
				console.log(resp);
				let list=resp.list
				let temp=''
				for(let one of list){
					if(one.status==1) {
						one.status="未付款"
					} else if(one.status==2) {
						one.status="已付款"
					} else if(one.status==3) {
						one.status="已发货"
					} else if(one.status==4) {
						one.status="已签收"
					}
					let button=''
					if(one.status=="未付款") {
						button='<input type="button" value="支付" class="pay-btn" />'
					}
					// data开头的都是自定义属性
					temp+=`
					<div class="order" data-order-id="${one.id}">
						<div class="row row-1">
							<span>订单编号：${one.code}</span>
							<span>${one.status}</span>
						</div>
						<div class="row row-2">
							假设这里是商品订单概要信息
						</div>
						<div class="row row-3">
							<div>
								金额：<span>${one.amount}元</span>
							</div>
							${button}
						</div>
					</div>
					`
				}
				$(".order-list").append(temp)
				$(".pay-btn").click(function() {
					// 获取自定义属性
					let orderId = $(this).parents(".order").data("order-id")
					$.ajax({
						url: wxUrl.nativePayOrder,
						type: "post",
						dataType: "json",
						contentType: "application/json",
						beforeSend: function(request) {
							request.setRequestHeader("token", localStorage.getItem("token"));
						},
						data: JSON.stringify({
							"orderId": orderId,
						}),
						success: function(resp) {
							if(resp.code==0) {
								let codeUrl = resp.codeUrl
								$(".qrcode").attr("src", wxUrl.qrcode+"?codeUrl="+codeUrl)
								$(".close-btn").attr("data-order-id", orderId)
								$("#native").show() // 显示弹出的框
								// 查询订单状态
								let num = 0
								let timer = setInterval(function(){
									num++
									let result = searchOrderStatus(orderId)
									if(result){
										clearInterval(timer)
										location.reload() // 刷新页面
									} else if(num==10) {
										clearInterval(timer)
									}
								},
								5000)
							}
						}
					})
				})
			}
		}
	})
	// 查询订单状态
	function searchOrderStatus(orderId) {
		let flag = false;
		$.ajax({
			url: wxUrl.searchOrderStatus,
			type: "post",
			dataType: "json",
			contentType: "application/json",
			async: false,
			beforeSend: function(request) {
				request.setRequestHeader("token", localStorage.getItem("token"));
			},
			data: JSON.stringify({
				"orderId": orderId,
			}),
			success: function(resp) {
				if(resp.msg=="订单状态已修改") {
					flag = true
				}
			}
		})
		return flag
	}
	// 点击【已经完成付款】按钮事件
	$(".close-btn").click(function() {
		let orderId = $(this).data("order-id")
		let result = searchOrderStatus(orderId)
		if(result) {
			location.reload()
		}
	})
	// 点击【关闭】图标事件
	$(".close-icon").click(function() {
		$("#native").hide()
	})
})