export default class Wallet {
    constructor({account = '', backup_date = '', chainId = '', encrypted_wifkey = '', encryption_key = '', id = '', password_pubkey = ''}) {
        this.account = account
        this.backup_date = backup_date
        this.chainId = chainId
        this.encrypted_wifkey = encrypted_wifkey
        this.encryption_key = encryption_key
        this.id = id
        this.password_pubkey = password_pubkey
    }

    unique() {
        return Wallet.unique(this)
    }

    static fromJson(obj) {
        return new Wallet(obj)
    }

    static unique({chainId, account}) {
        return (chainId + '|' + account)
    }
}
