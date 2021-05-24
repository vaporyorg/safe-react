import axios, { AxiosResponse } from 'axios'

import { getSafeClientGatewayBaseUrl } from 'src/config'
import { HistoryGatewayResponse, QueuedGatewayResponse } from 'src/logic/safe/store/models/types/gateway'
import { ChecksumAddress, checksumAddress } from 'src/utils/checksumAddress'

/*************/
/*  HISTORY  */
/*************/
const getHistoryTransactionsUrl = (safeAddress: ChecksumAddress): string => {
  return `${getSafeClientGatewayBaseUrl(safeAddress)}/transactions/history/`
}

const historyPointers: { [safeAddress: string]: { next: string | null; previous: string | null } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {ChecksumAddress} safeAddress
 */
export const loadPagedHistoryTransactions = async (
  safeAddress: ChecksumAddress,
): Promise<{ values: HistoryGatewayResponse['results']; next: string | null } | undefined> => {
  const address = safeAddress.toString()
  // if `historyPointers[address] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `historyPointers[address].next is `null`, it means it reached the last page in gateway-client
  if (!historyPointers[address]?.next) {
    return
  }

  const {
    data: { results, ...pointers },
  } = await axios.get<HistoryGatewayResponse, AxiosResponse<HistoryGatewayResponse>>(
    historyPointers[address].next as string,
  )

  historyPointers[address] = pointers

  return { values: results, next: historyPointers[address].next }
}

export const loadHistoryTransactions = async (
  safeAddress: ChecksumAddress,
): Promise<HistoryGatewayResponse['results']> => {
  const historyTransactionsUrl = getHistoryTransactionsUrl(safeAddress)
  const address = safeAddress.toString()

  try {
    const {
      data: { results, ...pointers },
    } = await axios.get<HistoryGatewayResponse, AxiosResponse<HistoryGatewayResponse>>(historyTransactionsUrl)

    if (!historyPointers[address]) {
      historyPointers[address] = pointers
    }

    return results
  } catch (error) {
    // When the safe is just created there is a delay until the gateway recognize the
    // safe address, when that happens it returns 404.
    if (error.response.status === 404) {
      return []
    }

    throw Error(`There was an error trying to fetch history txs from safeAddress ${address}`)
  }
}

/************/
/*  QUEUED  */
/************/
const getQueuedTransactionsUrl = (safeAddress: ChecksumAddress): string => {
  return `${getSafeClientGatewayBaseUrl(safeAddress)}/transactions/queued/`
}

const queuedPointers: { [safeAddress: string]: { next: string | null; previous: string | null } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {ChecksumAddress} safeAddress
 */
export const loadPagedQueuedTransactions = async (
  safeAddress: ChecksumAddress,
): Promise<{ values: QueuedGatewayResponse['results']; next: string | null } | undefined> => {
  const address = safeAddress.toString()
  // if `queuedPointers[address] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `queuedPointers[address].next is `null`, it means it reached the last page in gateway-client
  if (!queuedPointers[address]?.next) {
    return
  }

  const {
    data: { results, ...pointers },
  } = await axios.get<QueuedGatewayResponse, AxiosResponse<QueuedGatewayResponse>>(
    queuedPointers[address].next as string,
  )

  queuedPointers[address] = pointers

  return { values: results, next: queuedPointers[address].next }
}

export const loadQueuedTransactions = async (
  safeAddress: ChecksumAddress,
): Promise<QueuedGatewayResponse['results']> => {
  const queuedTransactionsUrl = getQueuedTransactionsUrl(safeAddress)
  const address = safeAddress.toString()

  try {
    const {
      data: { results, ...pointers },
    } = await axios.get<QueuedGatewayResponse, AxiosResponse<QueuedGatewayResponse>>(queuedTransactionsUrl)

    if (!queuedPointers[address] || queuedPointers[address].next === null) {
      queuedPointers[address] = pointers
    }

    return results
  } catch (error) {
    // When the safe is just created there is a delay until the gateway recognize the
    // safe address, when that happens it returns 404.
    if (error.response.status === 404) {
      return []
    }

    throw Error(`There was an error trying to fetch queued txs from safeAddress ${address}`)
  }
}
