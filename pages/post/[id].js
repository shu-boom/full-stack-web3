import ReactMarkdown from 'react-markdown'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import { AccountContext } from '../../context'

import {
    contractAddress,
    owner
  } from '../../config'
import Blog from '../../artifacts/contracts/Blog.sol/Blog.json'
const ipfsURI = 'https://ipfs.io/ipfs'


export default function Post({ post }) {
    // each post is passed here
    const account  = useContext(AccountContext)
    const router = useRouter()
    const {id} = router.query

    if(router.isFallback) {
        return <div>Loading...</div>
    }

    return (
        <div>
        {
        post && (
          <div className={container}>
            {
              /* if the owner is the user, render an edit button */
              owner === account && (
                <div className={editPost}>
                  <Link href={`/edit-post/${id}`}> 
                    <a>
                      Edit post
                    </a>
                  </Link>
                </div>
              )
            }
            {
              /* if the post has a cover image, render it */
              post.coverImage && (
                <img
                  src={post.coverImage}
                  className={coverImageStyle}
                />
              )
            }
            <h1>{post.title}</h1>
            <div className={contentContainer}>
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        )
      }
        </div>
    )


}

export async function getStaticPaths() {
  // fetch all the blog post here because that is static data 
  let provider
  if (process.env.ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider()
  } else if (process.env.ENVIRONMENT === 'testnet') {
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
  } else {
    provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
  }

  const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
  const data = await contract.fetchPosts()

  // specify an id to match the paths
  const paths = data.map(d=> ({params: {id: d[2]}}))
  return {
      paths, 
      fallback: true
  }
}


// for each hash get the data from the ipfs and get the URI. 
export async function getStaticProps({ params }) {
    const {id} = params // get the ID 
    const ipfsUrl = `${ipfsURI}/${id}` //get the IPFS url 

    const response  = await fetch(ipfsUrl) //fetch the response 

    const data  = await response.json() // get the response. Remember that the image is stored separatly on the ipfs and the hash is added here 

    if(data.coverImage) { // if a hash is present convert it to the URI
        let coverImage = `${ipfsURI}/${data.coverImage}`
        data.coverImage = coverImage
    }

    return {
        props: {
          post: data
        }
    }
}


const editPost = css`
  margin: 20px 0px;
`

const coverImageStyle = css`
  width: 900px;
`

const container = css`
  width: 900px;
  margin: 0 auto;
`

const contentContainer = css`
  margin-top: 60px;
  padding: 0px 40px;
  border-left: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
  & img {
    max-width: 900px;
  }
`