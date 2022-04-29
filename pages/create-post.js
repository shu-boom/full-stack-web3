import { useState, useRef, useEffect } from 'react' // new
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import {
    contractAddress,
    owner
  } from '../config.js'
  
import Blog from '../artifacts/contracts/Blog.sol/Blog.json'
const client = create('https://ipfs.infura.io:5001/api/v0') // connect the ipfs client. 
// each function for each upload so one for post and one for the photo

const SimpleMDE = dynamic(
    () => import('react-simplemde-editor'),
    { ssr: false }
)
  
const initialState = { title: '', content: '' } // initial post states
/**
 * This components allows post creation
 */
export default function CreatePost(){
    const [post, setPost] = useState(initialState)
    const [image, setImage] = useState(null) //set image for the post. The image is going to sit on the IPFS nodes
    const [loaded, setLoaded] = useState(false) // weather the editor is loaded or not
    const fileRef = useRef(null);
    const {title, content} = post;
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
          setLoaded(true)
        }, 500)
    }, [])


    // on change of function. to set the post state correctly 
    function onChange(e) {
        setPost(()=>({...post, [e.target.name]: e.target.value}))
    }

    // save the post to the IPFS protocol. 
    async function savePostToIpfs() {
        try {
            const added = await client.add(JSON.stringify(post))
            return added.path;
        } catch (error) {
            console.log(error)
        }
    }

    /**
    *  window.ethereum == undefined 
    * 
    * In order to interact with the contract. for transaction we need the signer instead of the provider 
    */
  async function savePost(hash) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, Blog.abi, signer)
      console.log('contract: ', contract)
      try {
        const val = await contract.createPost(post.title, hash)
        console.log('val: ', val)
      } catch (err) {
        console.log('Error: ', err)
      }
    }    
  }

  async function createNewPost() {   
    /* saves post to ipfs then anchors to smart contract */
    if (!title || !content) return
    const hash = await savePostToIpfs()
    await savePost(hash)
    router.push(`/`)
  }

  async function handleFileChange (e) {
    /* upload cover image to ipfs and save hash to state */
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return
    const added = await client.add(uploadedFile)
    setPost(state => ({ ...state, coverImage: added.path }))
    setImage(uploadedFile)
  }

  function triggerOnChange() {
    fileRef.current.click();
  }

  return (
    <div className={container}>
      {
        image && (
          <img className={coverImageStyle} src={URL.createObjectURL(image)} />
        )
      }
      <input
        onChange={onChange}
        name='title'
        placeholder='Give it a title ...'
        value={post.title}
        className={titleStyle}
      />
      <SimpleMDE
        className={mdEditor}
        placeholder="What's on your mind?"
        value={post.content}
        onChange={value => setPost({ ...post, content: value })}
      />
      {
        loaded && (
          <>
            <button
              className={button}
              type='button'
              onClick={createNewPost}
            >Publish</button>
            <button
              onClick={triggerOnChange}
              className={button}
            >Add cover image</button>
          </>
        )
      }
      <input
        id='selectImage'
        className={hiddenInput} 
        type='file'
        onChange={handleFileChange}
        ref={fileRef}
      />
    </div>
  )
}

const hiddenInput = css`
  display: none;
`

const coverImageStyle = css`
  max-width: 800px;
`

const mdEditor = css`
  margin-top: 40px;
`

const titleStyle = css`
  margin-top: 40px;
  border: none;
  outline: none;
  background-color: inherit;
  font-size: 44px;
  font-weight: 600;
  &::placeholder {
    color: #999999;
  }
`

const container = css`
  width: 800px;
  margin: 0 auto;
`

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`
