import Http from '../http';

// export const login = function(loginForm: any) {
//     return Http.post('/user/login', loginForm)
// }

export const login = function(loginForm: any) {
    return Http.post('/api/login', loginForm)
}

export const menu = function() {
    return Http.get('/user/menu') 
}

export const permission = function() {
    return Http.get('/user/permission') 
}

export const user = function(data: any) {
    return Http.post('/api/user', data)
}

export const createOrUpdate = function(data: any) {
    return Http.post('/api/user/create-or-update', data)
}

export const deleteById = function(id: string) {
    return Http.delete('/api/user/'+id,{})
}