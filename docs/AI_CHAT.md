# AI Chat Configuration

## Environment Variables

Add these to your `.env.local` and Vercel Environment Variables:

```env
# Required for AI functionality
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Analytics (for monitoring usage)
# OPENAI_ORG_ID=org-xxxxxxxxx
```

## API Endpoint

**POST** `/api/chat`

### Request Body

```json
{
  "message": "I need a photographer for a wedding in Tel Aviv",
  "language": "en",  // "en" | "ru" | "he"
  "conversationHistory": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous response" }
  ],
  "context": {
    "eventType": "Wedding",
    "city": "Tel Aviv"
  }
}
```

### Response

```json
{
  "response": "I found some amazing photographers for you! ✨",
  "vendors": [/* array of vendor objects */],
  "extracted": {
    "category": "Photographer",
    "city": "Tel Aviv",
    "eventType": "Wedding"
  },
  "suggestions": ["Find a DJ", "Find a videographer"]
}
```

## Rate Limits

- **20 requests per minute** per IP address
- Returns `429 Too Many Requests` when exceeded
- Headers include `X-RateLimit-Remaining`

## Model Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Model | `gpt-4o-mini` | 15x cheaper than gpt-4o, fast responses |
| Max Tokens | 300 | Concise responses |
| Temperature | 0.7 | Balanced creativity |
| Timeout | 10 seconds | Prevents hanging |

## Cost Estimation

| Usage | Cost (approx) |
|-------|---------------|
| 1,000 messages/day | ~$0.50 |
| 10,000 messages/day | ~$5.00 |
| 100,000 messages/day | ~$50.00 |

## Fallback Behavior

If `OPENAI_API_KEY` is not set:
- Uses keyword-based extraction
- Returns pre-defined responses in user's language
- Still finds and returns relevant vendors

## Supported Languages

- **English** (en) - Default
- **Russian** (ru) - Полная поддержка
- **Hebrew** (he) - תמיכה מלאה

## Extracted Entities

The AI extracts these from messages:
- **Category**: Photographer, DJ, Singer, etc.
- **City**: Tel Aviv, Haifa, Jerusalem, etc.
- **Event Type**: Wedding, Bar Mitzvah, Birthday, etc.
- **Budget**: e.g., "3000 NIS"
- **Guest Count**: e.g., "100 guests"
- **Date**: Various formats supported

## Monitoring (Vercel)

Check in Vercel Dashboard:
- **Functions** → `/api/chat` → See invocations and errors
- **Logs** → Filter by "OpenAI" for API errors
- **Analytics** → Monitor response times

## Troubleshooting

### "OpenAI API timeout"
- Network issues between Vercel and OpenAI
- High OpenAI API load
- Fallback response returned automatically

### No vendors found
- AI suggests broadening search
- Check if vendors exist in database

### Rate limit hit
- User exceeded 20 requests/minute
- Consider implementing user-based limits for authenticated users
