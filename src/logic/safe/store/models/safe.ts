import { Record, RecordOf } from 'immutable'

import { ChecksumAddress } from 'src/utils/checksumAddress'
import { FEATURES } from 'src/config/networks/network.d'
import { BalanceRecord } from 'src/logic/tokens/store/actions/fetchSafeTokens'

export type SafeOwner = ChecksumAddress

export type ModulePair = [
  // previous module
  string,
  // module
  string,
]

export type SpendingLimit = {
  delegate: string
  token: string
  amount: string
  spent: string
  resetTimeMin: string
  lastResetMin: string
  nonce: string
}

export type SafeRecordProps = {
  address: ChecksumAddress
  threshold: number
  ethBalance: string
  totalFiatBalance: string
  owners: SafeOwner[]
  modules?: ModulePair[] | null
  spendingLimits?: SpendingLimit[] | null
  balances: BalanceRecord[]
  nonce: number
  recurringUser?: boolean
  loadedViaUrl?: boolean
  currentVersion: string
  needsUpdate: boolean
  featuresEnabled: Array<FEATURES>
}

const makeSafe = Record<SafeRecordProps>({
  address: '',
  threshold: 0,
  ethBalance: '0',
  totalFiatBalance: '0',
  owners: [],
  modules: [],
  spendingLimits: [],
  balances: [],
  nonce: 0,
  loadedViaUrl: false,
  recurringUser: undefined,
  currentVersion: '',
  needsUpdate: false,
  featuresEnabled: [],
})

export type SafeRecord = RecordOf<SafeRecordProps>

export default makeSafe
