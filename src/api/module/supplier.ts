import Http from '../http';

// export const login = function(loginForm: any) {
//     return Http.post('/user/login', loginForm)
// }

export const supplier = function(data: any) {
    return Http.post('/api/supplier', data)
}

export const createOrUpdate = function(data: any) {
    return Http.post('/api/supplier/create-or-update', data)
}

export const deleteById = function(id: string) {
    return Http.delete('/api/supplier/'+id,{})
}
