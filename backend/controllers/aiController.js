const Complaint = require('../models/Complaint');
const fetch = require('node-fetch');

/**
 * Call OpenRouter AI API (free models like mistralai/mistral-7b-instruct)
 */
const callOpenRouter = async (prompt) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://complaint-management.onrender.com',
      'X-Title': 'AI Complaint Management System'
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter API Error: ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
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

    // Parse JSON safely
    let aiResult;
    try {
      // Strip markdown code blocks if present
      const cleaned = aiText.replace(/```json|```/g, '').trim();
      aiResult = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.status(500).json({
        success: false,
        message: 'AI returned invalid JSON. Please try again.',
        raw: aiText
      });
    }

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
