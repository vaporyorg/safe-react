import { Map } from 'immutable'

import { SafeRecord, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { ChecksumAddress } from 'src/utils/checksumAddress'

export type SafesMap = Map<string, SafeRecord>

export type DefaultSafe = 'NOT_ASKED' | string | undefined

export interface SafeReducerState {
  defaultSafe: DefaultSafe
  safes: SafesMap
  latestMasterContractVersion: string
  selectedCurrency: string
}

interface SafeReducerStateJSON {
  defaultSafe: 'NOT_ASKED' | ChecksumAddress | undefined
  safes: Record<string, SafeRecordProps>
  latestMasterContractVersion: string
  selectedCurrency: string
}

export interface SafeReducerMap extends Map<string, any> {
  toJS(): SafeReducerStateJSON
  get<K extends keyof SafeReducerState>(key: K): SafeReducerState[K]
}
