import Http from '../http';

// export const login = function(loginForm: any) {
//     return Http.post('/user/login', loginForm)
// }

export const material = function(data: any) {
    return Http.post('/api/material', data)
}

export const createOrUpdate = function(data: any) {
    return Http.post('/api/material/create-or-update', data)
}

export const deleteById = function(id: string) {
    return Http.delete('/api/material/'+id,{})
}
