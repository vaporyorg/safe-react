import React, { useState } from 'react'

import styled from 'styled-components'
import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'
import { Modal } from 'src/components/Modal'
import { CSVReader } from 'react-papaparse'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

const ImportContainer = styled.div`
  flex-direction: column;
  justify-content: center;
  margin: 24px;
  align-items: center;
  /* width: 200px;*/
  min-height: 100px;
  display: flex;
`

const InfoContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  text-align: center;
  margin-top: 16px;
`
const StyledIcon = styled(Icon)`
  svg {
    position: relative;
    top: 4px;
    left: 4px;
  }
`

const WRONG_FILE_EXTENSION_ERROR = 'Only CSV files are allowed'
const FILE_SIZE_TOO_BIG = 'The size of the file is over 1 MB'
const FILE_BYTES_LIMIT = 1000000
const IMPORT_SUPPORTED_FORMATS = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
]

const ImportEntryModal = ({ importEntryModalHandler, isOpen, onClose }) => {
  const [csvLoaded, setCsvLoaded] = useState(false)
  const [importError, setImportError] = useState('')
  const [entryList, setEntryList] = useState<AddressBookEntry[]>([])

  const handleImportEntrySubmit = () => {
    setCsvLoaded(false)
    importEntryModalHandler(entryList)
  }

  const handleOnDrop = (data, file) => {
    const slicedData = data.slice(1)

    const fileError = validateFile(file)
    if (fileError) {
      setImportError(fileError)
      return
    }

    const dataError = validateCsvData(slicedData)
    if (dataError) {
      setImportError(dataError)
      return
    }

    const formatedList = slicedData.map((entry) => {
      const address = entry.data[0].toLowerCase()
      return { address: getWeb3().utils.toChecksumAddress(address), name: entry.data[1] }
    })
    setEntryList(formatedList)
    setImportError('')
    setCsvLoaded(true)
  }

  const validateFile = (file) => {
    if (!IMPORT_SUPPORTED_FORMATS.includes(file.type)) {
      return WRONG_FILE_EXTENSION_ERROR
    }

    if (file.size >= FILE_BYTES_LIMIT) {
      return FILE_SIZE_TOO_BIG
    }

    return
  }

  const validateCsvData = (data) => {
    for (let index = 0; index < data.length; index++) {
      const entry = data[index]
      if (!entry.data[0] || !entry.data[1]) {
        return `Invalid amount of columns on row ${index + 2}`
      }
      // Verify address properties
      const address = entry.data[0].toLowerCase()
      if (!getWeb3().utils.isAddress(address)) {
        return `Invalid address on row ${index + 2}`
      }
      return
    }
  }

  const handleOnError = (error) => {
    setImportError(error.message)
  }

  const handleOnRemoveFile = () => {
    setCsvLoaded(false)
    setImportError('')
  }

  const handleClose = () => {
    setCsvLoaded(false)
    setEntryList([])
    setImportError('')
    onClose()
  }

  return (
    <Modal description="Import address book" handleClose={handleClose} open={isOpen} title="Import address book">
      <Modal.Header onClose={handleClose}>
        <Modal.Header.Title>Import address book</Modal.Header.Title>
      </Modal.Header>
      <Modal.Body withoutPadding>
        <ImportContainer>
          <CSVReader
            onDrop={handleOnDrop}
            onError={handleOnError}
            addRemoveButton
            onRemoveFile={handleOnRemoveFile}
            style={{
              dropArea: {
                borderColor: '#B2B5B2',
                borderRadius: 8,
              },
              dropAreaActive: {
                borderColor: '#008C73',
                /* borderColor: '${({ theme }) => theme.colors.primary}', */
              },
              dropFile: {
                width: 200,
                height: 100,
                background: '#fff',
                boxShadow: 'rgb(40 54 61 / 18%) 1px 2px 10px 0px',
                borderRadius: 8,
              },
              fileSizeInfo: {
                color: '#001428',
                lineHeight: 1,
                position: 'absolute',
                left: '10px',
                top: '12px',
              },
              fileNameInfo: {
                color: importError === '' ? '#008C73' : '#DB3A3D',
                backgroundColor: '#fff',
                fontSize: 14,
                lineHeight: 1.4,
                padding: '0 0.4em',
                margin: '1.2em 0 0.5em 0',
                maxHeight: '59px',
                overflow: 'hidden',
              },
              progressBar: {
                backgroundColor: '#008C73',
              },
              removeButton: {
                color: '#DB3A3D',
              },
            }}
          >
            <Text size="xl">
              Drop your CSV file here <br />
              or click to upload.
            </Text>
          </CSVReader>
        </ImportContainer>
        <InfoContainer>
          {importError !== '' && (
            <Text size="xl" color="error">
              {importError}
            </Text>
          )}
          {!csvLoaded && importError === '' && (
            <Text color="text" as="p" size="xl">
              Only CSV files are allowed in the format [Address, Name] separated by comma. <br />
              <Link
                href="https://help.gnosis-safe.io/en/"
                target="_blank"
                rel="noreferrer"
                title="Learn more about importing / exporting an address book."
              >
                <Text size="xl" as="span" color="primary">
                  Learn more about importing / exporting an address book.
                </Text>
                <StyledIcon size="sm" type="externalLink" color="primary" />
              </Link>
            </Text>
          )}
          {csvLoaded && importError === '' && (
            <>
              <Text size="xl" as="span">{`You're about to import`}</Text>
              <Text size="xl" strong as="span">{` ${entryList.length} entries to your address book`}</Text>
            </>
          )}
        </InfoContainer>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Footer.Buttons
          cancelButtonProps={{ onClick: () => handleClose() }}
          confirmButtonProps={{
            color: 'primary',
            disabled: !csvLoaded || importError !== '',
            onClick: handleImportEntrySubmit,
            text: 'Import',
          }}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default ImportEntryModal
