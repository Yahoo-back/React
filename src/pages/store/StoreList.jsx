import React,{Component} from 'react';
import {Breadcrumb, Card, Tabs, Table, message, Modal, Button, DatePicker, Input} from 'antd';
import {restaurantList,restaurantAudit} from "../../api";
import moment from 'moment';
import memoryUtils from "../../assets/js/memoryUtils";
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
class StoreList extends Component{

    state={
        //已审核门店
        auditStore: [],
        //未审核门店
        notAuditStore: [],
        startTime:'',
        endTime:'',
        loading:false,
        visible:0,
        store:{},
        isCheck:'1',
        reason:''
    };

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>门店管理</Breadcrumb.Item>
                <Breadcrumb.Item>门店列表</Breadcrumb.Item>
            </Breadcrumb>
        );
        this.columns1 = this.userStatus===0 ?[
            {
                title: '门店名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '门店负责人',
                dataIndex: 'linkUserName',
                align: 'center'
            },
            {
                title: '门店电话',
                dataIndex: 'phone',
                align: 'center'
            },
            {
                title: '经销商',
                dataIndex: 'agentName',
                align: 'center'
            },
            {
                title: '联系方式',
                dataIndex: 'agentMobile',
                align: 'center'
            },
            {
                title: '到期时间',
                dataIndex: 'endTime',
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
                            <Button onClick={()=>this.LookItem(data)} icon="eye" />
                        </span>
                    )
                }
            },
        ]:[
            {
                title: '门店名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '门店负责人',
                dataIndex: 'linkUserName',
                align: 'center'
            },
            {
                title: '有效日期',
                dataIndex: 'time',
                width:335,
                align: 'center',
                render: (text,data) => {
                    return (
                        <div>
                            <span>{data.startTime}</span> -- <span>{data.endTime}</span>
                        </div>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:90,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button
                                onClick={()=>this.detailItem(data)}
                                type="primary"
                                icon="edit"
                            />
                            <Button
                                type="danger"
                                icon="delete"
                                style={{marginLeft:'5px'}}
                            />
                        </span>
                    )
                }
            }
        ];

        this.columns2 = this.userStatus===0 ?[
            {
                title: '门店名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '门店负责人',
                dataIndex: 'linkUserName',
                align: 'center'
            },
            {
                title: '门店电话',
                dataIndex: 'phone',
                align: 'center'
            },
            {
                title: '经销商',
                dataIndex: 'agentName',
                align: 'center'
            },
            {
                title: '联系方式',
                dataIndex: 'agentMobile',
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
                            <Button onClick={()=>this.LookItem(data)} icon="eye" />
                        </span>
                    )
                }
            },
        ]:[
            {
                title: '门店名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '门店负责人',
                dataIndex: 'linkUserName',
                align: 'center'
            },
            {
                title: '审核状态',
                dataIndex: 'auditStatus',
                width:200,
                align: 'center',
                render: (text,data) => {
                    return (
                        data.auditStatus===3?<span
                            onClick={()=>this.cheackReason(data.auditMessage)}
                            style={{color:'#FF9500',cursor:'pointer'}}
                        >被驳回</span>:'等待审核'


                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:90,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button
                                onClick={()=>this.detailItem(data)}
                                type="primary"
                                icon="edit"
                            />
                            <Button
                                type="danger"
                                icon="delete"
                                style={{marginLeft:'5px'}}
                            />
                        </span>
                    )
                }
            }
        ];
    };

    detailItem = (data)=>{
        memoryUtils.storeData = data;
        this.props.history.push('/storeList/addUpdate')
    }

    LookItem = data=>{
        this.setState({
            visible:1,
            store:data
        })
    };

    handleCancel = ()=>{
        this.setState({
            visible:0
        })
    };

    onChangeTime = (value, dateString)=>{
        this.setState({
            startTime:dateString[0],
            endTime:dateString[1]
        })
    }

    //初始化不可用时间
    disabledDate = (current)=>{
        return current && current < moment().endOf('day');
    }

    //已审核列表
    getAuditStoreList = ()=>{
        this.setState({loading:true});
        let param = {
            auditStatus:2
        };
        restaurantList(param).then(res => {
            const list = res.data.restaurantInfoList;
            this.setState({
                auditStore:list,
                loading:false
            })
        }).catch(err=>{})
    };

    //未审核列表
    getNotAuditStoreList = ()=>{
        let param = {};
        if(this.userStatus === 0){//平台
            param = {
                auditStatus: '1' //未审核
            }
        } else if(this.userStatus === 1){//经销商
            param = {
                auditStatus: '3,1' //未审核+驳回
            }
        }
        restaurantList(param).then(res => {
            const list = res.data.restaurantInfoList;
            this.setState({
                notAuditStore:list,
            })
        }).catch(err=>{})
    }
    callback = (key)=>{
        this.setState({
            isCheck:key
        })
    };
    handleReject = ()=>{
        this.setState({
            visible:2
        })
    };
    cheackReason =(reason)=>{
        this.setState({
            visible:3,
            reason
        })
    }

    hanldeReason = e =>{
        this.setState({
            reason:e.target.value
        })
    };
    handleRejectBtn=organizationId=>{
        let {reason} = this.state;
        let param = {
            auditMessage:reason,
            organizationId,
            auditStatus: 3
        }
        restaurantAudit(param).then(res=>{
            message.success('已拒绝！');
            this.setState({
                startTime:'',
                endTime:'',
                visible:0,
                store:{},
                isCheck:'1'
            })
            this.getAuditStoreList();
            this.getNotAuditStoreList();
        }).catch(error=>{})
    };

    handlePass = organizationId =>{
        const {startTime,endTime}=this.state;
        if(!startTime||!endTime){
            message.warning('请先设置门店限期！')
            return false;
        }
        let param = {
            startTime,
            endTime,
            auditStatus:2,
            organizationId
        }
        restaurantAudit(param).then(res=>{
            message.success('审核通过！');
            this.setState({
                startTime:'',
                endTime:'',
                visible:0,
                store:{},
                isCheck:'1'
            })
            this.getAuditStoreList();
            this.getNotAuditStoreList();
        }).catch(err=>{})
    }

    componentWillMount() {
        let type = Number(sessionStorage.getItem('type'));
        this.userStatus = type === 1 ? 0 : 1;//0代表平台,1代表经销商
        this.initHeader();
    }

    componentDidMount() {
        this.getAuditStoreList();
        this.getNotAuditStoreList();
    }

    render() {
        const {auditStore,notAuditStore,loading,visible,store,isCheck,reason} = this.state;
        const extra = (
            this.userStatus===1?
            <Button
                onClick={()=>this.props.history.push('/storeList/addUpdate')}
                type="primary"
                icon="plus"
            >新增
            </Button>:''
        )
        return (
            <Card title={this.title} extra={extra}>
                <div className="card-container">
                    <Tabs type="card" onChange={this.callback}>
                        <TabPane tab="已审核门店" key="1">
                            <Table
                                rowKey='organizationId'
                                dataSource={auditStore}
                                columns={this.columns1}
                                pagination={false}
                                loading={loading}
                            />
                        </TabPane>
                        <TabPane tab="未审核门店" key="2">
                            <Table
                                rowKey='organizationId'
                                dataSource={notAuditStore}
                                columns={this.columns2}
                                pagination={false}
                                loading={loading}
                            />
                        </TabPane>
                    </Tabs>
                </div>
                <Modal
                    title="图片详情"
                    maskClosable={false}
                    visible={visible===1}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    <p className='dealerDetail'>
                        <span>门店LOGO：</span>
                        <span>
                            <img style={{height:40,position:'absolute',top:73}} src={store.photoUrl} alt='' />
                        </span>
                    </p>
                    <p className='dealerDetail'>
                        <span>门店名称：</span>
                        <span>{store.name}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>门店负责人：</span>
                        <span>{store.linkUserName}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>门店电话：</span>
                        <span>{store.phone}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>门店地址：</span>
                        <span>{store.address}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>是否有包厢：</span>
                        <span>{store.balcony===1?'有':'无'}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>门店座位：</span>
                        <span>包厢：{store.balconyTableNum}</span>
                        <span>大厅：{store.hallTableNum}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>是否接受预约：</span>
                        <span>{store.reserveAble===1?'是':'否'}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>门店介绍：</span>
                        <span>{store.description}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>人均消费设置：</span>
                        <span>{store.averagePrice}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>设置关键字搜索：</span>
                        <span>{store.tags}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>经销商：</span>
                        <span>{store.agentName}</span>
                    </p>
                    <p className='dealerDetail'>
                        <span>经销商电话：</span>
                        <span>{store.agentMobile}</span>
                    </p>
                    {
                        isCheck==='2'&&this.userStatus===0?
                            <p className='dealerDetail'>
                                <span>门店有限期设置：</span>
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder={['开始时间', '结束时间']}
                                    onChange={this.onChangeTime}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                    }}
                                />
                            </p>:
                            <p className='dealerDetail'>
                                <span>门店有限期：</span>
                                <span style={{color:'#FF9500'}}>{store.startTime +" -- "+ store.endTime}</span>
                            </p>
                    }

                    {
                        isCheck==='2'&&this.userStatus===0?
                            <p className='dealerDetail' style={{textAlign:'right',marginTop:20}}>
                                <Button onClick={this.handleReject}>驳回</Button>
                                <Button
                                    style={{marginLeft:'15px'}}
                                    type="primary"
                                    onClick={()=>this.handlePass(store.organizationId)}
                                >确定</Button>
                            </p>:''
                    }
                </Modal>
                <Modal
                    title="驳回理由"
                    maskClosable={false}
                    visible={visible===2}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    <TextArea
                        rows={4}
                        value={reason}
                        onChange={this.hanldeReason}
                    />
                    <p style={{marginTop:20,textAlign:'right'}}>
                        <Button
                            type="primary"
                            onClick={()=>this.handleRejectBtn(store.organizationId)}
                        >确定</Button>
                    </p>
                </Modal>
                <Modal
                    title="驳回理由"
                    maskClosable={false}
                    visible={visible===3}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    {reason}
                </Modal>

            </Card>
        )
    }
}

export default StoreList;