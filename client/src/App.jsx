import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TemplateSelect from './pages/TemplateSelect'
import ResumeForm from './pages/ResumeForm'
import Preview from './pages/Preview'

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [resumeData, setResumeData] = useState(null)
  const [generatedResume, setGeneratedResume] = useState(null)

  return (
    <Router>
      <div className="min-h-screen bg-soft-white">
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-2xl font-bold text-gray-900">
                LaTeX Resume Builder
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Professional resumes with LaTeX precision
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <TemplateSelect 
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                />
              } 
            />
            <Route 
              path="/form" 
              element={
                <ResumeForm 
                  selectedTemplate={selectedTemplate}
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                  setGeneratedResume={setGeneratedResume}
                />
              } 
            />
            <Route 
              path="/preview" 
              element={
                <Preview 
                  generatedResume={generatedResume}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App