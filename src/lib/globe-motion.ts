export type GlobeVector = [number, number];
export const COAST_STOP_SPEED = 0.002;

/** Integrate exponential drag using milliseconds, independent of frame rate. */
export function coastGlobe(rotation: GlobeVector, velocity: GlobeVector, elapsed: number) {
  const delta = Math.max(0, Math.min(elapsed, 50));
  const decay = Math.exp(-delta / 700);
  const travel = 700 * (1 - decay);
  const latitude = Math.max(-65, Math.min(65, rotation[1] + velocity[1] * travel));
  const nextVelocity: GlobeVector = [velocity[0] * decay, Math.abs(latitude) >= 65 ? 0 : velocity[1] * decay];
  if (Math.hypot(...nextVelocity) < COAST_STOP_SPEED) nextVelocity.fill(0);
  return {
    rotation: [rotation[0] + velocity[0] * travel, latitude] as GlobeVector,
    velocity: nextVelocity,
  };
}
