import React,{PureComponent } from 'react';
import { Upload, Icon, message } from 'antd';
import oss from 'ali-oss';
import {uploadPassCode} from "../../api";


export default class Picture extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            imageUrl:this.props.imgUrl
        }
    }


    beforeUpload = (file) => {
        this.setState({loading:true})
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            let param = { type: 3 };
            uploadPassCode(param).then(data => {
                let ossConfig = data.data.data;
                if(data.data.code === 200) {
                    let client = new oss({
                        accessKeyId: ossConfig.accessDTO.accessKeyID,
                        accessKeySecret: ossConfig.accessDTO.accessKeySecret,
                        stsToken: ossConfig.accessDTO.secretToken, //
                        bucket: ossConfig.bucketName,//
                    })
                    let url = ossConfig.keyPreBulider + '/' + new Date().getTime() + '.' + file.type.split('/')[1]

                    client.put(url, new Blob([file], {
                        type: file.type
                    })).then(res => {
                        this.setState({
                            imageUrl: res.url ,
                            loading:false
                        });

                    }).catch(err => console.log(err));

                }
            }).catch(err => console.log(err));
        }
        return false; // 不调用默认的上传方法
    }

    getImageUrl = ()=>{
        return this.state.imageUrl;
    }
    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div>上传图片</div>
            </div>
        );
        const { imageUrl } = this.state;
        return (
            <Upload
                accept="image/*"
                name="imageUrl"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
            >
                {imageUrl ? <img src={imageUrl} alt="imageUrl" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        )
    }
}

//自组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，自组件就可以调用
//父组件调用自组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法


































