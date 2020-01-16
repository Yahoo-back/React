import React,{Component} from 'react';
import {Breadcrumb, Button, Card, Table, DatePicker, message, Input, Row, Col, Select, Pagination  } from 'antd';
import {billPlatformList,billSystemList} from '../../api';
import {productList,classify} from '../../api'
import moment from 'moment';
// import { DateAPI } from "../../config/format";
import DateAPI from '../../config/format'
const { MonthPicker } = DatePicker;
// 定义你需要的时间格式
const monthFormat = 'YYYY-MM';
const { Search } = Input;
const { RangePicker } = DatePicker;
const {Option} = Select;
// 获取前一个月的时间
const beforeMonth = moment().subtract('1','month').format(monthFormat);


class ProductList extends Component{
  state = {
    list:[],//标签列表
    classify: [],
    loading:false,
		yearMonth:beforeMonth,
		pageSize: '',
		pageNum: '',
		name_cnd: '',
		is_hot_cnd: '',
		classify_cnd: '',
		position_cnd: '',
		status_cnd: '',
		create_time_FROM_cnd: '',
		create_time_TO_cnd: '',
    total: 0,//标签总数量
    pageSize:10,
    pageNum: 1,
    pageSizeOptions: ['5','10','20','30']
  }

  //初始化面包屑
  initHeader = ()=> {
    // this.title = (
    //   <Breadcrumb>
    //     <Breadcrumb.Item>商品管理</Breadcrumb.Item>
    //     <Breadcrumb.Item>商品列表</Breadcrumb.Item>
    //   </Breadcrumb>
    // );
    this.columns = [
			{
        title: '序号',
        dataIndex: 'index',
				align: 'center',
				render:(text,record,index)=>`${index+1}`
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '分类',
        dataIndex: 'classify',
        key: 'classify',
        align: 'center',
      },
      {
        title: '链接',
        dataIndex: 'link',
        key: 'link',
        width: 200,
        align: 'center',
      },
      {
      	title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        align: 'center',
      },
      {
        title: '是否首页热门',
        dataIndex: 'is_hot',
        key: 'is_hot',
        align: 'center',
        render:(is_hot)=>{
          if(is_hot === "0"){
            return '否'
          }else if(is_hot === "1"){
            return '是'
          }else{
            return '未知'
          }
        }
			},
			{
      	title: '热门排序',
        dataIndex: 'hot_sort',
        key: 'hot_sort',
        align: 'center',
			},
			{
      	title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        // render:(value,Object)=>{
        //   return DateAPI.format(value,'yyyy-MM-dd hh:mm:ss')
        // }
			},
			{
      	title: '状态',
        dataIndex: 'status',
        key: 'status',
				align: 'center',
				render:(status)=>{
          if(status === "0"){
            return '下架'
          }else if(status === "1"){
            return '上架'
          }else{
            return '未知'
          }
        }
			},
			{
      	title: '位置',
        dataIndex: 'position',
        key: 'position',
				align: 'center',
				render:(position)=>{
          if(position === "0"){
            return '默认'
          }else if(position === "1"){
            return '置顶'
          }else if(position === "2"){
            return '置尾'
          }else{
            return '未知'
          }
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
              <Button type="primary" icon="profile" />
            </span>
          )
        }
      }
    ]
  };

  changeTime=(value,dateString)=>{
    this.setState({
      create_time_FROM_cnd: dateString[0],
      create_time_TO_cnd: dateString[1]
    })

  }

  handleName=({target:{value}})=>{
    this.setState({
      name_cnd: value
    })
  }

  handleClassify=(value)=>{
    classify().then(res => {
      if(res.data.code == 200){
        this.setState({
          classify: res.data.data,
          classify_cnd: value
        })
      }else{

      }
    }).catch(()=>{})
  }

  handleStatus=(value)=>{
    this.setState({
      status_cnd: value
    })
  }

  handlePoition=(value)=>{
    this.setState({
      position_cnd: value
    })
  }

  handleHot=(value)=>{
    this.setState({
      is_hot_cnd: value
    })
  }

  //获取商品列表
  getProductList=()=>{
    this.setState({
      loading:true,
    })
    const {pageNum,pageSize,name_cnd,is_hot_cnd,classify_cnd,position_cnd,status_cnd,create_time_FROM_cnd,create_time_TO_cnd} = this.state
    let param = {
			pageNum: pageNum,
			pageSize: pageSize,
			name_cnd: name_cnd,
			is_hot_cnd: is_hot_cnd,
			classify_cnd: classify_cnd == undefined ? '' : classify_cnd,
			position_cnd: position_cnd,
			status_cnd: status_cnd,
			create_time_FROM_cnd:create_time_FROM_cnd,
			create_time_TO_cnd: create_time_TO_cnd
    }
    productList(param).then(res => {
      if(res.data.code == 200){
        this.setState({
          list:res.data.data.list,
          total:res.data.data.total,
          pageNum:res.data.data.pageNum,
          pageSize: res.data.data.pageSize,
          loading:false
        })
      }
    }).catch(()=>{})
  };

  handleSearch=()=>{
    this.getProductList();
    // console.log(this.state.classify_cnd)
    // const {name_cnd, is_hot_cnd, classify_cnd, position_cnd,status_cnd,create_time_FROM_cnd,create_time_TO_cnd} = this.state;
    // let param = {
    //   pageNum: 1,
    //   pageSize: 5,
    //   name_cnd: name_cnd,
    //   is_hot_cnd: is_hot_cnd,
    //   classify_cnd: classify_cnd == undefined ? '' : classify_cnd,
    //   position_cnd: position_cnd,
    //   status_cnd: status_cnd,
    //   create_time_FROM_cnd: create_time_FROM_cnd,
    //   create_time_TO_cnd: create_time_TO_cnd
    // }
    // console.log(param)
    // productList(param).then(res => {
    //   this.setState({
    //     list:res.data.data.list,
    //     loading:false
    // 	})
    // }).catch(()=>{})
  }
  
  onShowSizeChange=(pageNum, pageSize)=>{
    console.log(pageNum, pageSize);
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },() => {
        this.getProductList();
    })
  }

  onChange=(pageNum, pageSize)=>{
    console.log(pageNum, pageSize);
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },() => {
      this.getProductList();
    })
  }

  componentWillMount() {
    this.initHeader();
	}
	
  componentDidMount() {
    this.getProductList()
    this.handleClassify()
  }
  

  render() {
    const {list,loading,pageSize,classify,total,pageSizeOptions} = this.state;
    return (
      <div>
        <Card title={this.title}>
        <Row>
          <div className="searchOne">
            <Search
              placeholder="请输入商品名称"
              onChange={this.handleName}
              style={{ width: 200 }}
            />
          </div>
          <div className="search">
            <RangePicker renderExtraFooter={() => 'extra footer'} showTime onChange={this.changeTime}/>
          </div>
          <div className="search">
            <Select defaultValue="请选择分类" style={{ width: 160 }} onChange={this.handleClassify}>
            <Option value="">请选择分类</Option>
              {
                classify.map((item,index)=>{
                  return (
                    <Option key={item.name} value={item.id}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </div>
          <div className="search">
            <Select defaultValue="请选择状态" style={{ width: 160 }} onChange={this.handleStatus}>
              <Option value="">请选择状态</Option>
              <Option value="0">下架</Option>
              <Option value="1">上架</Option>
            </Select>
          </div>
          <div className="search">
            <Select defaultValue="请选择首页热门" style={{ width: 160 }} onChange={this.handleHot}>
              <Option value="">请选择首页热门</Option>
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>
          </div>
          <div className="search">
            <Select defaultValue="请选择位置" style={{ width: 160 }} onChange={this.handlePoition}>
              <Option value="">请选择位置</Option>
              <Option value="0">默认</Option>
              <Option value="1">置顶</Option>
              <Option value="2">置尾</Option>
            </Select>
          </div>
          <div className="search">
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
          </div>
        </Row>
          <Table
            rowKey='id'
            style={{marginTop: 20}}
            dataSource={list}
            columns={this.columns}
            pagination={{
              hideOnSinglePage:true,
            }}
            loading={loading}
          />
        <div style={{marginTop: 30}}>
          <Pagination
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.onChange}
            defaultCurrent={1}
            pageSizeOptions={pageSizeOptions}
            showTotal={total => `共 ${total} 条`}
            total={total}
          />
        </div>
        </Card>
       
      </div>
        
      
    )
	}
}

export default ProductList;