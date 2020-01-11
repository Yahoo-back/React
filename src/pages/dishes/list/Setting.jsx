import React,{PureComponent } from 'react';
import { Row, Col,Button,Input,message} from 'antd';

export default class Setting extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            list:this.props.list?this.props.list:[],
            addList:[],
            num:0
        }
    }
    //新增规格
    addNorm = ()=>{
        const {list,addList} = this.state;
        let listLength = list.length;
        let addLength = addList.length;
        let newCode = listLength+addLength;
        if(newCode<3){
            let addItem = {
                groupName:'',
                code:0,
                control:0,
                restaurantFoodStandardVoExtraList:[{
                    name:'',
                    price:''
                }]
            }
            addList.push(addItem);
            this.setState(()=>(
                addList
            ))
        }else {
            message.warning('最多只能添加三种规格！')
        }


    }
    addCancel = ()=>{
        this.setState({
            addList:[]
        })
    }

    //合并list和addList
    addConfirm = ()=>{
        const {list,addList} = this.state;
        if(addList.length===0){
            message.warning('请先添加新规格！');
            return false;
        }

        for (let i=0;i<addList.length;i++) {
            if(addList[i].groupName===''){
                message.warning('规格名称不能为空！');
                return false;
            }else {
                for (let j=0;j<addList[i].restaurantFoodStandardVoExtraList.length;j++){
                    if(addList[i].restaurantFoodStandardVoExtraList[j].name===''){
                        message.warning('分类名称不能为空！');
                        return false;
                    }
                }
            }
        }

        //保证价格不能有填和不填同时存在
        let isNoPrice=0,allTotal=0;
        if(addList.length>0){
            for (let i=0;i<addList.length;i++) {
                if(addList[i].restaurantFoodStandardVoExtraList.length>0){
                    for (let j=0;j<addList[i].restaurantFoodStandardVoExtraList.length;j++){
                        if(addList[i].restaurantFoodStandardVoExtraList[j].price!==''){
                            isNoPrice ++;
                        }else {
                            isNoPrice --;
                        }
                    }
                    if(isNoPrice===addList[i].restaurantFoodStandardVoExtraList.length){
                        allTotal++
                    }else if(isNoPrice===-(addList[i].restaurantFoodStandardVoExtraList.length)) {

                    }else {
                        message.warning('请为其中的一个规格填写价格！');
                        return false;
                    }
                    isNoPrice =0;
                }
            }

            if(allTotal==2){
                message.warning('请为其中的一个规格填写价格！');
                return false;
            }
        }


        //当list为空时判断所有的价格是否都填写，都填写则提醒用户只能填写其中一项
        let allPrice=true;
        if(list.length<1&&addList.length>1){
            for (let i=0;i<addList.length;i++) {
                for (let j=0;j<addList[i].restaurantFoodStandardVoExtraList.length;j++){
                    if(addList[i].restaurantFoodStandardVoExtraList[j].price!==''){
                        allPrice=true;
                    }else {
                        allPrice=false;
                        break;
                    }
                }
                if(allPrice===false){
                    break;
                }
            }
            if(allPrice){
                message.warning('最多只能为其中的一个规格添加价格！');
                return false;
            }
        }

        //当list为空时判断所有的价格是否都填写，当填写了其中的两个价格时提醒用户
        let twoPrice = 0;
        if(list.length<1&&addList.length>2){
            for (let i=0;i<addList.length;i++) {
                for (let j=0;j<addList[i].restaurantFoodStandardVoExtraList.length;j++){
                    if(addList[i].restaurantFoodStandardVoExtraList[j].price!==''){
                        twoPrice+=1;
                    }else {
                        twoPrice=0;
                    }
                }
            }
            if(twoPrice===2){
                message.warning('最多只能为其中的一个规格添加价格！');
                return false;
            }
        }

        //把控制金额的control字段置为1

        for (let i=0;i<addList.length;i++) {
            for (let j=0;j<addList[i].restaurantFoodStandardVoExtraList.length;j++){
                if(addList[i].restaurantFoodStandardVoExtraList[j].price!==''){
                    addList[i].control=1;
                }
            }
        }


        this.setState((prev)=>{
            return {
                list:[...prev.list,...prev.addList],
                addList:[]
            }

        })
    }
    //新增属性
    addType = ()=>{
        const {addList} = this.state;
        if(addList.length>0){
            let addChildItem = {
                name:'',
                price:''
            }
            addList[addList.length-1].restaurantFoodStandardVoExtraList.push(addChildItem);
            this.setState((prev)=>{
                return {
                    addList:addList,
                    num:prev.num+1
                }
            })
        }else {
            message.warning('请先添加一个规格！')
        }
    }

    itemChange = (e,index) => {
        const {addList}=this.state;
        addList[index].groupName=e.target.value;
        this.setState((prev)=>{
            return {
                addList:addList,
                num:prev.num+1
            }
        })
    }

    itemChildSortChange = (e,childIndex,index) => {
        const {addList}=this.state;
        addList[index].restaurantFoodStandardVoExtraList[childIndex].name=e.target.value;
        this.setState((prev)=>{
            return {
                addList:addList,
                num:prev.num+1
            }
        })
    }

    itemChildPriceChange = (e,childIndex,index) => {
        const {addList}=this.state;
        addList[index].restaurantFoodStandardVoExtraList[childIndex].price=e.target.value;
        this.setState((prev)=>{
            return {
                addList:addList,
                num:prev.num+1
            }
        })
    }

    //删除addList里的item项
    deleteItem = (index)=>{
        const {addList}=this.state;
        addList.splice(index,1)
        this.setState((prev)=>{
            return {
                addList:addList,
                num:prev.num-1
            }
        })
    }

    //删除list里的item项
    deleteListItem = (childIndex,fatherIndex)=>{
        const {list} = this.state;
        if(list[fatherIndex].restaurantFoodStandardVoExtraList.length===1){
            list.splice(fatherIndex,1);
        }else {
            list[fatherIndex].restaurantFoodStandardVoExtraList.splice(childIndex,1);
        }
        this.setState((prev)=>{
            return {
                list:list,
                num:prev.num-1
            }
        })
    }

    //用于父组件调用
    getList = ()=>{
        return this.state.list;
    }

    render(){
        const {list,addList} = this.state;
        let priceStatus=false;
        for (let i=0;i<list.length;i++) {
            for (let j=0;j<list[i].restaurantFoodStandardVoExtraList.length;j++){
                if(list[i].restaurantFoodStandardVoExtraList[j].price===''||list[i].restaurantFoodStandardVoExtraList[j].price===0){
                    priceStatus=false;
                }else {
                    priceStatus=true;
                    break;
                }
            }
            if(!priceStatus===false){
                break;
            }
        }

        return (
            <div className='wrapperSetting'>
                <Row className='settingHeader'>
                    <Col span={6}>规格名称</Col>
                    <Col span={6}>规格分类</Col>
                    <Col span={6}>售价(元)</Col>
                    <Col span={6}>操作</Col>
                </Row>
                {
                    list.length>0?list.map((item,index)=>{
                        return (
                            <Row
                                key={index}
                                type="flex"
                                justify="space-around"
                                align="middle"
                                style={{borderBottom:'1px solid #ffeed7'}}
                            >
                                <Col span={6}>{item.groupName}</Col>
                                <Col span={6}>
                                    {
                                        item.restaurantFoodStandardVoExtraList.map((childItem,index)=>{
                                            return (
                                                <Col span={24} key={index}>{childItem.name}</Col>
                                            )
                                        })
                                    }
                                </Col>
                                <Col span={6}>
                                    {
                                        item.restaurantFoodStandardVoExtraList.map((childItem,index)=>{
                                            return (
                                                <Col span={24} key={index}>{childItem.price===0||childItem.price===''?'--':childItem.price}</Col>
                                            )
                                        })
                                    }
                                </Col>
                                <Col span={6}>
                                    {
                                        item.restaurantFoodStandardVoExtraList.map((childItem,childIndex)=>{
                                            return (
                                                <Col span={24} key={childIndex}>
                                                    <Button
                                                        size='small'
                                                        type="danger"
                                                        onClick={()=>this.deleteListItem(childIndex,index)}
                                                    >删除</Button>
                                                </Col>
                                            )
                                        })
                                    }
                                </Col>
                            </Row>
                        )
                    }):'暂无数据'
                }
                {
                    addList.map((item,index)=>{
                        return (
                            <Row key={index} style={{borderBottom:'1px solid #ffeed7'}}>
                                <Col span={6}>
                                    <Input
                                        style={{width:'70%'}}
                                        placeholder="规格名称"
                                        value={item.groupName}
                                        onChange={(value)=>{this.itemChange(value,index)}}
                                    />
                                </Col>
                                <Col span={6}>
                                    {
                                        item.restaurantFoodStandardVoExtraList.map((childItem,childIndex)=>{
                                            return (
                                                <Col span={24} key={childIndex}>
                                                    <Input
                                                        style={{width:'70%'}}
                                                        placeholder="规格分类"
                                                        value={childItem.name}
                                                        onChange={(value)=>this.itemChildSortChange(value,childIndex,index)}
                                                    />
                                                </Col>
                                            )
                                        })
                                    }

                                </Col>
                                <Col span={6}>
                                    {
                                        !priceStatus?item.restaurantFoodStandardVoExtraList.map((childItem,childIndex)=>{
                                            return (
                                                <Col span={24} key={childIndex}>
                                                    <Input
                                                        style={{width:'70%'}}
                                                        placeholder="售价"
                                                        value={childItem.price}
                                                        onChange={(value)=>this.itemChildPriceChange(value,childIndex,index)}
                                                    />
                                                </Col>
                                            )
                                        }):''
                                    }
                                </Col>
                                <Col span={6}>
                                    <Button
                                        size='small'
                                        type="danger"
                                        onClick={()=>this.deleteItem(index)}
                                    >删除</Button>
                                </Col>
                            </Row>
                        )
                    })
                }
                <Row>
                    <Col span={6}>
                        <Button onClick={()=>this.addNorm()} type="link" icon="plus">新增规格</Button>
                    </Col>
                    <Col span={6}>
                        <Button onClick={()=>this.addType()} type="link" icon="plus">新增属性</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{color:'#ff1c00'}}>注：规格添加最多为3个,并且只能为其中一个规格分组添加不同的价格。</Col>
                </Row>
                {
                    addList.length>0?<Row span={8} type="flex" justify="end" style={{marginRight:5}}>
                        <Col>
                            <Button onClick={()=>this.addCancel()} style={{marginRight:10}}>取消</Button>
                            <Button onClick={()=>this.addConfirm()} type="primary">确认</Button>
                        </Col>
                    </Row>:''
                }
            </div>
        )
    }
}

