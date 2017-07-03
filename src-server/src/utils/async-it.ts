import { StorageError, ServiceResponse } from 'azure-storage';

export function asyncIt<T>(call: (serviceCallback: (error: StorageError, result: T) => void) => void): Promise<T> {
    // // DEBUG
    // const stackTraceCaller = (new Error()).stack;

    return new Promise<T>((resolve, reject) => {
        try {
            call((error, result) => {
                // // DEBUG
                // const stackTrace2 = stackTraceCaller;
                // console.log('asyncIt', stackTrace2);

                if (error) { reject(error); return; }
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    });
}
