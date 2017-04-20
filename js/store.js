var tabBarContainer = {
    type:"INDEX"
};//INDEX/ORDER
var store = {
   passport:{
       passportId:0,
       type:"",// | BLANK | UN_VERIFY | VERIFIED
       token:"",//登录口令,需要登录状态时，发送groupId和token
       token3:"",//微信openId
       nickName:"",
       gender:"",//M | F | B
       icon:"",
       mobile:"",
       wx:"",
       qq:""
   },
    //发现
  discovery:{
      navView: {
          key:"ALL",
          value:"全部"
      },
      topicList:[{
          id:1,
          type: "xxx",
          posterId:2222,
          posterName:"阳光过客",
          posterIcon:"images/img.jpeg",
          createTime:"1天前",
          text:"绿绿的小小的不知道是什么花，可惜只有小小的一支",
          photoList:["images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg"],
          followList:[{
              followerId:322332,
              followerName:"奇葩花",
              text:"绿绿的小小的不知道是什么花，可惜只有小小的一支"
          },{
              followerId:422332,
              followerName:"夏夏",
              text:"这朵花哪里买的啊"
          }],
          likeList:[{
              followerId:322332,
              followerName:"奇葩花"
          },{
              followerId:422332,
              followerName:"夏夏"
          }]
      },{
          id:2,
          type:"xxx",
          posterId:2222,
          posterName:"阳光过客2",
          posterIcon:"images/img.jpeg",
          createTime:"2天前",
          text:"绿色是洋桔梗的花苞",
          photoList:["images/img.jpeg"],
          followList:[{
              followerId:322332,
              followerName:"奇葩花2",
              text:"这朵花真好看"
          },{
              followerId:422332,
              followerName:"夏夏2",
              text:"是的呢，真的好好看"
          }],
          likeList:[{ //点赞
              followerId:322332,
              followerName:"奇葩花2"
          },{
              followerId:422332,
              followerName:"夏夏2"
          },{
              followerId:422333,
              followerName:"性感小幺鸡2"
          }]
      }]
  },
    //商城
  mall:{
      viewCateory: [
          {
              id: 1,
              name: "阅花"
          },
          {
              id: 2,
              name: "品茶"
          }
      ],
      itemList: [
          {
              type: "FORWARD",
              goodsId: 1,
              defaultSkuId: 321,
              title: "花盼 | 繁花絮事",
              description: "每周一束，每月4次，品种随机",
              mainPic: "images/img.jpeg",
              minPrice: 188,
              maxPrice: 998
          },
          {
              type: "FORWARD",
              goodsId: 2,
              defaultSkuId: 421,
              title: "偏爱 | 玫瑰",
              description: "每周一束，每月4次",
              mainPic: "images/img.jpeg",
              minPrice: 388,
              maxPrice: 1028
          }
      ],
      normalItemList : [
          {
              type: "NORMAL",
              goodsId: 3,
              title: "上好的龙井茶",
              description: "特级，味道极佳。",
              mainPic: "images/tea.jpg",
              minPrice: 188,
              maxPrice: 998
          }
      ]
  },
    item : {
        type: "FORWARD",
        goodsId:1,
        defaultSkuId:321,
        title:"花盼 | 繁花絮事",
        description:"每周一束，每月4次，品种随机",
        mainPic:["images/img.jpeg","images/12.png","images/13.png","images/14.png"],
        minPrice:188,
        maxPrice:1198,
        skuList:[{
            skuId: 321,
            price:188,
            quantity: 100000
        },{
            skuId: 322,
            price:528,
            quantity: 100000
        },{
            skuId: 323,
            price:998,
            quantity: 100000
        },{
            skuId: 324,
            price:1080,
            quantity: 100000
        },{
            skuId: 421,
            price:288,
            quantity: 100000
        },{
            skuId: 422,
            price:628,
            quantity: 100000
        },{
            skuId: 423,
            price:1098,
            quantity: 100000
        },{
            skuId: 424,
            price:1198,
            quantity: 100000
        }],
        skuPropertyList:[
            {
                id:22,
                name:"收货次数",
                eleList:[
                    {
                        id:1,
                        pid:22,
                        isSelected:0,
                        skuList:[321,421],
                        isAvailable:1,//每次选择后，要根据选择的skuId,遍历刷新
                        value:"一个月4次"
                    },{
                        id:2,
                        pid:22,
                        isSelected:0,
                        skuList:[322,422],
                        isAvailable:1,
                        value:"三个月12次"
                    },{
                        id:3,
                        pid:22,
                        isSelected:0,
                        skuList:[323,423],
                        isAvailable:1,
                        value:"六个月24次"
                    },{
                        id:4,
                        pid:22,
                        isSelected:0,
                        skuList:[324,424],
                        isAvailable:1,
                        value:"九个月36次"
                    }
                ]
            },{
                id:33,
                name:"包装",
                eleList:[
                    {
                        id:5,
                        pid:33,
                        isSelected:0,
                        skuList:[321,322,323,324],
                        isAvailable:1,//每次选择后，要根据选择的skuId,遍历刷新
                        value:"普通"
                    },{
                        id:6,
                        pid:33,
                        isSelected:0,
                        skuList:[421,422,423,424],
                        isAvailable:1,
                        value:"礼盒"
                    }
                ]
            }
        ],
        attachment:{////如果null,不顯示
            viewCategoryName: "配套商品",
            list: [
                {
                    goodsId:10,
                    defaultSkuId:3210,
                    title:"花剪",
                    skuList:[{
                        skuId: 3210,
                        price:10,
                        quantity: 100000
                    },{
                        skuId: 3220,
                        price:11,
                        quantity: 100000
                    },{
                        skuId: 3230,
                        price:12,
                        quantity: 100000
                    }
                    ],
                    skuPropertyList:[
                        {
                            id:100,
                            name:"",
                            eleList:[
                                {
                                    id:7,
                                    pid:100,
                                    isSelected:0,
                                    skuList:[3210],
                                    isAvailable:1,//每次选择后，要根据选择的skuId,遍历刷新
                                    value:"夢幻粉"
                                },{
                                    id:8,
                                    pid:100,
                                    isSelected:0,
                                    skuList:[3220],
                                    isAvailable:1,
                                    value:"魅惑紫"
                                },{
                                    id:9,
                                    pid:100,
                                    isSelected:0,
                                    skuList:[3230],
                                    isAvailable:1,
                                    value:"天空藍"
                                }
                            ]
                        }
                    ]
                }
            ]
        }

    },normalItem : {
        type: "NORMAL",
        goodsId:1,
        defaultSkuId:321,
        title:"上好的龙井茶",
        description:"味道极佳",
        mainPic:["images/tea.jpg","images/tea1.jpg"],
        minPrice:1888,
        maxPrice:2888,
        skuList:[{
            skuId: 521,
            price:2888,
            quantity: 100000
        },{
            skuId: 621,
            price:1888,
            quantity: 100000
        }],
        skuPropertyList:[
            {
                id:55,
                name:"等级",
                eleList:[
                    {
                        id:1,
                        pid:55,
                        isSelected:0,
                        skuList:[521],
                        isAvailable:1,//每次选择后，要根据选择的skuId,遍历刷新
                        value:"特级"
                    },{
                        id:2,
                        pid:55,
                        isSelected:0,
                        skuList:[621],
                        isAvailable:1,
                        value:"一级"
                    }
                ]
            }
        ]
    },
  orderListView: {
      type: "FORWARD",//FORWARD | GROUPON | CROWD_FUNDING (FORWARD:订单,GROUPON: 拼团)
      navView: [{
          /*
          ORDER_CREATED, 未付款，需要增加去支付按钮
          ORDER_PAID,服务中
          ORDER_FINISHED,已完成
           */
             key: "ALL",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
             value: "全部"
          },
          {
              key: "ORDER_CREATED",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
              value: "未付款"
          },
          {
              key: "ORDER_PAID",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
              value: "服务中"
          },
          {
              key: "ORDER_FINISHED",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
              value: "已完成"
          }
      ],
      page:1,
      rows:20,
      list: [
          {
              id:2323223,
              viewId:"e2434344467744344",
              skuId:3442,
              title:"混合花束, 每月4次",
              notes:"定几个月：３个月,送达日期:周一",//如果没有，这行不显示
              quantity: 3,
              price:260,
              status: 'ORDER_CREATED',
              type : 'NORMAL',
              mainPic:"images/img.jpeg",
              createTime: '2017-03-11 12:12:12'
          },
          {
              id:2323235,
              viewId:"e24343444677443432",
              skuId:3442,
              title:"特级|龙井茶",
              notes:"一定要是特级的。",//如果没有，这行不显示
              quantity: 3,
              price:300,
              status:'ORDER_FINISHED',
              type : 'NORMAL',
              mainPic:"images/img.jpeg",
              createTime: '2017-03-11 12:12:12'
          },
          {
              id:2323236,
              viewId:"e24343444677443433",
              skuId:3442,
              title:"混合花束, 每月4次",
              notes:"定几个月：３个月,送达日期:周一",//如果没有，这行不显示
              quantity: 3,
              price:300,
              status:'ORDER_FINISHED',
              type:'FORWARD',
              mainPic:"images/img.jpeg",
              createTime: '2017-03-11 12:12:12'
          },
          {
              id:2323237,
              viewId:"e24343444677443434",
              skuId:3442,
              title:"混合花束, 每月4次",
              notes:"定几个月：３个月,送达日期:周一",//如果没有，这行不显示
              quantity: 3,
              price:300,
              status:'ORDER_PAID',
              type : 'FORWARD',
              mainPic:"images/img.jpeg",
              createTime: '2017-03-11 12:12:12'
          }
      ]
  },

    orderListNoPayView: {
        type: "FORWARD",//FORWARD | GROUPON | CROWD_FUNDING (FORWARD:订单,GROUPON: 拼团)
        navView: [{
            /*
             ORDER_CREATED, 未付款，需要增加去支付按钮
             ORDER_PAID,服务中
             ORDER_FINISHED,已完成
             */
            key: "ALL",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
            value: "全部"
        },
            {
                key: "ORDER_CREATED",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
                value: "未付款"
            },
            {
                key: "ORDER_PAID",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
                value: "服务中"
            },
            {
                key: "ORDER_FINISHED",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
                value: "已完成"
            }
        ],
        page:1,
        rows:20,
        list: [
            {
                id:2323223,
                viewId:"e2434344467744344",
                skuId:3442,
                title:"特级|极品龙井茶",
                notes:"一定要特级得",//如果没有，这行不显示
                quantity: 3,
                price:260,
                status: 'ORDER_CREATED',
                type : 'NORMAL',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-11 12:12:12'
            },
            {
                id:2323235,
                viewId:"e24343444677443432",
                skuId:3442,
                title:"混合花束, 每月4次",
                notes:"定几个月：３个月,送达日期:周一",//如果没有，这行不显示
                quantity: 3,
                price:300,
                status:'ORDER_CREATED',
                type : 'FORWARD',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-11 12:12:12'
            },
            {
                id:2323236,
                viewId:"e24343444677443433",
                skuId:3442,
                title:"混合花束, 每月4次",
                notes:"定几个月：5个月,送达日期:周一",//如果没有，这行不显示
                quantity: 3,
                price:300,
                status:'ORDER_CREATED',
                type : 'FORWARD',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-11 12:12:12'
            },
            {
                id:2323237,
                viewId:"e24343444677443434",
                skuId:3442,
                title:"混合花束, 每月4次",
                notes:"定几个月：３个月,送达日期:周一",//如果没有，这行不显示
                quantity: 3,
                price:300,
                status:'ORDER_CREATED',
                type : 'FORWARD',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-11 12:12:12'
            }
        ]
    },

    orderListInServiceView: {
        type: "FORWARD",//FORWARD | GROUPON | CROWD_FUNDING (FORWARD:订单,GROUPON: 拼团)
        navView: [{
            /*
             ORDER_CREATED, 未付款，需要增加去支付按钮
             ORDER_PAID,服务中
             ORDER_FINISHED,已完成
             */
            key: "ALL",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
            value: "全部"
        },
            {
                key: "ORDER_CREATED",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
                value: "未付款"
            },
            {
                key: "ORDER_PAID",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
                value: "服务中"
            },
            {
                key: "ORDER_FINISHED",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
                value: "已完成"
            }
        ],
        page:1,
        rows:20,
        list: [
            {
                id:2323223,
                viewId:"e2434344467744344",
                skuId:3442,
                title:"特级|龙井茶",
                notes:"一定要特级的",//如果没有，这行不显示
                quantity: 3,
                price:290,
                status: 'ORDER_PAID',
                type :'NORMAL',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-11 12:12:12'
            },
            {
                id:2323235,
                viewId:"e24343444677443432",
                skuId:3442,
                title:"粉色妖姬",
                notes:"定几个月：３个月,送达日期:周一",//如果没有，这行不显示
                quantity: 3,
                price:310,
                status:'ORDER_PAID',
                type : 'FORWARD',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-11 12:12:12'
            },
            {
                id:2323236,
                viewId:"e24343444677443433",
                skuId:3442,
                title:"蓝色妖姬",
                notes:"定几个月：5个月,送达日期:周一",//如果没有，这行不显示
                quantity: 3,
                price:300,
                status:'ORDER_PAID',
                type :'FORWARD',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-11 12:12:12'
            },
            {
                id:2323237,
                viewId:"e24343444677443434",
                skuId:3442,
                title:"经典玫瑰",
                notes:"定几个月：３个月，送达日期:周一",//如果没有，这行不显示
                quantity: 3,
                price:300,
                status:'ORDER_PAID',
                type :'FORWARD',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-11 12:12:12'
            }
        ]
    },

    orderListCompletedView: {
        type: "FORWARD",//FORWARD | GROUPON | CROWD_FUNDING (FORWARD:订单,GROUPON: 拼团)
        navView: [{
            /*
             ORDER_CREATED, 未付款，需要增加去支付按钮
             ORDER_PAID,服务中
             ORDER_FINISHED,已完成
             */
            key: "ALL",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
            value: "全部"
        },
            {
                key: "ORDER_CREATED",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
                value: "未付款"
            },
            {
                key: "ORDER_PAID",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
                value: "服务中"
            },
            {
                key: "ORDER_FINISHED",//ALL|ORDER_CREATED|ORDER_PAID|ORDER_FINISHED
                value: "已完成"
            }
        ],
        page:1,
        rows:20,
        list: [
            {
                id:2323223,
                viewId:"e2434344467744344",
                skuId:3442,
                title:"经典黄色妖姬",
                notes:"定几个月：1个月,送达日期:周二",//如果没有，这行不显示
                quantity: 3,
                price:590,
                status: 'ORDER_PAID',
                type : 'FORWARD',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-10 12:12:12'
            },{
                id:2323223,
                viewId:"e2434344467744344",
                skuId:3442,
                title:"特级龙井茶",
                notes:"一定要特级得",//如果没有，这行不显示
                quantity: 3,
                price:590,
                status: 'ORDER_PAID',
                type : 'NORMAL',
                mainPic:"images/img.jpeg",
                createTime: '2017-03-10 12:12:12'
            }
        ]
    },
  orderForwardDetailsView: {
      id:2323223,
      viewId:"e2434344467744344",
      skuId:3442,
      status:"ORDER_CREATED",
      type : 'FORWARD',
      title:"混合花束, 每月4次",
      description:"ssssssssssssssssssssssssssss",
      notes:"不需要百合花",
      quantity: 3,
      price:260,
      mainPic:"images/img.jpeg",
      forwardPlan: {
          times:4,
          month:2,
          dayOfWeek:'五',
          nextDeliveryDay:2017-4-10
      },
      forwardList:[
          {//forward
              forwardPlanId:1,
              id:1,
              status:"ORDER_CREATED"
          }
      ],
      orderAddress:{
          orderId:2323223,
          province:"上海",
          city:"闵行区",
          address:"xxxx",
          tel:"13899971234",
          receiver:"rws"
      }
  },
    my:{
        id:2332,
        name:"xxxx",
        yiiBean:323332,
        icon:'images/img.jpeg',
        oderBrief:{
            created:1,
            paid:1,
            finished:1,
            unComment:0
        },
        grouponBrief:{
            ing:1,
            success:0,
            handled:1
        },
        cs:"xxxx.html"
    },
    addressList: [
        {
            id:1,
            country:"中国",
            province:"上海",
            city:"上海市",
            area:"长宁区",
            address:"爱博五村",
            receiver:"雪梅",
            tel:"17756619217",
            isDefault : 0
        },
        {
            id:2,
            country:"中国",
            province:"上海",
            city:"上海市",
            area:"长宁区",
            address:"爱博三村401111号",
            receiver:"小马",
            tel:"17756619217",
            isDefault : 0
        },
        {
            id:3,
            country:"中国",
            province:"上海",
            city:"上海市",
            area:"黄浦区",
            address:"爱博三村",
            receiver:"娜娜",
            tel:"17756619217",
            isDefault : 1
        }
    ],
    defaultAddress : {
        id:0,
        country:"",
        province:"",
        city:"",
        area:"",
        address:"",
        receiver:"",
        tel:"",
        isDefault : 1
    },
    forwardPlanList: [
        {
            firstDeliveryDay: '2017-03-13',
            dayOfWeek: 2
        },
        {
            firstDeliveryDay: '2017-03-18',
            dayOfWeek: 7
        },
        {
            firstDeliveryDay: '2017-03-20',
            dayOfWeek: 2
        },
        {
            firstDeliveryDay: '2017-03-25',
            dayOfWeek: 7
        }
        ,
        {
            firstDeliveryDay: '2017-03-27',
            dayOfWeek: 2
        },
        {
            firstDeliveryDay: '2017-04-01',
            dayOfWeek: 7
        },
        {
            firstDeliveryDay: '2017-04-03',
            dayOfWeek: 2
        },
        {
            firstDeliveryDay: '2017-04-08',
            dayOfWeek: 7
        }
    ],
    orderDetails : {
        type:"FORWARD",
        id:2323223,
        viewId:"e2434344467744344",
        skuId:3442,
        title:"混合花束, 每月4次",
        notes:"订购期限：３个月,送达日期:周一",//如果没有，这行不显示
        quantity: 1,
        price:260,
        status: 'ORDER_PAID',
        mainPic:"images/img.jpeg",
        createTime: '2017-03-11 12:12:12',
        forwardPlan : {
            times:4,
            month:3,
            dayOfWeek:6,//可修改, 修改后对第一个绿色生效
            nextDeliveryDay: "2017-4-17",// 可修改，修改后对第一个绿色生效
            forwardList: [
                {
                    id:1,
                    nextDeliveryDay:"2017-4-10",
                    status:"ORDER_PAID"//红色，只要不是 ORDER_CREATED, 都是红色
                },{
                    id:2,
                    nextDeliveryDay:"2017-4-17",
                    status:"ORDER_CREATED"//绿色，
                }

            ]
        },
        address:{
            id:1,
            country:"",
            province:"上海",
            city:"闵行",
            area:"虹桥",
            address:"万源新城26幢505",
            receiver:"小明",
            tel:"13634521345"
        }

    },
    delay : {
        from:"2017-03-21 周二",
        to:[
            "2017-03-25 周六",
            "2017-03-28 周二",
            "2017-04-01 周六",
            "2017-04-04 周二",
            "2017-04-08 周六",
            "2017-04-11 周二",
            "2017-04-15 周六",
            "2017-04-18 周二"
        ]
    },
    servingDetails : {
        status:"ORDER_FINISHED",//ORDER_PAID和ORDER_DELIVERED及ORDER_FINISHED,才会有sellerPhoto; ORDER_FINISHED buyer才能上传
        id:1,//第1次
        deliveryDay:'2017-03-14',// 发货日期，提前一天 2017-03-13
        dayOfWeek:3,//周二
        address:"上海市杨浦区平凉路568号 小明 13907812332",
        expressCarrier:"京东快递", // 如果存在就显示这一行 ， 和expressBill同时存在
        expressBill:"JD33233222",
        sellerPhoto:["images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg"]
        //buyerPhoto:["images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg","images/img.jpeg"]
    },
    normalOrderDetailsView : {
        type: "NORMAL",
        id:2323224,
        viewId:"e24343444677455334",
        skuId:521,
        status:"ORDER_FINISHED",
        title:"上好的龙井茶",
        description:"味道极佳",
        quantity: 500,
        quantityUnit: "g",
        price:2888,
        mainPic:"images/tea.jpg",
        createTime:"2017-03-10 08:30:22",
        orderAddress:{
            orderId:2323224,
            province:"上海",
            city:"闵行区",
            address:"xxxx",
            tel:"13899971234",
            receiver:"rws"
        },
        delivery: { // 没有就不显示
            deliveryTime: "2017-03-20 08:30:22",
            expressCarrier: "京东快递", // 如果存在就显示这一行 ， 和expressBill同时存在
            expressBill: "JD33233222"
        },
        sellerPhoto:["images/tea.jpg","images/tea1.jpg"]
    },
    topicView : {
        nav: [{
            id:1,
            key:"SHAI_SHAI",
            value:"晒晒"
        },{
            id:2,
            key:"INTEREST",
            value:"兴趣"
        }
        ],
        topicList:[{
            id:1,
            posterId:2222, //替换成user,的nickName
            posterAddress:"阳光过客",
            posterIcon:"images/img.jpeg",
            viewTime:1491833249982,
            tag:"[1,2]",
            text:"绿绿的小小的不知道是什么花，可惜只有小小的一支，可惜只有小小的一支，可惜只有小小的一支，可惜只有小小的一支，可惜只有小小的一支，可惜只有小小的一支，可惜只有小小的一支",
            photoStr:["http://static.yezaigou.com/images/img.jpeg","http://static.yezaigou.com/images/12.png","http://static.yezaigou.com/images/13.png","http://static.yezaigou.com/images/14.png"],
            followVoList:[{
                id:1,
                toId:0,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
                followerId:322332,//替换成user,的nickName
                text:"绿绿的小小的不知道是什么花，可惜只有小小的一支"
            },{
                id:2,
                toId:0,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
                followerId:322333,//替换成user,的nickName
                text:"花瓣都死了，以后不要发这些"
            },{
                id:3,
                toId:322332,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
                followerId:322333,//替换成user,的nickName
                text:"哈哈"
            },{
                id:4,
                toId:322333,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
                followerId:2222,//替换成user,的nickName
                text:"死了好多"
            }],
            likeList:[322332,2222]
        },{
            id:2,
            posterId:2222, //替换成user,的nickName
            posterAddress:"阳光过客",
            posterIcon:"images/img.jpeg",
            viewTime:1491829678978,
            tag:"[1,2]",
            text:"绿绿的小小的不知道是什么花，可惜只有小小的一支",
            photoStr:["http://static.yezaigou.com/images/tea.jpg","http://static.yezaigou.com/images/12.png","http://static.yezaigou.com/images/13.png","http://static.yezaigou.com/images/tea1.jpg"],
            followVoList:[{
                id:1,
                toId:0,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
                followerId:322332,//替换成user,的nickName
                text:"绿绿的小小的不知道是什么花，可惜只有小小的一支"
            },{
                id:2,
                toId:0,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
                followerId:322333,//替换成user,的nickName
                text:"花瓣都死了，以后不要发这些"
            },{
                id:3,
                toId:322332,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
                followerId:322333,//替换成user,的nickName
                text:"哈哈"
            },{
                id:4,
                toId:322333,//为0，表示直接回复topic；替换成user,的nickName，且前面加 TO
                followerId:2222,//替换成user,的nickName
                text:"死了好多"
            }],
            likeList:[322332,322333]
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
        },{//文本里的tag的id,显示时全替换成 #value#
            id:2,
            topicTypeId:2,// 晒晒 的编号s
            key:"FLOWER",
            value:"花" //显示: #花#
        }]

    }
};