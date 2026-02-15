'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Document {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  description: string;
  category: string;
  uploadedBy: { fullName: string; email: string };
  createdAt: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      CERTIFICATE: 'bg-blue-100 text-blue-800',
      MEMBERSHIP_CARD: 'bg-purple-100 text-purple-800',
      LETTER: 'bg-green-100 text-green-800',
      FORM: 'bg-yellow-100 text-yellow-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.OTHER;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl text-gold mb-4 animate-pulse">⚒</div>
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-heading text-gold">⚒</div>
              <span className="text-xl font-heading text-gold">FREEMASON INTERNATIONAL</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-gold transition">
                Dashboard
              </Link>
              <Link href="/documents" className="text-gold border-b-2 border-gold">
                Documents
              </Link>
              <Link href="/accessories" className="text-gray-300 hover:text-gold transition">
                Accessories
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl text-navy mb-2">
              My Documents
            </h1>
            <p className="text-gray-600">
              Download your membership documents, certificates, and forms
            </p>
            <div className="h-1 w-24 bg-gold mt-4"></div>
          </div>

          {/* Empty State */}
          {documents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-5xl text-gray-300 mb-4">📄</div>
              <h2 className="font-heading text-2xl text-gray-800 mb-2">
                No Documents Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Your documents will appear here once your membership is approved.
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-gold"
                >
                  {/* Icon */}
                  <div className="text-4xl mb-3">
                    {doc.fileType.includes('pdf') ? '📕' : '📄'}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg text-navy mb-2 truncate">
                    {doc.originalName}
                  </h3>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(
                        doc.category
                      )}`}
                    >
                      {doc.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Description */}
                  {doc.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  {/* File Info */}
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p>Size: {formatFileSize(doc.fileSize)}</p>
                    <p>
                      Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    <p>By: {doc.uploadedBy.fullName}</p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() =>
                      downloadDocument(doc.filePath, doc.originalName)
                    }
                    className="w-full py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition flex items-center justify-center space-x-2"
                  >
                    <span>📥</span>
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
