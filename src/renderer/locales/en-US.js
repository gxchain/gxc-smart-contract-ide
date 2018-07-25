const locale = {
    common: {
        validate: {
            pwd: {
                required: 'Please enter password',
                format: 'The password length cannot be less than 6 bits'
            }
        },
        placeholder: {
            pwd: 'Please enter password'
        },
        label: {
            pwd: 'Password'
        }
    },
    index: {
        'compile': 'compile'
    },
    connect: {
        'success': 'Entry point connect success',
        'closed': 'Entry point connect closed',
        'error': 'Entry point connect error,now is trying to reconnect',
        'reconnectFail': 'Reconnect failed,please trying switch to another entry point'
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
        'title': 'Contract List',
        'chooseEntryFile': 'Choose entry file',
        'inputContractName': 'Enter contract name',
        'deploy': 'deploy'
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
            compileServer: 'Compile Server'
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
        account: 'Account',
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
    }
}

export default locale
