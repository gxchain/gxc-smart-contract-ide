const locale = {
    index: {
        'compile': 'compile'
    },
    connect: {
        'success': 'entry point connect success',
        'closed': 'entry point connect closed',
        'error': 'entry point connect error,now is trying to reconnect',
        'reconnectFail': 'reconnect failed,please trying switch to another entry point'
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
        'chooseEntryFile': 'choose entry file',
        'inputContractName': 'input contract name',
        'deploy': 'deploy'
    },
    files: {
        addFile: 'add file',
        title: {
            removeFile: 'Remove File',
            editFileName: 'Edit File Name'
        },
        validate: {
            required: 'please enter file name',
            fileFormat: 'incorrect file name format',
            repeatName: 'repeated file name'
        },
        placeholder: {
            required: 'please enter file name'
        },
        confirmRemoveFile: 'confirm remove this file？',
        editFileName: 'edit file name'
    },
    statusbar: {
        currentApiServer: 'current api server',
        currentCompileServer: 'current compile server'
    },
    importSetting: {
        title: {
            importRecover: 'Import',
            entryPoint: 'Entry Point',
            compileServer: 'Compile Server'
        },
        placeholder: {
            wifKey: 'please enter wifKey',
            pwd: 'please enter password',
            pwdCheck: 'please confirm password'
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
    }
}

export default locale
