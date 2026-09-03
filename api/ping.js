/**
 * Vercel Serverless Function — Keep Render backend alive.
 *
 * Called every 10 minutes by Vercel Cron (defined in vercel.json).
 * Sends a GET request to the backend health endpoint to prevent
 * Render free tier from spinning down after inactivity.
 */
export default async function handler(req, res) {
  const backendUrl = 'https://pathshashtra-backend-8283.onrender.com';

  try {
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    });

    res.status(200).json({
      ok: true,
      backendStatus: response.status,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(200).json({
      ok: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
