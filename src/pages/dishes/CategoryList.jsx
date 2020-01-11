import React,{Component} from 'react';
import ReactDragListView from 'react-drag-listview';
import {Breadcrumb, Card, Button, Table, message, Modal, Input,Icon} from 'antd';
import {
    categoryList,
    categoryAdd,
    categoryUpdate,
    categoryDelete,
    categoryDrag
} from '../../api';

class CategoryList extends Component{

    constructor(props){
        super(props);
        this.state={
            dataSource:[],//分类数量列表
            loading:false,//加载动画
            visible:false,//Modal显示隐藏
            newCategory:'',//Model中的输入框值
            foodGroupId:null
        }

        const that = this;
        this.dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const startId = that.state.dataSource[fromIndex].foodGroupId;
                const endId = that.state.dataSource[toIndex].foodGroupId;
                categoryDrag(startId,endId).then(res=>{
                    const dataSource = that.state.dataSource;
                    const item = dataSource.splice(fromIndex, 1)[0];
                    dataSource.splice(toIndex, 0, item);
                    that.setState({
                        dataSource
                    });
                }).catch(err=>{});
            },
            handleSelector: "td"
        };
    }

    //删除操作
    deleteItem = (foodGroupId)=>{
        Modal.confirm({
            title: '确定要删除这条分类?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                categoryDelete(foodGroupId).then(res => {
                    message.success("删除成功！");
                    this.getCategoryList();
                }).catch(err=>{})
            }
        })
    }

    //隐藏弹框操作
    handleCancel = ()=>{
        this.setState({
            visible:false,
            newCategory:'',
            foodGroupId:null
        })
    }
    //显示弹框操作
    showModal = (data)=>{
        if(!data){
            this.setState({visible:true})
        }else {
            this.setState({
                newCategory:data.name,
                visible:true,
                foodGroupId:data.foodGroupId
            })
        }
    }

    //添加分类弹框操作
    addCategory = ()=> {
        let newCategory = this.state.newCategory;
        if(!newCategory){
            message.error('请输入分类名称');
            return false;
        }
        let params = {
            restaurantFoodGroup: {
                name: newCategory
            }
        };
        categoryAdd(params).then(res => {
            this.getCategoryList();
            this.setState({
                newCategory:'',
                visible:false
            })
        }).catch(err=>{})
    }


    //修改分类弹框操作
    updateCategory = ()=>{
        let {newCategory,foodGroupId} = this.state;
        if(!newCategory){
            message.error('请输入修改后的分类名称');
            return false;
        }
        let params = {
            restaurantFoodGroup: {
                name: newCategory,
                foodGroupId,
                status: 1
            }
        };
        categoryUpdate(params).then(res => {
            this.getCategoryList();
            this.setState({
                visible:false,
                newCategory:'',
                foodGroupId:null
            })
        }).catch(err=>{})
    }

    //Modal确认按钮
    handleCategory = foodGroupId =>{
        if(foodGroupId){
            this.updateCategory()
        }else {
            this.addCategory()
        }
    }


    getnewCategory = (e)=>{
        this.setState({
            newCategory:e.target.value
        })
    }

    //初始化table头/面包屑/头部
    initColumn = ()=>{
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>菜品统计分类</Breadcrumb.Item>
                <Breadcrumb.Item>分类列表</Breadcrumb.Item>
            </Breadcrumb>
        );

        this.extra = (
            <Button onClick={()=>this.showModal()} type="primary" icon="plus" >新增</Button>
        );

        this.columns = [
            {
                title: '分类编号',
                dataIndex: 'foodGroupId',
                width:90,
                align: 'center',
            },
            {
                title: '分类名称',
                dataIndex: 'name',
                align: 'center',
            },
            {
                title: '菜品数量',
                dataIndex: 'totalNum',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'zhaui',
                width:90,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button onClick={()=>this.showModal(data)} type="primary" icon="edit" />
                            <Button onClick={()=>this.deleteItem(data.foodGroupId)} type="danger" style={{marginLeft:'5px'}} icon="delete"/>
                        </span>
                    )
                }
            },
            {
                title: '拖拽排序',
                dataIndex: 'operate',
                width:90,
                align: 'center',
                render: (text,data,index) => {
                    return (
                        <Icon style={{fontSize:20,cursor:'pointer'}} type="drag" />
                    )
                }
            },
        ];
    }

    getCategoryList = ()=>{
        this.setState({loading:true})
        categoryList({}).then(res => {
            const dataSource = res.data.restaurantFoodGroupList;
            this.setState({
                dataSource,
                loading:false
            })
        }).catch(err=>{})
    }

    componentWillMount() {
        this.initColumn();
    }

    componentDidMount() {
        this.getCategoryList();
    }

    render() {
        const {dataSource,loading,visible,newCategory,foodGroupId} = this.state;
        return (
            <Card title={this.title} extra={this.extra} >
                <ReactDragListView {...this.dragProps}>
                <Table
                    rowKey='foodGroupId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={false}
                    loading={loading}
                />
                </ReactDragListView>
                <Modal
                    title={foodGroupId?'分类修改':'分类添加'}
                    maskClosable={false}
                    visible={visible}
                    onOk={()=>this.handleCategory(foodGroupId)}
                    onCancel={this.handleCancel}
                >
                    <Input placeholder="分类名称" onChange={(e)=>this.getnewCategory(e)} value={newCategory} />
                </Modal>
            </Card>

        )
    }
}

export default CategoryList;