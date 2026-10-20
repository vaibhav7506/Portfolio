export interface ParticleScene {
  setPaused(paused: boolean): void
  setVisible(visible: boolean): void
  destroy(): void
}

export function createParticleScene(canvas: HTMLCanvasElement, options: {
  signal: AbortSignal
  onReady(): void
  onError(): void
  onFormChange(name: string, index: number): void
}): Promise<ParticleScene>
