import React,{Component} from 'react';
import {Breadcrumb, Card, Button, Table, message, Switch, Modal} from 'antd';
import {staffList, staffDelete, staffUpdate} from "../../../api";
import memoryUtils from "../../../assets/js/memoryUtils";

class StaffList extends Component{

    state={
        dataSource:[],
        pageSize:10,
        total:0,//标签总数量
        loading:true,
        type:1
    };

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                <Breadcrumb.Item>人员列表</Breadcrumb.Item>
            </Breadcrumb>
        );
        this.extra = (
            <Button onClick={()=>this.props.history.push('/staffList/addUpdate')} type="primary" icon="plus" >新增</Button>
        );
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'userId'
            },
            {
                title: '用户名',
                dataIndex: 'name',
                align: 'center'

            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                align: 'center'
            },
            {
                title: '账号状态',
                dataIndex: 'status',
                align: 'center',
                render: (text,data) => {
                    if (data.status===1){
                        return (
                            <Switch
                                defaultChecked
                                onChange={()=>this.onChange(data)}
                                checkedChildren="开"
                                unCheckedChildren="关"
                            />
                        )
                    } else {
                        return (
                            <Switch
                                onChange={()=>this.onChange(data)}
                                checkedChildren="开"
                                unCheckedChildren="关"
                            />
                        )
                    }

                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:90,
                align: 'center',
                key: 'operate',
                render: (text,data) => {
                    return (
                        <span>
                            <Button onClick={()=>this.detailItem(data)} type="primary" icon="edit" />
                            {
                                this.state.type==='3'?
                                    <Button
                                        onClick={()=>this.deleteItem(data.employeeId)}
                                        type="danger"
                                        style={{marginLeft:'5px'}}
                                        icon="delete"
                                    />:''
                            }

                        </span>
                    )
                }
            },
        ];
    };

    detailItem = (data)=>{
        memoryUtils.staffData = data;
        this.props.history.push('/staffList/addUpdate')
    }

    deleteItem = (employeeId)=>{
        Modal.confirm({
            title: '确定要删除?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                let params={
                    roleType: this.state.type,
                    employeeId
                }
                staffDelete(params).then(res => {
                    message.success("删除成功！");
                    this.getStaffList();
                }).catch(err=>{})
            }
        })
    };

    onChange = (data)=>{
        let status=data.status;
        let employeeId=data.employeeId;
        let param = {
            restaurantEmployee: {
                status: status===1?-1:1,
                employeeId
            },
            roleType: sessionStorage.getItem('type')
        }
        staffUpdate(param).then((res) => {
            message.success('操作成功！');
        }).catch(error => {})
    };

    getStaffList = (pageNo)=>{
        let {pageSize} = this.state;
        let param = {
            pageNo,
            pageSize: pageSize,
            roleType:sessionStorage.getItem('type')
        }
        staffList(param).then(res => {
            const {list,total} = res.data.restaurantEmployeePageInfo;
            this.setState({
                dataSource:list,
                total,
                loading:false
            })
        }).catch(err=>{})
    };


    componentWillMount() {
        const type = sessionStorage.getItem('type')
        this.setState({
            type
        })
        this.initHeader();
    }

    componentDidMount() {
        this.getStaffList();
    }

    render() {
        const {dataSource,loading,pageSize,total} = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey='userId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={{
                        total,
                        hideOnSinglePage:true,
                        defaultPageSize:pageSize,
                        onChange:this.getStaffList
                    }}
                    loading={loading}
                />
            </Card>
        )
    }
}

export default StaffList;