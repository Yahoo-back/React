import {post,get} from './ajax';

//1.登录相关
// export const getVerificationCode = param => post('/ums/user/verificationPictureCode', param, 'blob');
export const login = param => post('/admin/login', param);

// 退出登录
export const logout = param => post('/admin/logout', param);

//2.初始化左侧菜单列表
export const initMenu = param => get('/admin/permission/'+ sessionStorage.getItem('userId'), param);

//商品列表
export const productList = param => get('/product/qryProductList?' +'pageSize='+param.pageSize+'&pageNum='+param.pageNum+'&name_cnd='+param.name_cnd+'&is_hot_cnd='
+param.is_hot_cnd+'&classify_cnd='+param.classify_cnd+'&position_cnd='
+param.position_cnd+'&status_cnd='+param.status_cnd+'&create_time_FROM_cnd='+param.create_time_FROM_cnd+'&create_time_TO_cnd='+param.create_time_TO_cnd, param);

//商品分类
export const classify = param => get('/product/qryProductClassifyAll', param);

// OSS上传签名获取
export const uploadPassCode = param => post('bag/oss/account', param);

//3. 菜品统计分类 增删改查
export const dishesCategoryList = param => post('restaurant/foodTopGroup/list', param);
export const dishesCategoryAdd = param => post('restaurant/foodTopGroup/add', param);
export const dishesCategoryUpdate = param => post('restaurant/foodTopGroup/update', param);
export const dishesCategoryDelete = param => post('restaurant/foodTopGroup/delete', param);

//4. 标签设置 增删改查
export const labelList = param => post('restaurant/label/page', param);
export const labelAdd = param => post('restaurant/label/add', param);
export const labelUpdate = param => post('restaurant/label/update', param);
export const labelDelete = param => post('restaurant/label/delete', param);

//5.个人中心修改密码
export const pwdModify = param => post('ums/user/updatePassword/token', param);

//6.用户管理
//6.1权限管理
export const authorityList = param => post('/ums/role/list', param);
export const authorityAdd = param => post('/ums/role/add', param);
export const authorityDelete = param => post('/ums/role/delete', param);
export const resourceList = param => post('/ums/resource/list', param);
//6.2角色管理
export const roleAdd = param => post('/ums/group/add', param);
export const roleList = param => post('/ums/group/list', param);
export const roleInfo = param => post('/ums/group/info', param);
export const roleUpdate = param => post('/ums/group/update', param);
export const roleDelete = param => post('/ums/group/delete', param);
//6.3人员管理
export const staffAdd = param => post('restaurant/employee/add', param);
export const staffList = param => post('restaurant/employee/page', param);
export const staffInfo = param => post('restaurant/employee/info', param);
export const staffUpdate = param => post('restaurant/employee/update', param);
export const staffDelete = param => post('restaurant/employee/delete', param);
//6.4 组别管理
export const categoryList = () => post('restaurant/foodGroup/list', {});
export const categoryAdd = param => post('restaurant/foodGroup/add', param);
export const categoryUpdate = param => post('restaurant/foodGroup/update', param);
export const categoryDelete = foodGroupId => post('restaurant/foodGroup/delete', { foodGroupId: foodGroupId});
export const categoryDrag = (foodGroupId, targetId) => post('restaurant/foodGroup/list/sort', {foodGroupId: foodGroupId, targetId: targetId});


//7.banner 增删改查
export const bannerList = param => post('/restaurant/banner/page', param);
export const bannerDelete = param => post('/restaurant/banner/delete', param);
export const bannerAdd = param => post('/restaurant/banner/add', param);
export const bannerUpdate = param => post('/restaurant/banner/update', param);
export const bannerRestaurantList = param => post('restaurant/banner/restaurant/list',param);

//8.经销商管理 增删改查
export const dealerList = param => post('restaurant/agent/list', param);
export const dealerAdd = param => post('restaurant/agent/add', param);
export const dealerDelete = agentId => post('restaurant/agent/delete', {agentId: agentId});
export const dealerDetail = agentId => post('restaurant/agent/info', {agentId: agentId});
export const dealerUpdate = param => post('restaurant/agent/update', param);
export const verificationCodeByMobile = param => post('ums/user/verificationCode', param);

//9.门店管理
export const restaurantAdd = param => post('/restaurant/restaurant/add', param);
export const restaurantList = param => post('/restaurant/restaurant/audit/list', param);
export const restaurantInfo = param => post('/restaurant/restaurant/info', param);
export const restaurantUpdate = param => post('/restaurant/restaurant/update', param);
export const restaurantDelete = param => post('/restaurant/restaurant/delete', param);
export const restaurantAudit = param => post('restaurant/restaurant/audit',param);
export const restaurantManager = param => post('restaurant/employee/manager/list',param);


//10.菜品列表 增删改查
export const dishesList = param => post('restaurant/food/listPage/byType', param);
export const dishesDetail = foodId => post('restaurant/food/info', {foodId: foodId});
export const dishesAdd = param => post('restaurant/food/add', param);
export const dishesUpdate = param => post('restaurant/food/update', param);
export const dishesDelete = foodId => post('restaurant/food/delete', {foodId: foodId});
export const onLine = param => post('restaurant/food/onLine',param);
export const recommendation = param => post('restaurant/food/recommend',param);

//10.优惠券列表 增删改查
export const couponManagement = param => post('restaurant/coupon/web/page',param);
export const couponAdd = param => post('restaurant/coupon/add',param);
export const couponList = param => post('restaurant/food/list',param);
export const couponDel = param => post('restaurant/coupon/delete',param);

//11订单管理
//11.1 预约列表 删除
export const reservationList = param => post('restaurant/reserve/app/page', param);
export const reservationDel = param => post('restaurant/reserve/delete', param);
//11.2 订单列表
export const orderList = param => post('restaurant/order/web/page', param);
export const orderDetail = param => post('restaurant/order/detail', param);
export const orderDelete = param => post('restaurant/order/delete', param);

//12.对账管理
export const billPlatformList = param => post('restaurant/checkOrder/platform/list',param);
export const billPlatformInfo = param => post('restaurant/checkOrder/platform/detail',param);
export const billSystemList = param => post('restaurant/checkOrder/system/list',param);
export const billSystemInfo = param => post('restaurant/checkOrder/system/detail',param);




















































