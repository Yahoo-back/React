import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Breadcrumb, Card, Button, Table, message, Modal} from 'antd';
import {bannerList, bannerDelete} from "../../api";
import memoryUtils from '../../assets/js/memoryUtils';
class BannerList extends Component{

    state={
        dataSource:[],
        pageSize:10,
        total:0,
        loading:false,
        visible:0,
        photoUrl:''
    };


    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>banner设置</Breadcrumb.Item>
                <Breadcrumb.Item>banner列表</Breadcrumb.Item>
            </Breadcrumb>
        );
        this.extra = (
            <Link to='/bannerList/addUpdate' >
                <Button type="primary" icon="plus" >新增</Button>
            </Link>
        );
        this.columns = this.roleType===1?[
            {
                title: 'Banner名称',
                dataIndex: 'name'
            },
            {
                title: '到期时间',
                dataIndex: 'endTime',
                align: 'center',
                render: (text,data) => {
                    if(data.status===1 && !data.endTime){
                        return (
                            <span>长期有效</span>
                        )
                    }else if(data.status===1 && data.endTime){
                        return (
                            <span>{data.endTime}</span>
                        )
                    }else if(data.status===2){
                        return (
                            <span>已失效</span>
                        )
                    }
                }
            },
            {
                title: '显示位置',
                dataIndex: 'showType',
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>{data.showType===1?'平台':'平台+商家'}</span>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:150,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button onClick={()=>this.LookItem(data)} icon="picture" />
                            <Button
                                onClick={()=>this.detailItem(data)}
                                type="primary"
                                icon="edit"
                                style={{marginLeft:'5px'}}
                            />
                            <Button
                                onClick={()=>this.deleteItem(data.bannerId)}
                                type="danger"
                                icon="delete"
                                style={{marginLeft:'5px'}}
                            />
                        </span>
                    )
                }
            },
        ]:[
            {
                title: 'Banner名称',
                dataIndex: 'name'
            },
            {
                title: '到期时间',
                dataIndex: 'endTime',
                align: 'center',
                render: (text,data) => {
                    if(data.status===1 && !data.endTime){
                        return (
                            <span>长期有效</span>
                        )
                    }else if(data.status===1 && data.endTime){
                        return (
                            <span>{data.endTime}</span>
                        )
                    }else if(data.status===2){
                        return (
                            <span>已失效</span>
                        )
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                width:150,
                align: 'center',
                render: (text,data) => {
                    return (
                        <span>
                            <Button onClick={()=>this.LookItem(data)} icon="picture" />
                            <Button
                                onClick={()=>this.detailItem(data)}
                                type="primary"
                                icon="edit"
                                style={{marginLeft:'5px'}}
                            />
                            <Button
                                onClick={()=>this.deleteItem(data.bannerId)}
                                type="danger"
                                icon="delete"
                                style={{marginLeft:'5px'}}
                            />
                        </span>
                    )
                }
            },
        ];
    };

    detailItem = (data)=>{
        memoryUtils.bannerData = data;
        this.props.history.push('/bannerList/addUpdate')
    }

    //删除操作
    deleteItem = (bannerId)=>{
        Modal.confirm({
            title: '确定要删除?',
            okText: '确定',
            okType: 'danger',
            cancelText: '想一想',
            onOk:()=> {
                bannerDelete({bannerId}).then(res => {
                    message.success("删除成功！");
                    this.getBannerList(1);
                }).catch(()=>{})
            }
        })
    };

    LookItem = data=>{
        this.setState({
            photoUrl:data.photoUrl,
            visible:1
        })
    };
    handleCancel = ()=>{
        this.setState({
            visible:0
        })
    };

    getBannerList = (pageNo)=>{
        this.setState({loading:true})
        let {pageSize} = this.state;
        let param = {
            pageNo,
            pageSize: pageSize,
            roleType:sessionStorage.getItem('type')
        }
        bannerList(param).then(res => {
            const {list,total} = res.data.restaurantBannerPageInfo;
            this.setState({
                dataSource:list,
                total,
                loading:false
            })
        }).catch(()=>{})
    }



    componentWillMount() {
        this.roleType = Number(sessionStorage.getItem('type'));
        this.initHeader();
    }

    componentDidMount() {
        this.getBannerList(1)
    }


    render() {
        const {dataSource,loading,pageSize,total,visible,photoUrl} = this.state;
        return (
            <Card title={this.title} extra={this.extra} >
                <Table
                    rowKey='bannerId'
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={{
                        total,
                        hideOnSinglePage:true,
                        defaultPageSize:pageSize,
                        onChange:this.getBannerList
                    }}
                    loading={loading}
                />

                <Modal
                    title="图片详情"
                    maskClosable={false}
                    visible={visible===1}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    <img style={{width: "473px"}} src={photoUrl} alt='' />
                </Modal>

            </Card>
        )
    }
}


export default BannerList;