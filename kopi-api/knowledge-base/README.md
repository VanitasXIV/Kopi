# Kopius Knowledge Base

This folder contains structured information about Kopius that Kopi uses to answer questions.

## Files

### organization-chart.json
Contains the company organizational structure including:
- Executive leadership team
- Direct reports to CEO
- Roles and responsibilities

### shipbob-team.json
Contains information about the ShipBob client team:
- 31 team members working on ShipBob
- Member names and roles
- Slack channel: team-shipbob
- Last updated: 2025-10-17

## Adding New Knowledge

To add new information to Kopi's knowledge base:

1. **Create a JSON file** with structured data
2. **Add it to the loader.js** in the `knowledgeFiles` array
3. **Create a formatter function** (like `formatOrganizationChart`)
4. **Add keywords** to the `searchKnowledge` function for triggering

## Example: Adding Company Policies

1. Create `company-policies.json`:
```json
{
  "title": "Company Policies",
  "policies": [
    {
      "name": "Remote Work",
      "description": "Employees can work remotely up to 3 days per week...",
      "contact": "HR Department"
    }
  ]
}
```

2. Update `loader.js`:
```javascript
const knowledgeFiles = [
  'organization-chart.json',
  'company-policies.json'  // Add here
];
```

3. Add formatter and keywords in `loader.js`

## Supported Question Types

The knowledge base currently supports:
- Organization structure questions
- People and roles inquiries
- Responsibilities and duties
- Client team information (ShipBob)

Examples:
- "Who is the CEO?"
- "Show me the organization chart"
- "What does the CFO do?"
- "Who reports to Jim Darrin?"
- "Who works on ShipBob?"
- "How many people are on the ShipBob team?"
- "List the ShipBob team members"
