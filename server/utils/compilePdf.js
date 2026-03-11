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

// Function to create ATS-friendly HTML resume (no colors, no emojis)
async function createFormattedHtmlResume(latexContent, outputPath) {
  try {
    const extractText = (pattern, defaultValue = '') => {
      try {
        const match = latexContent.match(pattern);
        return match ? match[1] || match[0] : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    // Extract basic info
    const name = extractText(/\\scshape\s+([A-Z][a-zA-Z\s]+)/, 'Your Name');
    const email = extractText(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/, '');
    const phone = extractText(/(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/, '');
    const linkedin = extractText(/linkedin[^}]*\}\{\\underline\{([^}]+)\}\}/, '');
    const github = extractText(/github[^}]*\}\{\\underline\{([^}]+)\}\}/, '');

    // Extract sections
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
    const skills = extractSection('Technical Skills');
    const projects = extractSection('Projects');
    const achievements = extractSection('Achievements');

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
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.5;
            color: #000;
            background: #fff;
            padding: 0.5in;
            max-width: 8.5in;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #000;
        }
        
        .header h1 {
            font-size: 24pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        
        .contact-info {
            font-size: 10pt;
            margin-top: 5px;
        }
        
        .contact-info span {
            margin: 0 5px;
        }
        
        .section {
            margin-bottom: 15px;
        }
        
        .section h2 {
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            padding-bottom: 3px;
            border-bottom: 1px solid #000;
        }
        
        .section-content {
            font-size: 10pt;
            line-height: 1.4;
        }
        
        ul {
            margin-left: 20px;
            margin-top: 5px;
        }
        
        li {
            margin-bottom: 3px;
        }
        
        a {
            color: #000;
            text-decoration: underline;
        }
        
        @media print {
            body {
                padding: 0;
            }
            a {
                text-decoration: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${name}</h1>
        <div class="contact-info">
            ${phone ? `${phone}` : ''}
            ${email && phone ? ' | ' : ''}
            ${email ? `<a href="mailto:${email}">${email}</a>` : ''}
            ${linkedin && (email || phone) ? ' | ' : ''}
            ${linkedin ? `<a href="${linkedin}">${linkedin}</a>` : ''}
            ${github && (linkedin || email || phone) ? ' | ' : ''}
            ${github ? `<a href="${github}">${github}</a>` : ''}
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
                .replace(/\\resumeSubHeadingListStart/g, '')
                .replace(/\\resumeSubHeadingListEnd/g, '')
                .replace(/\\resumeSubheading/g, '')
            }
        </div>
    </div>
    ` : ''}

    ${skills ? `
    <div class="section">
        <h2>Technical Skills</h2>
        <div class="section-content">
            ${skills
                .replace(/\\\\/g, '<br>')
                .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
                .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
                .replace(/\\begin\{itemize\}[^]]*\\item/g, '')
                .replace(/\\end\{itemize\}/g, '')
            }
        </div>
    </div>
    ` : ''}

    ${projects ? `
    <div class="section">
        <h2>Projects</h2>
        <div class="section-content">
            ${projects
                .replace(/\\resumeSubHeadingListStart/g, '<ul>')
                .replace(/\\resumeSubHeadingListEnd/g, '</ul>')
                .replace(/\\resumeProjectHeading/g, '<li>')
                .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
                .replace(/\\\\/g, '<br>')
                .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
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
                    .split('\\resumeItem')
                    .filter(item => item && item.trim())
                    .map(item => `<li>${item.replace(/\{|\}/g, '').trim()}</li>`)
                    .join('')
                }
            </ul>
        </div>
    </div>
    ` : ''}
</body>
</html>`;

    await fs.writeFile(outputPath, htmlContent);
  } catch (error) {
    const simpleHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; max-width: 8.5in; margin: 20px auto; padding: 20px; color: #000; }
        h1 { font-size: 18pt; border-bottom: 1px solid #000; }
        pre { font-family: 'Courier New', monospace; font-size: 9pt; white-space: pre-wrap; }
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
    
    const url = 'https://latexonline.cc/compile';
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', Buffer.from(latexContent), {
      filename: 'resume.tex',
      contentType: 'text/plain'
    });
    
    axios.post(url, form, {
      headers: form.getHeaders(),
      responseType: 'arraybuffer',
      timeout: 30000
    })
    .then(async (response) => {
      await fs.writeFile(outputPath, response.data);
      resolve();
    })
    .catch((error) => {
      reject(new Error(`Online compilation failed: ${error.message}`));
    });
  });
}

module.exports = { compilePdf };