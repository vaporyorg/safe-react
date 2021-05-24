import { useSelector } from 'react-redux'

import { getNameFromAddressBook } from 'src/logic/addressBook/utils'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { ChecksumAddress } from '../../../utils/checksumAddress'

export const useSafeName = (safeAddress?: ChecksumAddress): string => {
  const addressBook = useSelector(addressBookSelector)

  return getNameFromAddressBook(addressBook, safeAddress) || ''
}
