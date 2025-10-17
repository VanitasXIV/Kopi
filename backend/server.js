import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { formatDocumentsAsString } from "langchain/util/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

// Load environment variables right at the start
dotenv.config();

// This function handles the one-time setup of our RAG chain
const createRAGChain = async () => {
    console.log("Setting up the RAG chain...");

    // 1. Configure the models and embeddings for Azure
    const llm = new AzureChatOpenAI({
        azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_CHAT_DEPLOYMENT_NAME,
        temperature: 0,
    });

    const embeddings = new AzureOpenAIEmbeddings({
        azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
    });

    // 2. Load all documents from the 'documents' folder
    console.log("Loading all PDFs from the documents folder...");
    const directoryPath = path.join(process.cwd(), "documentos"); // Using "documents"
    const fileNames = fs.readdirSync(directoryPath).filter(file => file.endsWith('.pdf'));

    const loaders = fileNames.map(fileName =>
        new PDFLoader(path.join(directoryPath, fileName))
    );

    const loadedDocs = await Promise.all(loaders.map(loader => loader.load()));
    const allDocs = loadedDocs.flat();

    console.log(`Loaded ${allDocs.length} pages from ${fileNames.length} PDF files.`);

    // 3. Split the combined documents into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(allDocs);

    // 4. Create the vector store and retriever
    console.log("Creating vector store from all documents...");
    // 👇 CORRECTED: Using MemoryVectorStore as imported
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    const retriever = vectorStore.asRetriever();

    // 5. Create the prompt template
    const prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful assistant for Kopius employees. 
    Answer the following question based only on the provided context.
    If you don't know the answer, just say that you don't know in a kind and corporative way.
    In case you need to provide an answer, make sure to do so in Spanish.
    The answer should be concise and to the point, but thankful with the final user.
    The answer should also include relevant emojis to make it more engaging.
    If you know the answer, and it is not related to a greeting, do not greet them and just give a reply.
    When you answer, try to don't repeat the emojis used in the question
    If the final user asks for a joke, make sure to provide a funny and light-hearted one.
    If the final user says goodbye, respond with a friendly farewell message, emojis, and remember to mention the name of the people team "Team 3 Kopius 2025".

    Context:
    {context}

    Question:
    {question}
  `);

    // 6. Build the RAG chain
const retrievalChain = RunnableSequence.from([
    (input) => input.question, 
    retriever,                 
    formatDocumentsAsString,    
  ]);

  // Now, create the main chain that uses the retrievalChain for context.
  const chain = RunnableSequence.from([
    {
      context: retrievalChain,            // Use the new retrieval chain for the context.
      question: (input) => input.question, // Pass the original question through.
    },
    prompt,
    llm,
    new StringOutputParser(),
  ]);

    console.log("RAG chain setup complete! ✅");
    return chain;
};


const startServer = async () => {
    const ragChain = await createRAGChain();

    const app = express();
    app.use(cors());

    app.post("/ask", express.json(), async (req, res) => {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required." });
        }

        try {
            console.log(`Invoking chain with question: "${question}"`);
            const answer = await ragChain.invoke({ question });
            res.json({ answer });
        } catch (error) {
            console.error("Error invoking the RAG chain:", error);
            res.status(500).json({ error: "Failed to get an answer." });
        }
    });

    app.listen(3000, () => {
        console.log("Server is running on port 3000 and ready to answer questions!");
    });
};

startServer();