// 引入mock
const Mock = require('mockjs')
import * as user from './user/user.js'
// 设置延迟时间
Mock.setup({
    timeout: 1000
})

Mock.mock('http://www.mock.com/api/login', 'post', (req, res) => {
    // const reqBody = JSON.parse(req.body)
    return user.tokens['admin']
})

Mock.mock('http://www.mock.com/api/getUserInfo', 'post', (req, res) => {
    console.log(req)
    const reqBody = req.body
    return user.users[reqBody]
})
