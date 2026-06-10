/**
 * Typed validation middleware for parallel, asynchronous data payloads
 */

export const validatePayload = (req, res, next) => {
  const payload = req.body;
  
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ error: 'Payload must be a JSON object.' });
  }

  // Example typing check: requiring an 'eventName' string and 'value' number
  if (!payload.eventName || typeof payload.eventName !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "eventName". Must be a string.' });
  }

  if (payload.value !== undefined && typeof payload.value !== 'number') {
    return res.status(400).json({ error: 'Invalid "value". Must be a number if provided.' });
  }

  // Valid payload, proceed to next middleware/handler
  next();
};

export const validateHealthCheckShape = (req, res, next) => {
  const payload = req.body;
  
  // Explicit structural health check validation
  if (!payload || payload.type !== 'health_ping') {
    return res.status(400).json({ error: 'Invalid health check payload. Must contain type: "health_ping"' });
  }
  
  next();
};
