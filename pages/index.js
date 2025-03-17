import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  let [pollCreatorOn, setPollCreatorOn] = useState(false);
  
  
  return (
    <div className={styles.container}>
      <Head>
        <title>MyPoll</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className='title'>MyPoll</h1>
      


      
    </div>
  )
}
