import types from 'gxbjs/lib/serializer/src/types'
import ByteBuffer from 'bytebuffer'

const serializeCallData = (action, params, abi) => {
    let struct = abi.structs.find(s => s.name === action)
    let b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
    struct.fields.forEach(f => {
        let value = params[f.name]
        let type = types[f.type]
        if (!type) {
            let t = abi.types.find(t => t.new_type_name === f.type)
            if (t) {
                type = types[t.type]
            }
        }
        if (type) {
            type.appendByteBuffer(b, value)
        }
    })
    return Buffer.from(b.copy(0, b.offset).toBinary(), 'binary')
}

export default {
    serializeCallData
}
