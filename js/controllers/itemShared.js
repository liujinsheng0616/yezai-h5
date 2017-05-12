/**
 * Created by 53983 on 2017/3/22.
 */
goceanApp.controller('ItemSharedCtrl', function($scope, $rootScope, $state, $timeout, $stateParams, appSettings,mallDetailService, mainHomeService, configService) {

    var goodsId = 0;
    var sharerId = 0;
    if ($stateParams.goodsId){
        goodsId = $stateParams.goodsId;
    }
    if ($stateParams.sharerIdStr){
    	var sharerIdStr = $stateParams.sharerIdStr;
        sharerIdStr = sharerIdStr.replace("sharerId_","");
        sharerId = parseInt(sharerIdStr);
    }
    var _state = "itemDetail";
	window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/shared/"
			+ goodsId + "/sharerId_" + sharerId +
			"&response_type=code&scope=snsapi_userinfo&state="+_state;

});
