import React,{Component} from 'react';
import {Breadcrumb, Button, Card, Table, DatePicker, message, Input, Row, Col, Select, Pagination, Modal, Form  } from 'antd';
import {billPlatformList,billSystemList} from '../../api';
import {productVisit,qryVisitProductListAll} from '../../api'
import moment from 'moment';
// 定义你需要的时间格式
const monthFormat = 'YYYY-MM';
const { Search } = Input;
const { RangePicker } = DatePicker;
const {Option} = Select;


class ProductVisit extends Component{
  state = {
    addVisible: false,
    openVisible: false,
    closeVisible: false,
    list:[],//标签列表
    qryVisitProductListAll: [],
    product: '',
    loading:false,
    pageSize: '',
    pageNum: '',
    name_cnd: '',
    create_time_FROM_cnd: '',
    create_time_TO_cnd: '',
    total: 0,//标签总数量
    pageSize:10,
    pageNum: 1,
    pageSizeOptions: ['5','10','20','30'],
    title: '新增商品',
    confirmLoading: false,
    ModalText: 'Content of the modal',
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
        width: 120,
        fixed: 'left',
				render:(text,record,index)=>`${index+1}`
    },
    {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: 300,
        fixed: 'left',
        align: 'center',
    },
    {
        title: '预付款',
        dataIndex: 'money',
        key: 'money',
        width: 300,
        align: 'center',
    },
    {
        title: '访问次数',
        dataIndex: 'count',
        key: 'count',
        width: 300,
        align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width:320,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
},
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 300,
      align: 'center',
        render:(status)=>{
        if(status === "0"){
          // return '开启'
          return(
            <Button type="primary" onClick={this.showCloseModal} >关闭</Button>
          )
        }else if(status === "1"){
          return(
            <Button type="primary" onClick={this.showOpenModal} >开启</Button>
          ) 
          // return '关闭'
        }else if(status === "2"){
          return '失效'
        }else{
          return '未知'
        }
      }
    }
    ]
  };
  showAddModal=()=>{
    this.setState({
      addVisible: true,
      title: '新增访问商品'
    })
  }

  showOpenModal=()=>{
    this.setState({
      openVisible: true,
      title: '开启访问商品'
    })
  }

  showCloseModal=()=>{
    this.setState({
      closeVisible: true,
      title: '关闭访问商品'
    })
  }

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        addVisible: false,
        closeVisible: false,
        openVisible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      addVisible: false,
      closeVisible: false,
      openVisible: false
    });
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

  //获取商品列表
  getProductVisit=()=>{
    this.setState({
      loading:true,
    })
    const {pageNum,pageSize,name_cnd,create_time_FROM_cnd,create_time_TO_cnd} = this.state
    let param = {
			pageNum: pageNum,
			pageSize: pageSize,
			name_cnd: name_cnd,
			create_time_FROM_cnd:create_time_FROM_cnd,
			create_time_TO_cnd: create_time_TO_cnd
    }
    productVisit(param).then(res => {
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
    this.getProductVisit();
  }
  
  onShowSizeChange=(pageNum, pageSize)=>{
    console.log(pageNum, pageSize);
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },() => {
        this.getProductVisit();
    })
  }

  onChange=(pageNum, pageSize)=>{
    console.log(pageNum, pageSize);
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },() => {
      this.getProductVisit();
    })
  }

  handleProduct=(value)=>{
    qryVisitProductListAll().then(res => {
      if(res.data.code == 200){
        this.setState({
          qryVisitProductListAll: res.data.data,
          product: value
        })
      }else{

      }
    }).catch(()=>{})
  }

  componentWillMount() {
    this.initHeader();
	}
	
  componentDidMount() {
    this.getProductVisit()
    this.handleProduct()
  }
  

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { addVisible,openVisible,closeVisible, confirmLoading, ModalText,title } = this.state;
    const {list,loading,pageSize,total,pageSizeOptions,qryVisitProductListAll,product} = this.state;
    return (
      <div>
        <Card title={this.title}>
        <Row>
          <div className="searchOne">
            <Search
              placeholder="请输入商品名称"
              onChange={this.handleName}
              style={{ width: 200 }}
              allowClear
            />
          </div>
          <div className="search">
            <RangePicker allowClear renderExtraFooter={() => 'extra footer'} showTime onChange={this.changeTime}/>
          </div>
          <div className="search">
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button type="primary" onClick={this.showAddModal} style={{marginLeft: 10}}>新增</Button>
          </div>
          <Modal
            title={title}
            visible={openVisible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
            maskClosable={false}
          >
            <p>确定要开启该商品吗</p>
          </Modal>
          <Modal
            title={title}
            visible={closeVisible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
            maskClosable={false}
          >
             <p>确定要关闭该商品吗</p>
          </Modal>
          <Modal
            title={title}
            visible={addVisible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
            maskClosable={false}
          >
            <Form {...formItemLayout}>
              <Form.Item label="商品">
                {getFieldDecorator('product', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your E-mail!',
                    },
                  ],
                })(<Select style={{ width: 160 }} onChange={this.handleProduct}>
                <Option value="">请选择分类</Option>
                  {
                    qryVisitProductListAll.map((item,index)=>{
                      return (
                        <Option key={item.name} value={item.id}>{item.name}</Option>
                      )
                    })
                  }
                </Select>)}
              </Form.Item>
              <Form.Item label="预付款" hasFeedback>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                  ],
                })(<Input.Password />)}
              </Form.Item>
              <Form.Item label="访问次数" hasFeedback>
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(<Input.Password  />)}
              </Form.Item>
            </Form>
        </Modal>
        </Row>
          <Table
            rowKey='id'
            scroll={{ x: 1280, y: 1200 }}
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

export default Form.create()(ProductVisit);