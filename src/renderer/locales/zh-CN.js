const locale = {
    common: {
        copy: '复制',
        title: {
            guideToImport: '前往导入账户'
        },
        content: {
            guideToImport: '您还未导入账户，是否前往导入账户？'
        },
        validate: {
            pwd: {
                required: '请填写密码',
                format: '密码格式有误(不能少于6位)'
            }
        },
        placeholder: {
            pwd: '请填写密码',
            assetType: '请选择资产类型',
            assetAmount: '请填写资产数额'
        },
        label: {
            pwd: '密码'
        },
        messages: {
            copySuc: '复制成功'
        },
        error: {
            account: {
                notFound: '账户不存在'
            }
        }
    },
    index: {
        'compile': '编译'
    },
    connect: {
        'success': '接入点连接成功',
        'closed': '接入点连接关闭',
        'error': '接入点连接出错'
    },
    apiServer: {
        messages: {
            'exist': '该接入点已存在',
            'addSuc': '添加成功',
            'removeSuc': '移除成功'
        },
        placeholder: {
            addEntryPoint: '请填写接入点url',
            removeEntryPoint: '请选择要移除的接入点'
        },
        addEntryPoint: '添加接入点',
        removeEntryPoint: '移除接入点'
    },
    compileServer: {
        messages: {
            'exist': '该编译服务器已存在',
            'addSuc': '添加成功',
            'removeSuc': '移除成功'
        },
        placeholder: {
            addCompileServer: '请填写编译服务器url',
            removeCompileServer: '请选择要移除的编译服务器'
        },
        addCompileServer: '添加编译服务器',
        removeCompileServer: '移除编译服务器'
    },
    header: {
        setting: '设置',
        account: '账户'
    },
    contract: {
        'listTitle': '合约列表',
        'chooseProject': '请选择工程',
        'inputContractName': '请输入合约名称',
        'deploy': '部署',
        call: '调用',
        carryAmount: '附带资产',
        title: {
            removeContract: '移除合约',
            callConfirm: '调用确认',
            importContract: '导入合约'
        },
        placeholder: {
            name: {
                required: '请输入合约名称',
                format: '合约名称格式错误: /^[A-Za-z0-9]+[\\w.-]*[\\w]$/'
            }
        },
        content: {
            removeContract: '确认移除该合约?'
        },
        error: {
            fromAccountNotExist: '账户不存在',
            contractAccountNotExist: '合约不存在',
            paramCompute: '参数计算错误',
            feeCompute: '费用计算错误'
        },
        label: {
            name: '合约名称',
            entryProject: '工程',
            deployAccount: '部署账户',
            callAccount: '调用账户',
            costType: '消耗资产类型',
            costAmount: '消耗数额',
            methodName: '调用方法',
            params: '调用参数',
            carryAmount: '附带资产'
        },
        validate: {
            entryProject: {
                required: '请选择工程'
            },
            needToCompileFirst: '请先编译',
            name: {
                required: '请输入合约名称',
                format: '合约名格式错误: /^[\\w]+[\\w.-]*[\\w]$/'
            }
        },
        messages: {
            deploySuc: '合约部署成功',
            deployFail: '合约部署失败',
            compileSuc: '合约编译成功',
            compileFail: '合约编译失败',
            callSuc: '合约调用成功',
            callFail: '合约调用失败'
        }
    },
    files: {
        addProject: '添加工程',
        addFile: '添加文件',
        title: {
            removeFile: '删除文件',
            editFileName: '编辑文件名称',
            editDirectoryName: '编辑文件夹名称',
            removeDirectory: '删除文件夹'
        },
        validate: {
            required: '请输入文件名',
            fileFormat: '文件名格式错误: /^[\\w]+[\\w.-]*\\.cpp|hpp|json$/',
            repeatName: '文件名重复',
            directory: {
                required: '请输入文件夹名称',
                format: '文件夹名称格式错误: /^[\\w]+[\\w.-]*$/'
            }
        },
        placeholder: {
            required: '请输入文件名',
            directory: {
                required: '请输入文件夹名称'
            }
        },
        confirmRemoveFile: '确认删除该文件？',
        editFileName: '编辑文件名称',
        confirmRemoveDirectory: '确认删除该文件夹'
    },
    statusbar: {
        currentApiServer: '接入点',
        currentCompileServer: '编译服务',
        document: '文档',
        feedback: '反馈'
    },
    importSetting: {
        title: {
            importRecover: '导入',
            entryPoint: '接入点',
            compileServer: '编译服务器',
            removeAccount: '移除账户'
        },
        content: {
            removeAccount: '确认移除账户？'
        },
        placeholder: {
            wifKey: '请填写私钥',
            pwd: '请填写密码',
            pwdCheck: '请确认密码'
        },
        label: {
            importType: '导入方式',
            wifKey: '私钥',
            pwd: '密码',
            pwdCheck: '确认密码',
            importWifKey: '导入私钥'
        },
        validate: {
            importType: {
                required: '请选择导入方式'
            },
            wifKey: {
                required: '请填写私钥',
                format: '私钥格式有误'
            },
            pwd: {
                required: '请填写密码',
                format: '密码格式有误(不能少于6位)'
            },
            pwdCheck: {
                required: '请确认密码',
                format: '密码格式有误(不能少于6位)',
                doNotMatch: '与密码不一致'
            }
        },
        messages: {
            importSuc: '导入成功'
        },
        error: {
            accountNotFound: '账户不存在',
            exist: '账户已存在'
        },
        account: '账户',
        accountId: '账户ID',
        action: '操作',
        remove: '移除',
        importTitle: '导入'
    },
    unlock: {
        title: '解锁',
        messages: {
            accountNotFound: '账户不存在',
            invalidPassword: '密码错误'
        },
        label: {
            assetType: '消费类型',
            balance: '余额'
        },
        placeholder: {
            assetType: '请选择消费类型'
        },
        validate: {
            assetType: {
                required: '请选择消费类型'
            }
        }
    },
    log: {
        clear: '清除日志'
    },
    template: {
        title: {
            select: '选择模板',
            create: '创建工程'
        },
        placeholder: {
            required: '请输入工程名称'
        },
        validate: {
            required: '请输入工程名称',
            format: '工程名称格式错误: /^[\\w]+[\\w.-]*$/'
        }
    },
    tool: {
        use: '使用',
        title: {
            tool: '工具'
        }
    }
}

export default locale
