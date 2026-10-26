import OpenAI from 'openai';

/**
 * Practical 13: AI API Integration into a Web Application
 * Responsible AI Service module with OpenAI API integration,
 * rate limiting (Supplementary Problem 2), and graceful degradation.
 */

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.client = null;
    this.rateLimitMap = new Map(); // IP/client -> timestamp of last request
    this.RATE_LIMIT_WINDOW_MS = 20000; // 20 seconds between requests per client

    this.initClient();
  }

  initClient() {
    if (this.apiKey && this.apiKey !== 'your_key_here' && !this.apiKey.startsWith('sk-placeholder')) {
      try {
        this.client = new OpenAI({ apiKey: this.apiKey });
      } catch (err) {
        console.warn('[AI Service] Failed to initialize OpenAI client:', err.message);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  /**
   * Supplementary Problem 2: Rate Limiting
   * Prevents API quota exhaustion by enforcing a cooldown between AI requests.
   */
  checkRateLimit(clientId = 'default') {
    const now = Date.now();
    const lastRequest = this.rateLimitMap.get(clientId);

    if (lastRequest && (now - lastRequest) < this.RATE_LIMIT_WINDOW_MS) {
      const waitSeconds = Math.ceil((this.RATE_LIMIT_WINDOW_MS - (now - lastRequest)) / 1000);
      return {
        allowed: false,
        retryAfter: waitSeconds,
        message: `Rate limit active: Please wait ${waitSeconds}s before requesting another AI description.`
      };
    }

    this.rateLimitMap.set(clientId, now);
    return { allowed: true };
  }

  /**
   * Core AI Generation Method with Graceful Degradation
   * Generates technical description, priority, and category based on task title.
   */
  async generateTaskDescription(title, category = 'General') {
    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new Error('Task title is required to generate description');
    }

    const trimmedTitle = title.trim();

    // 1. If OpenAI client is active and not running in pure unit test mock mode
    if (this.client && process.env.NODE_ENV !== 'test_offline') {
      try {
        const prompt = `You are an AI assistant for a software engineering student portfolio. Given the milestone title: "${trimmedTitle}" (Domain: ${category}), generate a concise, professional technical description (2-3 sentences), suggest a priority ('low', 'medium', or 'high'), and propose an engineering domain category ('AI/ML', 'Web Dev', 'Architecture', 'Cloud/DevOps', or 'General'). Return ONLY valid JSON formatted as: {"description": "...", "priority": "...", "category": "..."}`;

        const completion = await this.client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert technical documentation assistant. Output only raw JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 200
        });

        const rawContent = completion.choices[0]?.message?.content?.trim() || '';
        const cleaned = rawContent.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
          description: parsed.description || `Implement and validate ${trimmedTitle} adhering to enterprise standards.`,
          priority: ['low', 'medium', 'high'].includes(parsed.priority?.toLowerCase()) ? parsed.priority.toLowerCase() : 'medium',
          category: parsed.category || category,
          fallback: false,
          provider: 'OpenAI gpt-4o-mini',
          model: 'gpt-4o-mini',
          generatedAt: new Date().toISOString()
        };
      } catch (err) {
        console.warn(`[AI Service Warning] OpenAI API request failed (${err.message}). Activating graceful degradation fallback.`);
        // Fall through to resilient rule-based generation
      }
    }

    // 2. Resilient Fallback Engine (Graceful Degradation)
    // Ensures zero application crashes and instant feedback even when offline or without active API credits
    const fallbackData = this.synthesizeFallbackDescription(trimmedTitle, category);
    return {
      ...fallbackData,
      fallback: true,
      provider: 'Resilient Rule-Based Synthesizer (Graceful Degradation)',
      message: 'Generated using local fallback engine. Configure OPENAI_API_KEY in .env for live GPT responses.',
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Deterministic Technical Description Synthesizer for High Resilience
   */
  synthesizeFallbackDescription(title, initialCategory) {
    const lower = title.toLowerCase();
    let desc;
    let priority = 'medium';
    let category = initialCategory || 'General';

    if (lower.includes('model') || lower.includes('train') || lower.includes('gesture') || lower.includes('ai') || lower.includes('dataset')) {
      category = 'AI/ML';
      priority = 'high';
      desc = `Architect and evaluate advanced machine learning models for "${title}". Optimize feature pipelines, fine-tune hyperparameters, and validate inference latency metrics.`;
    } else if (lower.includes('docker') || lower.includes('ci') || lower.includes('deploy') || lower.includes('kubernetes') || lower.includes('pipeline')) {
      category = 'Cloud/DevOps';
      priority = 'high';
      desc = `Configure automated containerization and deployment pipelines for "${title}". Establish reproducible build steps, environment parity, and telemetry health checks.`;
    } else if (lower.includes('auth') || lower.includes('jwt') || lower.includes('security') || lower.includes('login') || lower.includes('token')) {
      category = 'Architecture';
      priority = 'high';
      desc = `Implement hardened authentication and cryptographic verification boundaries for "${title}". Enforce principle of least privilege and comprehensive input sanitization.`;
    } else if (lower.includes('cache') || lower.includes('event') || lower.includes('optimize') || lower.includes('database') || lower.includes('mongo')) {
      category = 'Architecture';
      priority = 'medium';
      desc = `Design scalable backend data workflows and caching strategies for "${title}". Maximize throughput, minimize round-trip latencies, and ensure fault tolerance.`;
    } else if (lower.includes('ui') || lower.includes('react') || lower.includes('frontend') || lower.includes('component') || lower.includes('css')) {
      category = 'Web Dev';
      priority = 'medium';
      desc = `Develop responsive, accessible user interface components for "${title}". Ensure seamless client-side state synchronization, rich micro-interactions, and cross-browser consistency.`;
    } else {
      desc = `Execute engineering milestones for "${title}". Design modular architecture, implement robust error-handling boundaries, and conduct end-to-end integration verification.`;
    }

    return { description: desc, priority, category };
  }
}

export const aiService = new AIService();
export default aiService;
