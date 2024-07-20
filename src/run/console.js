import readline from 'readline';
import { File } from './file.js';
const masterReg = /^(\/|#)?设置主人([a-zA-Z0-9_\-]+)$/;

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
if (global.isrl == true) {
    rl.on('line', (input) => {
        logger.info(`[标准输入]:${input}`)
        const match = input.match(masterReg);
        if (match && match.length > 1) {
            logger.info(`[标准输出]:处理设置主人${match[2]}`)
            const qq = match[2]
            let masters = File.readFile('master')
            masters.masters.push(qq)
            File.writeFile('master', masters)
        }
        if (input.trim() === 'exit') {
            rl.close();
        }
    })
}
