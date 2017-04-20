/**
 * Created by 53983 on 2017/3/19.
 */
goceanApp.controller('ChangeDeliverDayCtrl', function ($scope, $state, $timeout, $stateParams,changeDeliverDayService) {
    console.log('about ChangeDeliverDayCtrl');

    // 数据绑定
    var obj = {viewId : $stateParams.viewId};
    changeDeliverDayService.getDelayTimeList(obj).then(function(data){
        console.log(data);
    },function(err){

    });
    //
    $scope.delayTimeList = store.delay;
    $("#d1").select({
        title: "选择你的收货日期",
        autoClose:true,
        items: $scope.delayTimeList.to
    });
});