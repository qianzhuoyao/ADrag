#### 说明
> 1:ADrag 在load内配置，在render内渲染，hook则为触发事件
> 2:使用，在index.vue内实例化render，然后将其当成模板渲染出左侧的样板，然后调用event来给index的一个组件列表添加组件来实现拖拽可视化，在组件内（config的pulzz），你必须传入一个render的实例（instance），他负责同步数据以及操作，view（与instance同层）是不允许直接更改的，你必须通过instance的方法来更改view，Proxy来保证instance与view 是同步的。当然你非要依赖view来更新instance那是不行的，出发i你去使用instance提供的方法来更新其（这会导致至少两次的更新view）