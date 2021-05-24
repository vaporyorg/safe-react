import { createAction } from 'redux-actions'

import { ChecksumAddress } from 'src/utils/checksumAddress'

export const SET_DEFAULT_SAFE = 'SET_DEFAULT_SAFE'

export const setDefaultSafe = createAction<ChecksumAddress>(SET_DEFAULT_SAFE)
