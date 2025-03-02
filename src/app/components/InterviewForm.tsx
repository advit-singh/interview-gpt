'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ResumeParser from './ResumeParser';

const formSchema = z.object({
  jobUrl: z.string().url('Please enter a valid URL'),
  interviewType: z.enum(['technical', 'behavioral']),
  resumeFile: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function InterviewForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      setValue('resumeFile', acceptedFiles[0]);
      setSelectedFile(acceptedFiles[0]);
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextExtracted = (text: string) => {
    setResumeText(text);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    console.log(data);
    console.log('Resume text:', resumeText);

    // Simulate API call delay
    setTimeout(() => {
      // Navigate to results page with interview type as query parameter
      router.push(`/results?type=${data.interviewType}`);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Job Description URL
        </label>
        <input
          {...register('jobUrl')}
          type="url"
          id="jobUrl"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Paste the job posting URL here"
        />
        {errors.jobUrl && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jobUrl.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Your Resume (PDF)
        </label>
        <div
          {...getRootProps()}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} border-dashed rounded-md transition-colors duration-200`}
        >
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload a file</span>
                <input {...getInputProps()} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Interview Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            type="button"
            onClick={() => setValue('interviewType', 'technical')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-white">Technical</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Coding and system design</p>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setValue('interviewType', 'behavioral')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-white">Behavioral</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Soft skills and experience</p>
          </motion.button>
        </div>
      </div>

      {selectedFile && (
        <ResumeParser file={selectedFile} onTextExtracted={handleTextExtracted} />
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className={`w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          'Generate Interview Questions'
        )}
      </motion.button>
    </form>
  );
}
