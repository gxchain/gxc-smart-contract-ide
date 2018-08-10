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
        'compile': 'compile'
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
        'chooseEntryFile': 'Choose entry file',
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
            entryFile: 'Entry File',
            deployAccount: 'Deploy Account',
            costType: 'Cost Type',
            costAmount: 'Cost Amount',
            methodName: 'Method Name',
            params: 'Params',
            carryAmount: 'Carry Amount'
        },
        validate: {
            entryFile: {
                required: 'Please select entry file'
            },
            needToCompileFirst: 'Need to compile first',
            name: {
                required: 'Please enter contract name',
                format: 'Contract name consist of letter|number|-'
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
        addFile: 'Add File',
        title: {
            removeFile: 'Remove File',
            editFileName: 'Edit File Name'
        },
        validate: {
            required: 'Please enter file name',
            fileFormat: 'Incorrect file name format',
            repeatName: 'Repeated file name'
        },
        placeholder: {
            required: 'Please enter file name'
        },
        confirmRemoveFile: 'Confirm remove this file？',
        editFileName: 'Edit file name'
    },
    statusbar: {
        currentApiServer: 'Current api server',
        currentCompileServer: 'Current compile server'
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
    }
}

export default locale
