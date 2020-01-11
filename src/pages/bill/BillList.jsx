import React,{Component} from 'react';
import {Breadcrumb, Button, Card, Table, DatePicker, message} from 'antd';
import {billPlatformList,billSystemList} from '../../api';
import moment from 'moment';
const { MonthPicker } = DatePicker;
// 定义你需要的时间格式
const monthFormat = 'YYYY-MM';
// 获取前一个月的时间
const beforeMonth = moment().subtract('1','month').format(monthFormat);


class BillList extends Component{

    state = {
        list:[],//标签列表
        loading:false,
        yearMonth:beforeMonth,
        total:0,//标签总数量
        pageSize:20
    }

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>对账管理</Breadcrumb.Item>
                <Breadcrumb.Item>账单列表</Breadcrumb.Item>
            </Breadcrumb>
        );
        this.extra = (
            <MonthPicker
                defaultValue={moment(beforeMonth, monthFormat)}
                format={monthFormat}
                placeholder={['选择月份']}
                onChange={this.onChangeTime}
            />
        )
        this.columns = this.type===1?[
            {
                title: '日期',
                dataIndex: 'billDate'
            },
            {
                title: '微信',
                dataIndex: 'wechatCheckStatus',
                align: 'center',
                render:(wechatCheckStatus)=> {
                    if(wechatCheckStatus===0){
                        return '初始化'
                    }else if(wechatCheckStatus===1){
                        return '核对中'
                    }else if(wechatCheckStatus===2){
                        return '核对成功'
                    }else if(wechatCheckStatus===3){
                        return '核对失败'
                    }else if(wechatCheckStatus===4){
                        return '金额不一致'
                    }else if(wechatCheckStatus===5){
                        return '本地缺失'
                    }
                }
            },
            {
                title: '支付宝',
                dataIndex: 'alipayCheckStatus',
                align: 'center',
                render:(alipayCheckStatus)=> {
                    if(alipayCheckStatus===0){
                        return '初始化'
                    }else if(alipayCheckStatus===1){
                        return '核对中'
                    }else if(alipayCheckStatus===2){
                        return '核对成功'
                    }else if(alipayCheckStatus===3){
                        return '核对失败'
                    }else if(alipayCheckStatus===4){
                        return '金额不一致'
                    }else if(alipayCheckStatus===5){
                        return '本地缺失'
                    }
                }
            },
            {
                title: '查看',
                dataIndex: 'operate',
                width:90,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button type="primary" icon="profile" />
                        </span>
                    )
                }
            }
        ]:[
            {
                title: '日期',
                dataIndex: 'countDate'
            },
            {
                title: '状态',
                dataIndex: 'type',
                align: 'center',
                render:(type)=> {
                    if(type === 1)
                        type = '已生成';
                    else if(type === 2)
                        type = '已核对';
                    else if(type === 3)
                        type = '提交划款';
                    else if(type === 4)
                        type = '已划款';
                    return type;
                }
            },
            {
                title: '查看',
                dataIndex: 'operate',
                width:90,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button type="primary" icon="profile" />
                        </span>
                    )
                }
            }
        ];
    };

    onChangeTime = (value, dateString)=>{
        this.setState({
            yearMonth:dateString
        },()=>{
            this.type===1?this.getBillPlatformList():this.getBillSystemList();
        })

    }

    //获取平台账单列表
    getBillPlatformList=()=>{
        this.setState({loading:true})
        let param = {
            yearMonth: this.state.yearMonth
        }
        billPlatformList(param).then(res => {
            this.setState({
                list:res.data.list,
                loading:false
            })
        }).catch(()=>{})
    };

    //获取商家账单列表
    getBillSystemList=()=>{
        this.setState({loading:true})
        let param = {
            yearMonth: this.state.yearMonth
        }
        billSystemList(param).then(res => {
            this.setState({
                list:res.data.list,
                loading:false
            })
        }).catch(()=>{})
    };

    componentWillMount() {
        this.type = Number(sessionStorage.getItem('type'));
        this.initHeader();
    }

    componentDidMount() {
        this.type===1?this.getBillPlatformList():this.getBillSystemList();
    }

    render() {
        const {list,loading,pageSize} = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey={this.type===1?'checkOrderId':'orderCheckId'}
                    dataSource={list}
                    columns={this.columns}
                    pagination={{
                        hideOnSinglePage:true,
                        defaultPageSize:pageSize
                    }}
                    loading={loading}
                />
            </Card>
        )
    }
}

export default BillList;