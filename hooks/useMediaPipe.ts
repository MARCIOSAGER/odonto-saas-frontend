"use client"

/**
 * useMediaPipe - Hook for MediaPipe Face Landmarker
 * Loads the face detection model and provides landmark detection functionality
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import type { NormalizedLandmark } from '@/lib/hof/warp-strategies'

// MediaPipe types (dynamic import)
interface FaceLandmarkerResult {
  faceLandmarks: NormalizedLandmark[][]
  faceBlendshapes?: unknown[]
  facialTransformationMatrixes?: unknown[]
}

interface FaceLandmarkerInstance {
  detect: (image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => FaceLandmarkerResult
  close: () => void
}

interface UseMediaPipeReturn {
  /** Whether the model is loaded and ready */
  modelLoaded: boolean
  /** Whether the model is currently loading */
  isLoading: boolean
  /** Error if model failed to load */
  error: Error | null
  /** Detected landmarks from last detection (468 points) */
  detectedLandmarks: NormalizedLandmark[] | null
  /** Detect face landmarks in an image */
  detectFace: (image: HTMLImageElement) => Promise<NormalizedLandmark[] | null>
  /** Clear detected landmarks */
  clearLandmarks: () => void
}

/**
 * Hook to load and use MediaPipe Face Landmarker
 * Handles dynamic import to avoid SSR issues
 */
export function useMediaPipe(): UseMediaPipeReturn {
  const [modelLoaded, setModelLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [detectedLandmarks, setDetectedLandmarks] = useState<NormalizedLandmark[] | null>(null)
  const landmarkerRef = useRef<FaceLandmarkerInstance | null>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function loadMediaPipe() {
      // Prevent duplicate loads
      if (loadingRef.current || landmarkerRef.current) return
      loadingRef.current = true
      setIsLoading(true)

      try {
        // Dynamic import of MediaPipe Vision Tasks
        // Files must be in public/mediapipe/
        const { FaceLandmarker, FilesetResolver } = await import(
          // @ts-expect-error - Dynamic import from public folder
          '/mediapipe/vision_bundle.mjs'
        )

        if (cancelled) return

        // Initialize the vision tasks fileset
        const vision = await FilesetResolver.forVisionTasks('/mediapipe/')

        if (cancelled) return

        // Create the face landmarker
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/mediapipe/face_landmarker.task',
            delegate: 'GPU' // Use GPU acceleration if available
          },
          runningMode: 'IMAGE',
          numFaces: 1, // Only detect one face
          outputFaceBlendshapes: false, // Not needed for HOF
          outputFacialTransformationMatrixes: false
        })

        if (cancelled) {
          landmarker.close()
          return
        }

        landmarkerRef.current = landmarker
        setModelLoaded(true)
        console.log('MediaPipe Face Landmarker loaded successfully')
      } catch (err) {
        if (!cancelled) {
          const error = err instanceof Error ? err : new Error('Failed to load MediaPipe')
          setError(error)
          console.error('Failed to load MediaPipe:', err)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
          loadingRef.current = false
        }
      }
    }

    loadMediaPipe()

    return () => {
      cancelled = true
      // Cleanup landmarker on unmount
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close()
        } catch {
          // Ignore cleanup errors
        }
        landmarkerRef.current = null
      }
    }
  }, [])

  const detectFace = useCallback(
    async (image: HTMLImageElement): Promise<NormalizedLandmark[] | null> => {
      if (!landmarkerRef.current || !modelLoaded) {
        console.warn('MediaPipe not loaded, skipping detection')
        return null
      }

      try {
        const results = landmarkerRef.current.detect(image)

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          const landmarks = results.faceLandmarks[0]
          setDetectedLandmarks(landmarks)
          console.log(`Detected ${landmarks.length} landmarks`)
          return landmarks
        } else {
          console.warn('No face detected in image')
          setDetectedLandmarks(null)
          return null
        }
      } catch (err) {
        console.error('Face detection error:', err)
        setDetectedLandmarks(null)
        return null
      }
    },
    [modelLoaded]
  )

  const clearLandmarks = useCallback(() => {
    setDetectedLandmarks(null)
  }, [])

  return {
    modelLoaded,
    isLoading,
    error,
    detectedLandmarks,
    detectFace,
    clearLandmarks
  }
}

export default useMediaPipe
