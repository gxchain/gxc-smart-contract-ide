const locale = {
    common: {
        copy: 'Copy',
        title: {
            guideToImport: 'Go to import account'
        },
        content: {
            guideToImport: `You haven't import account,go to import one?`
        },
        validate: {
            pwd: {
                required: 'Please enter password',
                format: 'The password length cannot be less than 6 bits'
            }
        },
        placeholder: {
            pwd: 'Please enter password',
            assetType: 'Please select asset type',
            assetAmount: 'Please enter asset amount'
        },
        label: {
            pwd: 'Password'
        },
        messages: {
            copySuc: 'Copy Success'
        },
        error: {
            account: {
                notFound: 'Account not found'
            }
        }
    },
    index: {
        'compile': 'Compile'
    },
    connect: {
        'success': 'Entry point connect success',
        'closed': 'Entry point connect closed',
        'error': 'Entry point connect error'
    },
    apiServer: {
        messages: {
            'exist': 'Entry point has already exist',
            'addSuc': 'Add entry point success',
            'removeSuc': 'Remove entry point success'
        },
        placeholder: {
            addEntryPoint: 'Please enter entry point url',
            removeEntryPoint: 'Please choose entry point to remove'
        },
        addEntryPoint: 'Add entry point',
        removeEntryPoint: 'Remove entry point'
    },
    compileServer: {
        messages: {
            'exist': 'Compile server has already exist',
            'addSuc': 'Add compile server success',
            'removeSuc': 'Remove compile server success'
        },
        placeholder: {
            addCompileServer: 'Please enter compile server url',
            removeCompileServer: 'Please choose compile server to remove'
        },
        addCompileServer: 'Add compile server',
        removeCompileServer: 'Remove compile server'
    },
    header: {
        setting: 'setting',
        account: 'account'
    },
    contract: {
        'listTitle': 'Contract List',
        'chooseProject': 'Choose project',
        'inputContractName': 'Enter contract name',
        'deploy': 'Deploy',
        call: 'Call',
        carryAmount: 'Carry Amount',
        title: {
            removeContract: 'Remove Contract',
            callConfirm: 'Call Confirm'
        },
        content: {
            removeContract: 'Confirm remove the contract?'
        },
        error: {
            fromAccountNotExist: 'Account not exist',
            contractAccountNotExist: 'Contract not exist',
            paramCompute: 'Param compute error',
            feeCompute: 'Fee compute error'
        },
        label: {
            name: 'Contract Name',
            entryProject: 'Project',
            deployAccount: 'Deploy Account',
            callAccount: 'Call Account',
            costType: 'Cost Type',
            costAmount: 'Cost Amount',
            methodName: 'Method Name',
            params: 'Params',
            carryAmount: 'Carry Amount'
        },
        validate: {
            entryProject: {
                required: 'Please select project'
            },
            needToCompileFirst: 'Need to compile first',
            name: {
                required: 'Please enter contract name',
                format: 'Contract name format error: /^[\\w]+[\\w.-]*[\\w]$/'
            }
        },
        messages: {
            deploySuc: 'Contract deploy success',
            deployFail: 'Contract deploy failed',
            compileSuc: 'Contract compile success',
            compileFail: 'Contract compile failed',
            callSuc: 'Contract call success',
            callFail: 'Contract call failed'
        }
    },
    files: {
        addProject: 'Add Project',
        addFile: 'Add File',
        title: {
            removeFile: 'Remove File',
            editFileName: 'Edit File Name',
            editDirectoryName: 'Edit Directory Name',
            removeDirectory: 'Remove Directory'
        },
        validate: {
            required: 'Please enter file name',
            fileFormat: 'Incorrect file name format: /^[\\w]+[\\w.-]*\\.cpp|hpp|json$/',
            repeatName: 'Repeated file name',
            directory: {
                required: 'Please enter directory name',
                format: 'Incorrect directory name format: /^[\\w]+[\\w.-]*$/'
            }
        },
        placeholder: {
            required: 'Please enter file name',
            directory: {
                required: 'Please enter directory name'
            }
        },
        confirmRemoveFile: 'Confirm remove this file？',
        editFileName: 'Edit file name',
        confirmRemoveDirectory: 'Confirm remove this directory？'
    },
    statusbar: {
        currentApiServer: 'Api Server',
        currentCompileServer: 'Compile Server',
        document: 'document',
        feedback: 'feedback'
    },
    importSetting: {
        title: {
            importRecover: 'Import',
            entryPoint: 'Entry Point',
            compileServer: 'Compile Server',
            removeAccount: 'Remove Account'
        },
        content: {
            removeAccount: 'Confirm removing the account?'
        },
        placeholder: {
            wifKey: 'Please enter wifKey',
            pwd: 'Please enter password',
            pwdCheck: 'Please confirm password'
        },
        label: {
            importType: 'Import Type',
            wifKey: 'WifKey',
            pwd: 'Password',
            pwdCheck: 'Password Check',
            importWifKey: 'Import WifKey'
        },
        validate: {
            importType: {
                required: 'Please choose import type'
            },
            wifKey: {
                required: 'Please enter wifKey',
                format: 'WifKey is incorrect'
            },
            pwd: {
                required: 'Please enter password',
                format: 'The password length cannot be less than 6 bits'
            },
            pwdCheck: {
                required: 'Please confirm password',
                format: 'The password length cannot be less than 6 bits',
                doNotMatch: 'The two passwords do not match'
            }
        },
        messages: {
            importSuc: 'Import Success'
        },
        error: {
            accountNotFound: 'Account Not Found',
            exist: 'Account has already exist'
        },
        account: 'Account',
        accountId: 'Account ID',
        action: 'Operation',
        remove: 'Remove',
        'importTitle': 'Import'
    },
    unlock: {
        title: 'Unlock',
        messages: {
            accountNotFound: 'Account not found',
            invalidPassword: 'Invalid password'
        },
        label: {
            assetType: 'Cost Type',
            balance: 'Balance'
        },
        placeholder: {
            assetType: 'Please select cost type'
        },
        validate: {
            assetType: {
                required: 'Please select cost type'
            }
        }
    },
    log: {
        clear: 'Clear log'
    },
    template: {
        title: {
            select: 'Select Template',
            create: 'Create Template'
        },
        placeholder: {
            required: 'Please enter project name'
        },
        validate: {
            required: 'Please enter project name',
            format: 'Incorrect project name format: /^[\\w]+[\\w.-]*$/'
        },
        meta: {
            bank: {
                description: 'bank contract offer deposit and withdraw method, you can deposit asset into the contract, or with draw your asset'
            },
            hello: {
                description: 'hello contract is a simple demonstration, just offer a hi method which will print a log, but it\'s not visible on frontend'
            },
            empty: {
                description: 'empty project'
            },
            redpacket: {
                description: 'a red packet contract, offer issue, open and close redpacket method'
            }
        }
    }
}

export default locale
