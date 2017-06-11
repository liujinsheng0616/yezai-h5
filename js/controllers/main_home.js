/**
 * Created by kingson·liu on 17/3/8.
 */
goceanApp.controller('MainHomeCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, mainHomeService, localStorageService,wxUserInfoService,configService) {

    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        localStorageService.set("passport",params);
    }
    
    $scope.passport = localStorageService.get("passport");

    if ($scope.passport == null || $scope.passport.type == "BLANK"){
        var _state = "home";
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/userInfo&response_type=code&scope=snsapi_userinfo&state="+_state;
        return;
    }

    $rootScope.topicViewNavId = localStorageService.get("topicViewNavId");

    if ($rootScope.topicViewNavId == null) {
        $rootScope.topicViewNavId = 1;
        localStorageService.set("topicViewNavId", $rootScope.topicViewNavId)
    }

    var tabIndex = $rootScope.topicViewNavId - 1;
    // 底部tab选中
    $("#activeHomePage").addClass('weui_active').siblings().removeClass('weui_active');
    $('#tab1').tab({defaultIndex:tabIndex,activeClass:"tab-green"});

    $scope.page = 1;
    $scope.rows = 10;
    $scope.toUserName = ''; // 回复对象名字
    $scope.toUserId = '';// 回复对象ID
    // 下拉刷新
    var loading = false;
    $scope.initData = function (viewTypeId,firstFlag) {
        if ($rootScope.topicViewNavId != viewTypeId){
            localStorageService.set("topicViewNavId", viewTypeId);
            location.reload();
            return;
        }
        var obj = {
            type:viewTypeId,
            page:$scope.page,
            rows: $scope.rows,
            orderBy:"id",
            sc:"desc"
        };

        mainHomeService.listTopic(obj).then(function(data){
            if (data.status == "OK"){
                var result = data.result;
                if (firstFlag){
                    $scope.topicList = [];
                    $scope.userList = [];
                    $scope.tagList = [];
                }
                if (result.topicList && result.topicList.length > 0){

                    if ($scope.topicList && $scope.topicList.length > 0){
                        $scope.topicList = $scope.topicList.concat(result.topicList);
                    } else {
                        $scope.topicList = result.topicList;
                        if ($scope.topicList.length < 10){
                            $(".weui-infinite-scroll").html('');
                        } else {
                            $(".weui-infinite-scroll").html('<p class="loading"><div class="infinite-preloader"></div>正在加载...</p>')
                            loading = false;
                        }
                    }
                    if ($scope.userList && $scope.userList.length > 0){
                        $scope.userList = $scope.userList.concat(result.userList);
                    } else {
                        $scope.userList = result.userList;
                    }
                    $scope.tagList = result.tagList;
                    operateData();
                    if(!$scope.$$phase){
                        $scope.$apply();
                    }
                } else {
                    $(".weui-infinite-scroll").html('<p class="bottomNoMore"><div class="infinite-preloader"></div>没有更多</p>')
                    loading = true;
                }
            }
        },function(err){

        });
    };

    // 初始化数据
    $scope.initData($rootScope.topicViewNavId, true);
    // 处理数据
    function operateData() {
        // 处理数据
        for (i in $scope.topicList) {
            var topic = $scope.topicList[i];
            var posterId = topic.posterId;
            if (posterId == $scope.passport.passportId){
                topic.ownFlag = true;
            } else {
                topic.ownFlag = false;
            }
            for (k in $scope.userList) {
                var user = $scope.userList[k];
                if (posterId == user.id) {
                    topic.nickName = user.nickName;
                    topic.posterIcon = user.icon;
                    break;
                }
            }

            var likedStr = '';
            var tagStr = '';
            // var passportLiked = false;
            topic.passportLiked = false;
            // 点赞数据
            for (j in topic.likesIdList) {
                var userId = topic.likesIdList[j];
                var passportLiked = false;
                if (userId == $scope.passport.passportId) {
                    passportLiked = true;
                    topic.passportLiked = true;
                }
                for (k in $scope.userList) {
                    var tempUserId = $scope.userList[k].id;
                    var nikeName = $scope.userList[k].nickName;
                    if (userId == tempUserId) {
                        if (passportLiked) {
                            likedStr = $scope.passport.nickName + ',' + likedStr;
                        } else {
                            likedStr += nikeName + ",";
                        }
                        break;
                    }
                }
            }
            // 标签数据
            for (t in topic.tag) {
                var tagId = topic.tag[t];
                for (y in $scope.tagList) {
                    var tempId = $scope.tagList[y].id;
                    var tagName = $scope.tagList[y].value;
                    if (tagId == tempId) {
                        tagStr += '#' + tagName + '#  ';
                    }
                }
            }
            // 回复数据
            for (a in topic.followVoList) {
                var commentPassport = false;
                var toId = topic.followVoList[a].toId;
                for (j in $scope.userList) {
                    var userId = $scope.userList[j].id;
                    var nickName = $scope.userList[j].nickName;
                    if (toId == userId) {
                        topic.followVoList[a].toName = nickName;
                        break;
                    }
                }
                var followerId = topic.followVoList[a].followerId;
                if (followerId == $scope.passport.passportId) {
                    commentPassport = true;
                }
                for (k in $scope.userList) {
                    var userId = $scope.userList[k].id;
                    var nickName = $scope.userList[k].nickName;
                    if (followerId == userId) {
                        topic.followVoList[a].followerName = nickName;
                        break;
                    }
                }
                topic.followVoList[a].commentPassport = commentPassport;
            }
            topic.likedStr = likedStr.substring(0, likedStr.lastIndexOf(","));
            topic.tagStr = tagStr;
            // topic.passportLiked = passportLiked;

            // 计算发布时间点
            var createTime = new Date().getTime() - topic.time;
            var remainTime = new Date().getTime() - createTime;
            // 相差天数
            var day = Math.floor(remainTime / (24 * 3600 * 1000));
            if (day > 0) {
                topic.viewTime = day + '天前';
            } else {
                // 天后面的剩余的小时
                var remainDayTime = remainTime % (24 * 3600 * 1000);
                var hour = Math.floor(remainTime / (3600 * 1000))
                if (hour > 0) {
                    topic.viewTime = hour + '小时前';
                } else {
                    // 计算相差分钟数
                    var remainHourTime = remainDayTime % (3600 * 1000);
                    // 小时后面剩余的分钟
                    var minute = Math.floor(remainHourTime / (60 * 1000))
                    if (minute > 0) {
                        topic.viewTime = minute + '分钟前';
                    } else {
                        topic.viewTime = 1 + '分钟前';
                    }
                }
            }
        }

        //定义文章长度
        const maxParagraphLength = 80;
        // 延迟出现
        setTimeout(function () {
            // 获取JSSDK
            configService.getJssdkInfo(window.location.href);
            // 隐藏右上角


            //定义文本
            $('.paragraph').each(function (index) {
                const paragraphText = $("#paragraph" + index).text();
                const paragraphLength = $("#paragraph" + index).text().length;

                //定义全文按钮
                const paragraphExtender = $('#paragraphExtender' + index);

                //定义全文按钮
                if (paragraphLength < maxParagraphLength) {
                    paragraphExtender.hide();
                } else {
                    $(this).html(paragraphText.substring(0, maxParagraphLength) + '...');
                }
            });

            var list = document.getElementById('list');
            var boxs = list.children;

            //删除节点
            function removeNode(node) {
                node.parentNode.removeChild(node);
            }
            //把事件代理到每条分享div容器
            for (var i = 0; i < boxs.length; i++) {
                //点击
                boxs[i].onclick = function (e) {
                    e = e || window.event;
                    var el = e.srcElement;
                    switch (el.className) {
                        //赞分享
                        case 'fa fa-thumbs-o-up':
                            praiseBox(el.parentNode.parentNode.parentNode, el);
                            break;
                        //赞分享
                        case 'fa fa-thumbs-up':
                            praiseBox(el.parentNode.parentNode.parentNode, el);
                            break;
                        //操作留言
                        case 'comment-operate':
                            operate(el);
                            break;
                    }
                };
            }

            /**
             * 赞分享
             * @param box 每个分享的div容器
             * @param el 点击的元素
             */
            function praiseBox(box, el) {
                var liketext = box.getElementsByClassName('liketext')[0];
                var praisesTotal = box.getElementsByClassName('liketext')[0].childNodes[1];
                var text = praisesTotal.innerHTML;
                var index = el.getAttribute("index");
                var passportLiked = el.getAttribute("passportLiked");
                var topicId = el.getAttribute("topicId");
                if (el.className == 'fa fa-thumbs-o-up') {
                    el.className = 'fa fa-thumbs-up';
                    if (text ==''){
                        text = $scope.passport.nickName;
                    } else {
                        text = $scope.passport.nickName + ',' + text;
                    }
                    praisesTotal.innerHTML = text;
                } else if (el.className == 'fa fa-thumbs-up') {
                    el.className = 'fa fa-thumbs-o-up';
                    text = text.substring($scope.passport.nickName.length + 1, text.length);
                    praisesTotal.innerHTML = text;
                }
                if (text.length > 0){
                    $("#liketext"+index).removeClass("ng-hide");
                } else {
                    $("#liketext"+index).addClass("ng-hide");
                }
                operatePraise(topicId);
            }

            /**
             * 操作留言
             * @param el 点击的元素
             */
            function operate(el) {
                var commentBox = el.parentNode.parentNode.parentNode;
                var txt = el.innerHTML;
                var user = commentBox.getElementsByClassName('user')[0].innerHTML;
                if (txt == '删除') {
                    var followId = el.getAttribute("followId");
                    $.confirm("您确定要删除吗?", "删除留言", function() {
                        removeNode(commentBox);
                        // 删除回复
                        deleteFollow(followId);
                    }, function() {
                        //取消操作
                    });
                }
            }
        },10);
    }

    // 评论框弹出
    $scope.showTextBox = function (topic) {
        $scope.toUserName = '';
        $scope.toUserId = '';
        $scope.topicId = topic.id;
        $("#textarea").val("");
        $("#textarea").attr('placeholder', '评论');
        $("#textBox").fadeIn();
        $("#zzDiv").attr("style", "transform-origin: 0px 0px 0px; opacity: 0.1; transform: scale(1, 1);")
        $("#zzDiv").fadeIn();
        $("#tabOrder").fadeOut();
        $('#textarea').trigger('focus');
    };

    // 隐藏评论框
    $scope.hideTextBox = function(){
        $("#textBox").fadeOut();
        $("#zzDiv").fadeOut();
        $("#tabOrder").fadeIn();
    };

    // 回复框弹出
    $scope.showCommentBox = function (comment, topicId) {
        $scope.toUserId = comment.followerId;
        $scope.toUserName = comment.followerName;
        $scope.topicId = topicId;
        $("#textarea").val("");
        $('#textarea').attr('placeholder', '回复 ' + comment.followerName + ':');
        $("#textBox").fadeIn();
        $("#zzDiv").attr("style", "transform-origin: 0px 0px 0px; opacity: 0.1; transform: scale(1, 1);")
        $("#zzDiv").fadeIn();
        $("#tabOrder").fadeOut();
        $('#textarea').trigger('focus');
    };
    
    // 显示全文或隐藏
    $scope.toggleFullParagraph = function (index, topic) {
        var txt = $("#paragraphExtender"+index).html();
        if (txt == '显示全文'){
            $("#paragraph"+index).html(topic.text);
            $("#paragraphExtender"+index).html('收起');
        } else {
            $("#paragraph"+index).html(topic.text.substring(0, maxParagraphLength) + '...');
            $("#paragraphExtender"+index).html('显示全文');
        }
    };

    // 预览图片
    $scope.previewImage = function(photoList, index){
        // 测试代码
        wx.ready(function() {
            wx.previewImage({
                current: photoList[index], // 当前显示图片的http链接
                urls: photoList // 需要预览的图片http链接列表
            });
        });
    };

    // 保存点赞数据
    function operatePraise(topicId) {
        var obj = {
            passportId : $scope.passport.passportId,
            token : $scope.passport.token,
            topicId : topicId
        };
        mainHomeService.likes(obj).then(function(data){
            console.log(data);
        },function(err){

        });
    }

    // 保存回复数据
    $scope.operateLeave = function() {
        if ($scope.toUserId == ''){
            $scope.toUserId = 0;
        }
        // 动态添加数据
        var text = $("#textarea").val();
        var commentBox = document.createElement('div');
        commentBox.className = 'comment-box clearfix';
        var str = '<div class="comment-content">' + '<p class="comment-text"><span class="user">'+ $scope.passport.nickName;
        if ($scope.toUserName != ''){
            str+= '</span> 回复 <span class="user">' + $scope.toUserName + '</span> ：'+ text +'</p>';
        } else {
            str+= '</span> ：' + text + '</p>';
        }
        str+='<p class="comment-time">' + '<a href="javascript:void(0);" class="comment-operate">删除</a>' + '</p>' + '</div>';
        commentBox.innerHTML = str;
        $("#commentList"+$scope.topicId).append(commentBox);

        var obj = {
            passportId : $scope.passport.passportId,
            token : $scope.passport.token,
            topicId : $scope.topicId,
            toId : $scope.toUserId,
            text : text
        };
        mainHomeService.createFollow(obj).then(function(data){
            console.log(data);
        },function(err){

        });
        // 隐藏评论框
        $scope.hideTextBox();
    };

    // 删除回复内容
    function deleteFollow(followId) {
        var obj = {
            passportId : $scope.passport.passportId,
            token : $scope.passport.token,
            followId : followId
        };
        mainHomeService.removeFollow(obj).then(function(data){
            console.log(data);
        },function(err){

        });
    }
    
    // 删除自己发的话题
    $scope.deleteOwnTopic = function (topicId) {
        $.confirm("您确定要删除吗?", "删除状态", function() {
            var obj = {
                passportId : $scope.passport.passportId,
                token : $scope.passport.token,
                topicId : topicId
            };
            mainHomeService.deleteOwnTopic(obj).then(function(data){
                if (data.status == "OK") {
                    $scope.initData($rootScope.topicViewNavId,true);
                }
            },function(err){

            });
        }, function() {
            //取消操作
        });
    };

    $scope.followPage = 2;
    // 加载更多回复内容
    $scope.loadMoreFollowVoList = function (topicId, followVoList) {
        var obj = {
            passportId : $scope.passport.passportId,
            token : $scope.passport.token,
            topicId : topicId,
            page : $scope.followPage,
            rows : 10
        };
        mainHomeService.loadMoreListFollow(obj).then(function(data){
            if (data.status == "OK") {
                if (data.result.list.length > 0){
                    var list = data.result.list;
                    // 回复数据
                    for (a in list) {
                        var commentPassport = false;
                        var toId = list[a].toId;
                        for (j in $scope.userList) {
                            var userId = $scope.userList[j].id;
                            var nickName = $scope.userList[j].nickName;
                            if (toId == userId) {
                                list[a].toName = nickName;
                                break;
                            }
                        }
                        var followerId = list[a].followerId;
                        if (followerId == $scope.passport.passportId) {
                            commentPassport = true;
                        }
                        for (k in $scope.userList) {
                            var userId = $scope.userList[k].id;
                            var nickName = $scope.userList[k].nickName;
                            if (followerId == userId) {
                                list[a].followerName = nickName;
                                break;
                            }
                        }
                        list[a].commentPassport = commentPassport;
                    }
                    for (var i in $scope.topicList){
                        var id = $scope.topicList[i].id;
                        if (topicId == id){
                            $scope.topicList[i].followVoList = $scope.topicList[i].followVoList.concat(data.result.list);
                        }
                    }
                    if(!$scope.$$phase){
                        $scope.$apply();
                    }
                    $scope.followPage++;
                }
            }
        },function(err){

        });
    };
    // 上拉刷新
    $("div.weui-pull-to-refresh").pullToRefresh().on("pull-to-refresh", function () {
        $scope.page = 1;
        setTimeout(function () {
            $(".comment-content").each(function(){
                $(this).remove();
            });
            $scope.initData($rootScope.topicViewNavId,true);
            $("div.weui-pull-to-refresh").pullToRefreshDone(); // 重置下拉刷新
        }, 1000);   //模拟延迟
    });

    // 下拉刷新
    $("div.weui-pull-to-refresh").infinite().on("infinite", function () {
        if (loading) return;
        $scope.page++;
        loading = true;
        setTimeout(function () {
            $scope.initData($rootScope.topicViewNavId,false);
            loading = false;
        }, 1000);   //模拟延迟
    });
    $(".infinite-preloader").on("show", function () { alert("it show!"); });
});

