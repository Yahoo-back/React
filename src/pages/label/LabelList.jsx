import React,{Component} from 'react';
import { Breadcrumb, Card, Button, Table, message,Modal,Input } from 'antd';
import {labelList,labelAdd,labelDelete,labelUpdate} from '../../api';

class LabelList extends Component{

    constructor(props){
        super(props);
        this.state = {
            list:[],//标签列表
            loading:false,
            newLable:'',
            total:0,//标签总数量
            pageSize:10,
            visible:false,
            labelId:null
        }
    }

    //初始化table头/面包屑/新增按钮
    initColumn = ()=>{
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>标签设置</Breadcrumb.Item>
                <Breadcrumb.Item>标签列表</Breadcrumb.Item>
            </Breadcrumb>
        );

        this.extra = (
            <Button onClick={()=>this.showModal()} type="primary" icon="plus" >新增</Button>
        )

        this.columns = [
            {
                title: '标签名称',
                dataIndex: 'name'
            },
            {
                title: '使用次数',
                dataIndex: 'count',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:90,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button onClick={()=>this.showModal(data)} type="primary" icon="edit" />
                            <Button
                                onClick={()=>this.deleteItem(data.labelId)}
                                type="danger"
                                style={{marginLeft:'5px'}}
                                icon="delete"
                            />
                        </span>
                    )
                }
            },
        ];
    }

    //获取列表
    getLableList=(pageNo)=>{
        this.setState({loading:true})
        let {pageSize} = this.state
        labelList({pageSize,pageNo}).then(res => {
            const {list,total} = res.data.restaurantLabelPageInfo;
            this.setState({
                list,
                total,
                loading:false
            })
        }).catch(err=>{})
    }

    //显示弹框操作
    showModal = (data)=>{
        if(data){
            this.setState({
                newLable:data.name,
                visible:true,
                labelId:data.labelId
            })
        }else {
            this.setState({
                visible:true
            })
        }

    }

    //隐藏弹框操作
    handleCancel = ()=>{
        this.setState({
            visible:false,
            newLable:'',
            labelId:null
        })
    }

    //添加分类弹框操作
    addLable = ()=> {
        let newLable = this.state.newLable;
        if(!newLable){
            message.error('请输入标签名称');
            return false;
        }
        let params = {
            restaurantLabel: {name: newLable}
        };
        labelAdd(params).then(res => {
            message.success("添加成功！");
            this.getLableList();
            this.setState({
                newLable:'',
                visible:0
            })
        }).catch(err=>{})
    }

    //修改标签弹框操作
    updateLable = ()=>{
        let {newLable,labelId} = this.state;
        if(!newLable){
            message.error('请输入修改后的标签名称');
            return false;
        }
        let params = {
            restaurantLabel: {
                name: newLable,
                labelId
            }
        };
        labelUpdate(params).then(res => {
            message.success("修改成功！");
            this.getLableList();
            this.setState({
                newLable:'',
                visible:0,
                labelId:null
            })
        }).catch(err=>{})
    }

    //modal添加修改操作
    handleLable=(labelId)=>{
        if(labelId){
            this.updateLable();
        }else {
            this.addLable();
        }
    }

    //删除操作
    deleteItem = (labelId)=>{
        Modal.confirm({
            title: '确定要删除这条标签?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                labelDelete({labelId}).then(res => {
                    message.success("删除成功！");
                    this.getLableList();
                }).catch(err=>{})
            }
        })
    }

    //新增/修改label输入框
    handleChang = (e)=>{
        this.setState({
            newLable:e.target.value
        })
    }

    componentWillMount() {
        this.initColumn();
    }

    componentDidMount() {
        this.getLableList()
    }


    render() {
        const {list,loading,visible,newLable,pageSize,total,labelId} = this.state;
        return (
            <Card title={this.title} extra={this.extra} >
                <Table
                    rowKey='labelId'
                    dataSource={list}
                    columns={this.columns}
                    pagination={{
                        total,
                        hideOnSinglePage:true,
                        defaultPageSize:pageSize,
                        onChange:this.getLableList
                    }}
                    loading={loading}
                />
                <Modal
                    title={labelId?"标签修改":"标签添加"}
                    maskClosable={false}
                    visible={visible}
                    onOk={()=>this.handleLable(labelId)}
                    onCancel={this.handleCancel}
                >
                    <Input placeholder="标签名称" onChange={(e)=>this.handleChang(e)} value={newLable} />
                </Modal>

            </Card>
        )
    }
}

export default LabelList;