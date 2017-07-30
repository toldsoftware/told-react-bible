import * as XP from 'reactxp';
import { StorageType } from './storageType';

class StorageClass implements StorageType {

    constructor() {
        console.log('Using StorageClass (native)');
    }

    getItem(key: string): Promise<string> {
        return XP.Storage.getItem(key) as Promise<string>;
    }
    getItem_noMemCache(key: string): Promise<string> {
        return XP.Storage.getItem(key) as Promise<string>;
    }
    setItem(key: string, value: string): Promise<void> {
        return XP.Storage.setItem(key, value) as Promise<void>;
    }
    setItem_noMemCache(key: string, value: string): Promise<void> {
        return XP.Storage.setItem(key, value) as Promise<void>;
    }
    hasItem = async (key: string): Promise<boolean> => {
        return (await XP.Storage.getItem(key)) != null;
    }

}

export const Storage = new StorageClass() as StorageType;
