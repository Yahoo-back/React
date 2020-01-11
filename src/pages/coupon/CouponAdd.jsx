import React,{Component} from 'react';
import {Breadcrumb, Card, Form, Input, Button, DatePicker, Radio, InputNumber, message,Checkbox} from 'antd';
import {Link} from "react-router-dom";
import moment from 'moment';
import {couponAdd,categoryList} from "../../api";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
class CouponAdd extends Component{
    state = {
        discountType:'1',
        applyType:'1',
        restaurantFoodGroupList:[],
        checkAll:false,
        indeterminate: true,
        checkedList:[]
    }

    initHeader = ()=>{
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>优惠券列表</Breadcrumb.Item>
                <Breadcrumb.Item>优惠券新增</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    //验证价格的自定义函数
    validatePrice=(rule,value,callback)=>{
        if(value*1>0){
            callback()
        }else {
            callback('数量必须大于0')
        }
    }
    //初始化不可用时间
    disabledDate = (current)=>{
        return current && current < moment().endOf('day');
    }


    handleSubmit = e=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {checkedList,restaurantFoodGroupList}=this.state;
                let list = [];
                for (let i=0;i<checkedList.length;i++){
                    for (let j=0;j<restaurantFoodGroupList.length;j++) {
                        if(checkedList[i]===restaurantFoodGroupList[j].name){
                            list.push(restaurantFoodGroupList[j].foodGroupId)
                        }
                    }
                }
                let param = {
                    restaurantCoupon:{
                        applyType:Number(values.applyType),
                        couponName:values.couponName,
                        discountType:Number(values.discountType),
                        robTime:values['robTime'].format('YYYY-MM-DD HH:mm:ss'),
                        startTime:values['date'][0].format('YYYY-MM-DD HH:mm:ss'),
                        expireTime:values['date'][1].format('YYYY-MM-DD HH:mm:ss'),
                        minConsume:values.minConsume,
                        idList:list,
                        worth:values.worth,
                        totalNum:values.totalNum,
                        useCondition:values.useCondition
                    }
                }
                couponAdd(param).then((res)=>{
                    message.success('增加成功！');
                    this.props.history.push('/couponManagement')
                }).catch(error => {})

            }
        });
    }

    onCheckAllChange = e => {
        this.setState({
            checkedList: e.target.checked ? this.name : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };
    onChange = (checkedList)=>{
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < this.name.length,
            checkAll: checkedList.length === this.name.length,
        });
    }

    discountType = e=>{
        this.setState({
            discountType:e.target.value
        })
    }

    applyType = e=>{
        this.setState({
            applyType:e.target.value,
            checkedList:[]
        })
    }

    categoryList = ()=>{
        categoryList({}).then((res)=>{
            let initName=[];
            res.data.restaurantFoodGroupList.map((item)=>(
                initName.push(item.name)
            ))
            this.name = initName;
            this.setState({
                restaurantFoodGroupList:res.data.restaurantFoodGroupList
            })
        }).catch(error=>{})
    }



    componentWillMount() {
        this.initHeader();
    }

    componentDidMount() {
        this.categoryList();
    }


    render() {
        const {discountType,applyType,checkAll,checkedList} = this.state;
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
                    <Form.Item label="优惠券类型">
                        {getFieldDecorator('discountType',{
                            initialValue: '1',
                        })(
                            <Radio.Group onChange={(e)=>this.discountType(e)}>
                                <Radio value="1">代金券</Radio>
                                <Radio value="2">折扣券</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item label="活动主题">
                        {getFieldDecorator('couponName', {
                            rules: [{ required: true, message: '请输入活动主题！' }],
                        })(
                            <Input
                                placeholder="活动主题"
                                style={{width:250}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="消费门槛">
                        {getFieldDecorator('minConsume', {
                            rules: [
                                { required: true, message: '请输入消费门槛！' },
                                {validator:this.validatePrice}
                            ],
                        })(
                            <InputNumber
                                placeholder="消费门槛"
                                style={{width:100}}
                            />
                        )}
                        <span> 元</span>
                    </Form.Item>
                    {
                        discountType==='1'?<Form.Item label="代金券额度">
                            {getFieldDecorator('worth', {
                                rules: [
                                    { required: true, message: '请输入代金券额度！' },
                                    {validator:this.validatePrice}
                                ],
                            })(
                                <InputNumber
                                    placeholder="额度"
                                    style={{width:100}}
                                />
                            )}
                            <span> 元</span>
                        </Form.Item>:
                        <Form.Item label="折扣比例">
                            {getFieldDecorator('worth', {
                                rules: [
                                    { required: true, message: '请输入折扣比例！' },
                                    {validator:this.validatePrice}
                                ],
                            })(
                                <InputNumber
                                    placeholder="比例"
                                    style={{width:100}}
                                />
                            )}
                            <span> %</span>
                        </Form.Item>
                    }
                    <Form.Item label="使用日期">
                        {getFieldDecorator('date', {
                            rules: [{ required: true, message: '请输入使用日期！' }]
                        })(
                            <RangePicker
                                disabledDate={this.disabledDate}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间', '结束时间']}
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="发放数量">
                        {getFieldDecorator('totalNum', {
                            rules: [
                                { required: true, message: '请输入发放数量！' },
                                {validator:this.validatePrice}
                            ],
                        })(
                            <InputNumber
                                placeholder="数量"
                                style={{width:100}}
                            />
                        )}
                        <span> 张</span>
                    </Form.Item>

                    <Form.Item label="指定餐品">
                        {getFieldDecorator('applyType',{
                            initialValue: '1',
                        })(
                            <Radio.Group onChange={(e)=>this.applyType(e)}>
                                <Radio value="1">全部菜品</Radio>
                                <Radio value="2">指定分类</Radio>
                            </Radio.Group>
                        )}
                        {
                            applyType==='2'?
                                <div className='couponSort'>
                                    <div>
                                        <Checkbox
                                            indeterminate={this.state.indeterminate}
                                            onChange={this.onCheckAllChange}
                                            checked={checkAll}
                                        >
                                            全选
                                        </Checkbox>

                                    </div>
                                    <CheckboxGroup
                                        options={this.name}
                                        value={checkedList}
                                        onChange={this.onChange}
                                    />
                                </div>
                                :''
                        }

                    </Form.Item>
                    <Form.Item label="发放日期">
                        {getFieldDecorator('robTime',{
                            rules: [{ required: true, message: '请输入发放日期！' }]
                        })(
                            <DatePicker
                                style={{width:200}}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="使用说明">
                        {getFieldDecorator('useCondition',{})(
                            <TextArea
                                style={{width:250}}
                                placeholder="请输入优惠券使用说明"
                                autosize={{ minRows: 3, maxRows: 6 }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...buttonItemLayout}>
                        <Button style={{width:90}}>
                            <Link to="/couponManagement">取消</Link>
                        </Button>
                        <Button style={{width:90,marginLeft:'15px'}} type="primary" htmlType="submit" >确定</Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
const WrapCouponAdd = Form.create()(CouponAdd);
export default WrapCouponAdd;