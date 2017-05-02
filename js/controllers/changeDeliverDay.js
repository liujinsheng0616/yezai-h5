/**
 * Created by 53983 on 2017/3/19.
 */
goceanApp.controller('ChangeDeliverDayCtrl', function ($scope, $state, $timeout, $stateParams,changeDeliverDayService,payMomentService) {
    console.log('about ChangeDeliverDayCtrl');

    // 数据绑定
    // var obj = {viewId : $stateParams.viewId};
    // changeDeliverDayService.getDelayTimeList(obj).then(function(data){
    //     console.log(data);
    // },function(err){
    //
    // });
    //
    if ($stateParams.forward) {
        $scope.keyForward = $stateParams.forward;
        $scope.deliveryDayDtoList = $stateParams.deliveryDayDtoList;
    }else{
        return;
    }

    // $scope.template.deliveryDay.dayList;


    function initPlanSelector() {

        var currentTime =  $scope.keyForward.deliveryTime;

        var oneT = $scope.deliveryDayDtoList[0];
        var twoT = $scope.deliveryDayDtoList[1];

        var factoryOne = 0;
        if (currentTime/1000 < oneT.time/1000){
            factoryOne = 1;
        }

        var factoryTwo = 0;
        if (currentTime/1000 < twoT.time/1000){
            factoryTwo = 1;
        }

        $scope.nextPlanList = [];
        for (var i=1; i<=4; i++){
            var one = {
                day:oneT.day,
                time: oneT.time + 604800000 * (i - factoryOne)
            }
            var two = {
                day:twoT.day,
                time: twoT.time + 604800000 * (i - factoryTwo)
            }
            if (one.day < two.day){
                $scope.nextPlanList.push(one);
                $scope.nextPlanList.push(two);
            }else{
                $scope.nextPlanList.push(two);
                $scope.nextPlanList.push(one);
            }

        }


        var length = $scope.nextPlanList.length;
        for (var i = 0;i<length;i++){
            var plan = $scope.nextPlanList[i];
            var day = plan.day;
            if (day == 1){
                plan.dayView = '日';
            } else if (day == 2){
                plan.day = '一';
            } else if (day == 3){
                plan.dayView = '二';
            } else if (day == 4){
                plan.dayView = '三';
            } else if (day == 5){
                plan.dayView = '四';
            } else if (day == 6){
                plan.dayView = '五';
            } else if (day == 7){
                plan.dayView = '六';
            }
        }


        for (i in $scope.nextPlanList){
            var to = $scope.nextPlanList[i];
            var date = new Date(to.time);
            to.title = date.toLocaleDateString().replace("/","-").replace("/","-") + "   周"+to.dayView;
        }

    };

    initPlanSelector();

    $("#d1").select({
        title: "选择你的收货日期",
        autoClose:true,
        items: $scope.nextPlanList
    });
});