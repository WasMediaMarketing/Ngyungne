"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function VirtualTemple() {
  const mountRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<OrbitControls>()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controlsRef.current = controls

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(0, 1, 0)
    scene.add(directionalLight)

    // Load temple model
    const loader = new GLTFLoader()
    loader.load(
      "/temple-model.glb",
      (gltf) => {
        scene.add(gltf.scene)
      },
      undefined,
      (error) => {
        console.error("An error occurred loading the model:", error)
      },
    )

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Virtual Temple Tour</CardTitle>
        <CardDescription>Explore our temple in 3D. Use your mouse to rotate and zoom.</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mountRef} className="w-full aspect-video rounded-lg overflow-hidden" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button onClick={() => controlsRef.current?.reset()}>Reset View</Button>
          <Button variant="outline">Enter VR Mode</Button>
        </div>
      </CardContent>
    </Card>
  )
}

