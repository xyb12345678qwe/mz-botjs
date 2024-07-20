import select, { Separator } from '@inquirer/select';
import input from '@inquirer/input';
import { File } from '../run/file.js'
import { spawn } from 'child_process'
import { logger } from '../core/index.js';
export class botConfigSet {
    bot = {
        LLOneBot: null,
        ntqq: null
    };
    async runSelect() {
        const answer = await select({
            message: '选择要配置的机器人平台',
            choices: [
                new Separator('--- 机器人平台 ---'),
                {
                    name: 'LLOneBot',
                    value: 'LLOneBot',
                    description: `介绍:添加LLOneBot平台`,
                },
                {
                    name: 'NTQQ',
                    value: 'ntqq',
                    description: `介绍:ntqq官方q群机器人`,
                },
            ],
        });
        switch (answer) {
            case 'LLOneBot':
                this.configureLLOneBot()
                break;
            case 'ntqq':
                await this.configureNTQQ();
                break;
            default:
                console.log('未知的机器人平台');
        }
    }
    async configureLLOneBot() {
        let config = File.readFile('config')
        const name = await this.promptsForInput('输入配置项名称(一个配置项可存储多个不同平台的信息，如果已有相同平台则覆盖)');
        config[name].LLOneBot = {}
        File.writeFile('config', config)
    }
    async configureNTQQ() {
        const appID = await this.promptsForInput('输入你的appId');
        const token = await this.promptsForInput('输入你的token');
        const secret = await this.promptsForInput('输入你的secret');
        const name = await this.promptsForInput('输入配置项名称(一个配置项可存储多个不同平台的信息，如果已有相同平台则覆盖)');
        this.bot.ntqq = { appID, token, secret };
        let config = File.readFile('config')
        config[name].ntqq = this.bot.ntqq
        File.writeFile('config', config)
        console.log('NTQQ配置完成');
    }
    async promptsForInput(message) {
        const answer = await input({ message });
        if (!answer) {
            console.error(`错误：${message} 不能为空`);
            return this.promptsForInput(message); // 递归请求直到获得有效输入
        }
        return answer;
    }
    async chooseBot() {
        const name = await this.promptsForInput('你要启动的配置项');
        const config = File.readFile('config')
        if (!config[name]) return console.info(`未找到对应配置项`)
        const keys = Object.keys(config[name])
        const choices = keys.map(key => ({
            name: key,
            value: key,
            description: key,
        }));

        return {
            name: name,
            answers: await select({
                type: 'checkbox', // 设置为多选模式
                message: '选择要启动的机器人',
                choices: [
                    new Separator('--- 机器人---'),
                    ...choices
                ],
                pageSize: choices.length + 1 // 可选，根据需要调整列表显示的大小
            })
        }
    }
    async run() {
        const { name, answers } = await this.chooseBot()
        const command = ['run', 'start'].concat(name).concat(answers);

        const child = spawn(
            'npm',
            command,
            {
                shell: true,
                stdio: [
                    'pipe', // 标准输入
                    'inherit', // 标准输出
                    'inherit'  // 标准错误
                ]
            }
        )
        process.on('SIGINT', () => {
            if (child.pid) process.kill(child.pid)
            if (process.pid) process.exit()
        })
    }
}
