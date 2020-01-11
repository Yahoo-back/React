import React,{Component} from 'react';
import {Breadcrumb, Card, Button, Table, message, Modal} from 'antd';
import {couponManagement, couponDel} from "../../api";

class CouponList extends Component{

    state={
        dataSource:[],//分类数量列表
        pageSize:20,
        total:0,
        loading:false,//加载动画
    }

    initHeader = ()=>{
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>优惠券管理</Breadcrumb.Item>
                <Breadcrumb.Item>优惠券列表</Breadcrumb.Item>
            </Breadcrumb>
        );

        this.extra = (
            <Button
                onClick={()=>this.props.history.push('/couponManagement/add')}
                type="primary"
                icon="plus"
            >新增</Button>
        );
        this.columns = [
            {
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                fixed: 'left',
                width:60,
                render:(text,record,index)=>`${index+1}`,
            },
            {
                title: '优惠券编号',
                fixed: 'left',
                width:100,
                dataIndex: 'couponId',
                align: 'center'
            },
            {
                title: '优惠券名称',
                dataIndex: 'couponName',
                align: 'center'
            },
            {
                title: '发放数量',
                dataIndex: 'totalNum',
                align: 'center'
            },
            {
                title: '领取数量',
                dataIndex: 'receiveNum',
                align: 'center'
            },
            {
                title: '使用数量',
                dataIndex: 'useNum',
                align: 'center',
            },
            {
                title: '使用率',
                dataIndex: 'usePercent',
                align: 'center',
            },
            {
                title: '发放日期',
                dataIndex: 'robTime',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:100,
                align: 'center',
                fixed: 'right',
                render: (text, data) => {
                    return (
                        <Button
                            onClick={()=>this.deleteItem(data.couponId)}
                            type="danger"
                            icon="delete"
                            style={{marginLeft:'5px'}}
                        />
                    )
                }
            },
        ];
    }

    deleteItem = (couponId)=>{
        Modal.confirm({
            title: '确定要删除?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                couponDel({couponId}).then(res => {
                    message.success("删除成功！");
                    this.getCouponList(1);
                }).catch(()=>{})
            }
        })
    }


    getCouponList = (pageNo)=>{
        this.setState({loading:true})
        let {pageSize} = this.state;
        let param = {
            pageNo,
            pageSize
        };
        couponManagement(param).then(res => {
            const {total,list} = res.data.restaurantCouponPageInfo;
            this.setState({
                dataSource:list,
                total,
                loading:false
            })
        }).catch(err =>{});
    }


    componentWillMount() {
        this.initHeader();
    }

    componentDidMount() {
        this.getCouponList(1)
    }


    render() {
        const {dataSource,loading,pageSize,total} = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey='couponId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={{
                        total,
                        hideOnSinglePage:true,
                        defaultPageSize:pageSize,
                        onChange:this.getCouponList
                    }}
                    loading={loading}
                    scroll={{ x: 960}}
                />
            </Card>
        )
    }
}

export default CouponList;