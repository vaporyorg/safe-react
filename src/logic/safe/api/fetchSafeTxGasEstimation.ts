import axios from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
import { ChecksumAddress } from 'src/utils/checksumAddress'

export type GasEstimationResponse = {
  safeTxGas: string
}

type FetchSafeTxGasEstimationProps = {
  safeAddress: ChecksumAddress
  to: ChecksumAddress
  value: string
  data?: string
  operation: number
}

export const fetchSafeTxGasEstimation = async ({
  safeAddress,
  ...body
}: FetchSafeTxGasEstimationProps): Promise<string> => {
  const url = `${getSafeServiceBaseUrl(safeAddress)}/multisig-transactions/estimations/`

  return axios.post(url, body).then(({ data }) => data.safeTxGas)
}
