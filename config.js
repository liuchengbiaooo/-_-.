/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

//var host = "my892599484.imwork.net:10484"
//var host = "http://192.168.1.117:9000"
var host = 'https://www.0751sgcfjy.com';
//var host = "https://dz.dzcyxt.cn"

var config = {

    // 下面的地址配合云端 Server 工作
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/index/login`,

    // 请求地址，用于获取首页Banner
    bannerUrl: `${host}/index/bannerList`,

    // 用code换取openId
    openIdUrl: `${host}/index/wxCode`,

    // 请求地址,用户获取商家列表
    getmerchant: `${host}/wooApi/merchant/search`,

    //添加或者删除购物车
    shoppingTrolley: `${host}/course/shoppCart`,

    // 请求地址,用户获取商家信息
    viewmerchant: `${host}/index/getAllCategoryParent`,

    findvoucherStatueUrl: `${host}/wooApi/merchant/findvoucher/statue`,

    //获取课程（搜索）通过二级分类ID查询课程 
    viewmerchantList: `${host}/course/getCourse`,

    //兴趣、研学分类的列表
    interestStudies: `${host}/course/getCourseElegantByType`,

    //兴趣、研学课程的详细信息
    interestStudiesID: `${host}/course/getCourseElegantById`,

    // 请求地址,收藏商家信息
    collectionUrl: `${host}/wooApi/merchant/collection`,

    // 请求地址,收藏商家信息
    addReserveUrl: `${host}/wooApi/merchant/add/reserve`,

    // 请求地址,收藏商家信息
    reserveUrl: `${host}/wooApi/merchant/reserve`,

    //查询预约课程
    searchReserveUrl: `${host}/optCourse/getCourseConsult`,

    //绑定学生编号
    bindingStudent: `${host}/index/bindStudent`,

    //绑定教师编号
    bindingTeacher: `${host}/index/bingTeacher`,

    //课堂风采列表
    classrooms: `${host}/classTeacher/getClassRecordByUserId`,

    //教师专栏列表
    teachersColumn: `${host}/classTeacher/getTeacherColumnByUserId`,

    //课堂风采列表详情
    classroomDetails: `${host}/classTeacher/getClassRecordById`,

    //教师专栏详情
    teachersColumnDetails: `${host}/classTeacher/getTeacherColumnById`,

    //教师我的课程
    myCourses: `${host}/course/getCourseByTeacher`,

    //查看教师是否有绑定编号
    teacherBianHao: `${host}/index/openIdIsExistBind`,
    //拿到教师的信息
    teacherData: `${host}/index/getTeacherInfoByUserId`,

    searchCategoryUrl: `${host}/index/getAllCategoryParent`,

    searchPromotionUrl: `${host}/wooApi/merchant/search/promotion`,

    findPromotionUrl: `${host}/wooApi/merchant/find/promotion`,

    findbusinessUrl: `${host}/wooApi/merchant/findbusiness`,

    zhongheUrl: `${host}/wooApi/merchant/zhonghe/pingjia`,

    findcascadeUrl: `${host}/wooApi/merchant/findcascade/category`,

    searchGiftUrl: `${host}/wooApi/points/gift/search`,

    searchGiftOrderUrl: `${host}/wooApi/points/gift/search/mygift`,

    detailGiftUrl: `${host}/wooApi/points/gift/detail`,

    getGifttotleUrl: `${host}/wooApi/points/gift/findgift/orderwzf`,

    confirmSubmitGiftUrl: `${host}/wooApi/points/gift/confirm/submit`,

    uploadUrl: `${host}/wooApi/upload/upload-image`,

    addCardVoucherUrl: `${host}/wooApi/merchant/addCardVoucher`,

    searchpProduct: `${host}/wooApi/merchant/search/product`,

    getSearchCardvouchers: `${host}/wooApi/merchant/search/cardvoucher`,

    personMycardvoucherUrl: `${host}/wooApi/person-central/search/mycard_voucher`,

    mycardvoucherUrl: `${host}/wooApi/cart/mycardvoucher`,

    // 请求地址,得到购物车数据
    cartListUrl: `${host}/course/shoppCartByUserId`,

    //用户订单列表
    userorderForm: `${host}/course/getCourseListByUserId`,

    //查询家长对应学生ID
    queryStudents: `${host}/course/getStudentListByUserId`,

    // 请求地址,加入购物车
    cartAddUrl: `${host}/wooApi/cart/add`,

    // 请求地址,操作购物车
    cartOperationUrl: `${host}/wooApi/cart/operation`,

    // 请求地址,用户获取商家列表
    searchMercantComUrl: `${host}/wooApi/merchant/search/comment`,

    // 请求地址,用户获取商家列表
    getFoodmenuUrl: `${host}/wooApi/merchant/foodmenu`,

    // 请求地址,产品信息
    getProductUrl: `${host}/wooApi/merchant/product`,

    // 请求地址,得到购物车数据，准备购物
    cartCheckoutUrl: `${host}/wooApi/cart/checkout`,

    // 请求地址,得到用户地址列表
    cartShptoListUrl: `${host}/wooApi/addr-central/shpto/list`,

    // 请求地址,保存用户地址
    cartShptoSaveUrl: `${host}/wooApi/addr-central/shipto/save`,

    // 请求地址,设置默认地址
    shptoDefaultUrl: `${host}/wooApi/addr-central/shipto/default`,

    // 请求地址,设置默认地址
    shptoDeleteUrl: `${host}/wooApi/addr-central/shipto/del`,

    // 请求地址,获取一个收货地址
    shiptoUrl: `${host}/wooApi/addr-central/shipto`,

    //支付订单
    paymentMoney: `${host}/courseWechatPay/pay`,

    //查看课程详情
    courseDetails: `${host}/course/getCourseById`,

    // 请求地址,订单生成
    orderSubmitUrl: `${host}/course/createOrder`,

    promotionSubmitUrl: `${host}/wooApi/cart/promotion/submit`,

    //请求地址，订单提交成功，获取订单信息
    orderSuccessUrl: `${host}/wooApi/order/success`,

    findTodayCourseNewUrl: `${host}/wooApi/order-central/findtoday/orderitem`,

    //请求地址，获取订单列表
    orderSearchListUrl: `${host}/wooApi/order-central/search`,

    //请求地址，获取订单详情
    orderDetailtUrl: `${host}/wooApi/order-central/detail`,

    //请求地址，订单取消交易
    orderCanceltUrl: `${host}/course/deleteOrder`,

    findOrderNumberltUrl: `${host}/wooApi/order-central/findOrder/number`,

    //请求地址，订单发表评论
    orderCommenttUrl: `${host}/wooApi/order-central/submit/comment`,

    //请求地址，我的收藏
    personCollectionUrl: `${host}/wooApi/person-central/search/collection`,

    //请求地址，我的收藏
    personPaymentinfoUrl: `${host}/wooApi/person-central/search/paymentinfo`,

    pointsdateUrl: `${host}/wooApi/person-central/points/date`,

    pointsSigninUrl: `${host}/wooApi/person-central/points/signin`,

    gettotleUrl: `${host}/wooApi/person-central/gettotle/points`,

    searchPointsUrl: `${host}/wooApi/person-central/search/points`,

    createPosterUrl: `${host}/wooApi/person-central/create/poster`,

    addJigouRuzhuUrl: `${host}/wooApi/person-central/enter/mechanism`,

    // 生成支付订单的接口
    paymentUrl: `${host}/wooApi/wechat/pay`,

    // 发送模板消息接口
    templateMessageUrl: `${host}/templateMessage`,

    // 上传文件接口
    uploadFileUrl: `${host}/upload`,

    // 下载示例图片接口
    downloadExampleUrl: `${host}/static/weapp.jpg`
};

module.exports = config