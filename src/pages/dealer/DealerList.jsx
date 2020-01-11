import React,{Component} from 'react';
import {Breadcrumb, Card,Button,Table, message, Modal} from 'antd';
import {dealerList, dealerDelete} from "../../api";
import memoryUtils from "../../assets/js/memoryUtils";

class DealerList extends Component{

    state = {
        dataSource:[],
        loading:false,
        visible:0,
        dealer:{},
        restaurantNameList:[]
    }

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>经销商管理</Breadcrumb.Item>
                <Breadcrumb.Item>经销商列表</Breadcrumb.Item>
            </Breadcrumb>
        );
        this.extra = (
            <Button onClick={()=>this.props.history.push('/dealerList/dealer')} type="primary" icon="plus" >新增</Button>
        );
        this.columns = [
            {
                title: '经销商',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '联系电话',
                dataIndex: 'mobile'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center'
            },
            {
                title: '门店数量',
                dataIndex: 'storeNum',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:150,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button onClick={()=>this.LookItem(data)} icon="profile" />
                            <Button
                                // onClick={()=>this.props.history.push('/dealerList/dealer',data)}
                                onClick={()=>this.detailItem(data)}
                                type="primary"
                                icon="edit"
                                style={{marginLeft:'5px'}}
                            />
                            <Button
                                onClick={()=>this.deleteItem(data.agentId)}
                                type="danger"
                                icon="delete"
                                style={{marginLeft:'5px'}}
                            />
                        </span>
                    )
                }
            },
        ];
    };

    detailItem = (data)=>{
        memoryUtils.dealerData = data;
        this.props.history.push('/dealerList/dealer')
    }

    //删除操作
    deleteItem = (agentId)=>{
        Modal.confirm({
            title: '确定要删除?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                dealerDelete(agentId).then(res => {
                    message.success("删除成功！");
                    this.getDearList();
                }).catch((err)=>{})
            }
        })
    };


    getDearList = ()=>{
        this.setState({loading:true})
        dealerList({}).then(res => {
            const list = res.data.restaurantAgentList;
            this.setState({
                dataSource:list,
                loading:false
            })
        }).catch((err)=>{})
    };

    LookItem = data=>{
        this.setState({
            visible:1,
            dealer:data,
            restaurantNameList:data.restaurantNameList
        })
    };

    handleCancel = ()=>{
        this.setState({
            visible:0
        })
    };


    componentWillMount() {
        this.initHeader();
    }

    componentDidMount() {
        this.getDearList();
    }

    render() {
        const {dataSource,loading,visible,dealer,restaurantNameList} = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey='agentId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={false}
                    loading={loading}
                />

                <Modal
                    title="详情"
                    maskClosable={false}
                    visible={visible===1}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    <p className='dealerDetail'>
                        <span>经销商姓名：</span>
                        <span>{dealer.name}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>联系方式：</span>
                        <span>{dealer.mobile}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>创建时间：</span>
                        <span>{dealer.createTime}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>门店数量：</span>
                        <span>{dealer.storeNum}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>地址：</span>
                        <span>{dealer.address}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>门店：</span>
                        <span>
                            {
                                restaurantNameList.length>0?
                                restaurantNameList.map((item,index)=>{
                                    return (
                                        <span key={index}>{item}</span>
                                    )
                                }):'暂无门店'
                            }
                        </span>

                    </p>
                </Modal>

            </Card>
        )
    }
}

export default DealerList;