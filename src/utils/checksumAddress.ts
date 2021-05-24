import { web3ReadOnly } from 'src/logic/wallets/getWeb3'

export class ChecksumAddress extends String {
  private readonly checksummed = true

  constructor(address: string) {
    super(web3ReadOnly.utils.toChecksumAddress(address))
  }
}

export const checksumAddress = (address: string): ChecksumAddress => new ChecksumAddress(address)
