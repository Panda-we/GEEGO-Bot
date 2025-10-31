// Import the Pinecone library
// ✅ Import the Pinecone client
const { Pinecone }=require ('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding
// ✅ Connect to the index created in your Pinecone dashboard
const cohortChatGptIndex=pc.Index('cohort-chat-gpt')


/**
 * Store message embeddings (vector memory) in Pinecone
 * @param {Object} param0
 * @param {number[]} param0.vectors - The embedding values
 * @param {string} param0.messageId - Unique message identifier
 * @param {Object} param0.metadata - Metadata like userId, chatId, etc.
 */
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

/**
 * Query similar memories (semantic search)
 * @param {Object} param0
 * @param {number[]} param0.queryVector - The embedding vector to search with
 * @param {number} [param0.limit=5] - Number of top results to return
 * @param {Object} [param0.metadata] - Optional metadata filters
 * @returns {Promise<Array>} - Matching vectors with metadata
 */
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
