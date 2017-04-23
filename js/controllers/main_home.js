/**
 * Created by kingson·liu on 17/3/8.
 */
goceanApp.controller('MainHomeCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, mainHomeService, localStorageService,wxUserInfoService,configService) {

    var params = configService.parseQueryString(window.location.href);
    params.nickName = Base64.decode(params.nickName);
    var passport = params;
    $rootScope.passport = params;

    if (passport.passportId == 0 || passport.type == "" || passport.type == "BLANK") {
        wxUserInfoService.getUserInfo();
    }

    var tabIndex = 0;

    $rootScope.topicView = store.topicView;
    if ($rootScope.topicViewNav == null) {
        $rootScope.topicViewNav = store.topicView.nav[0];
    }
    tabIndex = $rootScope.topicViewNav.id - 1;
    // 底部tab选中
    $("#activeHomePage").addClass('weui_active').siblings().removeClass('weui_active');
    $('#tab1').tab({defaultIndex:tabIndex,activeClass:"tab-green"});


    $scope.page = 1;
    $scope.rows = 10;

    var obj = {
        type:$rootScope.topicViewNav.id,
        page:$scope.page,
        rows:$scope.rows,
        orderBy:"id",
        sc:"desc"
    };

    mainHomeService.listTopic(obj).then(function(data){
        if (data.status == "OK"){
            var result = data.result;
            $scope.topicList = result.topicList;
            $scope.userList = result.userList;
            $scope.tagList = result.tagList;

            // if(!$scope.$$phase){
            //     $scope.$apply();
            // }
            init();
        }

    },function(err){

    });

    function init() {

        // 处理数据
        for (i in $scope.topicList) {
            var topic = $scope.topicList[i];

            var posterId = topic.posterId;
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
            var passportLiked = false;
            // 点赞数据
            for (j in topic.likesIdList) {
                var userId = topic.likesIdList[j];
                if (userId == passport.passportId) {
                    passportLiked = true;
                }
                for (k in $scope.userList) {
                    var tempUserId = $scope.userList[k].id;
                    var nikeName = $scope.userList[k].nickName;
                    if (userId == tempUserId) {
                        if (passportLiked) {
                            likedStr = passport.nickName + ',' + likedStr;
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
                if (followerId == passport.passportId) {
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
            topic.passportLiked = passportLiked;

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
            getJssdkInfo();
            function getJssdkInfo() {
                var sdkObj = {
                    url:location.href.split('#')[0]
                };
                mainHomeService.getJssdkInfo(sdkObj).then(function(data){
                    if (data){
                        setWxconfig(data);
                    }
                },function(err){

                });
            }

            // 配置微信config
            function setWxconfig(data) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.result.appId, // 必填，公众号的唯一标识
                    timestamp: data.result.timestamp , // 必填，生成签名的时间戳
                    nonceStr: data.result.noncestr, // 必填，生成签名的随机串
                    signature: data.result.signature,// 必填，签名，见附录1
                    jsApiList: ['chooseImage', 'uploadImage', 'previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }

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

            var toUserName = '';
            var toUserId = '';
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
                        //回复按钮蓝
                        case 'btn':
                            reply(el.parentNode.parentNode.parentNode, el);
                            break;
                        //回复按钮灰
                        case 'btn btn-off':
                            clearTimeout(timer);
                            break;
                        //操作留言
                        case 'comment-operate':
                            operate(el);
                            break;
                    }
                };
                //评论
                var textArea = boxs[i].getElementsByClassName('comment')[0];
                //评论获取焦点
                textArea.onfocus = function () {
                    this.parentNode.className = 'text-box text-box-on';
                    if (this.value != ''){
                        this.value = '';
                    }
                    this.onkeyup();
                };
                //评论失去焦点
                textArea.onblur = function () {
                    var me = this;
                    var val = me.value;
                    if (val == '') {
                        setTimeout(function () {
                            me.value = '评论…';
                            me.parentNode.className = 'text-box';
                        }, 200);
                    }
                };
                //评论按键事件
                textArea.onkeyup = function () {
                    var val = this.value;
                    var len = val.length;
                    var els = this.parentNode.children;
                    var btn = els[1];
                    var word = els[2];
                    if (len <=0 || len > 140) {
                        btn.className = 'btn btn-off';
                    } else {
                        btn.className = 'btn';
                    }
                    word.innerHTML = len + '/140';
                }
            }
            /**
             * 发评论
             * @param box 每个分享的div容器
             * @param el 点击的元素
             */
            function reply(box, el) {
                var commentList = box.getElementsByClassName('comment-list')[0];
                var textarea = box.getElementsByClassName('comment')[0];
                var commentBox = document.createElement('div');
                var text_box = box.getElementsByClassName('text-box')[0];
                var topicId = el.getAttribute("topicId");
                commentBox.className = 'comment-box clearfix';
                commentBox.setAttribute('user', 'self');
                var str = '<div class="comment-content">' + '<p class="comment-text"><span class="user">'+ passport.nickName;
                if (toUserName != ''){
                    str+= '</span> 回复 <span class="user">' + toUserName + '</span>：'+ textarea.value +'</p>';
                } else {
                    str+= '：</span>' + textarea.value + '</p>';
                }
                str+='<p class="comment-time">' + '<a href="javascript:;" class="comment-operate">删除</a>' + '</p>' + '</div>';
                commentBox.innerHTML = str;
                commentList.appendChild(commentBox);
                // 保存回复内容
                operateLeave(topicId,toUserId,textarea.value);
                textarea.value = '';
                toUserName = '';
                toUserId = '';
                text_box.style.display = 'none';

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
                        text = passport.nickName;
                    } else {
                        text = passport.nickName + ',' + text;
                    }
                    praisesTotal.innerHTML = text;
                } else if (el.className == 'fa fa-thumbs-up') {
                    el.className = 'fa fa-thumbs-o-up';
                    text = text.substring(passport.nickName.length + 1, text.length);
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
                var box = commentBox.parentNode.parentNode.parentNode;
                var txt = el.innerHTML;
                var user = commentBox.getElementsByClassName('user')[0].innerHTML;
                var textBox = box.getElementsByClassName('text-box')[0];
                var textarea = box.getElementsByClassName('comment')[0];
                if (txt == '回复') {
                    toUserId = el.getAttribute("toUserId");
                    textBox.style.display = 'block';
                    textarea.value = '回复'+ user + '：';
                    toUserName = user;
                    textarea.onkeyup();
                } else {
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
    $scope.showTextBox = function (id) {
        $("#textBox"+id).show();
        $("#textBox"+id ).find('textarea').val('评论…');
        $("#textBox"+id ).removeClass().addClass('text-box');
    };

    // 隐藏评论框
    $scope.hideTextBox = function(id){
        $("#textBox"+id).hide();
        $("#textBox"+id ).find('textarea').val('评论…');
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
    $scope.previewImage = function(photoList){
        // 测试代码
        wx.ready(function() {
            wx.previewImage({
                current: photoList[0], // 当前显示图片的http链接
                urls: photoList // 需要预览的图片http链接列表
            });
        });
    };

    // 保存点赞数据
    function operatePraise(topicId) {
        var obj = {
            passportId : $rootScope.passport.passportId,
            token : $rootScope.passport.token,
            topicId : topicId
        };
        mainHomeService.likes(obj).then(function(data){
            console.log(data);
        },function(err){

        });
    }

    // 保存回复数据
    function operateLeave(topicId,toUserId,text) {
        if (toUserId == ''){
            toUserId = 0;
        }
        var obj = {
            passportId : $rootScope.passport.passportId,
            token : $rootScope.passport.token,
            topicId : topicId,
            toId : toUserId,
            text : text
        };
        mainHomeService.createFollow(obj).then(function(data){
            console.log(data);
        },function(err){

        });
    }

    // 删除回复内容
    function deleteFollow(followId) {
        var obj = {
            passportId : $rootScope.passport.passportId,
            token : $rootScope.passport.token,
            followId : followId
        };
        mainHomeService.removeFollow(obj).then(function(data){
            console.log(data);
        },function(err){

        });
    }
});

