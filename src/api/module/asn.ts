import Http from '../http';

export const asn = function(data: any) {
    return Http.post('/api/asn', data)
}

export const createOrUpdate = function(data: any) {
    return Http.post('/api/asn/create-or-update', data)
}

export const deleteById = function(id: string) {
    return Http.delete('/api/asn/'+id,{})
}

export const getAsnInfo = function(id: string) {
    return Http.get('/api/asn/info/'+id,{})
}

export const getItems = function(asn_number: string) {
    return Http.get('/api/asn/items/'+asn_number,{})
}

export const inbound = function(data: any) {
    return Http.post('/api/asn/inbound', data)
}
