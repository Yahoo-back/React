import React,{Component} from 'react';
import {Breadcrumb, Card, Form, Input, Button, message, DatePicker,Select,Radio,Checkbox} from 'antd';
import moment from 'moment';
import {Link} from 'react-router-dom';
import Picture from '../../components/picture/Picture';
import memoryUtils from '../../assets/js/memoryUtils';
import {bannerAdd, bannerUpdate,bannerRestaurantList} from "../../api";
const { RangePicker } = DatePicker;
const { Option } = Select;
class AddUpdate extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isShowType:'1',
            isType:'1',
            applyType:'1',
            startTime:'',
            endTime:'',
            storeList:[]
        }
        this.myRef = React.createRef();
    }

    handleSubmit = e=> {
        e.preventDefault();
        let imageUrl = this.myRef.current.getImageUrl();
        if(!imageUrl){
            message.warning('请上传图片！')
            return;
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {startTime,endTime,isType,isShowType}=this.state;
                let applyRestaurants=[]
                if(values.applyRestaurants){
                    applyRestaurants=values.applyRestaurants
                }
                let param = {
                    restaurantBanner: {
                        photoUrl: imageUrl,
                        name: values.bannerName,
                        endTime: endTime,
                        startTime: startTime,
                        type: isType
                    },
                    roleType: this.roleType
                }
                if(this.roleType===1){//平台
                    param.restaurantBanner.showType=isShowType;
                    param.restaurantBanner.organizationId=values.store;
                }else if(this.roleType===2){//经销商
                    param.restaurantBanner.showType=isShowType;
                    param.restaurantBanner.applyType=values.applyType;
                    param.restaurantBanner.applyRestaurants=applyRestaurants.join(',');
                }
                if(this.isUpdate){
                    param.restaurantBanner.bannerId=this.bannerId;
                    bannerUpdate(param).then((res) => {
                        message.success('修改成功！');
                        this.props.history.push('/bannerList')
                    }).catch(error => {})
                }else {
                    bannerAdd(param).then((res) => {
                        message.success('增加成功！');
                        this.props.history.push('/bannerList')
                    }).catch(error => {})
                }
            }
        });
    };

    //选择时间
    onChangeTime = (value, dateString)=>{
        this.setState({
            startTime:dateString[0],
            endTime:dateString[1]
        })
    }

    //初始化不可用时间
    disabledDate = (current)=>{
        return current && current < moment().endOf('day');
    }

    //推送：平台还是商家1、平台 2、平台+商家
    getShowType = e =>{
        this.setState({
            isShowType:e.target.value
        })
    }

    //改变有效期1、长期 2选择时间
    getType = e =>{
        this.setState({
            isType:e.target.value
        })
    }

    //改变应运门店状态
    getStoreType = e =>{
        this.setState({
            applyType:e.target.value
        })
    }

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/bannerList">Banner列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.isUpdate?'Banner修改':'Banner新增'}</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    componentWillMount() {
        //1 管理员；2 经销商；3 餐厅经理；4 服务员
        this.roleType = Number(sessionStorage.getItem('type'));
        const banner =  memoryUtils.bannerData;
        this.isUpdate = !!banner.bannerId;//验证是新增还是修改，true:修改，false：新增
        this.banner = banner || {};//防止为undefined影响后续判断
        this.bannerId = this.isUpdate?this.banner.bannerId:'';
        if(this.isUpdate){
            //收集选择的门店id，并转化为数字类型
            this.banner.applyRestaurants=this.banner.applyRestaurants.split(',').map((item)=>{
                return item*1;
            })
        }

        //如果是2表示修改的是带时间的
        if(this.banner.type===2){
            this.setState({
                isType:'2',
                startTime:this.banner.startTime,
                endTime:this.banner.endTime
            })
        }
        //同上
        if(this.banner.applyType===2){
            this.setState({
                applyType:'2'
            })
        }
        //同上
        if(this.banner.showType===2){
            this.setState({
                isShowType:'2',
            })
        }
        this.initHeader();
    }

    componentDidMount() {
        bannerRestaurantList().then(res => {
            this.setState({
                storeList:res.data.restaurantInfoList
            })
        }).catch(error => {})
    }

    componentWillUnmount() {
        memoryUtils.bannerData={}
    }

    render() {
        const {isShowType,isType,startTime,endTime,storeList,applyType} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 20 },
        };
        const buttonItemLayout = {
            wrapperCol: { span: 20, offset: 3 }
        }

        return (
            <Card title={this.title}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="Banner上传">
                        <Picture ref={this.myRef} imgUrl={this.banner.photoUrl} />
                    </Form.Item>
                    <Form.Item label="有效期">
                        {getFieldDecorator('type',{
                            initialValue: this.banner.type?this.banner.type+'':'1',
                        })(
                            <Radio.Group onChange={(e)=>this.getType(e)}>
                                <Radio value="1">长期有效</Radio>
                                <Radio value="2">选择时间段</Radio>
                            </Radio.Group>
                        )}
                        {
                            isType==='2'&&startTime?<RangePicker
                                disabledDate={this.disabledDate}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间', '结束时间']}
                                onChange={this.onChangeTime}
                                defaultValue={[
                                    moment(startTime, "YYYY-MM-DD HH:mm:ss"),
                                    moment(endTime, "YYYY-MM-DD HH:mm:ss")
                                ]}
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                }}
                            />:isType==='2'&&!startTime?<RangePicker
                                disabledDate={this.disabledDate}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间', '结束时间']}
                                onChange={this.onChangeTime}
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                }}
                            />:''
                        }

                    </Form.Item>
                    {
                        this.roleType===1?<Form.Item label="推送">
                            {getFieldDecorator('showType',{
                                initialValue: this.banner.showType?this.banner.showType+'':'1',
                            })(
                                <Radio.Group onChange={(e)=>this.getShowType(e)}>
                                    <Radio value="1">平台</Radio>
                                    <Radio value="2">平台+商家页</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>:''
                    }
                    <Form.Item label="Banner名称">
                        {getFieldDecorator('bannerName', {
                            initialValue:this.banner.name,
                            rules: [{ required: true, message: '请输入Banner名称!' }],
                        })(
                            <Input
                                placeholder="Banner名称"
                                style={{width:300}}
                            />
                        )}
                    </Form.Item>
                    {
                        isShowType==='1'&&this.roleType===1?<Form.Item label="链接到门店" >
                        {getFieldDecorator('store', {})(
                            <Select style={{width:300}}>
                                {
                                    storeList.map((item,index)=>{
                                        return (
                                            <Option key={index} value={item.organizationId}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                        </Form.Item>:''
                    }
                    {
                        this.roleType===2?<Form.Item label="应用门店" >
                            {getFieldDecorator('applyType', {
                                initialValue: this.banner.applyType?this.banner.applyType+'':'1',
                            })(
                                <Radio.Group onChange={(e)=>this.getStoreType(e)}>
                                    <Radio value="1">所有门店</Radio>
                                    <Radio value="2">部分门店</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>:''
                    }
                    {
                        this.roleType===2&&applyType==='2'?<Form.Item {...buttonItemLayout}>
                            {getFieldDecorator('applyRestaurants', {
                                initialValue:this.banner.applyRestaurants,
                                rules: [{ required: true, message: '请选择门店!' }],
                            })(
                                <Checkbox.Group>
                                    {
                                        storeList.map((item,index)=>{
                                            return (
                                                <Checkbox style={{marginTop:'10px'}} key={index} value={item.organizationId}>{item.name}</Checkbox>
                                            )
                                        })
                                    }
                                </Checkbox.Group>
                            )}
                        </Form.Item>:''
                    }
                    <Form.Item {...buttonItemLayout}>
                        <Button style={{width:90}}>
                            <Link to="/bannerList">取消</Link>
                        </Button>
                        <Button style={{width:90,marginLeft:'15px'}} type="primary" htmlType="submit" >确定</Button>
                    </Form.Item>

                </Form>
            </Card>
        )
    }
}
const WrapAddUpdate = Form.create()(AddUpdate);
export default WrapAddUpdate;