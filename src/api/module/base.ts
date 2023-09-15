import Http from '../http';

export const setting = function(data: any) {
    return Http.post('/api/setting',data)
}

export const createOrUpdate = function(type: string,data: any) {
    return Http.post('/api/setting/'+type+'/create-or-update',data)
}
