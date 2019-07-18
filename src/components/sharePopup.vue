<template>
	<div>
		<div v-if="showPopup" class="shareAll animated fadeInUpBig" :class="{show:showPopup}" >
			<div v-if="showWXGo==1">
				<div @click="call('wechatFriend')" class="langue">微信好友</div>
				<div @click="call('wechatTimeline')" class="langue">朋友圈</div>
				<div @click="call('qqFriend')" class="langue">QQ</div>
				<div @click="call('qZone')" class="langue">QQ空间</div>
				<div @click="call('weibo')" class="langue">分享到微博</div>
			</div>
			<div v-if="showWXGo==2">
				<div class="langue" v-clipboard:copy="shareConfig.url" v-clipboard:success="onCopy" v-clipboard:error="onError"
				 @click="shareWX">
					复制链接并分享到微信
				</div>
			</div>
			<div class="langue" @click="shareSina" v-if="showWXGo!=1">
				分享到微博
			</div>
			<div class="langue" v-clipboard:copy="shareConfig.url" v-clipboard:success="onCopy" v-clipboard:error="onError">
				复制链接
			</div>
			<div @click="call()" class="langue" v-if="showWXGo==1">更多</div>
			<div class="langue cancels" @click="hide">
				取消
			</div>
		</div>
		<div :class="{guid:showPopup}" @click="hide"></div>
	</div>
</template>

<script>
	export default {
		props: ["showShare", "shareConfig"],
		data() {
			return {
				// showPopup:this.showShare,
				chooseText: [""],
				mshare: "",
				share_obj: "",
				showWXGo: false, //false为既不是qq,也不是UC
				showChrome: false,
				nativeShare: new NativeShare(),
				shareData: {}
			};
		},
		computed: {
			showPopup: {
				get() {
					return this.showShare;
				},
				set(newVal) {}
			}
		},
		methods: {
			shareTest() {
				this.shareData = {
					title: this.shareConfig.title,
					desc: this.shareConfig.desc,
					// 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
					link: this.shareConfig.url,
					icon: this.shareConfig.img,
					// 不要过于依赖以下两个回调，很多浏览器是不支持的
					success: function() {
						alert("分享成功");
					},
					fail: function() {
						// alert("");
						console.log("您的浏览器不支持该分享功能，请手动复制链接!");
					}
				};
				this.nativeShare.setShareData(this.shareData);
			},
			call(command) {
				this.shareTest();
				try {
					this.nativeShare.call(command);
					this.hide();
				} catch (err) {
					// 如果不支持，你可以在这里做降级处理
					alert("您的浏览器不支持该分享功能，请手动复制链接!");
				}
			},
			confirm() {
				this.$parent.$emit("showShare", false);
				this.hide();
			},
			//复制成功执行的函数
			onCopy(e) {
				this.hide();
				alert("链接复制成功!", "middle");
			},
			//复制失败执行的函数
			onError(e) {
				this.hide();
				if (e.text == this.shareConfig.url) {
					alert("链接复制成功!", "middle");
				} else {
					alert("链接复制失败!", "middle");
				}
			},
			hide() {
				this.$parent.$emit("showShare", false);
			},
			// 分享微博
			shareSina() {
				//分享到新浪微博
				var param = {
					url: this.shareConfig.url,
					// type: "2",
					// count: "2" /**是否显示分享数，1显示(可选)*/,
					// appkey:'111', /**您申请的应用appkey,显示分享来源(可选)*/
					title: this.shareConfig
						.title /**分享的文字内容(可选，默认为所在页面的title)*/ ,
					pic: this.shareConfig.img /**分享图片的路径(可选)*/ ,
					// ralateUid: "6024068761" /**关联用户的UID，分享微博会@该用户(可选)*/,
					language: "zh_cn" /**设置语言，zh_cn|zh_tw(可选)*/ ,
					dpc: this.shareConfig.desc
					// rip: "http://192.168.0.160:8081/"
				};
				console.log(this.shareConfig.img);

				var temp = [];
				for (var p in param) {
					temp.push(p + "=" + encodeURIComponent(param[p] || ""));
				}
				var sharesinastring =
					// "http://service.weibo.com/share/share.php?"+ temp.join("&");
					"https://service.weibo.com/share/mobile.php?" + temp.join("&");
				// var sharesinastring = 'sinaweibo://browser?url=https://service.weibo.com/share/mobile.php?url='+temp.join("&")+'&rip=http://192.168.0.160:8081/&frefer=http://localhost:8081/&rnd=1562815863'
				window.top.location.href = sharesinastring;
				// this.$router.push({
				//   name: "iframeShare",
				//   query: {
				//     link: sharesinastring
				//   }
				// });
				this.hide();
				//    window.location.replace('sinaweibo://browser?url=https://service.weibo.com/share/mobile.php?url=?' +encodeURIComponent(this.shareConfig.url) + '&title=' + this.shareConfig.title + '&appkey=277159429&&ralateUid=1855112015&pic=' + this.shareConfig.url + '&searchPic=true' )
				// window.location.href = 'sinaweibo://browser?url=https%3A%2F%2Fservice.weibo.com%2Fshare%2Fmobile.php%3Furl%3Dhttps%253A%252F%252Fm.emp288.cn%26type%3D1%26count%3D1%26title%3D%25E8%258D%25A3%25E8%2580%2580%25E7%259C%259F%25E8%25A6%2581%25E5%2581%259A%25E7%2594%25B5%25E8%25A7%2586%25EF%25BC%259F%25E7%259F%25A5%25E6%2583%2585%25E4%25BA%25BA%25E5%25A3%25AB%25E6%2594%25BE%25E5%2587%25BA%25E6%25B6%2588%25E6%2581%25AF%25EF%25BC%258C%25E6%259C%2588%25E5%25BA%2595%25E8%25A7%2581%25E5%2588%2586%25E6%2599%2593%26pic%3Dhttp%253A%252F%252F192.168.0.198%253A7774%252FImg%252FShow%252F0519C165E4D1E784E2834C9F473CE54B504B70D468A6CAF084A8A0193F7C625313D5596B2D13DAD7DAC05CE713A1F31DDD4C79D471A965C6A588276C36CE36ED%26language%3Dzh_cn%26dpc%3D%25E7%2599%25BE%25E5%25BA%25A6%26frefer%3Dhttp%3A%2F%2Flocalhost%3A8081%2F%26rnd%3D1562751250'
				// 'sinaweibo://browser?url=https://service.weibo.com/share/mobile.php?url=https%3A%2F%2Fm.emp288.cn&type=1&count=1&title=%E8%8D%A3%E8%80%80%E7%9C%9F%E8%A6%81%E5%81%9A%E7%94%B5%E8%A7%86%EF%BC%9F%E7%9F%A5%E6%83%85%E4%BA%BA%E5%A3%AB%E6%94%BE%E5%87%BA%E6%B6%88%E6%81%AF%EF%BC%8C%E6%9C%88%E5%BA%95%E8%A7%81%E5%88%86%E6%99%93&pic=http%3A%2F%2F192.168.0.198%3A7774%2FImg%2FShow%2F0519C165E4D1E784E2834C9F473CE54B504B70D468A6CAF084A8A0193F7C625313D5596B2D13DAD7DAC05CE713A1F31DDD4C79D471A965C6A588276C36CE36ED&language=zh_cn&dpc=%E7%99%BE%E5%BA%A6&frefer=http://localhost:8081/&rnd=1562751250'
			},

			// 普通分享微信
			shareWX() {
				// window.location.replace("http://s.jiathis.com/qrcode.php?url="+this.shareConfig.url);
				try {
					window.top.location.replace("weixin://");
					this.hide();
				} catch (err) {
					// 如果不支持，你可以在这里做降级处理
					alert("您的浏览器不支持该分享功能，请手动复制链接!");
				}
			},
			shareChrome() {
				if (navigator.share) {
					try {
						navigator.share({
							title: this.shareConfig.title,
							text: this.shareConfig.desc,
							url: this.shareConfig.url
						});
						console.log("Successful share");
					} catch (error) {
						console.log("Error sharing", error);
					}
				} else {
					alert("分享失败，请手动复制链接");
				}
			}
		},
		mounted() {
			var UA = navigator.appVersion;
			var ue = /(iPad).*OS\s([\d_]+)/.test(UA);
			var le = /(iPod)(.*OS\s([\d_]+))?/.test(UA);
			var fe = !UA && /(iPhone\sOS)\s([\d_]+)/.test(UA);
			var pe = /(Android);?[\s\/]+([\d.]+)?/.test(UA);
			// if (ue || le || fe||pe) {//判断为手机的情况下
			var wx = /micromessenger/i.test(UA);
			var chrome = UA.toLowerCase().indexOf("chrome");
			var baidu = /mobile.*baidubrowser/i.test(UA);
			var Sogou = /SogouMobileBrowser/i.test(UA);
			var baiduAPP = /baiduboxapp/i.test(UA);
			var uc = UA.split("UCBrowser/").length > 1 ? 1 : 0;
			var qq = UA.split("MQQBrowser/").length > 1 ? 2 : 0;
			var qqNot = /QQ\/([\d\.]+)/.test(UA);
			// if(!wx){
			if (uc == 1 || qq == 1 || qq == 2 || baidu || baiduAPP || (Sogou && !pe)) {
				this.showWXGo = 1;
				if (wx || qqNot) {
					this.showWXGo = 3;
				}
			} else if (wx) {
				this.showWXGo = 3;
			} else {
				this.showWXGo = 2;
			}
			if (chrome != -1) {
				this.showChrome = true;
			} else {
				this.showChrome = false;
			}
			// } else {
			//   this.showWXGo = 3;
			// }

			// }else{
			//   this.showWXGo = -5;
			// }
		}
	};
</script>

<style  >
	.shareAll {
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;

	}

	.langue {
		width: 100%;
		height: 4rem;
		background-color: #fff;
		font-size: 1rem;
		color: #333;
		line-height: 4rem;
		border-bottom: 1px solid #f0f0f0;
	}

	.guid {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #000;
		opacity: 0.7;
	}

	.show {}

	.cancels {
		margin-top: 8px;
		border-bottom: 0 none;
	}
	 .animated {
    animation-duration: 0.3s;
  }
</style>
