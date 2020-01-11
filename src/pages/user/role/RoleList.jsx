import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Breadcrumb, Card, Button,Table, message, Modal} from 'antd';
import {roleList, roleDelete} from "../../../api";
import memoryUtils from "../../../assets/js/memoryUtils";

class RoleList extends Component{

    state={
        dataSource:[],
        loading:true
    };

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                <Breadcrumb.Item>角色列表</Breadcrumb.Item>
            </Breadcrumb>
        );
        this.extra = (
            <Link to='/roleList/addUpdate'>
                <Button type="primary" icon="plus" >新增</Button>
            </Link>
        );
        this.columns = [
            {
                title: '角色ID',
                dataIndex: 'groupId'
            },
            {
                title: '角色名称',
                dataIndex: 'name',
                align: 'center'

            },
            {
                title: '操作权限',
                dataIndex: 'description',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:90,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button onClick={()=>this.detailItem(data)} type="primary" icon="edit" />
                            <Button
                                onClick={()=>this.deleteItem(data.groupId)}
                                type="danger"
                                icon="delete"
                                style={{marginLeft:'5px'}}
                            />
                        </span>
                    )
                }
            },
        ];
    }

    detailItem = (data)=>{
        memoryUtils.roleData = data;
        this.props.history.push('/roleList/addUpdate')
    }

    //获取列表
    getRoleList = ()=>{
        roleList({systemId:4}).then(res => {
            const {groupList} = res.data;
            this.setState({
                dataSource:groupList,
                loading:false
            })
        }).catch(()=>{})
    };

    //删除操作
    deleteItem = (groupId)=>{
        Modal.confirm({
            title: '确定要删除这个角色?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                let params={
                    groupId
                }
                roleDelete(params).then(res => {
                    const {groupList} = res.data;
                    this.setState({
                        dataSource:groupList,
                        loading:false
                    })
                }).catch(()=>{})
            }
        })
    };

    componentWillMount() {
        this.initHeader();
    }

    componentDidMount() {
        this.getRoleList()
    }

    render() {
        const {dataSource,loading} = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey='groupId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={false}
                    loading={loading}
                />
            </Card>
        )
    }
}

export default RoleList;