import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
export let polls = [];
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
