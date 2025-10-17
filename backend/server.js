import { AzureChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const llm = new AzureChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
});


const app = express();


app.post("/ask", express.json(), async (req, res) => {
  const { question } = req.body;

  const aiMsg = await llm.invoke([
    [
      "system",
      "You are a helpful assistant for Kopius employees. Answer the user's question.",
    ],
    ["human", question],
  ]);
    res.json({ answer: aiMsg.content});
  console.log({ aiMsg });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
