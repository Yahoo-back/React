import * as contants from './actionTypes';
import { message} from 'antd';
import {initMenu} from '../api';


//获取首页数据
export const getMenuAction=(params)=>{
    return (dispatch)=>{
        initMenu(params).then((res)=>{
            let header = res.headers;
            if (res.data.code = 200) {
                const menu = res.data.data;
                function list(myId,pId,menu){
                      function exists(menu, parentMuenId){
                        for(var i=0; i<menu.length; i++){
                          if (menu[i][myId] == parentMuenId) return true;
                        }
                        return false;
                      }
                      var nodes = [];
                      for(var i=0; i<menu.length; i++){
                        var row = menu[i];
                        if (!exists(menu, row[pId])){
                          nodes.push(row);
                        }
                      }
                      var toDo = [];
                      for(var i=0; i<nodes.length; i++){
                        toDo.push(nodes[i]);
                      }
                      while(toDo.length){
                        var node = toDo.shift(); // the parent node
                        for(var i=0; i<menu.length; i++){
                          var row = menu[i];
                          if (row[pId] == node[myId]){
                            if (node.children){
                              node.children.push(row);
                            } else {
                              node.children = [row];
                            }
                            toDo.push(row);
                          }
                        }
                      }
											return nodes;
										}
										var menuTree = list("muenid","parentMuenId",menu);
										// console.log(menuTree)
										var m = JSON.stringify(menuTree)
										// console.log(m)
										let menuList = JSON.parse(m);
										// console.log(menuList)
                dispatch({
                    type:contants.INIT_MENU,
                    menuList
                })
            } else {
                message.error(decodeURIComponent(header.message));
            }
        })
    }
}

