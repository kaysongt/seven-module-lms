import { describe, expect, it } from "vitest";
import { coastGlobe, type GlobeVector } from "@/lib/globe-motion";

describe("globe release momentum", () => {
  it("continues in the release direction, then comes to rest", () => {
    let state = { rotation: [0, 0] as GlobeVector, velocity: [-0.12, 0.025] as GlobeVector };
    const first = coastGlobe(state.rotation, state.velocity, 32);
    expect(first.rotation[0]).toBeLessThan(0);
    expect(first.rotation[1]).toBeGreaterThan(0);
    expect(Math.abs(first.velocity[0])).toBeLessThan(0.12);
    for (let frame = 0; frame < 150; frame++) state = coastGlobe(state.rotation, state.velocity, 32);
    expect(state.velocity).toEqual([0, 0]);
    expect(state.rotation[0]).toBeGreaterThan(-90);
  });

  it("travels the same distance at 30 fps and 120 fps", () => {
    const travel = (frames: number) => {
      let state = { rotation: [45, -25] as GlobeVector, velocity: [0.15, 0.02] as GlobeVector };
      for (let frame = 0; frame < frames; frame++) state = coastGlobe(state.rotation, state.velocity, 1000 / frames);
      return state.rotation;
    };
    expect(travel(30)[0]).toBeCloseTo(travel(120)[0], 8);
    expect(travel(30)[1]).toBeCloseTo(travel(120)[1], 8);
  });

  it("stops vertical motion at the pole limit without stopping horizontal rotation", () => {
    const next = coastGlobe([10, 64], [0.1, 0.18], 50);
    expect(next.rotation[1]).toBe(65);
    expect(next.velocity[1]).toBe(0);
    expect(next.rotation[0]).toBeGreaterThan(10);
  });

  it("keeps a stationary release still and limits long frame gaps", () => {
    expect(coastGlobe([65, -25], [0, 0], 32).rotation).toEqual([65, -25]);
    expect(coastGlobe([0, 0], [0.1, 0], 10000)).toEqual(coastGlobe([0, 0], [0.1, 0], 50));
  });
});
