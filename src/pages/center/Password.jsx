import React,{Component} from 'react';
import { Breadcrumb ,Card,Form, Input, Button,message} from 'antd';
import {Link} from 'react-router-dom';
import md5 from 'js-md5';
import {pwdModify} from '../../api';

class Password extends Component{
    state = {
        confirmDirty: false,
    };

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/personalCenter">个人中心</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>修改密码</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    //确认修改密码操作
    handleSubmit = e=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let param = {
                    password: md5(values.oldPassword),
                    newPassword: md5(values.newPassword)
                };
                pwdModify(param).then(res=>{
                    message.success("修改成功！");
                    this.props.history.push('/personalCenter')
                }).catch(err=>{});
            }
        });

    };


    //验证操作
    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    //验证操作
    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('两次输入不一致!');
        } else {
            callback();
        }
    };
    //验证操作
    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };



    componentWillMount() {
        this.initHeader();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const buttonItemLayout = {
            wrapperCol: { span: 24, offset: 8 }
        }

        return (
            <Card title={this.title}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="原密码" hasFeedback>
                        {getFieldDecorator('oldPassword', {
                            rules: [{ required: true, message: '请输入原密码!' }],
                        })(
                            <Input
                                type="password"
                                placeholder="原密码"
                                style={{width:300}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="新密码" hasFeedback>
                        {getFieldDecorator('newPassword', {
                            rules: [{ required: true, message: '请输入新密码!' },{
                                validator: this.validateToNextPassword,
                            }],
                        })(
                            <Input
                                type="password"
                                placeholder="新密码"
                                style={{width:300}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="新密码确认" hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [{ required: true, message: '请输入新密码!' },{
                                validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input
                                type="password"
                                placeholder="再次输入新密码"
                                style={{width:300}}
                                onBlur={this.handleConfirmBlur}
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...buttonItemLayout}>
                        <Button style={{width:90}}>
                            <Link to="/personalCenter">取消</Link>
                        </Button>
                        <Button style={{width:90,marginLeft:'15px'}} type="primary" htmlType="submit" >确定</Button>
                    </Form.Item>
                </Form>
            </Card>
        )

    }
}
const WrapPassword = Form.create()(Password);

export default WrapPassword;