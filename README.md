### ADRAG

#### 介绍:

这是一个渐进的可视化拖拽库，通过绑定id来操作

#### 相关说明:

+ 0:注意实现
+ 1:api
+ 2:属性

##### 0:注意事项

+ 如果你是script调用，请务必在onload之后(包含),类如以下框架钩子内=>
+ VUE=>mounted
+ REACT=>useEffect
+ ANGULAR =>ngInit

##### 1:api

| 名称  | 说明          | 参数                                                                                                                  | 示例                                                                                                                                                                          |
|-----|-------------|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| constructor | ASheet构造函数  | prev:是否阻塞浏览器的拖拽默认事件。默认true,<br/>namespace:作用范围，htmlID。默认'app'                                                       | 目的：新建类<br/>示例：new ASheet()                                                                                                                                                  |
| trigger | 拖拽元绑定       | identifiers：被绑定的允许被操作的元DOM。无默认值。可以组成元池（即元dom的id的list）                                                               | 目的：将id为"drag"与"dragd"的dom绑定上<br/>示例：new ASheet().trigger(["drag", "dragd"])                                                                                                 |
| container | 推拽目标容器绑定, 容器dom 的position必须为 absolute;，否则会校准不对容器   | identifier:被绑定的允许被操作的容器DOM。无默认值                                                                                     | 目的:使元只允许在id为container的容器上操作<br/>示例： new ASheet().container("container")                                                                                                     |
| exportTarget | 获取所有元       | 无参数                                                                                                                 | 目的：获取所有元<br/>示例：new ASheet().getTargets()                                                                                                                                   |
| filterTargets | 获取指定元       | fn ：筛选条件                                                                                                            | 目的：获取isChildren是true的元<br/>示例：new ASheet().filterTargets(item=>item.isChildren)                                                                                             |
| dragStartOnUp | 鼠标放起事件      | filterFn 片筛选，函数 ，参数为片集合迭代项目，即再所有片集合中筛选指定的满足条件的片.默认拖拽中且是容器内<br/>upFn 鼠标抬起回调 参数为event当前触发事件对象, current: 当前操作片         | new ASheet().mouseUp((_)=>{console.log('抬起函数)},()=>{console.log("返回true任意触发函数")，return true})                                                                               |
| dragStartOnDown | 鼠标按下且后续进行移动时触发事件 ,注意，所有被包裹的组件的事件都会失效，如果需要，请用registryEvents函数去注册     | filterFn 片筛选，函数 ，参数为片集合迭代项目，即再所有片集合中筛选指定的满足条件的片<br/>downFn 鼠标按下回调 参数为event当前触发事件对象, current: 当前操作片                  | new ASheet().mouseDown((_)=>{console.log('返回true任意触发函数),return true},()=>{console.log("按下函数"})                                                                              |
| dragStartOnMove | 鼠标移动事件      | triggerFn 触发条件,默认为只会在drag期间触发<br/>moveFn 鼠标移动回调 参数为event当前触发事件对象, current: 当前操作片                                    | new ASheet().mouseMove((_)=>{console.log('移动函数)},()=>{console.log("返回true任意移动函数")，return true}                                                                              |
| startByDraging | 当前是否存在拖拽    | 无参数                                                                                                                 | new ASheet().startByDraging()                                                                                                                                               |
| instanceBindData | 元拖拽绑定数据     | instanceFilterFn 被绑定的元素筛选方法，此方法不会覆盖,如果要重新赋值请使用instanceRebindData<br/>show 被绑定的数据,它会被展示出来<br/>data 被绑定的数据,会被绑在data键上 | 目的：绑定拖拽途中元素slot与放置template与arron的数据<br/>示例 new ASheet().instanceBindData((i) => i.id === "drag",{ templateId: "dragSlot", slot: "dragImageId" },{ name: "arron", age: 24 }) |
| instanceBindData | 元拖拽绑重新定data | instanceFilterFn 被绑定的元素筛选方法<br/>  data 新数据                                                                          | new ASheet().instanceBindData((i) => i.id === "drag",{ name: "arron", age: 25 })                                            |
| delete | 删除container内的dom | identifier string 待删除的html的id | new ASheet().delete('drag')                                            |
| zIndexChange | 更改container内的dom的显示层级 | identifier string 待更改的html的id<br/>zIndex,新的zIndex默认10<br/> force:强制更新，不再去确认是否为child的copydom | new ASheet().zIndexChange('drag'，20)                                            |
| registryEvents | 注册模板上的原生事件 |目前支持支down事件 | new ASheet().registryEvents({ down: (event) => { console.log("按下了", event);} })                                            |
##### 2:属性（__开头的属性不公开）

| 属性  | 说明 |
|-----|--|
| DOM | 元dom |
| childs | 继承与元的tempalte的节点集合 |
| data | 绑定的数据 |
| height | current元素高，如果没current就是元dom的高 |
| width | current元素长，如果没current就是元dom的长 |
| current | 当前操作的dom，只有在操作时才有 |
| isChildren | 当前操作的dom是否包含在childs内,只有在操作时才有 |
| id | 元id |
| show | 绑定的show对象，包含slot与template |
| slotDOM | slot的dom |
| tempateDOM | template的dom|
| x | x,offsetLeft |
| y | y,offsetTop|

