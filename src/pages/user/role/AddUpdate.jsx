import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Breadcrumb, Card, Form, Input, Button, message,Checkbox} from 'antd';
import {authorityList,roleAdd,roleUpdate,roleInfo} from '../../../api';
import memoryUtils from "../../../assets/js/memoryUtils";

class RoleAdd extends Component{

    state = {
        roleList:[],
        roleIdArray:[]
    };

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/roleList">角色列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.isUpdate?"角色修改":"角色新增"}</Breadcrumb.Item>
            </Breadcrumb>
        );

        this.formItemLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };
        this.buttonItemLayout = {
            wrapperCol: { span: 20, offset: 3 }
        }

    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.isUpdate){
                    let param={
                        groupId:this.groupId,
                        name:values.roleName,
                        roleIdArray:values.roleAuthorityList.join(',')
                    }
                    roleUpdate(param).then(()=>{
                        this.props.history.push('/roleList');
                        message.success('修改成功!');
                    }).catch(error=>{})
                }else {
                    let param={
                        systemId:1,
                        organizationId:'',
                        type:1,
                        name:values.roleName,
                        roleIdArray:values.roleAuthorityList.join(',')
                    }
                    roleAdd(param).then(()=>{
                        this.props.history.push('/roleList');
                        message.success('添加成功!');
                    }).catch(error=>{})
                }
            }
        });
    };

    getAuthorityList(){
        let param={
            pageNo:1,
            pageSize:20,
            organizationId:999,
        }
        authorityList(param).then(data=>{
            this.setState({
                roleList:data.data.roleList
            })
        }).catch(error=>{})
    }




    componentWillMount() {
        const role =  memoryUtils.roleData;
        this.isUpdate = !!role.groupId;
        this.role = role || {};
        this.groupId = this.isUpdate?role.groupId:'';
        this.initHeader();
    }

    componentDidMount() {
        if(this.isUpdate){
            roleInfo({groupId:this.groupId}).then(data=>{
                let roleIdArray = data.data.roleIdArray.split(',');
                roleIdArray =roleIdArray.map((item)=>{
                    return item*1;
                })
                this.setState({
                    roleIdArray
                })
            }).catch(error=>{})
        }
        this.getAuthorityList();
    }

    componentWillUnmount() {
        memoryUtils.roleData={}
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {roleList} = this.state;
        return (
            <Card title={this.title}>
                <Form {...this.formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="角色名称">
                        {getFieldDecorator('roleName', {
                            initialValue:this.role.name,
                            rules: [
                                { required: true,whitespace:true, message: '请输入角色名称!' },
                                { max: 20, message: '名称过长!' }
                            ],
                        })(
                            <Input style={{width:300}} placeholder="请输入角色名称" />
                        )}
                    </Form.Item>
                    <Form.Item label="权限选择">
                        {getFieldDecorator('roleAuthorityList', {
                            initialValue:this.state.roleIdArray,
                        })(
                            <Checkbox.Group>
                                {
                                    roleList.map((item,index)=>{
                                        return (
                                            <Checkbox style={{marginTop:'10px'}} key={index} value={item.roleId}>{item.name}</Checkbox>
                                        )
                                    })
                                }
                            </Checkbox.Group>
                        )}
                    </Form.Item>
                    <Form.Item {...this.buttonItemLayout}>
                        <Button style={{width:90}}>
                            <Link to="/roleList">取消</Link>
                        </Button>
                        <Button style={{width:90,marginLeft:'15px'}} type="primary" htmlType="submit" >确定</Button>
                    </Form.Item>
                </Form>
            </Card>
        )

    }
}

const WrapRoleAdd = Form.create()(RoleAdd);

export default WrapRoleAdd;