import React,{Component} from 'react';
import {Breadcrumb, Card, Button, Table, message,Modal,Input} from 'antd';
import {
    dishesCategoryList,
    dishesCategoryAdd,
    dishesCategoryUpdate,
    dishesCategoryDelete
} from '../../api';

class DishesCategory extends Component{

    state={
        dataSource:[],//分类数量列表
        loading:true,//加载动画
        visible:false,//标识分类添加/修改的确认框是否显示
        newCategory:'',//Model中的输入框值
        foodTopGroupId:null
    }

    //删除操作
    deleteItem = (foodTopGroupId)=>{
        Modal.confirm({
            title: '确定要删除这条分类?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                dishesCategoryDelete({foodTopGroupId}).then(res => {
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
            foodTopGroupId:null
        })
    }
    //显示弹框操作
    showModal = (data)=>{
        if(data){
            this.setState({
                newCategory:data.name,
                visible:true,
                foodTopGroupId:data.foodTopGroupId
            })
        }else {
            this.setState({
                visible:true
            })
        }
    }

    //添加分类弹框操作
    addCategory = ()=> {
        let newCategory = this.state.newCategory;
        if(!newCategory){
            message.error('请输入分类名称')
            return false;
        }
        let params = {
            restaurantFoodTopGroup: {
                name: newCategory
            }
        };
        dishesCategoryAdd(params).then(res => {
            message.success("添加成功！");
            this.getCategoryList();
            this.setState({
                newCategory:'',
                visible:0
            })
        }).catch(err=>{})
    }

    //修改分类弹框操作
    updateCategory = ()=>{
        let {newCategory,foodTopGroupId} = this.state;
        if(!newCategory){
            message.error('请输入修改后的分类名称');
            return false;
        }
        let params = {
            restaurantFoodTopGroup: {
                name: newCategory,
                foodTopGroupId
            }
        };
        dishesCategoryUpdate(params).then(res => {
            message.success("修改成功！");
            this.getCategoryList();
            this.setState({
                newCategory:'',
                visible:0,
                foodTopGroupId:null
            })
        }).catch((err)=>{})
    }

    //Modal确认操作
    handleCategory=(foodTopGroupId)=>{
        if(foodTopGroupId){
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
        )

        this.columns = [
            {
                title: '序号',
                dataIndex: 'index',
                render:(text,record,index)=>`${index+1}`,
            },
            {
                title: '分类',
                dataIndex: 'name',
                align: 'center',
            },
            {
                title: '数量',
                dataIndex: 'totalNum',
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
                            <Button onClick={()=>this.deleteItem(data.foodTopGroupId)} type="danger" style={{marginLeft:'5px'}} icon="delete"/>
                        </span>
                    )
                }
            },
        ];
    }

    getCategoryList = ()=>{
        dishesCategoryList({}).then(res => {
            const dataSource = res.data.restaurantFoodTopGroupList;
            this.setState({
                dataSource,
                loading:false
            })
        }).catch((err)=>{})
    }

    componentWillMount() {
        this.initColumn();
    }

    componentDidMount() {
        this.getCategoryList();
    }

    render() {
        const {dataSource,loading,visible,newCategory,foodTopGroupId} = this.state;
        return (
            <Card title={this.title} extra={this.extra} >
                <Table
                    rowKey='foodTopGroupId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={false}
                    loading={loading}
                />
                <Modal
                    title={foodTopGroupId?"分类修改":"分类添加"}
                    maskClosable={false}
                    visible={visible}
                    onOk={()=>this.handleCategory(foodTopGroupId)}
                    onCancel={this.handleCancel}
                >
                    <Input placeholder="分类名称" onChange={(e)=>this.getnewCategory(e)} value={newCategory} />
                </Modal>
            </Card>

        )
    }
}

export default DishesCategory;