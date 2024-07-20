import { APP } from './plugin.js'
export const LLOneBotEvent = [
    'MESSAGES',//消息
    'MESSAGES',//成员进退
]
export class APPevent {
    #MEMBERS = APP.get('#MEMBERS')
    #MEMBERS_FNC = new Map();

    load() {
        this.refresh()
        if (this.#MEMBERS) {
            Object.values(this.#MEMBERS).forEach(member => {
                member.rule.forEach(rule => {
                    if (rule.fnc) {
                        this.#MEMBERS_FNC.set(this.#MEMBERS_FNC.size + 1, member[rule.fnc]);
                    }
                });
            });
        }
    }
    refresh() {
        this.#MEMBERS = APP.get('MEMBERS')
    }
    async MEMBERS(e) {
        if (this.#MEMBERS_FNC.size === 0) return;
        for (const [id, command] of this.#MEMBERS_FNC.entries()) {
            if (command) {
                await command(e);
            }
        }
    }

}
export const APPEvent = new APPevent();