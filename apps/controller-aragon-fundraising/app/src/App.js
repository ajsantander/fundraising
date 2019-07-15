import React from 'react'
import { useApi } from '@aragon/api-react'
import { AppView, Bar, Button, Main, SyncIndicator, TabBar } from '@aragon/ui'
import AppHeader from './components/AppHeader/AppHeader'
import NewOrderSidePanel from './components/NewOrderSidePanel'
import Reserves from './screens/Reserves'
import Orders from './screens/Orders'
import Overview from './screens/Overview'

import { AppLogicProvider, useAppLogic } from './app-logic'

const tabs = ['Overview', 'Orders', 'Reserve Settings']

const App = () => {
  const { orderPanel, orderAmount, tokenAmount, token, tabIndex, isSyncing } = useAppLogic()
  const api = useApi()

  const handlePlaceOrder = async (collateralTokenAddress, amount, isBuyOrder) => {
    // TODO: add error handling on failed tx, check token balances
    if (isBuyOrder) {
      console.log(`its a buy order where token: ${collateralTokenAddress}, amount: ${amount}`)
      api.createBuyOrder(collateralTokenAddress, amount).toPromise()
    } else {
      console.log(`its a sell order where token: ${collateralTokenAddress}, amount: ${amount}`)
      api.createSellOrder(collateralTokenAddress, amount).toPromise()
    }
  }

  const handleTokenTapUpdate = async tapAmount => {
    api
      .updateTokenTap(token, tapAmount)
      .toPromise()
      .catch(err => console.error('You do not have permissions to update this value: ', err))
  }

  return (
    <div css="min-width: 320px">
      <Main assetsUrl="./">
        <SyncIndicator visible={isSyncing} />
        <AppView>
          <AppHeader
            heading="Fundraising"
            action={
              <Button mode="strong" label="New Order" onClick={() => orderPanel.set(true)}>
                New Order
              </Button>
            }
          />
          <Bar>
            <TabBar selected={tabIndex.current} onChange={tabIndex.set} items={tabs} />
          </Bar>
          {tabIndex.current === 0 && <Overview />}
          {tabIndex.current === 1 && <Orders />}
          {tabIndex.current === 2 && <Reserves updateTokenTap={handleTokenTapUpdate} />}
        </AppView>
        <NewOrderSidePanel
          orderAmount={orderAmount.current}
          tokenAmount={tokenAmount.current}
          token={token.current}
          price={300.0}
          opened={orderPanel.current}
          onClose={() => orderPanel.set(false)}
          onSubmit={handlePlaceOrder}
        />
      </Main>
    </div>
  )
}

export default () => (
  <AppLogicProvider>
    <App />
  </AppLogicProvider>
)
