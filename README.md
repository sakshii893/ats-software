# LaTeX Resume Builder

A full-stack resume builder application that generates professional LaTeX-based resumes from user input. Features multiple templates, online PDF compilation, and a modern React interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 🚀 Features

- **5 Professional Templates**: Modern, Minimal, Developer, Classic, and Academic designs
- **Online LaTeX Compilation**: Uses LaTeX.Online API for PDF generation (no local installation required)
- **Smart Fallback**: Generates formatted HTML resume if PDF compilation fails
- **Dynamic Form Builder**: Add multiple projects, skills, achievements, and custom sections
- **Real-time Preview**: View your resume before downloading
- **Responsive Design**: Clean, modern UI with Tailwind CSS
- **Download Options**: Get your resume as PDF or HTML

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/latex-resume-builder.git
cd latex-resume-builder
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

## 🚀 Running the Application

### Start Backend Server (Terminal 1)
```bash
cd server
npm run dev
```
Backend will run on: **http://localhost:3002**

### Start Frontend Server (Terminal 2)
```bash
cd client
npm run dev
```
Frontend will run on: **http://localhost:5173**

## 📁 Project Structure

```
latex-resume-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Main pages (TemplateSelect, ResumeForm, Preview)
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API services
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── templates/        # LaTeX templates (.tex files)
│   ├── utils/           # Utility functions (LaTeX generation, PDF compilation)
│   ├── generated/       # Generated resume files (gitignored)
│   ├── server.js        # Main server file
│   └── package.json
├── .gitignore
└── README.md
```

## 🎨 Available Templates

1. **Modern** - Clean and contemporary design with accent colors
2. **Minimal** - Simple and elegant layout
3. **Developer** - Perfect for tech professionals with monospace fonts
4. **Classic** - Traditional professional format
5. **Academic** - Ideal for research and academic positions

## 🔧 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express
- Axios (for LaTeX.Online API)
- Form-data

### LaTeX Compilation
- LaTeX.Online API (primary)
- Local pdflatex (fallback, optional)
- HTML formatting (final fallback)

## 📝 Usage

1. **Select Template**: Choose from 5 professionally designed templates
2. **Fill Form**: Enter your information:
   - Basic info (name, email, phone, location, LinkedIn, GitHub)
   - Education details
   - Skills (add multiple)
   - Projects (add multiple with descriptions)
   - Achievements
   - Custom sections
3. **Generate**: Click "Generate Resume" to create your resume
4. **Preview & Download**: View the formatted resume and download as PDF/HTML

## 🌐 API Endpoints

- `GET /api/templates` - Get available resume templates
- `POST /api/generate-resume` - Generate resume from template and user data
- `GET /api/download-resume` - Download the generated resume file
- `GET /test` - Test endpoint to verify server is running

## 🔒 Environment Variables

No environment variables required for basic functionality. The application works out of the box.

## 🐛 Troubleshooting

### Port Already in Use
If you get `EADDRINUSE` error:
```bash
# Kill the process using the port
lsof -ti:3002 | xargs kill -9

# Or use a different port
PORT=3003 npm run dev
```

### PDF Generation Issues
The app uses LaTeX.Online API for PDF generation. If it fails:
- Check your internet connection
- The app will automatically fall back to formatted HTML
- You can still download and use the HTML version

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LaTeX.Online](https://latexonline.cc/) for free LaTeX compilation API
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/latex-resume-builder](https://github.com/yourusername/latex-resume-builder)

## 🎯 Future Enhancements

- [ ] User authentication and resume saving
- [ ] More template options
- [ ] Export to Word format
- [ ] Resume analytics and tips
- [ ] Template customization (colors, fonts)
- [ ] Multi-language support

---

Made with ❤️ by [Your Name]