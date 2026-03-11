const express = require('express');
const path = require('path');
const router = express.Router();
const { generateLatex } = require('../utils/generateLatex');
const { compilePdf } = require('../utils/compilePdf');

// Get available templates
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design',
      rating: 4.8,
      preview: null
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant layout',
      rating: 4.6,
      preview: null
    },
    {
      id: 'developer',
      name: 'Developer',
      description: 'Perfect for tech professionals',
      rating: 4.9,
      preview: null
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional professional format',
      rating: 4.5,
      preview: null
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Ideal for research positions',
      rating: 4.7,
      preview: null
    }
  ];
  
  res.json(templates);
});

// Generate resume
router.post('/generate-resume', async (req, res) => {
  try {
    const { templateId, resumeData } = req.body;
    
    // Generate LaTeX content
    const latexContent = await generateLatex(templateId, resumeData);
    
    // Compile to PDF (or HTML fallback)
    const filePath = await compilePdf(latexContent);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(fileName);
    
    let responseUrl;
    if (fileExt === '.pdf') {
      responseUrl = `http://localhost:3002/generated/resume.pdf`;
    } else if (fileExt === '.html') {
      responseUrl = `http://localhost:3002/generated/resume.html`;
    } else {
      responseUrl = `http://localhost:3002/generated/resume.txt`;
    }
    
    res.json({
      success: true,
      pdfUrl: responseUrl,
      downloadUrl: `http://localhost:3002/api/download-resume`,
      latexContent: latexContent,
      fileType: fileExt.substring(1)
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Download resume endpoint
router.get('/download-resume', (req, res) => {
  const fs = require('fs');
  const generatedDir = path.join(__dirname, '../generated');
  
  // Check for PDF first, then HTML, then TXT
  const pdfPath = path.join(generatedDir, 'resume.pdf');
  const htmlPath = path.join(generatedDir, 'resume.html');
  const txtPath = path.join(generatedDir, 'resume.txt');
  
  if (fs.existsSync(pdfPath)) {
    res.download(pdfPath, 'resume.pdf');
  } else if (fs.existsSync(htmlPath)) {
    res.download(htmlPath, 'resume.html');
  } else if (fs.existsSync(txtPath)) {
    res.download(txtPath, 'resume.txt');
  } else {
    res.status(404).json({ error: 'Resume file not found' });
  }
});

module.exports = router;