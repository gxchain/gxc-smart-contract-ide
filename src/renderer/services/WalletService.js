import {Aes, key, PrivateKey, TransactionBuilder} from 'gxbjs/lib/index.js'
import {Apis} from 'gxbjs-ws'
import Promise from 'bluebird'
import uniq from 'lodash/uniq'
import some from 'lodash/some'
import store from '@/store'
import find from 'lodash/find'
// import Vue from 'vue'
/**
 * get account information by name
 * @param account_name
 */
const fetch_account = (account_name) => {
    return Apis.instance().db_api().exec('get_account_by_name', [account_name])
}

/**
 * import account into wallet by passing wif key and password
 * @param wifKey
 * @param password
 * @returns {bluebird}
 */
const import_account = (wifKey, password) => {
    return new Promise((resolve, reject) => {
        let password_aes = Aes.fromSeed(password)
        let encryption_buffer = key.get_random_key().toBuffer()
        let encryption_key = password_aes.encryptToHex(encryption_buffer)
        let local_aes_private = Aes.fromSeed(encryption_buffer)
        let encrypted_wifkey = local_aes_private.encryptToHex(wifKey)
        let password_private = PrivateKey.fromSeed(password)
        let password_pubkey = password_private.toPublicKey().toPublicKeyString() // used to validate password

        let imported = []
        let exist = []

        let private_key = PrivateKey.fromWif(wifKey)
        let public_key = private_key.toPublicKey().toPublicKeyString()
        resolve(Apis.instance().db_api().exec('get_key_references', [[public_key]]).then((resp) => {
            if (resp.length > 0) {
                return uniq(resp[0])
            } else {
                // throw new Error(i18n.t('wallet_import.error.account_not_found'))
                throw new Error('wallet_import.error.account_not_found')
            }
        }).then((account_ids) => {
            return Apis.instance().db_api().exec('get_objects', [account_ids]).then((accounts) => {
                if (accounts.length > 0) {
                    let wallets = store.state.wallets
                    accounts.forEach((account) => {
                        let weight_threshold = account.active.weight_threshold
                        // available key should have enough weight
                        let isKeyAvailable = some(account.active.key_auths, function (key) {
                            if (key[0] == public_key && key[1] >= weight_threshold) {
                                return true
                            }
                            return false
                        })
                        if (isKeyAvailable) {
                            // do not import a duplicate account
                            let alreadyExist = some(wallets, function (wallet) {
                                return wallet.account == account.name
                            })
                            if (!alreadyExist) {
                                // 修改store状态
                                let wallet = {
                                    id: account.id,
                                    account: account.name,
                                    password_pubkey,
                                    encryption_key,
                                    encrypted_wifkey,
                                    backup_date: null
                                }
                                imported.push(wallet)
                                store.dispatch('appendWallet', wallet)
                            } else {
                                exist.push({
                                    account: account.name
                                })
                            }
                        }
                    })

                    // 成功
                    if (imported.length > 0) {
                        return {
                            imported,
                            exist
                        }
                    } else {
                        if (exist.length > 0) {
                            throw new Error('exist')
                        } else {
                            throw new Error('no_reference_account')
                        }
                    }
                } else {
                    // throw new Error(i18n.t('wallet_import.error.account_not_found'))
                    throw new Error('wallet_import.error.account_not_found')
                }
            })
        }))
    })
}

/**
 * send GXS to another account
 * @param from
 * @param to
 * @param amount
 * @param memo
 * @param password
 * @returns {*}
 */
const deploy_contract = ({from = '', contractName = '', code = '', abi = '', fee_id = '', password = '', broadcast = true}) => {
    let vm_type = '0'
    let vm_version = '0'

    return new Promise((resolve, reject) => {
        resolve(Promise.all([fetch_account(from), unlock_wallet(from, password)]).then(results => {
            let fromAcc = results[0]
            if (!fromAcc) {
                // throw new Error(i18n.t('transfer.error.account.from_account_not_exist'))
            }

            let tr = new TransactionBuilder()

            tr.add_operation(tr.get_type_operation('create_contract', {
                'fee': {
                    'amount': 0,
                    'asset_id': fee_id
                },
                'name': contractName,
                'account': fromAcc.id,
                vm_type,
                vm_version,
                code,
                abi
            }))

            return process_transaction(tr, from, password, broadcast).then((resp) => {
                // 如果不broadcast，返回为对象
                if (resp instanceof Array) {
                    return fetch_account(contractName).then((account) => {
                        resp[0].ext = {
                            abi,
                            from,
                            contractName,
                            contractId: account.id,
                            fee: resp[0].trx.operations[0][1].fee
                        }

                        return resp
                    })
                }
                // 时间、费用、费用类型
                return resp
            })
        }))
    })
}

const call_contract = (from, target, act, fee_id, password, broadcast = true, amount = {}) => {
    return new Promise((resolve, reject) => {
        resolve(Promise.all([fetch_account(from), fetch_account(target), unlock_wallet(from, password)]).then(results => {
            let fromAcc = results[0]
            let contractAccount = results[1]
            if (!fromAcc) {
                // throw new Error(i18n.t('transfer.error.account.from_account_not_exist'))
            }

            let tr = new TransactionBuilder()
            let opts = {
                'fee': {
                    'amount': 0,
                    'asset_id': fee_id
                },
                'account': fromAcc.id,
                'contract_id': contractAccount.id,
                'method_name': act.method_name,
                'data': act.data
            }

            if (!!amount.amount) {
                opts.amount = amount
            }
            tr.add_operation(tr.get_type_operation('call_contract', opts))
            return process_transaction(tr, from, password, broadcast)
        }))
    })
}

/**
 * process transaction
 * @param tr
 * @param account
 * @param password
 * @returns {bluebird}
 */
const process_transaction = (tr, account, password, broadcast) => {
    let walletInfo = null
    return new Promise((resolve, reject) => {
        resolve(unlock_wallet(account, password).then(info => {
            walletInfo = info
            return Promise.all([tr.update_head_block(), tr.set_required_fees()]).then(() => {
                tr.add_signer(PrivateKey.fromWif(walletInfo.wifKey))
                if (broadcast) {
                    return tr.broadcast()
                } else {
                    return tr
                }
            })
        }))
    })
}

const unlock_wallet = (account, password) => {
    return new Promise((resolve, reject) => {
        import('@/locales').then(i18n => {
            i18n = i18n.default
            let wallets = store.state.wallets
            let wallet = find(wallets, function (w) {
                return w.account == account
            })
            wallet = Object.assign({}, wallet)
            let password_private = PrivateKey.fromSeed(password)
            let password_pubkey = password_private.toPublicKey().toPublicKeyString() // used to validate password
            if (wallet == null) {
                // TODO 本来想在最前面引入i18n，但是引入会导致循环依赖的问题
                reject(new Error(i18n.t('unlock.messages.accountNotFound')))
            } else if (password_pubkey != wallet.password_pubkey) {
                reject(new Error(i18n.t('unlock.messages.invalidPassword')))
            } else {
                let password_aes = Aes.fromSeed(password)
                let encryption_plainbuffer = password_aes.decryptHexToBuffer(wallet.encryption_key)
                let aes_private = Aes.fromSeed(encryption_plainbuffer)
                let wifKey = aes_private.decryptHexToText(wallet.encrypted_wifkey)
                resolve({
                    wifKey,
                    wallet
                })
            }
        })
    })
}

/**
 * get objects by id
 * @param ids
 */
const get_objects = (ids) => {
    return Apis.instance().db_api().exec('get_objects', [ids])
}

/***
 * get assets by ids
 * @param ids
 * @returns {bluebird}
 */
const get_assets_by_ids = (ids) => {
    let assetsMap = {}
    return new Promise(function (resolve, reject) {
        let new_ids = []
        ids.forEach(id => {
            if (!assetsMap[id]) {
                new_ids.push(id)
            }
        })
        if (new_ids.length > 0) {
            return get_objects(new_ids).then(assets => {
                assets.forEach(asset => {
                    assetsMap[asset.id] = asset
                })
                resolve(ids.map(id => {
                    return assetsMap[id]
                }))
            }).catch(reject)
        } else {
            resolve(ids.map(id => {
                return assetsMap[id]
            }))
        }
    })
}

/**
 * fetch account balances by account name or id
 * @param account_name
 * @returns {bluebird}
 */
const fetch_account_balances = (account_name) => {
    return new Promise((resolve, reject) => {
        resolve(fetch_account(account_name).then((account) => {
            return Apis.instance().db_api().exec('get_account_balances', [account.id, []]).then(function (balances) {
                if (balances && balances.length > 0) {
                    // GXS order first
                    if (balances[1] && balances[1].asset_id === '1.3.1') {
                        let tmpObj = balances[0]
                        balances[0] = balances[1]
                        balances[1] = tmpObj
                    }
                    return balances
                } else {
                    return [{amount: 0, asset_id: '1.3.1'}]
                }
            })
        }))
    })
}

const serialize_contract_call_args = (contract = 'contract', method = 'hi', json_args = {}) => {
    return Apis.instance().db_api().exec('serialize_contract_call_args', [contract, method, JSON.stringify(json_args)])
}

export {
    get_objects,
    get_assets_by_ids,
    fetch_account_balances,
    call_contract,
    fetch_account,
    unlock_wallet,
    process_transaction,
    deploy_contract,
    import_account,
    serialize_contract_call_args
}
