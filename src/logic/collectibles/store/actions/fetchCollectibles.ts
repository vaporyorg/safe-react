import { Dispatch } from 'redux'

import { getConfiguredSource } from 'src/logic/collectibles/sources'
import { addNftAssets, addNftTokens } from 'src/logic/collectibles/store/actions/addCollectibles'
import { ChecksumAddress } from '../../../../utils/checksumAddress'

export const fetchCollectibles = (safeAddress: ChecksumAddress) => async (dispatch: Dispatch): Promise<void> => {
  try {
    const source = getConfiguredSource()
    const collectibles = await source.fetchCollectibles(safeAddress)

    dispatch(addNftAssets(collectibles.nftAssets))
    dispatch(addNftTokens(collectibles.nftTokens))
  } catch (error) {
    console.log('Error fetching collectibles:', error)
  }
}
