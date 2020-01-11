import React,{Component} from 'react';
import {
    Breadcrumb,
    Card,
    Form,
    Input,
    Button,
    message,
    Select,
    Radio,
    Cascader,
    InputNumber,
    Checkbox
} from 'antd';
import {Link} from "react-router-dom";
import {cityArray} from "../../assets/js/data";
import Picture from '../../components/picture/Picture';
import {
    restaurantManager,
    labelList
} from '../../api';
import memoryUtils from "../../assets/js/memoryUtils";
const { TextArea } = Input;
const { Option } = Select;

class AddUpdate extends Component{
    constructor(props) {
        super(props);
        this.state = {
            manList:[],
            scheduleList:[],
            tags:[],
            timeType:'1',
            boxType:'1',
            reserveAbleType:'1',
            startTime:'',
            endTime:'',
        }
        this.myRef = React.createRef();
    }



    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/storeList">门店列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.isUpdate?'门店修改':'门店新增'}</Breadcrumb.Item>
            </Breadcrumb>
        );
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

            }
        });
    };



    getTimeType = (e)=>{
        this.setState({
            timeType:e.target.value
        })
    }
    getBoxType = (e)=>{
        this.setState({
            boxType:e.target.value
        })
    }
    getReserveAbleType = (e)=>{
        this.setState({
            reserveAbleType:e.target.value
        })
    }


    componentWillMount() {
        const store =  memoryUtils.storeData;
        this.isUpdate = !!store.organizationId;//验证是新增还是修改，true:修改，false：新增
        this.store = store || {};//防止为undefined影响后续判断
        this.initHeader();
    }

    componentDidMount() {
        //获取标签列表
        labelList({pageNo:'',pageSize:''}).then(res => {
            let header = res.headers;
            if (header.businessstatus >= 200 && header.businessstatus <= 299) {
                this.setState({
                    tags:res.data.restaurantLabelPageInfo.list
                })
            }else {
                message.error(decodeURIComponent(header.message));
                this.props.history.push('/login');
            }
        }).catch(error => message.error('网路跑丢了～～'));
        //获取经理列表
        restaurantManager().then(res => {
            let header = res.headers;
            if (header.businessstatus >= 200 && header.businessstatus <= 299) {
                this.setState({
                    manList:res.data.restaurantEmployeeList
                })
            }else {
                message.error(decodeURIComponent(header.message));
                this.props.history.push('/login');
            }
        }).catch(error => message.error('网路跑丢了～～'));
    }
    componentWillUnmount() {
        memoryUtils.storeData={}
    }

    render() {
        const {manList,timeType,tags}=this.state;
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
                    <Form.Item label="门店名称">
                        {getFieldDecorator('storeName', {
                            initialValue:this.store.name,
                            rules: [{ required: true, message: '请输入门店名称!' }],
                        })(
                            <Input
                                placeholder="门店名称"
                                style={{width:300}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="地址">
                        {getFieldDecorator('areaCode', {
                            initialValue:this.isUpdate?this.store.areaCode.split('/'):[],
                            rules: [{ required: true, message: '请输入地址!' }],
                        })(
                            <Cascader
                                options={cityArray}
                                placeholder="请输入"
                                style={{width:450}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...buttonItemLayout}>
                        {getFieldDecorator('address', {
                            initialValue:this.store.address,
                            rules: [{ required: true, message: '请输入详细地址!' }],
                        })(
                            <Input
                                placeholder="详细地址"
                                style={{width:450}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="餐厅经理">
                        {getFieldDecorator('agentMan', {
                            initialValue:this.store.linkUserId,
                            rules: [{ required: true, message: '请选择餐厅经理!' }],
                        })(
                            <Select style={{width:300}}>
                                {
                                    manList.map((item,index)=>{
                                        return (
                                            <Option key={index} value={item.userId}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="营业时间">
                        {getFieldDecorator('time',{
                            initialValue: this.store.type?this.store.type+'':'1',
                        })(
                            <Radio.Group onChange={(e)=>this.getTimeType(e)}>
                                <Radio value="1">24小时营业</Radio>
                                <Radio value="2">选择时间段</Radio>
                            </Radio.Group>
                        )}
                        {
                            timeType==='2'?'选择时间':''
                        }
                    </Form.Item>

                    <Form.Item label="是否有包厢">
                        {getFieldDecorator('balcony',{
                            initialValue: this.store.balcony?this.store.balcony+'':'1',
                        })(
                            <Radio.Group onChange={(e)=>this.getBoxType(e)}>
                                <Radio value="1">有</Radio>
                                <Radio value="2">无</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="是否接受预约">
                        {getFieldDecorator('reserveAble',{
                            initialValue: this.store.reserveAble?this.store.reserveAble+'':'1',
                        })(
                            <Radio.Group onChange={(e)=>this.getReserveAbleType(e)}>
                                <Radio value="1">接受</Radio>
                                <Radio value="2">不接受</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="门店LOGO">
                        <Picture ref={this.myRef} imgUrl={this.store.photoUrl} />
                    </Form.Item>

                    <Form.Item label="门店介绍">
                        {getFieldDecorator('description',{
                            initialValue: this.store.description,
                        })(
                            <TextArea rows={4} style={{width:450}} />
                        )}
                    </Form.Item>
                    <Form.Item label="人均消费设置">
                        {getFieldDecorator('averagePrice',{
                            initialValue: this.store.averagePrice,
                        })(
                            <InputNumber
                                style={{width:100}}
                                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="门店电话">
                        {getFieldDecorator('phone',{
                            initialValue: this.store.phone,
                        })(
                            <Input
                                placeholder="请输入门店电话"
                                style={{width:200}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="设置搜索关键字">
                        {getFieldDecorator('tags', {
                            initialValue:this.isUpdate?this.store.tags.split(','):[],
                        })(
                            <Checkbox.Group>
                                {
                                    tags.map((item)=>{
                                        return (
                                            <Checkbox
                                                style={{marginTop:'10px'}}
                                                key={item.labelId}
                                                value={item.name}
                                            >{item.name}</Checkbox>
                                        )
                                    })
                                }
                            </Checkbox.Group>
                        )}
                    </Form.Item>

                    <Form.Item {...buttonItemLayout}>
                        <Button style={{width:90}}>
                            <Link to="/storeList">取消</Link>
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