const fs = require('fs').promises;
const { exec } = require('child_process');
const path = require('path');
const { promisify } = require('util');
const https = require('https');

const execAsync = promisify(exec);

async function compilePdf(latexContent) {
  try {
    const generatedDir = path.join(__dirname, '../generated');
    const texFilePath = path.join(generatedDir, 'resume.tex');
    const pdfFilePath = path.join(generatedDir, 'resume.pdf');
    
    // Ensure generated directory exists
    try {
      await fs.access(generatedDir);
    } catch {
      await fs.mkdir(generatedDir, { recursive: true });
    }
    
    // Write LaTeX content to file
    await fs.writeFile(texFilePath, latexContent);
    
    // Try online LaTeX compilation first
    try {
      console.log('Attempting online LaTeX compilation...');
      await compileOnline(latexContent, pdfFilePath);
      console.log('PDF generated successfully using online service');
      return pdfFilePath;
    } catch (onlineError) {
      console.log('Online compilation failed, trying local pdflatex...');
      
      // Try local pdflatex as fallback
      try {
        const command = `cd "${generatedDir}" && pdflatex -interaction=nonstopmode resume.tex`;
        await execAsync(command);
        await fs.access(pdfFilePath);
        console.log('PDF generated successfully using local pdflatex');
        return pdfFilePath;
      } catch (localError) {
        // If both fail, create formatted HTML resume
        console.warn('Both online and local compilation failed, creating formatted HTML resume');
        const htmlPath = path.join(generatedDir, 'resume.html');
        await createFormattedHtmlResume(latexContent, htmlPath);
        return htmlPath;
      }
    }
  } catch (error) {
    throw new Error(`Failed to compile PDF: ${error.message}`);
  }
}

// Function to create a properly formatted HTML resume from LaTeX
async function createFormattedHtmlResume(latexContent, outputPath) {
  try {
    // Simple extraction with safe defaults
    const extractText = (pattern, defaultValue = '') => {
      try {
        const match = latexContent.match(pattern);
        return match ? match[1] || match[0] : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    // Extract basic info
    const name = extractText(/\\bfseries[^}]*\s+([A-Z][a-zA-Z\s]+)/, 'Your Name');
    const email = extractText(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/, '');
    const phone = extractText(/(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/, '');
    const linkedin = extractText(/LinkedIn[:\s]+([^\s\\}|]+)/, '');
    const github = extractText(/GitHub[:\s]+([^\s\\}|]+)/, '');

    // Extract sections - simple approach
    const extractSection = (sectionName) => {
      try {
        const regex = new RegExp(`\\\\section\\{${sectionName}\\}([^]*?)(?=\\\\section|\\\\end\\{document\\}|$)`, 'i');
        const match = latexContent.match(regex);
        if (match && match[1]) {
          return match[1].trim();
        }
        return '';
      } catch {
        return '';
      }
    };

    const education = extractSection('Education');
    const skills = extractSection('Technical Skills|Skills|Technical Stack');
    const projects = extractSection('Projects|Projects & Development|Research & Projects');
    const achievements = extractSection('Achievements|Achievements & Publications');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .resume-container {
            max-width: 850px;
            margin: 0 auto;
            background: white;
            padding: 40px 50px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #22c55e;
        }
        
        .header h1 {
            font-size: 2.5em;
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .contact-info {
            font-size: 0.95em;
            color: #555;
            margin-top: 10px;
        }
        
        .contact-info span {
            margin: 0 10px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section h2 {
            font-size: 1.4em;
            color: #22c55e;
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 2px solid #22c55e;
            font-weight: 600;
        }
        
        .section-content {
            margin-left: 10px;
            color: #444;
            line-height: 1.8;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        
        .skill-tag {
            background: #e8f5e9;
            color: #22c55e;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
        }
        
        ul {
            margin-left: 20px;
            margin-top: 8px;
        }
        
        li {
            margin-bottom: 5px;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .resume-container {
                box-shadow: none;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="header">
            <h1>${name}</h1>
            <div class="contact-info">
                ${email ? `<span>✉ ${email}</span>` : ''}
                ${phone ? `<span>📞 ${phone}</span>` : ''}
                ${linkedin ? `<span>🔗 ${linkedin}</span>` : ''}
                ${github ? `<span>💻 ${github}</span>` : ''}
            </div>
        </div>

        ${education ? `
        <div class="section">
            <h2>Education</h2>
            <div class="section-content">
                ${education
                    .replace(/\\\\/g, '<br>')
                    .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
                    .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
                    .replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>')
                }
            </div>
        </div>
        ` : ''}

        ${skills ? `
        <div class="section">
            <h2>Skills</h2>
            <div class="section-content">
                ${skills
                    .replace(/\\\\/g, '<br>')
                    .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
                    .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
                    .replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>')
                }
            </div>
        </div>
        ` : ''}

        ${projects ? `
        <div class="section">
            <h2>Projects</h2>
            <div class="section-content">
                ${projects
                    .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
                    .replace(/\\\\/g, '<br>')
                    .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
                    .replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>')
                    .replace(/\\vspace\{[^}]+\}/g, '<br>')
                }
            </div>
        </div>
        ` : ''}

        ${achievements ? `
        <div class="section">
            <h2>Achievements</h2>
            <div class="section-content">
                <ul>
                    ${achievements
                        .split('\\item')
                        .filter(item => item && item.trim())
                        .map(item => `<li>${item.trim()}</li>`)
                        .join('')
                    }
                </ul>
            </div>
        </div>
        ` : ''}
    </div>
</body>
</html>`;

    await fs.writeFile(outputPath, htmlContent);
  } catch (error) {
    // If parsing fails, create a simple fallback
    const simpleHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
        h1 { color: #22c55e; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>Resume Generated</h1>
    <p>Your resume has been generated. LaTeX content:</p>
    <pre>${latexContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
    await fs.writeFile(outputPath, simpleHtml);
  }
}

// Function to compile LaTeX online using LaTeX.Online API
function compileOnline(latexContent, outputPath) {
  return new Promise((resolve, reject) => {
    const axios = require('axios');
    
    // Use LaTeX.Online API
    const url = 'https://latexonline.cc/compile';
    
    // Create form data
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', Buffer.from(latexContent), {
      filename: 'resume.tex',
      contentType: 'text/plain'
    });
    
    // Make request
    axios.post(url, form, {
      headers: form.getHeaders(),
      responseType: 'arraybuffer',
      timeout: 30000
    })
    .then(async (response) => {
      // Save PDF
      await fs.writeFile(outputPath, response.data);
      resolve();
    })
    .catch((error) => {
      reject(new Error(`Online compilation failed: ${error.message}`));
    });
  });
}

module.exports = { compilePdf };