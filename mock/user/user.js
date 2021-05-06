export const users = {
    'admin-token': {
        code: 200,
        message: '请求成功',
        result: {
            roles: ['admin'],
            introduction: 'I am a super administrator',
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            name: 'Super Admin'
        }
    },
    'editor-token': {
        code: 200,
        message: '请求成功',
        result: {
            roles: ['editor'],
            introduction: 'I am an editor',
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            name: 'Normal Editor'
        }
    }
}
export const tokens = {
    admin: {
        code: 200,
        message: '请求成功',
        result: {
            token: 'admin-token'
        }
    },
    editor: {
        code: 200,
        message: '请求成功',
        result: {
            token: 'editor-token'
        }
    }
}
