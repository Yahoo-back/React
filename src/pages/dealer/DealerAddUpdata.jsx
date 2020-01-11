import React,{Component} from 'react';
import {Breadcrumb, Card, Button, message, Form, Input,Cascader,Checkbox,InputNumber} from 'antd';
import {Link} from "react-router-dom";
import {cityArray} from '../../assets/js/data';
import {dealerAdd,verificationCodeByMobile,dealerUpdate} from "../../api";
import memoryUtils from "../../assets/js/memoryUtils";


class DealerAddUpdata extends Component{

    state = {
        testInfo:'获取验证码',
        mobile:''
    };


    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/dealerList">经销商列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.isUpdate?"经销商修改":"经销商添加"}</Breadcrumb.Item>
            </Breadcrumb>
        );
    };

    //验证价格的自定义函数
    validatePrice=(rule,value,callback)=>{
        if(value*1>0){
            callback()
        }else {
            callback('数量必须大于0')
        }
    }


    getVerificationCode = ()=>{
        let param = {
            type: 4,
            mobile:this.state.mobile
        };
        let times = 60;
        this.setState({testInfo:'('+ times + ')s倒计时'})
        let time = setInterval(() => {
            this.setState({testInfo:'('+ --times + ')s倒计时'})
            if(times<=0){
                window.clearInterval(time);
                this.setState({testInfo:'获取验证码'})
                times = 60;
            }
        },1000);


        verificationCodeByMobile(param).then(res=>{
        }).catch(err=>{
            window.clearInterval(time);
            this.setState({
                testInfo:'获取验证码'
            })
        });

    };
    getMobile = (e)=>{
        this.setState({
            mobile:e.target.value
        })
    };

    handleSubmit = e=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let param = {
                    restaurantAgent: {
                        name: values.name,
                        mobile: values.mobile,
                        areaCode: values.areaCode.join('/'),
                        address: values.address,
                        authority: values.authority?1:-1,
                        storeNum: values.storeNum
                    }
                };
                if(this.isUpdate){
                    param.restaurantAgent.agentId = this.agentId;
                    dealerUpdate(param).then(res=>{
                        this.props.history.push('/dealerList');
                        message.success('修改成功!');
                    }).catch(err=>{});
                }else {
                    param.verificationCode = values.verificationCode;
                    dealerAdd(param).then(res=>{
                        this.props.history.push('/dealerList');
                        message.success('添加成功!');
                    }).catch(err=>{});
                }
            }
        });
    };


    componentWillMount() {
        // const dealer =  this.props.location.state;
        // this.isUpdate = !!dealer;
        const dealer =  memoryUtils.dealerData;
        this.isUpdate = !!dealer.agentId;
        this.dealer = dealer || {};
        this.agentId = this.isUpdate?dealer.agentId:'';
        this.initHeader();
    }

    componentWillUnmount() {
        memoryUtils.dealerData={}
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 16 },
        };
        const buttonItemLayout = {
            wrapperCol: { span: 16, offset: 3 }
        }
        return (
            <Card title={this.title}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="经销商名称">
                        {getFieldDecorator('name', {
                            initialValue:this.dealer.name,
                            rules: [{ required: true, message: '请输入经销商名称!' }],
                        })(
                            <Input
                                placeholder="经销商名称"
                                style={{width:300}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="联系方式">
                        {getFieldDecorator('mobile', {
                            initialValue:this.dealer.mobile,
                            rules: [{ required: true, message: '请输入手机号码!' }],
                        })(
                            <Input
                                placeholder="手机号码"
                                style={{width:300}}
                                onChange={(e)=>this.getMobile(e)}
                            />
                        )}
                    </Form.Item>

                    {
                        this.isUpdate?'':
                            <Form.Item {...buttonItemLayout}>
                            {getFieldDecorator('verificationCode', {
                                rules: [{ required: true, message: '请输入验证码!' }],
                            })(
                                <Input
                                    placeholder="验证码"
                                    style={{width:180}}
                                />
                            )}
                            <Button
                                style={{marginLeft:10}}
                                type='primary'
                                onClick={this.getVerificationCode}
                            >{this.state.testInfo}</Button>
                        </Form.Item>
                    }


                    <Form.Item label="地址">
                        {getFieldDecorator('areaCode', {
                            initialValue:this.isUpdate?this.dealer.areaCode.split('/'):[],
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
                            initialValue:this.dealer.address,
                            rules: [{ required: true, message: '请输入详细地址!' }],
                        })(
                            <Input
                                placeholder="详细地址"
                                style={{width:450}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="角色">
                        {getFieldDecorator('authority', {
                            valuePropName: 'checked',
                            initialValue: this.dealer.authority===1?true:false,
                        })(<Checkbox>经销商权限</Checkbox>)}
                    </Form.Item>
                    <Form.Item label="门店数量">
                        {getFieldDecorator('storeNum', {
                            initialValue:this.dealer.storeNum,
                            rules: [
                                { required: true, message: '请输入门店数量!' },
                                {validator:this.validatePrice}
                            ],
                        })(
                            <InputNumber
                                placeholder="门店数量"
                                style={{width:100}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...buttonItemLayout}>
                        <Button style={{width:90}}>
                            <Link to="/dealerList">取消</Link>
                        </Button>
                        <Button style={{width:90,marginLeft:'15px'}} type="primary" htmlType="submit" >确定</Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
const WrapDealerAdd = Form.create()(DealerAddUpdata);

export default WrapDealerAdd;