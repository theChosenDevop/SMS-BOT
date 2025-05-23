import express, { Request, Response } from 'express'
import { mastra } from './mastra/index'
import { contextEnrichment } from './mastra/agents/index'
import integration from '../integration.json'
import agentcard from '../agent-card.json'
import africastalking from 'africastalking'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sendChannelReport = process.env.WEBHOOK_URL || 'http://localhost:3000/webhook'

const at = africastalking({
  apiKey: process.env.AFRICASTALKING_API_KEY!,
  username: process.env.AFRICASTALKING_USERNAME!,
})

const sms = at.SMS



app.get('/.well-known/a2a/agent-card.json', (req: Request, res: Response) => {
  // res.send(agentcard)
  res.send(integration)
})
// app.get('/integration.json', (req: Request, res: Response) => {
//   res.send(integration)
// })

interface TelexIntRequest {
  jsonrpc: '2.0';
  method: string;
  params: {
    message: string;
    tone: string;
    recipient: string;
    send_time: string;
    test_mode: boolean;
  };
  id: string | number;
}

app.post('/webhook', async (req: Request, res: Response) => {
  const { jsonrpc, method, params, id } = req.body as TelexIntRequest;
  const {message: Message, tone: Message_Tone,recipient: Recipient_Phone_Number, send_time: Send_Time, test_mode: Test_Mode } = params;
  console.log('Received integration data:', Message)
  console.log(mastra.getLogger().info('Hello from Mastra!'));
  try {

    if (method !== 'contextEnrichment') {
       res.status(400).json({ error: 'Invalid method' });
       return;
    }
    const agent = await contextEnrichment.generate([{ role: 'user', content: `Reformat this message to be sent as an SMS in a ${Message_Tone} tone: "${Message}"` }])
    console.log("Agent response: ", agent.text);
    const summary = agent.text;

    const smsResponse = await sms.send({
      to: [Recipient_Phone_Number],
      from: process.env.AFRICASTALKING_SENDER_ID || 'Telex',
      message: summary,
    })

    console.log('SMS sent:', smsResponse);

    res.status(200).json({ summary, smsResponse });
  } catch (error) {
    console.error("Error in agent generation:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`http://localhost:${PORT}`);
})
