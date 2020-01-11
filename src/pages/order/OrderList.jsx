import React,{Component} from 'react';
import {Breadcrumb, Card, Button, Table, Modal, Row, Col, Input, DatePicker, message} from 'antd';
import {orderList, orderDelete, orderDetail} from "../../api";
const { Search } = Input;
const { RangePicker } = DatePicker;

class OrderList extends Component{

    state={
        dataSource:[],
        pageSize:20,
        total:0,
        loading:false,
        visible:0,
        startTime:'',
        endTime:'',
        detail:{},
        restaurantOrderDetailList:[],
        keyWord:'',
        couponId:null
    }

    initHeader = ()=>{
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                <Breadcrumb.Item>订单列表</Breadcrumb.Item>
            </Breadcrumb>
        );

        this.extra = (
            <span>
                <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['开始时间', '结束时间']}
                    onChange={this.onChangeTime}
                    onOk={this.onOkTime}
                />
                <Search
                    style={{width:250,marginLeft:10}}
                    placeholder="搜索订单号、金额、桌号"
                    onSearch={value => this.searchInfo(value)}
                    enterButton
                />
            </span>
        );
        this.columns = [
            {
                title: '订单时间',
                dataIndex: 'finishTime',
                align: 'center',
                render:(finishTime)=>{
                    return finishTime?finishTime:'--'
                }
            },
            {
                title: '订单号',
                dataIndex: 'orderId',
                align: 'center'
            },
            {
                title: '桌号',
                dataIndex: 'tableName',
                align: 'center',
                render:(tableName)=>{
                    return tableName?tableName:'--'
                }
            },
            {
                title: '金额（元）',
                dataIndex: 'factPrice',
                align: 'center',
                sorter: true
            },
            {
                title: '服务员',
                dataIndex: 'confirmUserName',
                align: 'center',
                render:(confirmUserName)=>{
                    return confirmUserName?confirmUserName:'--'
                }
            },
            {
                title: '折扣',
                dataIndex: 'couponName',
                align: 'center',
                render:(couponName)=>{
                    return couponName?couponName:'无'
                }
            },
            {
                title: '结算方式',
                dataIndex: 'payType',
                align: 'center',
                render: (payType) => {
                    if(payType===1){
                        return '支付宝';
                    }else if(payType===2){
                        return '微信';
                    }else if(payType===3){
                        return '现金';
                    }else if(payType===4){
                        return '银联';
                    }else {
                        return '线下扫码';
                    }
                },
                filters: [
                    {text: '支付宝',value: 1},
                    {text: '微信',value: 2},
                    {text: '现金',value: 3},
                    {text: '银联',value: 4},
                    {text: '线下扫码',value: 5}
                ]
            },
            {
                title: '撤销操作',
                dataIndex: 'revokeStatus',
                align: 'center',
                render:(revokeStatus)=>{
                    return revokeStatus===1?'是':'否'
                },
                filters: [
                    {text: '是',value: 1},
                    {text: '否',value: 0}
                ],
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:100,
                align: 'center',
                fixed: 'right',
                render: (text, data) => {
                    return (
                        <span>
                            <Button onClick={()=>this.LookItem(data.orderId)} icon="profile" />
                            <Button
                                onClick={()=>this.deleteItem(data.orderId)}
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

    handleTableChange = (pagination,filters, sorter)=>{
        let payType = '';
        if(filters.payType){
            payType = filters.payType.join(',')
        }

        let revokeStatus = '';
        if(filters.revokeStatus){
            revokeStatus = filters.revokeStatus.join(',')
        }

        const current = pagination.current
        let priceSort=''
        if(sorter.order==='ascend'){
            priceSort='asc';
        }else if(sorter.order==='descend'){
            priceSort='desc';
        }

        this.getOrderList(current,priceSort,payType,revokeStatus);
    }

    onChangeTime = (value, dateString)=>{
        this.setState({
            startTime:dateString[0],
            endTime:dateString[1]
        })

    }
    onOkTime = ()=>{
        this.getOrderList(1);
    }

    searchInfo = (value)=>{
        this.setState({
            keyWord:value
        },()=>this.getOrderList(1))
    }

    handleCancel = ()=>{
        this.setState({
            visible:0
        })
    }

    LookItem = orderId=>{
        orderDetail({orderId}).then(res => {
            const detail= res.data.restaurantOrder;
            this.setState({
                detail,
                visible:1,
                restaurantOrderDetailList:detail.restaurantOrderDetailList
            })
        }).catch(err =>{});
    };

    deleteItem = (orderId)=>{
        Modal.confirm({
            title: '确定要删除?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                orderDelete({orderId}).then(res => {
                    message.success("删除成功！");
                    this.getOrderList(1);
                }).catch(err=>{})
            }
        })
    }

    getOrderList = (pageNo,priceSort,payType,revokeStatus)=>{
        this.setState({loading:true})
        const {pageSize,keyWord,startTime,endTime,couponId} = this.state;
        let param = {
            pageNo,
            pageSize,
            keyWord,
            payType,
            revokeStatus,
            couponId,
            priceSort,
            startTime,
            endTime
        };
        orderList(param).then(res => {
            const {list,total}= res.data.restaurantOrderPageInfo;
            this.setState({
                dataSource:list,
                loading:false,
                total
            })
        }).catch(err =>{});
    }

    componentWillMount() {
        this.initHeader();
    }

    componentDidMount() {
        this.getOrderList(1);
    }


    render() {
        const {dataSource,loading,pageSize,total,visible,detail,restaurantOrderDetailList} = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey='orderId'
                    dataSource={dataSource}
                    columns={this.columns}
                    onChange={this.handleTableChange}
                    pagination={{
                        total,
                        hideOnSinglePage:true,
                        defaultPageSize:pageSize
                    }}
                    loading={loading}
                    scroll={{ x: 960}}
                />
                <Modal
                    title="订单详情"
                    maskClosable={false}
                    visible={visible===1}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    <Row className="reservationDetail">
                        <Col span={24}>订单号：{detail.orderId}</Col>
                    </Row>
                    <div className="reservationDetail">
                        <Row>
                            <Col span={12}>桌号：{detail.orderNumber}</Col>
                            <Col span={12}>折扣：{detail.couponName?detail.couponName:'无'}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>订单时间：{detail.finishTime?detail.finishTime:'--'}</Col>
                            <Col span={12}>结算方式：{detail.payType}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>金额：{detail.factPrice}</Col>
                            <Col span={12}>是否撤销：{detail.revokeStatus===1?'是':'否'}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>服务员：{detail.confirmUserName?detail.confirmUserName:'--'}</Col>
                        </Row>
                    </div>

                    <div className="reservationDetail">
                        <div>点餐详情：</div>
                        <Row>
                            <Col span={6}>名称</Col>
                            <Col span={6}>数量</Col>
                            <Col span={6}>单价</Col>
                            <Col span={6}>小记</Col>
                        </Row>
                        {
                            restaurantOrderDetailList.map((item,index)=>{
                                return (
                                    <Row key={index}>
                                        <Col span={6}>{item.foodName}</Col>
                                        <Col span={6}>*{item.quantity}</Col>
                                        <Col span={6}>¥{item.unitPrice}</Col>
                                        <Col span={6}>¥{item.totalPrice}</Col>
                                    </Row>
                                )

                            })
                        }
                    </div>
                </Modal>
            </Card>
        )
    }
}

export default OrderList;