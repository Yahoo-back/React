import React, { Component } from 'react';
import { Form, Icon, Input, Button, Radio, message } from 'antd';
import { connect } from 'react-redux';
import * as contants from '../../store/actionTypes';
import md5 from 'js-md5';
import { getVerificationCode, login } from '../../api';
import { formatDate } from '../../config/common';
import Particles from 'reactparticles.js';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verificationCodeUrl: ''
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 }
    };
    return (
      <div>
        <div className="loginWrapper">
          <img src={require('../../assets/images/login.png')} alt="" />
          <div className="loginBox">
            <h1 className="title">后台管理系统</h1>
            <div className="formWrapper">
              <Form
                {...formItemLayout}
                onSubmit={this.handleSubmit}
                className="login-form"
              >
                <Form.Item>
                  {getFieldDecorator('username', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入用户名!'
                      },
                      { max: 15, message: '用户名过长!' }
                    ]
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: '#fff' }} />}
                      placeholder="用户名"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入用户密码!' }]
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: '#fff' }} />}
                      type="password"
                      placeholder="密码"
                      className="passInput"
                    />
                  )}
                </Form.Item>
                <Button htmlType="submit" className="login-form-button">
                  登录
                </Button>
              </Form>
            </div>
          </div>
        </div>
        <Particles id="particles" config="particles.json" />
      </div>
    );
  }

  componentDidMount() {
    const token = sessionStorage.getItem('token');
    // console.log(token)
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          username: values.username,
          password: values.password
        };
        login(params)
          .then(res => {
            if (res.data.code == 200) {
              let bearer = res.data.data.tokenHead;
              let token = res.data.data.token;
              let userId = res.data.data.userId;
              let Authorization = bearer + token;
              let userName = res.data.data.userName;
              sessionStorage.setItem('Authorization', Authorization);
              sessionStorage.setItem('userId', userId);
              sessionStorage.setItem('userName', userName);
              message.success(res.data.message);
              // this.props.history.push('/')

              let userData = {
                Authorization: Authorization,
                userId: userId,
                userName: userName
              };
              sessionStorage.setItem('userData', userData);
              this.props.loginAction(userData, () => {
                this.props.history.push('/product/list');
              });
            } else {
              message.error(res.data.message);
            }
          })
          .catch(err => {});
      }
    });
  };
}

const WrapLogin = Form.create()(Login);

const mapDispatch = dispatch => {
  return {
    loginAction(userData, callback) {
      dispatch({
        type: contants.LOGIN_DATA,
        userData
      });
      callback && callback();
    }
  };
};

export default connect(null, mapDispatch)(WrapLogin);
