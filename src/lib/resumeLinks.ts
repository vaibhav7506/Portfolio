export const resumeLinks = {
  sde: {
    label: "SDE",
    url: "https://drive.google.com/file/d/1U39tGRv_uEVXY-NVU99XS02sL-9mLzCA/preview",
  },
  aiml: {
    label: "AI/ML",
    url: "https://drive.google.com/file/d/1l3gaiSuaRHJbVQ6HwTKmoO2P-uWP22c6/preview",
  },
} as const

export type ResumeKind = keyof typeof resumeLinks
