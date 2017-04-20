passport = {
    groupId:2322, //userId
    type:"BLANK",// | BLANK | UN_VERIFY | VERIFIED
    token:"e45cfa4533",//登录口令,需要登录状态时，发送groupId和token
    token3:"xx33333333333333333333d",//微信openId
    nickName:"XXXX",
    gender:"M",//M | F | B
    icon:"http://xxxx",
    mobile:"13423423456",
    wx:"",
    qq:""
}

topicView = {
    nav: [{
        key:"SHAI_SHAI",
        value:"晒晒"
    },{
        key:"INTEREST",
        value:"兴趣"
    }
    ],
    topicList:[{
        id:1,
        posterId:2222, //替换成user,的nickName
        posterAddress:"阳光过客",
        posterIcon:"images/img.jpeg",
        createTime:1111222211123,
        tag: [{id:1,value:"订单"}],
        text:"绿绿的小小的不知道是什么花，可惜只有小小的一支",
        photoStr:["images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg"],
        followVoList:[{
            id:1,
            toId:32233,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
            followerId:322332,//替换成user,的nickName
            text:"绿绿的小小的不知道是什么花，可惜只有小小的一支"
        }],
        likeList:[{
            followerId:322332,
            nickName:"小明"
        },{
            followerId:422332,
            nickName:"奇葩花"
        }]
    }],
    tagList:[{//文本里的tag的id,显示时全替换成 #value#
        id:1,
        topicTypeId:1,// 晒晒 的编号s
        key:"ORDER",
        value:"订单" //显示: #订单#
    }]

}