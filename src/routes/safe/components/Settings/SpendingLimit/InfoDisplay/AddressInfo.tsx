import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo, getNetworkId } from 'src/config'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'
import { sameString } from 'src/utils/strings'
import { ChecksumAddress } from '../../../../../../utils/checksumAddress'

import DataDisplay from './DataDisplay'

const chainId = getNetworkId()

interface AddressInfoProps {
  address: ChecksumAddress
  title?: string
}

const AddressInfo = ({ address, title }: AddressInfoProps): ReactElement => {
  const name = useSelector((state) => getNameFromAddressBookSelector(state, { address, chainId }))
  const explorerUrl = getExplorerInfo(address.toString())

  return (
    <DataDisplay title={title}>
      <EthHashInfo
        hash={address.toString()}
        name={sameString(name, 'UNKNOWN') ? undefined : name}
        showCopyBtn
        showAvatar
        textSize="lg"
        explorerUrl={explorerUrl}
      />
    </DataDisplay>
  )
}

export default AddressInfo
