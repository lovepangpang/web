import Layout from '@/layout'

// 拿到菜单数据处理
export function getTreeArr(arr) {
    let map = {}
    arr.forEach(item => {
        map[item.id] = item
    })
    console.log('map', map)
    // 结果数组
    let result = []
    arr.forEach(child => {
        // 找出每一个和指针对象相对应的子节点
        const mapItem = map[child.parentId]
        child.path = '/' + child.id
        if (mapItem) {
            child.name = child.funcUrl
            child.meta = {'title': child.funcName, icon: 'form' }
            child.component =  () => import('@/views/demo/index')
            if (mapItem.children) {
                let arr = mapItem.children.filter((item) => {
                    return item.level !== '1'
                })
                mapItem.children = arr;
            } else {
                mapItem.children = []
            }
            mapItem.children.push(child)
            // const childThe = Object.assign(child, {
            //     name: child.funcUrl,
            //     component:  () => import('@/views/demo/index'),
            //     meta: {'title': child.funcName, 'icon': 'form' }
            // })
            // (mapItem.children || (mapItem.children = [])).push(childThe)
        } else {
            // 处理好的数据或者没有子节点直接添加到结果数组
            child.component = Layout
            child.name = child.funcUrl
            child.meta = {'title': child.funcName, icon: 'form' }
            child.children = [
                {
                    level: '1',
                    path: 'index',
                    name: 'demo',
                    component: () => import('@/views/demo/index'),
                    meta: { title: child.funcName, icon: 'form' }
                }
            ]
            result.push(child)
        }
    })
    result.push(
        { path: '*', redirect: '/404', hidden: true }
    )
    return result
}