/*
 * @Author: Anixuil
 * @Date: 2024-12-27 11:47:50
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-19 19:43:11
 * @Description: 请填写简介
 */
export * from './theme';
export * from './screen';

// 深拷贝
export const deepClone = (obj: any) => { 
    if (obj === null || typeof obj !== 'object') return obj;
    
    const clone = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            (clone as Record<string, any>)[key] = deepClone(obj[key]);
        }
    }
    
    return clone;
}
