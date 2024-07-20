export interface ControllerLLOneBot {
    ws: WebSocket | null;

    reply(group_id: number | string, msg: string): void;

    replyPrivate(user_id: number | string, msg: string): void;
    getFriendList(): Promise<any>;
    getGroupList(): Promise<any>;
}

export declare class controllerLLOneBot implements ControllerLLOneBot {
    ws: WebSocket | null;

    constructor();

    reply(group_id: number | string, msg: string): void;

    replyPrivate(user_id: number | string, msg: string): void;
    getFriendList(): Promise<any>;
    getGroupList(): Promise<any>;
}

export const ControllerLLOneBot: controllerLLOneBot;
