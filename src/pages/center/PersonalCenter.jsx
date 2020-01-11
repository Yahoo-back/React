import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import { Breadcrumb ,Card,Button} from 'antd';
import {connect} from "react-redux";

class PersonalCenter extends Component{
    initHeader = ()=> {
        this.title = (
            <Breadcrumb>
                <Breadcrumb.Item>个人中心</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    componentWillMount() {
        this.initHeader();
    }

    render() {
        const {name,username} = this.props.userData;
        return (
            <Card title={this.title}>
                <div className="centerDiv">
                    <p>用户名:</p>
                    {name}
                </div>
                <div className="centerDiv">
                    <p>登录名:</p>
                    {username}
                </div>
                <div className="centerDiv">
                    <p>登录密码:</p>
                    {'******'}
                    <Button style={{marginLeft:"40px"}}>
                        <Link to='/personalCenter/password'>修改密码</Link>
                    </Button>
                </div>
            </Card>
        )
    }
}
const mapState = (state)=>{
    return {
        userData:state.userData.userData
    }
}
export default connect(mapState,null)(PersonalCenter);