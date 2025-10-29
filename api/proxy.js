export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Used by OpenAI to validate the endpoint
    return res.status(200).json({ status: 'ok', message: 'GPT action endpoint ready' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const makeWebhookUrl = 'https://hook.eu2.make.com/dm34sewci9xme214l9coxtsuuq0o9gyi';

    const forwardRes = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!forwardRes.ok) {
      const errorText = await forwardRes.text();
      console.error('Make webhook error:', errorText);
      return res.status(502).json({ error: 'Failed to forward to Make webhook' });
    }

    res.status(200).json({ status: 'success', message: 'Task sent to Make webhook' });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
