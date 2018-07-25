const locale = {
    common: {
        validate: {
            pwd: {
                required: '请填写密码',
                format: '密码格式有误(不能少于6位)'
            }
        },
        placeholder: {
            pwd: '请填写密码'
        },
        label: {
            pwd: '密码'
        }
    },
    index: {
        'compile': '编译'
    },
    connect: {
        'success': '接入点连接成功',
        'closed': '接入点连接关闭',
        'error': '接入点连接出错，正在尝试重连',
        'reconnectFail': '重连失败，请尝试更换其他接入点'
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
        'title': '合约列表',
        'chooseEntryFile': '请选择入口文件',
        'inputContractName': '请输入合约名称',
        'deploy': '部署'
    },
    files: {
        addFile: '添加文件',
        title: {
            removeFile: '删除文件',
            editFileName: '编辑文件名称'
        },
        validate: {
            required: '请输入文件名',
            fileFormat: '文件名格式错误',
            repeatName: '文件名重复'
        },
        placeholder: {
            required: '请输入文件名'
        },
        confirmRemoveFile: '确认删除该文件？',
        editFileName: '编辑文件名称'
    },
    statusbar: {
        currentApiServer: '当前接入点',
        currentCompileServer: '当前编译服务'
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
    }
}

export default locale
