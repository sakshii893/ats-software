const fs = require('fs').promises;
const path = require('path');

async function generateLatex(templateId, resumeData) {
  try {
    // Read the template file
    const templatePath = path.join(__dirname, '../templates', `${templateId}.tex`);
    let template = await fs.readFile(templatePath, 'utf8');
    
    // Replace basic placeholders
    template = template.replace(/<<NAME>>/g, resumeData.name || '');
    template = template.replace(/<<EMAIL>>/g, resumeData.email || '');
    template = template.replace(/<<PHONE>>/g, resumeData.phone || '');
    template = template.replace(/<<LOCATION>>/g, resumeData.location || '');
    template = template.replace(/<<LINKEDIN>>/g, resumeData.linkedin || '');
    template = template.replace(/<<GITHUB>>/g, resumeData.github || '');
    
    // Replace education
    if (resumeData.education) {
      const educationText = `${resumeData.education.college} - ${resumeData.education.degree} (${resumeData.education.cgpa})`;
      template = template.replace(/<<EDUCATION>>/g, educationText);
    }
    
    // Replace skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      const skillsText = resumeData.skills.join(', ');
      template = template.replace(/<<SKILLS>>/g, skillsText);
    }
    
    // Replace projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      let projectsText = '';
      resumeData.projects.forEach(project => {
        projectsText += `\\textbf{${project.title}} \\\\\n`;
        projectsText += `${project.description} \\\\\n`;
        if (project.technologies) {
          projectsText += `\\textit{Technologies: ${project.technologies}} \\\\\n`;
        }
        projectsText += `\\vspace{0.2cm}\n\n`;
      });
      template = template.replace(/<<PROJECTS>>/g, projectsText);
    }
    
    // Replace achievements
    if (resumeData.achievements && resumeData.achievements.length > 0) {
      let achievementsText = '';
      resumeData.achievements.forEach(achievement => {
        achievementsText += `\\item ${achievement}\n`;
      });
      template = template.replace(/<<ACHIEVEMENTS>>/g, achievementsText);
    }
    
    // Replace custom sections
    if (resumeData.customSections && resumeData.customSections.length > 0) {
      let customText = '';
      resumeData.customSections.forEach(section => {
        customText += `\\section{${section.heading}}\n`;
        if (section.subheading) {
          customText += `\\subsection{${section.subheading}}\n`;
        }
        customText += `${section.content}\n\n`;
      });
      template = template.replace(/<<CUSTOM_SECTIONS>>/g, customText);
    }
    
    // Clean up any remaining placeholders
    template = template.replace(/<<[^>]+>>/g, '');
    
    return template;
  } catch (error) {
    throw new Error(`Failed to generate LaTeX: ${error.message}`);
  }
}

module.exports = { generateLatex };