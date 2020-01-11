import React,{Component} from 'react';
import {Breadcrumb, Card, Button, Table, message, Modal, Row, Col,DatePicker} from 'antd';
import {reservationList, reservationDel} from "../../api";

const { RangePicker } = DatePicker;

class ReservationList extends Component{

    state={
        dataSource:[],
        pageSize:20,
        total:0,
        loading:false,
        visible:0,
        startDate:'',
        endDate:'',
        detail:{}
    }

    onChangeTime = (value, dateString)=>{
        this.setState({
            startDate:dateString[0],
            endDate:dateString[1]
        })

    }
    onOkTime = ()=>{
        this.getReservationList(1);
    }

    initHeader = ()=>{
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                <Breadcrumb.Item>预约列表</Breadcrumb.Item>
            </Breadcrumb>
        );

        this.extra = (
            <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={['开始时间', '结束时间']}
                onChange={this.onChangeTime}
                onOk={this.onOkTime}
            />
        );
        this.columns = [
            {
                title: '日期',
                dataIndex: 'createTime',
                align: 'center'
            },
            {
                title: '客人电话',
                dataIndex: 'mobile',
                align: 'center'
            },
            {
                title: '预约来源',
                dataIndex: 'type',
                align: 'center',
                render: (type) => {
                    return (
                        type===1?'支付宝':'微信'
                    )
                }
            },
            {
                title: '是否取消',
                dataIndex: 'status',
                align: 'center',
                render: (status) => {
                    if(status===1){
                        return '待确认';
                    }else if(status===2){
                        return '预约成功';
                    }else if(status===-1){
                        return '预约失败';
                    }else {
                        return '用户取消';
                    }
                }
            },
            {
                title: '座位性质',
                dataIndex: 'seatType',
                align: 'center',
                render: (seatType) => {
                    return (
                        seatType===1?'大厅':'包厢'
                    )
                }
            },
            {
                title: '操作人员',
                dataIndex: 'operaterName',
                align: 'center',
                render: (operaterName) => {
                    return (
                        operaterName?operaterName:'--'
                    )
                }
            },
            {
                title: '操作',
                width:100,
                align: 'center',
                fixed: 'right',
                render: (text, data) => {
                    return (
                        <span>
                            <Button onClick={()=>this.LookItem(data)} icon="profile" />
                            <Button
                                onClick={()=>this.deleteItem(data.reserveId)}
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

    deleteItem = (reserveId)=>{
        Modal.confirm({
            title: '确定要删除?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                reservationDel({reserveId}).then(res => {
                    message.success("删除成功！");
                    this.getReservationList(1);
                }).catch(err=>{})
            }
        })
    }

    handleCancel = ()=>{
        this.setState({
            visible:0
        })
    }

    LookItem = data=>{
        this.setState({
            detail:data,
            visible:1
        })
    };

    getReservationList = (pageNo)=>{
        this.setState({loading:true})
        let {pageSize,startDate,endDate} = this.state;
        let param = {
            pageNo,
            pageSize,
            startDate,
            endDate
        };
        reservationList(param).then(res => {
            const {count,list} = res.data.tableResponse;
            this.setState({
                dataSource:list,
                total:count,
                loading:false
            })
        }).catch(err =>{});
    }



    componentWillMount() {
        this.initHeader();
    }

    componentDidMount() {
        this.getReservationList(1);
    }

    render() {
        const {dataSource,loading,pageSize,total,visible,detail} = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey='reserveId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={{
                        total,
                        hideOnSinglePage:true,
                        defaultPageSize:pageSize,
                        onChange:this.getReservationList
                    }}
                    loading={loading}
                    scroll={{ x: 960}}
                />
                <Modal
                    title="预约详情"
                    maskClosable={false}
                    visible={visible===1}
                    onCancel={this.handleCancel}
                    footer={[]}
                >

                    <Row className="reservationDetail">
                        <Col span={24}>预约日期：{detail.createTime}</Col>
                    </Row>
                    <div className="reservationDetail">
                        <Row>
                            <Col span={12}>预约来源：{detail.type===1?'支付宝':'微信'}</Col>
                            <Col span={12}>客人电话：{detail.mobile}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>操作人员：{detail.operaterName?detail.operaterName:'--'}</Col>
                            <Col span={12}>是否取消：{detail.status===4?'是':'否'}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>座位性质：{detail.seatType===1?'大厅':'包厢'}</Col>
                            <Col span={12}>到店日期：{detail.startTime}</Col>
                        </Row>
                    </div>
                    <div className="reservationDetail">
                        <div>备注详情：</div>
                        <p>{detail.remarks}</p>
                    </div>
                    <div className="reservationDetail">
                        <div>撤销详情：</div>
                        <p>{detail.message}</p>
                    </div>
                </Modal>
            </Card>
        )
    }
}

export default ReservationList;



























