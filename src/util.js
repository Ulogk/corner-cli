import fs from 'node:fs'
import ora from 'ora'
import { exec } from 'node:child_process'
import { promisify } from 'node:util';

const execPromise = promisify(exec)

/**
 * 检查指定路径是否存在
 * @param {*} path 
 * @returns boolean
 */
export const cheackPath = (path) => {
    if(fs.existsSync(path)){
        return true
    } else {
        return false
    }
}

/**
 * 下载模板
 * @param {string} branch 模板分支
 * @param {string} name 项目名称
 */
export const downloadTemp = async (branch, name) => {
    // 显示下载模板的进度提示
    let spinner = ora('正在下载模板...').start()
    // 模板仓库地址
    const repoUrl = 'https://gitee.com/zhao-zhide/moyu-cli.git'
    try{
        // 要执行的命令
        const command = `git clone -b ${branch} ${repoUrl} ${name}`
        // 执行命令
        await execPromise(command)
        // 下载模板成功后提示
        spinner.succeed('模板下载完成')
        // 下载模板成功后停止显示进度提示
        spinner.stop()
    } catch(err) {
        // 模板下载失败
        spinner.fail('模板下载失败')
        spinner.stop()
        console.error(err.message)
        // 如果出错，清理可能已创建的空目录
        if (fs.existsSync(name)) {
            // 删除已创建的空目录
            fs.rmSync(name, { recursive: true, force: true })
        }
    }
}
