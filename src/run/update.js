import { exec } from 'child_process'
export function yarnUpdate() {
    exec('git pull & yarn upgrade mz-botjs', (error, stdout, stderr) => {
        logger.info(`[Mz-botjs]开始更新`);
        if (error) {
            logger.error(`[Mz-botjs]更新失败: ${error}`);
            return;
        }
        logger.info(`[Mz-botjs]更新成功`);

    });
}

export function npmUpdate() {
    exec('git pull & npm update mz-botjs', (error, stdout, stderr) => {
        logger.info(`[Mz-botjs]开始更新`);
        if (error) {
            logger.error(`[Mz-botjs]更新失败: ${error}`);
            return;
        }
        logger.info(`[Mz-botjs]更新成功`);
    }
    )
}