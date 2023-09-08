import Http from '../http';

export const order = function(data: any) {
    return Http.post('/api/order', data)
}

export const createOrUpdate = function(data: any) {
    return Http.post('/api/order/create-or-update', data)
}

export const deleteById = function(id: string) {
    return Http.delete('/api/order/'+id,{})
}

export const getOrderInfo = function(id: string) {
    return Http.get('/api/order/info/'+id,{})
}
