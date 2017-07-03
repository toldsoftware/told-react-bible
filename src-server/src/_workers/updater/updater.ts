import { readQueueMessages, writeQueueMessage, initQueue } from "../../utils/queues";
import { group } from "../../utils/objects";
import { logger } from "../../utils/logger";

export async function init() {
    initQueue(UPDATE_DATA_QUEUE);
}

export async function runUpdater() {
    await runUpdates(processUpdates);
}

async function runUpdates(update: () => Promise<{ updateCount: number, isDone: boolean }>) {
    const MAX_UPDATES = 60;
    let updateCount = 0;
    let r = await update();
    updateCount = r.updateCount;

    while (!r.isDone && updateCount < MAX_UPDATES) {
        r = await update();
        updateCount += r.updateCount;
    }
}

export async function testQueueMany() {
    await initQueue(UPDATE_DATA_QUEUE);

    for (let x = 0; x < 20; x++) {
        await queueUpdate({ kind: 'a', key: 'a' });
        await queueUpdate({ kind: 'b', key: 'b', staleMs: 15 * 1000 });
    }
}

// Update Data
const UPDATE_DATA_QUEUE = 'update-data';

export interface UpdateQueueMessage {
    kind: 'a' | 'b';
    key: string;
    staleMs?: number;
}

function getId_UpdateQueueMessage(m: UpdateQueueMessage) {
    return m.kind + m.key + m.staleMs;
}

export async function queueUpdate(message: UpdateQueueMessage) {
    await writeQueueMessage(UPDATE_DATA_QUEUE, message);
}

export async function processUpdates() {
    // logger.log('processUpdates START');

    const messages = await readQueueMessages<UpdateQueueMessage>(UPDATE_DATA_QUEUE);
    const hasMessages = !!(messages && messages.length);

    if (!hasMessages) {
        return { updateCount: 0, isDone: true };
    }

    let updateCount = 0;

    const groups = group(messages, m => getId_UpdateQueueMessage(m.data));

    // logger.log('processUpdates', { groups });
    for (let k in groups) {
        const g = groups[k];
        const messages = g.items;
        const r = await processUpdate(messages[0].data);
        updateCount += r.updateCount;

        for (let m of messages) {
            await m.delete();
        }
    }

    return { updateCount, isDone: !hasMessages };
}

async function processUpdate({ kind, key, staleMs }: UpdateQueueMessage): Promise<{ updateCount: number }> {
    logger.log('processUpdate', { kind, key, staleMs });

    // if (kind === 'a') {
    //     const r = await updateA_ifStale(key, staleMs || undefined);
    //     if (r) {
    //         return { updateCount: 1 };
    //     }
    // } else if (kind === 'b') {
    //     const r = await updateB_ifStale(key, staleMs || undefined);
    //     if (r) {
    //         return { updateCount: 1 };
    //     }
    // }

    return { updateCount: 0 };
}