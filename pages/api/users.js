// Pretty much does nothing other than return a set of documents
// no optimization or caching. 

import {MongoClient} from 'mongodb'

export const createDBClient = () => {
  const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, { useUnifiedTopology: true })
  return client
}


export default async (req, res) => {
  // create a client
  const timings = {
    startTime: Date.now()
  }
  const client = createDBClient()
  timings['clientCreated'] = Date.now()

  try {
    await client.connect()
    timings['clientConnected'] = Date.now()
    
    const shops = await client.db('shopify-app').collection('shops').find().toArray()
    timings['shopsData'] = Date.now()
    
    // listDatabases(client)
    return res.status(200).json({timings, shops})
    

  } catch (error) {
    return res.status(500).json({message: error.message})
  } finally {
    await client.close();
  }
}
