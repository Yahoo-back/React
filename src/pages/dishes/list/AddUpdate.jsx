import React,{Component} from 'react';
import {Breadcrumb, Card,Form, Input, Button, InputNumber, message,Select,Radio} from 'antd';
import {Link} from "react-router-dom";
import Picture from '../../../components/picture/Picture';
import Setting from './Setting';
import {dishesAdd, dishesCategoryList, categoryList, dishesUpdate} from "../../../api";
import memoryUtils from "../../../assets/js/memoryUtils";
const { TextArea } = Input;
const { Option } = Select;
class AddUpdate extends Component{
    constructor(props) {
        super(props);
        this.state = {
            categoryList:[],
            statisticsCategoryList:[],
            imgShape:'',
            showImgUrl:'',
            isSpecAdd:'1'

        }
        this.myRef1 = React.createRef();
        this.myRef2 = React.createRef();
        this.myList = React.createRef();
    }



    initHeader = ()=>{
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/dishesList">菜品列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.isUpdate?'菜品修改':'菜品添加'}</Breadcrumb.Item>
            </Breadcrumb>
        );

    }

    handleSubmit = e=> {
        const {isSpecAdd} = this.state;
        let photoUrl = this.myRef1.current.getImageUrl();
        let photoUrls = this.myRef2.current.getImageUrl();
        let list = []
        if(isSpecAdd==='2'){
            list = this.myList.current.getList()
            for (let i=0;i<list.length;i++) {
                list[i].code=i+1;
            }

        }
        if(!photoUrl){
            message.warning('请上传菜品头像图！')
            return;
        }
        if(!photoUrls){
            message.warning('请上传菜品详情图！')
            return;
        }

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let param = {
                    restaurantFood:{
                        description:values.description,
                        name:values.name,
                        foodGroupId:values.foodGroupId,
                        foodTopGroupId:values.foodTopGroupId,
                        price:values.price,
                        photoUrl:photoUrl,
                        photoUrls:photoUrls
                    },
                    restaurantFoodStandardGroupVoExtralist:list
                }

                if(this.isUpdate){
                    param.restaurantFood.foodId=this.foodId;
                    dishesUpdate(param).then((res) => {
                        message.success('修改成功！');
                        this.props.history.push('/dishesList')
                    }).catch(error => {})
                }else {
                    dishesAdd(param).then((res)=>{
                        message.success('添加成功！');
                        this.props.history.push('/dishesList')
                    }).catch(error => {})
                }
            }
        })
    }

    //是否设置规格
    isSpecAdd = (e)=>{
        this.setState({
            isSpecAdd:e.target.value
        })
    }

    //验证价格的自定义函数
    validatePrice=(rule,value,callback)=>{
        if(value*1>0){
            callback()
        }else {
            callback('价格必须大于0')
        }
    }
    categoryList = ()=>{
        categoryList({}).then(res=>{
            this.setState({
                categoryList:res.data.restaurantFoodGroupList
            })
        }).catch(err=>{});
    }
    dishesCategoryList = ()=>{
        dishesCategoryList({}).then(res=>{
            this.setState({
                statisticsCategoryList:res.data.restaurantFoodTopGroupList
            })
        }).catch(err=>{});
    }

    componentWillMount() {
        const dishes =  memoryUtils.dishesData;
        this.isUpdate = !!dishes.foodId;//验证是新增还是修改，true:修改，false：新增
        this.dishes = dishes || {};//防止为undefined影响后续判断
        this.foodId = this.isUpdate?this.dishes.foodId:'';
        if(this.isUpdate){
            this.list = JSON.parse(dishes.standards)||[];
            if(this.list.length>0){
                this.setState({
                    isSpecAdd:'2'
                })
            }
        }

        this.initHeader();
    }

    componentDidMount() {
        this.categoryList();
        this.dishesCategoryList();
    }

    componentWillUnmount() {
        memoryUtils.dishesData={}
    }


    render() {
        const {categoryList,statisticsCategoryList,isSpecAdd} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 20 },
        };
        const buttonItemLayout = {
            wrapperCol: { span: 20, offset: 3 }
        }
        return (
            <Card title={this.title}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="菜品名称">
                        {getFieldDecorator('name',{
                            initialValue:this.dishes.name,
                            rules: [{ required: true, message: '请输入菜品名称！' }],
                        })(
                            <Input
                                placeholder="菜品名称"
                                style={{width:250}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="菜品价格">
                        {getFieldDecorator('price', {
                            initialValue:this.dishes.price,
                            rules: [
                                { required: true, message: '请输入菜品价格！' },
                                {validator:this.validatePrice}
                            ],
                        })(
                            <InputNumber
                                placeholder="价格"
                                style={{width:100}}
                            />
                        )}
                        <span> 元</span>
                    </Form.Item>
                    <Form.Item label="菜品分类" >
                        {getFieldDecorator('foodGroupId', {
                            initialValue:this.dishes.foodGroupId,
                            rules: [{ required: true, message: '请选择菜品分类！' }]
                        })(
                            <Select placeholder="菜品分类" style={{width:250}}>
                                {
                                    categoryList.map((item,index)=>{
                                        return (
                                            <Option key={index} value={item.foodGroupId}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="统计分类" >
                        {getFieldDecorator('foodTopGroupId', {
                            initialValue:this.dishes.foodTopGroupId,
                            rules: [{ required: true, message: '请选择统计分类！' }]
                        })(
                            <Select placeholder="统计分类" style={{width:250}}>
                                {
                                    statisticsCategoryList.map((item,index)=>{
                                        return (
                                            <Option key={index} value={item.foodTopGroupId}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="菜品头像上传">
                        <Picture ref={this.myRef1} imgUrl={this.dishes.photoUrl} />
                    </Form.Item>
                    <Form.Item label="详情图上传">
                        <Picture ref={this.myRef2} imgUrl={this.dishes.photoUrls} />
                    </Form.Item>
                    <Form.Item label="菜品介绍">
                        {getFieldDecorator('description',{
                            initialValue:this.dishes.description,
                            rules: [{ required: true, message: '请输入菜品介绍！' }],
                        })(
                            <TextArea
                                style={{width:350}}
                                placeholder="菜品介绍"
                                autosize={{ minRows: 3, maxRows: 6 }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="规格设置">
                        {getFieldDecorator('isSpecAdd',{
                            initialValue:isSpecAdd
                        })(
                            <Radio.Group onChange={(e)=>this.isSpecAdd(e)}>
                                <Radio value="1">无规格</Radio>
                                <Radio value="2">设置规格</Radio>
                            </Radio.Group>
                        )}

                        {
                            isSpecAdd==='2'?<Setting ref={this.myList} list={this.list}/>:''
                        }

                    </Form.Item>
                    <Form.Item {...buttonItemLayout}>
                        <Button style={{width:90}}>
                            <Link to="/dishesList">取消</Link>
                        </Button>
                        <Button style={{width:90,marginLeft:'15px'}} type="primary" htmlType="submit" >确定</Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
const WrapAddUpdate = Form.create()(AddUpdate);
export default WrapAddUpdate;