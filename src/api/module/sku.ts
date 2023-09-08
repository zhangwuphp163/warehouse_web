import Http from '../http';

export const sku = function(data: any) {
    return Http.post('/api/sku', data)
}

export const skuCreateOrUpdate = function(data: any) {
    return Http.post('/api/sku/createOrUpdate', data)
}

export const editById = function(id: string) {
    return Http.get('/api/sku/'+id,{})
}

export const getSkuInfo = function(id: string) {
    return Http.get('/api/sku/info/'+id,{})
}

export const deleteById = function(id: string) {
    return Http.delete('/api/sku/'+id,{})
}
