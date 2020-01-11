import React,{Component} from 'react';
import {Breadcrumb, Card, Button, Table, message, Modal} from 'antd';
import {authorityList, authorityDelete} from "../../api";

class AuthorityList extends Component{

    state={
        dataSource:[],
        pageSize:10,
        total:0,//标签总数量
        loading:true
    };

    //初始化面包屑/table头
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                <Breadcrumb.Item>权限列表</Breadcrumb.Item>
            </Breadcrumb>
        );
        this.extra = (
            <Button type="primary" icon="plus" onClick={this.noTest} >新增</Button>
        );
        this.columns = [
            {
                title: '权限ID',
                dataIndex: 'roleId'
            },
            {
                title: '权限名称',
                dataIndex: 'name',
                align: 'center'

            },
            {
                title: '权限描述',
                dataIndex: 'description',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:70,
                align: 'center',
                render: (text,data) => {
                    return (
                        <Button
                            onClick={()=>this.deleteItem(data.roleId)}
                            type="danger"
                            icon="delete"
                        />
                    )
                }
            },
        ];
    }
    noTest = ()=>{
        message.warning('暂未开发，敬请谅解！');
    }

    //删除操作
    deleteItem = (roleId)=>{
        Modal.confirm({
            title: '确定要删除这条权限?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                let params={
                    roleId
                }
                authorityDelete(params).then(res => {
                    message.success("删除成功！");
                    this.getRoleList();
                }).catch(err=>{})
            }
        })
    }

    //获取列表
    getRoleList = (pageNo)=>{
        let {pageSize} = this.state;
        let param = {
            pageNo,
            pageSize: pageSize,
        }
        authorityList(param).then(res => {
            const {roleList,count} = res.data;
            this.setState({
                dataSource:roleList,
                total:count,
                loading:false
            })
        }).catch(err=>{})
    }



    componentWillMount() {
        this.initHeader();
    }

    componentDidMount() {
        this.getRoleList()
    }


    render() {
        const {dataSource,loading,pageSize,total} = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey='roleId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={{
                        total,
                        hideOnSinglePage:true,
                        defaultPageSize:pageSize,
                        onChange:this.getRoleList
                    }}
                    loading={loading}
                />
            </Card>
        )
    }
}

export default AuthorityList;