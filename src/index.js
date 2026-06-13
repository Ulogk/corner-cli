#!/usr/bin/env node

import { program } from 'commander';
import fs from 'node:fs'
import inquirer from 'inquirer'
import { cheackPath, downloadTemp } from './util.js'
import { templateMap } from './templateMap.js'

// 获取package文件的内容
let packageJson = fs.readFileSync('./package.json')
// 转为对象
packageJson = JSON.parse(packageJson)

/**
 * 自定义命令：-V
 */
program.version(packageJson.version)

/**
 * 自定义命令：create/c <projectName>
 * alias：别称
 * description：描述
 * action：执行
 */
program.command('create <projectName>')
.alias('c')
.description('创建项目')
.action((projectName) => {
    // 获取用户输入
    inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: '请输入项目名称',
            default: projectName
        },
        {
            type: 'input',
            name: 'projectDescription',
            message: '请输入项目描述'
        },
        {
            type: 'select',
            name: 'projectType',
            message: '请选择项目类型',
            choices: ['vue', 'react']
        },
        {
            type: 'select',
            name: 'useJsorTs',
            message: '请选择项目使用的语言',
            choices: ['javaScript', 'typeScript']
        },
        {
            type:'confirm',
            name: 'isCreateProject',
            message: '是否创建项目'
        }
    ]).then(res => {
        // 判断是否确认创建项目
        if(!res.isCreateProject){
            console.log('取消创建项目')
            return
        }
        // 判断同名文件夹是否存在，如果存在就不能创建项目，反之可以
        if(cheackPath(res.projectName)){
            console.log('同名文件夹已存在')
            return
        }
        // 获取模板名称，通过项目类型和项目使用的语言在模板映射对象中获取
        const templateName = templateMap[res.projectType]?.[res.useJsorTs];
        // 下载模板
        if (templateName) {
            downloadTemp(templateName, res.projectName);
        }
    })
})
















program.parse(process.argv)