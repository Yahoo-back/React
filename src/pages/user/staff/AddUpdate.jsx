import React,{Component} from 'react';
import md5 from 'js-md5';
import {Breadcrumb, Card, Button, message, Form, Input, Radio} from 'antd';
import {staffUpdate,staffAdd,verificationCodeByMobile} from "../../../api";
import {Link} from "react-router-dom";
import memoryUtils from "../../../assets/js/memoryUtils";


class AddUpdate extends Component{

    state = {
        testInfo:'获取验证码',
        mobile:''
    };


    handleSubmit = e=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let param = {
                    restaurantEmployee: {
                        name: values.name,
                        mobile: values.mobile,
                        status: Number(values.status),
                    },
                    verificationCode: values.verificationCode,
                    roleType: sessionStorage.getItem('type')
                };
                if(this.isUpdate){
                    param.restaurantEmployee.employeeId = this.employeeId;
                    staffUpdate(param).then(res=>{
                        this.props.history.push('/staffList');
                        message.success('修改成功!');
                    }).catch(err=>{});
                }else {
                    staffAdd(param).then(res=>{
                        this.props.history.push('/staffList');
                        message.success('添加成功!');
                    }).catch(err=>{});
                }
            }
        });

    };

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
    resetPassword = ()=>{
        let param = {
            restaurantEmployee: {
                passWord: md5('123456'),
                employeeId: this.employeeId,
            },
            roleType: sessionStorage.getItem('type')
        }
        staffUpdate(param).then(() => {
            message.success('重置成功');
        }).catch(error => {})
    };

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/staffList">人员列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.isUpdate?"人员修改":"人员新增"}</Breadcrumb.Item>
            </Breadcrumb>
        );
    };

    componentWillMount() {
        const staff =  memoryUtils.staffData;
        this.isUpdate = !!staff.employeeId;
        this.staff = staff || {};
        this.employeeId = this.isUpdate?staff.employeeId:'';
        this.initHeader();
    }

    componentWillUnmount() {
        memoryUtils.staffData={}
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 16 },
        };
        const buttonItemLayout = {
            wrapperCol: { span: 16, offset: 3 }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Card title={this.title}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="用户名">
                        {getFieldDecorator('name', {
                            initialValue:this.staff.name,
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input
                                placeholder="用户名"
                                style={{width:250}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="联系方式">
                        {getFieldDecorator('mobile', {
                            initialValue:this.staff.mobile,
                            rules: [{ required: true, message: '请输入手机号码!' }],
                        })(
                            <Input
                                placeholder="手机号码"
                                style={{width:250}}
                                onChange={(e)=>this.getMobile(e)}
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...buttonItemLayout}>
                        {getFieldDecorator('verificationCode', {
                            rules: [{ required: true, message: '请输入验证码!' }],
                        })(
                            <Input
                                placeholder="验证码"
                                style={{width:130}}
                            />
                        )}
                        <Button
                            style={{marginLeft:10}}
                            type='primary'
                            onClick={this.getVerificationCode}
                        >{this.state.testInfo}</Button>
                    </Form.Item>
                    {
                        this.isUpdate?
                            <Form.Item label="密码">
                                <Button
                                    type="link"
                                    onClick={this.resetPassword}
                                >重置密码</Button>
                                <span>注：初始化密码为123456</span>
                            </Form.Item>:""
                    }

                    <Form.Item label="状态">
                        {getFieldDecorator('status',{
                            initialValue:this.staff.status?this.staff.status:1
                        })(
                            <Radio.Group>
                                <Radio value={1}>启用</Radio>
                                <Radio value={-1}>禁用</Radio>
                            </Radio.Group>
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

const WrapAddUpdate = Form.create()(AddUpdate);

export default WrapAddUpdate;