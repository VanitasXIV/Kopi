import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load all knowledge base files and format them for the AI context
 */
export function loadKnowledgeBase() {
  const knowledgeFiles = [
    'organization-chart.json',
    'shipbob-team.json'
  ];

  let knowledgeContext = '\n\n--- KOPIUS KNOWLEDGE BASE ---\n\n';

  for (const file of knowledgeFiles) {
    try {
      const filePath = path.join(__dirname, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      if (file === 'organization-chart.json') {
        knowledgeContext += formatOrganizationChart(data);
      } else if (file === 'shipbob-team.json') {
        knowledgeContext += formatShipBobTeam(data);
      }
    } catch (error) {
      console.error(`Error loading knowledge file ${file}:`, error.message);
    }
  }

  knowledgeContext += '\n--- END KNOWLEDGE BASE ---\n\n';
  return knowledgeContext;
}

/**
 * Format organization chart data for AI context
 */
function formatOrganizationChart(data) {
  let text = `## ${data.title}\nLast Updated: ${data.lastUpdated}\n\n`;

  const ceo = data.structure.ceo;
  text += `**${ceo.title}**: ${ceo.name} (${ceo.subtitle})\n\n`;
  text += `Reports directly to CEO:\n\n`;

  for (const person of ceo.reports) {
    text += `- **${person.title}** (${person.subtitle}): ${person.name}\n`;
    text += `  ${person.responsibilities}\n\n`;
  }

  return text;
}

/**
 * Format ShipBob team data for AI context
 */
function formatShipBobTeam(data) {
  let text = `## ${data.title}\n`;
  text += `Client: ${data.client}\n`;
  text += `Last Updated: ${data.lastUpdated}\n`;
  text += `Total Members: ${data.totalMembers}\n`;
  text += `Slack Channel: ${data.slackChannel}\n\n`;
  text += `${data.description}\n\n`;
  text += `Team Members:\n`;

  for (const member of data.members) {
    if (member.role) {
      text += `- ${member.name} - ${member.role}\n`;
    } else {
      text += `- ${member.name}\n`;
    }
  }

  text += '\n';
  text += `Format instructions: Present this list with clear sections, group by role, include totals, and be conversational.\n\n`;

  return text;
}

/**
 * Search knowledge base for relevant information
 */
export function searchKnowledge(query) {
  const lowerQuery = query.toLowerCase();

  // Check for ShipBob-specific queries
  const shipbobKeywords = ['shipbob', 'ship bob', 'works on shipbob', 'working on shipbob'];
  if (shipbobKeywords.some(keyword => lowerQuery.includes(keyword))) {
    const filePath = path.join(__dirname, 'shipbob-team.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return '\n\n--- KOPIUS KNOWLEDGE BASE ---\n\n' + formatShipBobTeam(data) + '\n--- END KNOWLEDGE BASE ---\n\n';
  }

  // Check for organization queries
  const orgKeywords = ['organization', 'org chart', 'structure', 'hierarchy', 'ceo', 'cfo', 'cro', 'cpo'];
  if (orgKeywords.some(keyword => lowerQuery.includes(keyword))) {
    const filePath = path.join(__dirname, 'organization-chart.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return '\n\n--- KOPIUS KNOWLEDGE BASE ---\n\n' + formatOrganizationChart(data) + '\n--- END KNOWLEDGE BASE ---\n\n';
  }

  return null;
}
