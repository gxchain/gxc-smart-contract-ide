import {Aes, key, PrivateKey} from 'gxbjs'
import {Apis} from 'gxbjs-ws'
import Promise from 'bluebird'
import uniq from 'lodash/uniq'
import some from 'lodash/some'
import store from '@/store'
// import Vue from 'vue'
// import i18n from '@/locales'

/**
 * unlock wallet
 * @param account
 * @param password
 * @returns {bluebird}
 */
// const unlockWallet = (account, password) => {
//     return new Promise((resolve, reject) => {
//         let wallets = get_wallets()
//         let wallet = find(wallets, function (w) {
//             return w.account == account
//         })
//         let password_private = PrivateKey.fromSeed(password)
//         let password_pubkey = password_private.toPublicKey().toPublicKeyString() // used to validate password
//         if (wallet == null) {
//             reject(new Error(i18n.t('unlock.account_not_found')))
//         } else if (password_pubkey != wallet.password_pubkey) {
//             reject(new Error(i18n.t('unlock.error.invalid_password')))
//         } else {
//             let password_aes = Aes.fromSeed(password)
//             let encryption_plainbuffer = password_aes.decryptHexToBuffer(wallet.encryption_key)
//             let aes_private = Aes.fromSeed(encryption_plainbuffer)
//             let wifKey = aes_private.decryptHexToText(wallet.encrypted_wifkey)
//             resolve({
//                 wifKey,
//                 wallet
//             })
//         }
//     })
// }

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
                                    account: account.name,
                                    password_pubkey,
                                    encryption_key,
                                    encrypted_wifkey,
                                    backup_date: null
                                }
                                imported.push(wallet)
                                store.dispatch('appendWallet', wallet)
                            } else {
                                console.log('account:', account.name, 'already exist')
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
// const transfer = (from, to, asset, fee_id, amount, memo, password, broadcast = true) => {
//     return new Promise((resolve, reject) => {
//         resolve(Promise.all([fetch_account(from), fetch_account(to), unlock_wallet(from, password)]).then(results => {
//             let fromAcc = results[0]
//             if (!fromAcc) {
//                 // throw new Error(i18n.t('transfer.error.account.from_account_not_exist'))
//             }
//             let toAcc = results[1]
//             if (!toAcc) {
//                 // throw new Error(i18n.t('transfer.error.account.to_account_not_exist'))
//             }
//
//             let memo_from_public, memo_to_public
//             if (memo) {
//                 memo_from_public = fromAcc.options.memo_key
//
//                 // The 1s are base58 for all zeros (null)
//                 if (/111111111111111111111/.test(memo_from_public)) {
//                     memo_from_public = null
//                 }
//
//                 memo_to_public = toAcc.options.memo_key
//                 if (/111111111111111111111/.test(memo_to_public)) {
//                     memo_to_public = null
//                 }
//                 let fromPrivate = PrivateKey.fromWif(results[2].wifKey)
//                 if (memo_from_public != fromPrivate.toPublicKey().toPublicKeyString()) {
//                     throw new Error(i18n.t('transfer.error.account.memo_signer_not_exist'))
//                 }
//             }
//
//             let memo_object
//             if (memo && memo_to_public && memo_from_public) {
//                 let nonce = TransactionHelper.unique_nonce_uint64()
//                 memo_object = {
//                     from: memo_from_public,
//                     to: memo_to_public,
//                     nonce,
//                     message: Aes.encrypt_with_checksum(
//                         PrivateKey.fromWif(results[2].wifKey),
//                         memo_to_public,
//                         nonce,
//                         new Buffer(memo, 'utf-8')
//                     )
//                 }
//             }
//
//             let tr = new TransactionBuilder()
//             if (window.nnn) {
//                 tr.add_operation(tr.get_type_operation('transfer', {
//                     fee: {
//                         amount: 0,
//                         asset_id: fee_id
//                     },
//                     from: fromAcc.id,
//                     to: toAcc.id,
//                     amount: {amount: accMult(amount, Math.pow(10, asset.precision)), asset_id: asset.id},
//                     memo: memo_object
//                 }))
//             } else {
//                 tr.add_operation(tr.get_type_operation('create_contract', {
//                     'fee': {
//                         'amount': 0,
//                         'asset_id': fee_id
//                     },
//                     'name': 'bob',
//                     'account': fromAcc.id,
//                     'vm_type': '0',
//                     'vm_version': '0',
//                     'code': '0061736d01000000013f0c60027f7e006000006000017e60017f0060017e006000017f60027f7f017f60037f7f7f017f60027f7f0060037e7e7e0060017f017f60057f7f7f7f7f017f029e010a03656e760561626f7274000103656e7610616374696f6e5f646174615f73697a65000503656e760c63757272656e745f74696d65000203656e76066d656d637079000703656e76066d656d736574000703656e76067072696e7469000403656e76067072696e746e000403656e76067072696e7473000303656e76087072696e74735f6c000803656e7610726561645f616374696f6e5f6461746100060314130606060509000600080a060a030a03080b0701040501700103030503010001077c09066d656d6f72790200165f5a6571524b3131636865636b73756d32353653315f000a165f5a6571524b3131636865636b73756d31363053315f000b165f5a6e65524b3131636865636b73756d31363053315f000c036e6f77000d056170706c79000e066d616c6c6f63001304667265650016066d656d636d70001b0909010041000b031c0f110ae619130b00200020014120101b450b0b00200020014120101b450b0d00200020014120101b4100470b0a00100242c0843d80a70b9c0101017f4100410028020441306b2203360204024020012000520d0020032001370328024020024280808080808080ca3f510d0020024280808080808080c0eb00520d01200341003602242003410136022020032003290320370208200341286a200341086a10101a0c010b2003410036021c2003410236021820032003290318370210200341286a200341106a10101a0b4100200341306a3602040ba80303037f037e017f4100410028020441206b220836020441201007200110064130100742002101423b210541c00021044200210603400240024002400240024020014202560d0020042c00002202419f7f6a41ff017141194b0d01200241a5016a21020c020b420021072001420b580d020c030b200241d0016a41002002414f6a41ff01714105491b21020b2002ad42388642388721070b2007421f83200542ffffffff0f838621070b200441016a2104200142017c2101200720068421062005427b7c2205427a520d000b20082006370318200841086a200841186a101241d00010074200100541e00010072008280210200841086a410172220420082d0008220241017122031b200828020c200241017620031b10084130100741d00010074201100541e00010072008280210200420082d0008220241017122031b200828020c200241017620031b10084130100741d00010074202100541e00010072008280210200420082d0008220241017122031b200828020c200241017620031b100841301007024020082d0008410171450d00200841106a28020010180b4100200841206a3602040bcb0103017f017e037f410028020441106b22042106410020043602042001280204210220012802002105024002400240024010012201450d002001418104490d012001101321040c020b410021040c020b410020042001410f6a4170716b22043602040b2004200110091a0b20064200370308200641086a2004410810031a2006290308210302402001418104490d00200410160b200020024101756a210102402002410171450d00200128020020056a28020021050b2001200320051100004100200641106a36020441010b0a0041101007200110060b810303067f017e017f4100410028020441106b2209360204200041101017220636020820004291808080d0013702002006412e410d10041a200641003a000d200041016a21022001290300210841112107200041086a2105410c210603404100280268420f421f2006410c4622041b200883a76a2d000021032002210102402007410171450d00200528020021010b0240200120066a20033a00002006450d002006417f6a210620084204420520041b88210820002d000021070c010b0b200041046a28020020002d00002206410176200641017122011b2106200041086a280200200220011b2107024003402006450d01200720066a21012006417f6a220321062001417f6a2d0000412e460d000b2003417f460d00200920004100200341016a2000101a1a0240024020002d00004101710d00200041003b01000c010b200041086a28020041003a0000200041046a41003602000b200041001019200041086a200941086a280200360200200020092903003702000b4100200941106a3602040b0900419401200010140bb904010c7f02402001450d00024020002802c041220d0d004110210d200041c0c1006a41103602000b200141086a200141046a41077122026b200120021b210202400240024020002802c441220a200d4f0d002000200a410c6c6a4180c0006a21010240200a0d0020004184c0006a220d2802000d0020014180c000360200200d20003602000b200241046a210a034002402001280208220d200a6a20012802004b0d002001280204200d6a220d200d28020041808080807871200272360200200141086a22012001280200200a6a360200200d200d28020041808080807872360200200d41046a22010d030b2000101522010d000b0b41fcffffff0720026b2104200041c8c1006a210b200041c0c1006a210c20002802c8412203210d03402000200d410c6c6a22014180c0006a210620014184c0006a280200220541046a210d0340200520062802006a2107200d417c6a2208280200220941ffffffff07712101024020094100480d000240200120024f0d000340200d20016a220a20074f0d01200a280200220a4100480d012001200a41ffffffff07716a41046a22012002490d000b0b20082001200220012002491b200941808080807871723602000240200120024d0d00200d20026a200420016a41ffffffff07713602000b200120024f0d040b200d20016a41046a220d2007490d000b41002101200b4100200b28020041016a220d200d200c280200461b220d360200200d2003470d000b0b20010f0b2008200828020041808080807872360200200d0f0b41000b870501087f20002802c44121010240024041002d00e042450d0041002802e44221070c010b3f002107410041013a00e0424100200741107422073602e4420b200721030240024002400240200741ffff036a41107622023f0022084d0d00200220086b40001a4100210820023f00470d0141002802e44221030b41002108410020033602e44220074100480d0020002001410c6c6a210220074180800441808008200741ffff037122084181f8034922061b6a2008200741ffff077120061b6b20076b2107024041002d00e0420d003f002103410041013a00e0424100200341107422033602e4420b20024180c0006a210220074100480d01200321060240200741076a417871220520036a41ffff036a41107622083f0022044d0d00200820046b40001a20083f00470d0241002802e44221060b4100200620056a3602e4422003417f460d0120002001410c6c6a22014184c0006a2802002206200228020022086a2003460d020240200820014188c0006a22052802002201460d00200620016a2206200628020041808080807871417c20016b20086a72360200200520022802003602002006200628020041ffffffff07713602000b200041c4c1006a2202200228020041016a220236020020002002410c6c6a22004184c0006a200336020020004180c0006a220820073602000b20080f0b02402002280200220820002001410c6c6a22034188c0006a22012802002207460d0020034184c0006a28020020076a2203200328020041808080807871417c20076b20086a72360200200120022802003602002003200328020041ffffffff07713602000b2000200041c4c1006a220728020041016a22033602c0412007200336020041000f0b2002200820076a36020020020b7b01037f024002402000450d0041002802d44222024101480d004194c10021032002410c6c4194c1006a21010340200341046a2802002202450d010240200241046a20004b0d00200220032802006a20004b0d030b2003410c6a22032001490d000b0b0f0b2000417c6a2203200328020041ffffffff07713602000b3f01027f02402000410120001b2201101322020d0003404100210241002802e842220041003a00002000450d012000110100200110132202450d000b0b20020b0e0002402000450d00200010160b0be20201067f0240200141704f0d00410a2102024020002d00002205410171450d0020002802002205417e71417f6a21020b0240024020054101710d00200541fe017141017621030c010b200028020421030b410a2104024020032001200320014b1b2201410b490d00200141106a417071417f6a21040b024020042002460d00024002402004410a470d0041012106200041016a210120002802082102410021070c010b200441016a101721010240200420024b0d002001450d020b024020002d000022054101710d0041012107200041016a2102410021060c010b2000280208210241012106410121070b0240024020054101710d00200541fe017141017621050c010b200028020421050b0240200541016a2205450d0020012002200510031a0b02402006450d00200210180b02402007450d0020002003360204200020013602082000200441016a4101723602000f0b200020034101743a00000b0f0b1000000bc40101047f20004200370200200041086a41003602000240200128020420012d00002208410176200841017122051b22082002490d00200820026b2208200320082003491b220341704f0d00200128020821060240024002402003410b4f0d00200020034101743a0000200041016a210820030d010c020b200341106a4170712207101721082000200741017236020020002008360208200020033602040b20082006200141016a20051b20026a200310031a0b200820036a41003a000020000f0b1000000b4901037f4100210502402002450d000240034020002d0000220320012d00002204470d01200141016a2101200041016a21002002417f6a22020d000c020b0b200320046b21050b20050b0300000b0b7e090041040b04706100000041100b064279652c20000041200b0848656c6c6f2c20000041300b020a000041c0000b0464616e000041d0000b066c6f6f7020000041e0000b08206e616d652c20000041e8000b04700000000041f0000b212e31323334356162636465666768696a6b6c6d6e6f707172737475767778797a00',
//                     'code_version': '529f9cea024c1c031f3908b73b85792b42756ab92846afacb87288a22e9ec282',
//                     'abi': '616269'
//                 }))
//             }
//
//             return process_transaction(tr, from, password, broadcast)
//         }))
//     })
// }

/**
 * process transaction
 * @param tr
 * @param account
 * @param password
 * @returns {bluebird}
 */
// const process_transaction = (tr, account, password, broadcast) => {
//     let walletInfo = null
//     return new Promise((resolve, reject) => {
//         resolve(unlock_wallet(account, password).then(info => {
//             walletInfo = info
//             return Promise.all([tr.update_head_block(), tr.set_required_fees()]).then(() => {
//                 tr.add_signer(PrivateKey.fromWif(walletInfo.wifKey))
//                 if (broadcast) {
//                     return tr.broadcast()
//                 } else {
//                     return tr
//                 }
//             })
//         }))
//     })
// }

export {
    // transfer,
    // unlock_wallet,
    import_account
}
