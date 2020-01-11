import React,{Component} from 'react';
import {Breadcrumb, Card, Button, Table, message, Modal, Switch,Icon,Input} from 'antd';
import {dishesList, dishesDelete, onLine, recommendation} from "../../../api";
import memoryUtils from "../../../assets/js/memoryUtils";

const { Search } = Input;

class DishesList extends Component{

    state={
        dataSource:[],//分类数量列表
        pageSize:20,
        total:0,
        keyWord:'',
        loading:false,//加载动画
        visible:0,//确认框是否显示，0：不显示，1：显示
        picture:'',
    }


    initHeader = ()=>{
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>菜品管理</Breadcrumb.Item>
                <Breadcrumb.Item>菜品列表</Breadcrumb.Item>
            </Breadcrumb>
        );

        this.extra = (
            <span>
                <Search
                    style={{width:250,marginRight:10}}
                    placeholder="搜索菜品"
                    onSearch={value => this.searchInfo(value)}
                    enterButton
                />
                <Button
                    onClick={()=>this.props.history.push('/dishesList/addUpdate')}
                    type="primary"
                    icon="plus"
                >新增</Button>
            </span>
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
                title: '菜品编码',
                fixed: 'left',
                width:80,
                dataIndex: 'foodId',
                align: 'center'
            },
            {
                title: '名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '分类',
                dataIndex: 'foodGroupName',
                align: 'center'
            },
            {
                title: '单价（元）',
                dataIndex: 'price',
                align: 'center'
            },
            {
                title: '图片',
                dataIndex: 'photoUrl',
                align: 'center',
                render:(photoUrl)=>{
                    return (
                        <Icon
                            style={{fontSize:20,color:'#FF9500'}}
                            type="picture"
                            onClick={()=>this.LookItem(photoUrl)}
                        />
                    )
                },
            },
            {
                title: '规格',
                dataIndex: 'isStandards',
                align: 'center',
                render:(isStandards)=>{
                    return (
                        isStandards===1?'有':'无'
                    )
                },
            },
            {
                title: '首页推荐',
                dataIndex: 'recommend',
                align: 'center',
                render:(text,data)=>{
                    return (
                        data.recommend===1?
                        <Switch
                            defaultChecked
                            onChange={()=>this.changeRecommend(data)}
                            checkedChildren="开"
                            unCheckedChildren="关"
                        />:
                        <Switch
                            onChange={()=>this.changeRecommend(data)}
                            checkedChildren="开"
                            unCheckedChildren="关"
                        />
                    )
                },
            },
            {
                title: '上线',
                dataIndex: 'online',
                align: 'center',
                render:(text,data)=>{
                    return (
                        data.online===1?
                        <Switch
                            defaultChecked
                            onChange={()=>this.changeOnline(data)}
                            checkedChildren="开"
                            unCheckedChildren="关"
                        />:
                        <Switch
                            onChange={()=>this.changeOnline(data)}
                            checkedChildren="开"
                            unCheckedChildren="关"
                        />
                    )
                },
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:100,
                align: 'center',
                fixed: 'right',
                render: (text,data) => {
                    return (
                        <span>
                            <Button
                                onClick={()=>this.detailItem(data)}
                                type="primary"
                                icon="edit"
                                style={{marginLeft:'5px'}}
                            />
                            <Button
                                onClick={()=>this.deleteItem(data.foodId)}
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

    changeRecommend = (data)=>{
        let param = {
            recommend: data.recommend===1?-1:1,
            foodId:data.foodId
        }
        recommendation(param).then(() => {
            message.success('操作成功！');
        }).catch(error => {})
    }

    changeOnline = (data)=>{
        let param = {
            foodId: data.foodId,
            onLine: data.online===1?-1:1
        }
        onLine(param).then(() => {
            message.success('操作成功！');
        }).catch(error => {})
    }


    detailItem = (data)=>{
        memoryUtils.dishesData = data;
        this.props.history.push('/dishesList/addUpdate')
    }

    deleteItem = (foodId)=>{
        Modal.confirm({
            title: '确定要删除?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                dishesDelete(foodId).then(res => {
                    message.success("删除成功！");
                    this.getDishesList();
                }).catch(err=>{})
            }
        })

    }

    handleCancel = ()=>{
        this.setState({
            visible:0
        })
    }

    LookItem = photoUrl=>{
        this.setState({
            photoUrl,
            visible:1
        })
    };
    searchInfo = (value)=>{
        this.setState({
            keyWord:value
        },()=>this.getDishesList(1))
    }
    getDishesList = (pageNo)=>{
        this.setState({loading:true})
        let {pageSize,keyWord} = this.state;
        let param = {
            pageNo,
            pageSize,
            foodTypeId: null,
            keys: keyWord
        };
        dishesList(param).then(res => {
            const {count,restaurantFoodList} = res.data;
            this.setState({
                dataSource:restaurantFoodList,
                total:count,
                loading:false
            })
        }).catch(err =>{});
    }

    componentWillMount() {
        this.initHeader();
    }

    componentDidMount() {
        this.getDishesList(1);
    }

    render() {
        const {dataSource,loading,visible,photoUrl,pageSize,total} = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey='foodId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={{
                        total,
                        hideOnSinglePage:true,
                        defaultPageSize:pageSize,
                        onChange:this.getDishesList
                    }}
                    loading={loading}
                    scroll={{ x: 960}}
                />
                <Modal
                    title="图片详情"
                    width={300}
                    maskClosable={false}
                    visible={visible===1}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    <img style={{width: "150px",marginLeft:50}} src={photoUrl} alt='' />
                </Modal>
            </Card>
        )
    }
}

export default DishesList;