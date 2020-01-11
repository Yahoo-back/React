import React,{Component} from 'react';
import { Breadcrumb,Card} from 'antd';

class TransferList extends Component{

    //初始化面包屑
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>划款管理</Breadcrumb.Item>
                <Breadcrumb.Item>划款列表</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    componentWillMount() {
        this.initHeader();
    }

    render() {
        return (
            <Card title={this.title}>

            </Card>
        )
    }
}

export default TransferList;