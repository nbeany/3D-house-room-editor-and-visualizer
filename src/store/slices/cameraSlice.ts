import type { CameraSlice, SliceCreator } from '../types'

export const createCameraSlice: SliceCreator<CameraSlice> = (set, get) => ({
  cameraMode: 'orbit',
  autoRotate: false,
  fpLocked: false,
  liveCam: { x: 14, z: 16, heading: Math.PI * 0.85 },

  setCameraMode: (mode) => {
    // Entering the walkthrough drops selection & measure mode — you can't
    // manipulate furniture while pointer-locked.
    if (mode === 'firstPerson') set({ selectedId: null, tool: 'select' })
    set({ cameraMode: mode, autoRotate: mode === 'orbit' ? get().autoRotate : false })
  },

  setAutoRotate: (v) => set({ autoRotate: v }),
  setFpLocked: (v) => set({ fpLocked: v }),
  setLiveCam: (x, z, heading) => set({ liveCam: { x, z, heading } }),
})
