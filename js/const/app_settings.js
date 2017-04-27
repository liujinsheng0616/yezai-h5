/**
 * Created by Administrator on 2015/7/10.
 */
goceanApp.constant('appSettings', {
	timeout : 30000,
	// host:'http://localhost',
	host : 'http://m.yezaigou.com',
	host2:'http://wxsdk.yezaigou.com',
	requestURL : {
		wxBase: '/wx/page/base',
		wxUserInfo:'wx/page/userInfo',
		item_listItem : '/item/listItem',
		item_details : '/item/details',
		listTopic : '/sns/topic/listTopic',
		createTopic : '/sns/topic/createTopic',
		removeTopic : '/sns/topic/removeTopic',
		createFollow : '/sns/topic/createFollow',
		removeFollow : '/sns/topic/removeFollow',
		likes : '/sns/topic/likes',
		urlJssdk : '/wx/common/sign/js',

		getDefaultAddress:'/address/default/get',
		setDefaultAddress:'/address/default/set',
		createAddress:'/address/create',
		refreshAddress:'/address/refresh',
		createOrRefresh:'/address/createOrRefresh',
		removeAddress:'/address/remove',
		listAddress:'/address/list',

		forwardPlanSelector:'/forward/plan/selector',

		placeOrder:'/order/place',
		orderList:'/order/listMy',
		orderDetails:'/order/details'

	},
    appId:'wx0cae6e3b9632e632'
});
