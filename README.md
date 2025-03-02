# Interview GPT

Interview GPT is an AI-powered interview preparation assistant that helps you practice for technical and behavioral interviews by generating relevant questions based on your resume and job description.

## Features

- **Resume Analysis**: Upload your resume (PDF format) and get tailored interview questions
- **Job Description Integration**: Paste a job URL to get questions specific to the role
- **Dual Interview Modes**:
  - Technical interview preparation (coding and system design)
  - Behavioral interview preparation (soft skills and experience)
- **Modern UI/UX**:
  - Responsive design
  - Dark mode support
  - Smooth animations
  - Drag-and-drop file upload

## Tech Stack

- **Frontend Framework**: Next.js 15.2
- **UI Library**: React 19.0
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Handling**:
  - React Hook Form
  - Zod for validation
- **PDF Processing**: PDF.js
- **File Upload**: React Dropzone

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/interview-gpt.git
cd interview-gpt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Usage

1. Upload your resume in PDF format (max 10MB)
2. Paste the job posting URL you're interested in
3. Select the type of interview you want to practice (Technical or Behavioral)
4. Click "Generate Interview Questions" to get personalized interview questions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for the smooth animations
- PDF.js for PDF parsing capabilities
