const last = (a) => {
    let current = []
    a.map(i => {
        i.map((f, k) => {
            const setList = current.map(p => JSON.stringify(p))
            const curPush = i.slice(0, k + 1)
            if (!setList.includes(JSON.stringify(curPush))) {
                current.push(curPush)
            }

        })
    })
    console.log(current)
    return current
}
last([[1, 3, 4, 5], [1, 2, 3, 4]]) // [[1],[1,2],[1,2,3],[1,2,3,4]]
