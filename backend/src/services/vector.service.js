
const { Pinecone }=require ('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const cohortChatGptIndex=pc.Index('cohort-chat-gpt')


async function createMemory({vectors,messageId,metadata}) {
   try{
     await cohortChatGptIndex.upsert([{
        id: messageId,
        values: vectors,
        metadata,
      },
    ]);

    console.log(`🧠 Vector memory saved for message ${messageId}`);
  } catch (err) {
    console.error("❌ Pinecone upsert error:", err);
  }
}


async function queryMemory({queryVector,limit=5,metadata}) {
   try{
     const data=await cohortChatGptIndex.query({
       vector: queryVector,
      topK: limit,
      filter: metadata || undefined,
      includeMetadata: true,
    });

    return result.matches || [];
  } catch (err) {
    console.error("❌ Pinecone query error:", err);
    return [];
  }
}

module.exports={
    createMemory,
    queryMemory
}
