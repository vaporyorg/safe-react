import { getSafeClientGatewayBaseUrl } from 'src/config'
import { ChecksumAddress } from 'src/utils/checksumAddress'

export const buildSafeInformationUrl = (safeAddress: ChecksumAddress): string => {
  const url = getSafeClientGatewayBaseUrl(safeAddress)
  return `${url}/`
}
