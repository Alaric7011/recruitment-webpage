// ============================================================
// ROLE_FORMS — role-specific extra application questions
// Common fields (name, email, etc.) are appended automatically.
// ============================================================
export const ROLE_FORMS = {
  1: { // Growth Intern
    extras: [
      { id: 'growth_channel',  label: 'Which growth channel do you know best?', type: 'select',
        options: ['Social Media', 'SEO/Content', 'Paid Ads', 'Email Marketing', 'Community', 'Referrals', 'Other'], required: true },
      { id: 'analytics_tools', label: "Analytics tools you've used", type: 'text',
        placeholder: 'e.g. Google Analytics, Mixpanel, Meta Ads…', required: false },
      { id: 'growth_project',  label: "Describe a growth project you've worked on or designed", type: 'textarea',
        placeholder: 'What was the goal, what did you do, what was the result?', required: true },
      { id: 'availability_hrs', label: 'Hours available per week', type: 'select',
        options: ['10–15 hrs', '15–20 hrs', '20–30 hrs', '30+ hrs (full-time)'], required: true },
    ]
  },
  2: { // Founder's Office Intern
    extras: [
      { id: 'startup_interest',     label: 'What aspect of startups excites you most?', type: 'select',
        options: ['Product building', 'Fundraising', 'GTM & growth', 'Operations', 'Strategy', 'All of the above'], required: true },
      { id: 'organised_example',    label: 'Give an example of how you managed a complex project or task', type: 'textarea',
        placeholder: 'Tools used, how you prioritised, what the outcome was…', required: true },
      { id: 'tools_used',           label: 'Productivity & collaboration tools you use', type: 'text',
        placeholder: 'e.g. Notion, Slack, Asana, Figma…', required: false },
      { id: 'why_founders_office',  label: "Why Founder's Office specifically?", type: 'textarea',
        placeholder: 'What draws you to this role vs. other internships?', required: true },
    ]
  },
  3: { // Community Manager
    extras: [
      { id: 'community_experience', label: "Describe a community you've built or managed", type: 'textarea',
        placeholder: 'Platform, size, what you did to grow/engage it…', required: true },
      { id: 'community_size',       label: "Largest community you've managed", type: 'select',
        options: ['< 100 members', '100–500 members', '500–2000 members', '2000–10k members', '10k+ members'], required: true },
      { id: 'conflict_example',     label: 'How have you handled a difficult community situation or conflict?', type: 'textarea',
        placeholder: 'Situation, your approach, outcome…', required: true },
      { id: 'notice_period',        label: 'Notice period / when can you start?', type: 'text',
        placeholder: 'e.g. Immediate, 2 weeks, 1 month…', required: true },
      { id: 'current_ctc',          label: 'Current CTC (if applicable)', type: 'text',
        placeholder: 'e.g. ₹18 LPA or "Fresher"', required: false },
    ]
  },
  4: { // Content Creator
    extras: [
      { id: 'content_formats',  label: 'Content formats you create (select all that apply)', type: 'select',
        options: ['Long-form articles', 'LinkedIn posts', 'Short-form video scripts', 'Newsletters', 'Podcasts', 'Infographics', 'Twitter/X threads'], required: true },
      { id: 'portfolio_link',   label: 'Portfolio / best work link', type: 'text',
        placeholder: 'LinkedIn, personal blog, Google Drive folder…', required: true },
      { id: 'sample_hook',      label: 'Write a hook for a LinkedIn post about why 90% of startups fail', type: 'textarea',
        placeholder: 'Just the opening line(s) — show us your voice!', required: true },
      { id: 'availability_hrs', label: 'Hours available per week', type: 'select',
        options: ['10–15 hrs', '15–20 hrs', '20–30 hrs', '30+ hrs (full-time)'], required: true },
    ]
  },
  5: { // Full Stack Developer Intern
    extras: [
      { id: 'github_link',       label: 'GitHub profile URL', type: 'text',
        placeholder: 'https://github.com/yourhandle', required: true },
      { id: 'tech_stack',        label: 'Primary tech stack', type: 'text',
        placeholder: 'e.g. React, Node.js, PostgreSQL, TypeScript…', required: true },
      { id: 'shipped_project',   label: "Describe a project you've shipped end-to-end", type: 'textarea',
        placeholder: 'What it does, tech used, your role, link if available…', required: true },
      { id: 'project_link',      label: 'Live project / portfolio link (optional)', type: 'text',
        placeholder: 'https://…', required: false },
      { id: 'experience_years',  label: 'Years of coding experience', type: 'select',
        options: ['< 1 year', '1–2 years', '2–3 years', '3+ years'], required: true },
    ]
  },
  6: { // AI Automation Intern
    extras: [
      { id: 'ai_tools',          label: "AI/automation tools you've worked with", type: 'text',
        placeholder: 'e.g. OpenAI API, Make, n8n, LangChain, Claude…', required: true },
      { id: 'automation_built',  label: "Describe an automation or AI workflow you've built", type: 'textarea',
        placeholder: 'Problem it solved, tools used, time/effort saved…', required: true },
      { id: 'primary_language',  label: 'Primary programming language', type: 'select',
        options: ['Python', 'JavaScript/TypeScript', 'Both Python & JS', 'Other'], required: true },
      { id: 'llm_experience',    label: 'Describe your experience with LLMs / AI APIs', type: 'textarea',
        placeholder: "Projects, use cases, APIs you've called…", required: false },
    ]
  },
  7: { // Startup Research Analyst
    extras: [
      { id: 'research_topic',    label: 'Write a 3–5 line insight on a startup trend you find interesting right now', type: 'textarea',
        placeholder: 'Show us how you think about the ecosystem…', required: true },
      { id: 'research_tools',    label: 'Research tools / sources you rely on', type: 'text',
        placeholder: 'e.g. Tracxn, Crunchbase, DRHP filings, CB Insights, Substack…', required: false },
      { id: 'data_viz_exp',      label: 'Experience with data visualisation', type: 'select',
        options: ['None yet', 'Basic charts (Google Sheets/Excel)', 'Tableau / Power BI', 'Python (matplotlib/plotly)', 'Other'], required: true },
      { id: 'availability_hrs',  label: 'Hours available per week', type: 'select',
        options: ['10–15 hrs', '15–20 hrs', '20–30 hrs', '30+ hrs (full-time)'], required: true },
    ]
  }
};
