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
        posterAddress:"上海 闵行",
        posterIcon:"images/img.jpeg",
        viewTime:120000,
        tag:"[1,2]",
        text:"绿绿的小小的不知道是什么花，可惜只有小小的一支",
        photoStr:["images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg"],
        followVoList:[{
            id:1,
            toId:0,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
            followerId:32232,//替换成user,的nickName
            text:"绿绿的小小的不知道是什么花，可惜只有小小的一支"
        },{
            id:2,
            toId:0,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
            followerId:32233,//替换成user,的nickName
            text:"花瓣都死了，以后不要发这些"
        },{
            id:3,
            toId:32232,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
            followerId:32233,//替换成user,的nickName
            text:"哈哈"
        },{
            id:3,
            toId:32233,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
            followerId:2222,//替换成user,的nickName
            text:"死了好多"
        }],
        likeList:[32233,422332]
    }],
    userList:[ //文本里的,posterId, toId,followerId,显示时全替换成 nickName
        {
            id:2222,
            nickName:"XXXX",
            wx:"",//微信号
            qq:""//QQ号
        },
        {
            id:322332,
            nickName:"小明",
            wx:"2wee32",//微信号
            qq:"782211223"//QQ号
        },{
            id:322333,
            nickName:"奇葩花",
            wx:"",//微信号
            qq:""//QQ号
        }
    ],
    tagList:[{//文本里的tag的id,显示时全替换成 #value#
        id:1,
        topicTypeId:1,// 晒晒 的编号s
        key:"ORDER",
        value:"订单" //显示: #订单#
    },{
        id:2,
        topicTypeId:1,// 晒晒 的编号s
        key:"FLOWER",
        value:"花" //显示: #订单#
    }]

}