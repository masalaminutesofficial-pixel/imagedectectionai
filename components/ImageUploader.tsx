"use client";

import React, { useState, useRef, useEffect } from "react";
import { TurbineModelConfig, InspectionTestConfig } from "@/config/inspectionTests";
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
  VideoOff
} from "lucide-react";

interface ImageUploaderProps {
  model: TurbineModelConfig;
  test: InspectionTestConfig;
  onImageSelected: (imageDataUrl: string, imageName: string, demoScenario?: "OK" | "NOT_OK" | "REVIEW") => void;
  onBack: () => void;
}

export function ImageUploader({
  model,
  test,
  onImageSelected,
  onBack
}: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [demoScenario, setDemoScenario] = useState<"OK" | "NOT_OK" | "REVIEW" | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WEBP).");
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
    setCameraError(null);
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
      setCameraError("Camera unavailable or permission denied. Please browse or use a sample image.");
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
    setImageName(`webcam_inspection_${Date.now()}.jpg`);
    setDemoScenario(undefined);
    stopCamera();
  };

  const selectSampleImage = (sample: SampleImage) => {
    setSelectedImage(sample.dataUrl);
    setImageName(`${sample.id}_sample.svg`);
    setDemoScenario(sample.expectedResult);
    stopCamera();
  };

  const handleConfirmAnalyze = () => {
    if (!selectedImage) return;
    onImageSelected(selectedImage, imageName || "turbine_inspection.jpg", demoScenario);
  };

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Test Selection</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {model.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#006F78]/10 text-[#006F78] border border-[#006F78]/20">
              {test.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#006F78] mb-1">
          <span>Step 3 of 4</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Capture Inspection Image
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Upload or capture a clear photo of the turbine component for AI evaluation.
        </p>
      </div>

      {/* Main Upload / Camera View Area */}
      {!selectedImage ? (
        <div className="space-y-4">
          {/* Camera Viewfinder if active */}
          {isCameraActive ? (
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-4 relative text-center">
              <div className="relative aspect-video max-h-[380px] mx-auto bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none flex items-center justify-center">
                  <span className="text-white/60 font-mono text-xs px-2 py-1 bg-black/40 rounded">
                    Position component within frame
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-5 py-2.5 bg-[#006F78] hover:bg-[#005a62] text-white rounded-lg text-sm font-semibold inline-flex items-center gap-2 shadow-sm cursor-pointer"
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
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
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
                Drag and drop inspection image here
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Supports JPG, JPEG, PNG, WEBP. Ensure the component area is well-lit and in focus.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  Browse Files
                </button>

                <button
                  type="button"
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

              {cameraError && (
                <p className="text-xs text-amber-600 mt-3 font-medium">
                  {cameraError}
                </p>
              )}
            </div>
          )}

          {/* Quick Demo Sample Images */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-[#006F78]" />
                <span>Demo Quality Test Images (Instant 1-Click Load)</span>
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
                  onClick={() => selectSampleImage(sample)}
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
        /* Image Preview Screen as explicitly required by Section 4 */
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#006F78]" />
              <h3 className="text-base font-bold text-slate-900">
                Ready for AI Visual Inspection
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setImageName("");
                setDemoScenario(undefined);
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Image</span>
            </button>
          </div>

          {/* Model & Inspection Context as specified */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 mb-5">
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
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {test.expectedCondition}
              </p>
            </div>
          </div>

          {/* Image Display */}
          <div className="mb-6">
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

          {/* Analyze Image Button */}
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
              Choose Different Image
            </button>

            <button
              type="button"
              id="analyze-image-btn"
              onClick={handleConfirmAnalyze}
              className="w-full sm:w-auto px-8 py-2.5 bg-[#006F78] hover:bg-[#005a62] text-white text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
