import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Close from '@material-ui/icons/Close'

import Divider from 'src/components/Divider'
import QRIcon from 'src/assets/icons/qrcode.svg'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import { TextAreaField } from 'src/components/forms/TextAreaField'
import TextField from 'src/components/forms/TextField'
import { composeValidators, maxValue, minValue, mustBeFloat } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { ScanQRModal } from 'src/components/ScanQRModal'
import { safeSelector } from 'src/logic/safe/store/selectors'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { ContractsAddressBookInput } from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import { sameString } from 'src/utils/strings'

import { styles } from './style'
import { getExplorerInfo, getNetworkInfo } from 'src/config'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'

export interface CreatedTx {
  contractAddress: string
  data: string
  value: string | number
}

export type CustomTxProps = {
  contractAddress?: string
}

type Props = {
  initialValues: CustomTxProps
  onClose: () => void
  onNext: (tx: CreatedTx, submit: boolean) => void
  isABI: boolean
  switchMethod: () => void
  contractAddress?: string
}

const useStyles = makeStyles(styles)

const { nativeCoin } = getNetworkInfo()

const SendCustomTx: React.FC<Props> = ({ initialValues, onClose, onNext, contractAddress, switchMethod, isABI }) => {
  const classes = useStyles()
  const { ethBalance } = useSelector(safeSelector) || {}
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false)
  const [selectedEntry, setSelectedEntry] = useState<{ address?: string; name: string } | null>({
    address: contractAddress || initialValues.contractAddress,
    name: '',
  })
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true)

  const saveForm = async (values) => {
    await handleSubmit(values, false)
    switchMethod()
  }

  const handleSubmit = (values: any, submit = true) => {
    if (values.data || values.value) {
      onNext(values, submit)
    }
  }

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const formMutators = {
    setMax: (args, state, utils) => {
      utils.changeValue(state, 'value', () => ethBalance)
    },
    setRecipient: (args, state, utils) => {
      utils.changeValue(state, 'contractAddress', () => args[0])
    },
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Contract interaction
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm
        formMutators={formMutators}
        initialValues={initialValues}
        subscription={{ submitting: true, pristine: true, values: true }}
        onSubmit={handleSubmit}
      >
        {(...args) => {
          const mutators = args[3]
          const pristine = args[2].pristine
          let shouldDisableSubmitButton = !isValidAddress
          if (selectedEntry) {
            shouldDisableSubmitButton = !selectedEntry.address
          }

          const handleScan = (value) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }

            mutators.setRecipient(scannedAddress)
            closeQrModal()
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo />
                <Divider withArrow />
                {selectedEntry && selectedEntry.address ? (
                  <div
                    onKeyDown={(e) => {
                      if (sameString(e.key, 'Tab')) {
                        return
                      }
                      setSelectedEntry(null)
                    }}
                    onClick={() => {
                      setSelectedEntry(null)
                    }}
                    role="listbox"
                    tabIndex={0}
                  >
                    <Row margin="xs">
                      <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                        Contract address
                      </Paragraph>
                    </Row>
                    <Row align="center" margin="md">
                      <Col xs={12}>
                        <EthHashInfo
                          hash={selectedEntry.address}
                          name={selectedEntry.name}
                          showAvatar
                          showCopyBtn
                          explorerUrl={getExplorerInfo(selectedEntry.address)}
                        />
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <>
                    <Row margin="md">
                      <Col xs={11}>
                        <ContractsAddressBookInput
                          fieldMutator={mutators.setRecipient}
                          pristine={pristine}
                          setIsValidAddress={setIsValidAddress}
                          setSelectedEntry={setSelectedEntry}
                          label="Contract address"
                        />
                      </Col>
                      <Col center="xs" className={classes} middle="xs" xs={1}>
                        <Img
                          alt="Scan QR"
                          className={classes.qrCodeBtn}
                          height={20}
                          onClick={() => {
                            openQrModal()
                          }}
                          role="button"
                          src={QRIcon}
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                      Value
                    </Paragraph>
                    <ButtonLink onClick={mutators.setMax} weight="bold">
                      Send max
                    </ButtonLink>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      component={TextField}
                      inputAdornment={{
                        endAdornment: <InputAdornment position="end">{nativeCoin.name}</InputAdornment>,
                      }}
                      name="value"
                      placeholder="Value*"
                      text="Value*"
                      type="text"
                      validate={composeValidators(mustBeFloat, maxValue(ethBalance || '0'), minValue(0))}
                    />
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col>
                    <TextAreaField
                      name="data"
                      placeholder="Data (hex encoded)*"
                      text="Data (hex encoded)*"
                      type="text"
                    />
                  </Col>
                </Row>
                <Paragraph color="disabled" noMargin size="lg" style={{ letterSpacing: '-0.5px' }}>
                  <Switch onChange={() => saveForm(args[2].values)} checked={!isABI} />
                  Use custom data (hex encoded)
                </Paragraph>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} onClick={onClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  className={classes.submitButton}
                  color="primary"
                  data-testid="review-tx-btn"
                  disabled={shouldDisableSubmitButton}
                  minWidth={140}
                  type="submit"
                  variant="contained"
                >
                  Review
                </Button>
              </Row>
              {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={handleScan} />}
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default SendCustomTx
