"use client";

import React, { useState, useRef, useEffect } from "react";
import { TurbineModel, InspectionTest } from "@/config/inspection-tests";
import { SAMPLE_IMAGES, SampleImage } from "@/config/sampleImages";
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  X,
  FileCheck,
  VideoOff,
  AlertCircle
} from "lucide-react";

interface ImageUploaderProps {
  model: TurbineModel;
  test: InspectionTest;
  onImageSelected: (imageDataUrl: string, imageName: string, demoScenario?: "OK" | "NOT_OK" | "REVIEW") => void;
  onBack: () => void;
  isLoading?: boolean;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function ImageUploader({
  model,
  test,
  onImageSelected,
  onBack,
  isLoading = false
}: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [demoScenario, setDemoScenario] = useState<"OK" | "NOT_OK" | "REVIEW" | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileProcess = (file: File) => {
    setUploadError(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError("Invalid format. Please upload an image in JPG, PNG, or WEBP format.");
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 10 MB limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setImageName(file.name);
      setDemoScenario(undefined);
      stopCamera();
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file. Please try another image.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const startCamera = async () => {
    setUploadError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setUploadError("Mobile/desktop camera unavailable or permission denied. Please browse files or use a test sample.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setSelectedImage(dataUrl);
    setImageName(`field_capture_${Date.now()}.jpg`);
    setDemoScenario(undefined);
    stopCamera();
  };

  const selectSample = (sample: SampleImage) => {
    setSelectedImage(sample.dataUrl);
    setImageName(`${sample.id}_sample.svg`);
    setDemoScenario(sample.expectedResult);
    setUploadError(null);
    stopCamera();
  };

  const handleConfirmAnalyze = () => {
    if (!selectedImage) return;
    onImageSelected(selectedImage, imageName || "turbine_inspection.jpg", demoScenario);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Inspection Test</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Model: {model.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#006F78]/10 text-[#006F78] border border-[#006F78]/20">
              Test: {test.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006F78] mb-1">
          <span>Step 3 of 3</span>
          <span>&bull;</span>
          <span>Image Upload &amp; Verification</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Capture Inspection Image
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Upload or capture a photograph of the turbine component for Gemini visual inspection.
        </p>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Main Upload / View Area */}
      {!selectedImage ? (
        <div className="space-y-4">
          {/* Camera Viewfinder */}
          {isCameraActive ? (
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-4 text-center">
              <div className="relative aspect-video max-h-[360px] mx-auto bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none flex items-center justify-center">
                  <span className="text-white/70 font-mono text-xs px-2 py-1 bg-black/50 rounded">
                    Position component within frame
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  id="camera-capture-btn"
                  onClick={capturePhoto}
                  className="px-5 py-2.5 bg-[#006F78] hover:bg-[#005a62] text-white rounded-lg text-sm font-semibold inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Capture Photo
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <VideoOff className="w-4 h-4" />
                  Cancel Camera
                </button>
              </div>
            </div>
          ) : (
            /* Drag and drop dropzone */
            <div
              id="image-dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer bg-white ${
                isDragging
                  ? "border-[#006F78] bg-[#006F78]/5 scale-[0.99]"
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-input"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
                <UploadCloud className="w-7 h-7 text-[#006F78]" />
              </div>

              <h3 className="text-base font-bold text-slate-800 mb-1">
                Drag and drop component photograph here
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Supported formats: <strong>JPG, PNG, WEBP</strong> (Max 10 MB). Ensure proper lighting and visual clarity.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  id="browse-files-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  Browse Photograph
                </button>

                <button
                  type="button"
                  id="use-camera-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-slate-500" />
                  Use Camera
                </button>
              </div>
            </div>
          )}

          {/* Quick 1-Click Demo Samples */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-[#006F78]" />
                <span>Instant Demo Test Images (1-Click Load)</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Test OK, NOT OK &amp; REVIEW states
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  id={`sample-btn-${sample.id}`}
                  onClick={() => selectSample(sample)}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-[#006F78] bg-white text-left transition-all hover:shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        sample.expectedResult === "OK"
                          ? "bg-green-100 text-green-700"
                          : sample.expectedResult === "NOT_OK"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {sample.expectedResult}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sample.model}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-[#006F78]">
                    {sample.label}
                  </p>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {sample.test}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Section */
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#006F78]" />
              <h3 className="text-base font-bold text-slate-900">
                Inspection Image Ready
              </h3>
            </div>
            <button
              type="button"
              id="change-image-btn"
              onClick={() => {
                setSelectedImage(null);
                setImageName("");
                setDemoScenario(undefined);
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Photograph</span>
            </button>
          </div>

          {/* Model & Inspection Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 mb-5 text-sm">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Model:
              </span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {model.name}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">{model.series}</p>
            </div>

            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Inspection:
              </span>
              <span className="text-base font-bold text-slate-900">
                {test.name}
              </span>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 italic">
                &ldquo;{test.expectedCondition}&rdquo;
              </p>
            </div>
          </div>

          {/* Image Display */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Image:
              </span>
              {imageName && (
                <span className="text-xs font-mono text-slate-400">
                  {imageName}
                </span>
              )}
            </div>

            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-[300px]">
              <img
                src={selectedImage}
                alt="Inspection preview"
                className="max-h-[290px] w-auto object-contain mx-auto"
              />
              <button
                type="button"
                id="remove-image-btn"
                onClick={() => {
                  setSelectedImage(null);
                  setImageName("");
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              id="choose-different-img-btn"
              onClick={() => {
                setSelectedImage(null);
                setImageName("");
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
            >
              Choose Different Photograph
            </button>

            <button
              type="button"
              id="analyze-image-btn"
              disabled={isLoading}
              onClick={handleConfirmAnalyze}
              className="w-full sm:w-auto px-8 py-2.5 bg-[#006F78] hover:bg-[#005a62] disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Analyzing Photograph..." : "Analyze Image"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
