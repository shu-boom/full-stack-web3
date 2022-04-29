import '../styles/globals.css' 
import { useState } from 'react'
import Link from 'next/link'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { AccountContext } from '../context.js'
import { owner } from '../config'
import 'easymde/dist/easymde.min.css'
/**
 * This is the main component of this application. 
 * The CMS application works with an account. Remember we even build an account context. 
 * This UI stores the account inside a state variable of the main component and this account is passed down the component tree
 * In order to connect to a wallet, we need the web3Modal library. 
 */

function App({Component, pageProps}){
  const [account, setAccount] = useState(null) // set the state 
  
  /**
   * get the web3 instance by using the walletconnect provieder. 
   * Ethereum apps only work with accounts. Having an account is necessary to interact. This is solved by the web3modal
   * which act as a bridge between the wallet and the dapp. 
   * 
   * The dapp is located on the ethereum blockchain and we use Infura to talk to the ethereum blockchain 
   * Therefore, we instantiate the web3modal with our projectid and use WalletConnect as our Web3 Provider
   */
  async function getWeb3Modal(){
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions:{
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "7019baad8dea4210b892c52f5eb604f7"
          }
        }
      }
    })
    return web3Modal;
  }

  /**
   * This is the actual connection to the provider and returning an account from the wallet. 
   * Web3Modal is creagted using the new Web3Modal
   * 
   * The web3Provider uses the connection to get the provider. The provider is the wallet and it contains the accounts.    * 
   */
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal(); // get the web3 modal 
      const connection = await web3Modal.connect(); // connect to the web3 wallet software
      const provider = new ethers.providers.Web3Provider(connection); // use the wrapper to wrap the web3connectionprovider to work with ether
      const accounts = await provider.listAccounts(); // since web3provider inherits from jsonrpc provider it has a list of accounts 
      setAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <nav className={nav}>
        <div className={header}>
        <Link href="/">
              <a>
                <img
                  src='/logo.svg'
                  alt="React Logo"
                  style={{ width: '50px' }}
                />
              </a>
            </Link>
        <Link href="/">
              <a>
                <div className={titleContainer}>
                  <h2 className={title}>Full Stack</h2>
                  <p className={description}>WEB3</p>
                </div>
              </a>
        </Link>
        {
              !account && (
                <div className={buttonContainer}>
                  <button className={buttonStyle} onClick={connect}>Connect</button>
                </div>
              )
        }
        {
              account && <p className={accountInfo}>{account}</p>
        }
        </div>
        <div className={linkContainer}>
            <Link href="/" >
              <a className={link}>
                Home
              </a>
            </Link>
            {
              /* if the signed in user is the contract owner, we */
              /* show the nav link to create a new post */
              (account === owner) && (
                <Link href="/create-post">
                  <a className={link}>
                    Create Post
                  </a>
                </Link>
              )
            }
        </div>
      </nav>
      <div>
        <AccountContext.Provider value={account}>
          <Component {...pageProps} connect={connect}></Component>
        </AccountContext.Provider>
      </div>
    </div>
  )
}

const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
`

const container = css`
  padding: 40px;
`

const linkContainer = css`
  padding: 30px 60px;
  background-color: #fafafa;
`

const nav = css`
  background-color: white;
`

const header = css`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, .075);
  padding: 20px 30px;
`

const description = css`
  margin: 0;
  color: #999999;
`

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`

const title = css`
  margin-left: 30px;
  font-weight: 500;
  margin: 0;
`

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

const buttonStyle = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 18px;
  padding: 16px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`

const link = css`
  margin: 0px 40px 0px 0px;
  font-size: 16px;
  font-weight: 400;
`
export default App;