## 说明
- 事件 event
- - 操作事件 
- 数据模型 model
- 控制 controller 
- - 依赖模型进行数据转换 translation
- - - 处理配置文件 config
- - - 处理请求数据 request
- - - 生成可被渲染器识别的数据结构 compare
- 渲染 render
- - 渲染数据
- - 生成容器结构 provider
- - 生成内部颗粒组件 fragment 
- 视图 view
- - provider
- - fragment
```javascript
<fragment :tag='1'>
    </fragment>
<provider :tags='[1]'>
</provider>
```
