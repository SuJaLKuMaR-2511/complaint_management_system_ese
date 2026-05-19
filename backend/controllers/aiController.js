const Complaint = require('../models/Complaint');
const fetch = require('node-fetch');

/**
 * Extract first JSON object from AI output safely.
 */
const extractJsonObject = (rawText) => {
  const cleaned = rawText.replace(/```json|```/gi, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('No valid JSON object found in AI response');
  }
};

/**
 * Call OpenRouter AI API with model fallback.
 */
const callOpenRouter = async (prompt) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const models = (process.env.OPENROUTER_MODELS || 'openai/gpt-oss-20b:free,meta-llama/llama-3.3-8b-instruct:free,deepseek/deepseek-chat-v3-0324:free')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);

  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://complaint-management.onrender.com',
          'X-Title': 'AI Complaint Management System'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `Model ${model}: ${errText}`;
        continue;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string') {
        lastError = `Model ${model}: Empty response content`;
        continue;
      }
      return content.trim();
    } catch (err) {
      lastError = `Model ${model}: ${err.message}`;
    }
  }

  throw new Error(`OpenRouter API Error: ${lastError || 'All model attempts failed'}`);
};

/**
 * @route   POST /api/ai/analyze
 * @desc    Analyze a complaint using AI - detect priority, department, summary, auto-response
 * @access  Private
 */
const analyzeComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({ success: false, message: 'complaintId is required' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const prompt = `
You are an AI assistant for a Smart Complaint Management System for a municipal corporation.

Analyze the following complaint and respond ONLY in valid JSON format with these exact keys:
{
  "priority": "Low" | "Medium" | "High" | "Critical",
  "department": "name of the responsible government department",
  "summary": "1-2 sentence summary of the complaint",
  "autoResponse": "a polite, professional auto-response message to send to the complainant"
}

Complaint Details:
- Title: ${complaint.title}
- Category: ${complaint.category}
- Description: ${complaint.description}
- Location: ${complaint.location}

Respond ONLY with the JSON object, no extra text.
`;

    const aiText = await callOpenRouter(prompt);

    let aiResult;
    try {
      aiResult = extractJsonObject(aiText);
    } catch (parseErr) {
      return res.status(500).json({
        success: false,
        message: 'AI returned invalid JSON. Please try again.',
        raw: aiText
      });
    }

    const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
    if (!validPriorities.includes(aiResult.priority)) {
      aiResult.priority = 'Medium';
    }
    aiResult.department = (aiResult.department || 'Municipal Support Desk').toString().trim();
    aiResult.summary = (aiResult.summary || 'Complaint received and reviewed by AI.').toString().trim();
    aiResult.autoResponse = (aiResult.autoResponse || 'Thank you for your complaint. Our team will review and take action shortly.').toString().trim();

    // Save AI analysis to the complaint
    complaint.aiAnalysis = {
      priority: aiResult.priority,
      department: aiResult.department,
      summary: aiResult.summary,
      autoResponse: aiResult.autoResponse
    };
    await complaint.save();

    res.json({
      success: true,
      message: 'AI analysis complete',
      data: {
        complaintId: complaint._id,
        title: complaint.title,
        aiAnalysis: complaint.aiAnalysis
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeComplaint };
