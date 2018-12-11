/**
 * log util
 * all the events below:
 *
 * createTemplateSuc
 * compileClick
 * deployClick
 * deploySuc
 * deployFail
 * callClick
 * callSuc
 * callFail
 * importClick
 * importSuc
 * importFail
 * addEntryPointSuc
 * addCompileServerSuc
 * documentClick
 * feedbackClick
 * updateContractClick
 * updateContractSuc
 * updateContractFail
 */

const util = {}

util.logClick = function (id, params = {}) {
    if (process.env.NODE_ENV !== 'production') {
        return
    }

    if (!id) {
        throw new Error('id not exist')
    }

    MtaH5.clickStat(id, params)
}

export default util
