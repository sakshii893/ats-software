import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Eye, Code, ArrowLeft } from 'lucide-react'

function Preview({ generatedResume }) {
  const navigate = useNavigate()
  const [showLatex, setShowLatex] = useState(false)

  if (!generatedResume) {
    navigate('/form')
    return null
  }

  const handleDownload = async () => {
    try {
      // Use the download endpoint if available
      const downloadUrl = generatedResume.downloadUrl || generatedResume.pdfUrl;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Resume is Ready!
        </h2>
        <p className="text-gray-600">
          Preview your generated resume and download the PDF
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/form')}
          className="flex items-center gap-2 btn-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Edit
        </button>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 btn-primary"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>

        <button
          onClick={() => setShowLatex(!showLatex)}
          className="flex items-center gap-2 btn-secondary"
        >
          <Code className="w-4 h-4" />
          {showLatex ? 'Hide' : 'Show'} LaTeX Code
        </button>
      </div>

      {/* Resume Preview */}
      <div className="card">
        {showLatex ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Generated LaTeX Code
            </h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              {generatedResume.latexContent}
            </pre>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resume Preview
            </h3>
            {generatedResume.pdfUrl ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {generatedResume.fileType === 'pdf' ? (
                  <iframe
                    src={generatedResume.pdfUrl}
                    className="w-full h-96"
                    title="Resume Preview"
                  />
                ) : generatedResume.fileType === 'html' ? (
                  <iframe
                    src={generatedResume.pdfUrl}
                    className="w-full h-96"
                    title="Resume Preview"
                  />
                ) : (
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <p className="text-gray-600 mb-4">
                      Resume generated successfully! pdflatex not available for PDF generation.
                    </p>
                    <a 
                      href={generatedResume.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-block"
                    >
                      View Generated File
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  PDF preview not available. Please download to view your resume.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-parrot-green rounded-full flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Resume Generated Successfully!
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Your professional LaTeX resume has been generated and is ready for download.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">What's Next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <Download className="w-8 h-8 text-parrot-green mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Download</h4>
            <p className="text-sm text-gray-600">Save your resume as PDF</p>
          </div>
          <div className="card text-center">
            <Eye className="w-8 h-8 text-parrot-green mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Review</h4>
            <p className="text-sm text-gray-600">Check for any final edits</p>
          </div>
          <div className="card text-center">
            <ArrowLeft className="w-8 h-8 text-parrot-green mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Create Another</h4>
            <p className="text-sm text-gray-600">Try a different template</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview