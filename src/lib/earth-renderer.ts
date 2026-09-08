/** A textured orthographic Earth. Rotation uses the same angles as d3-geo. */
export function createEarthRenderer(canvas: HTMLCanvasElement, source: string) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  });
  if (!gl || gl.getParameter(gl.MAX_TEXTURE_SIZE) < 4096) return null;
  canvas.dataset.renderer = "loading";
  let ready = false;
  let disposed = false;
  const shaders: WebGLShader[] = [];
  const shader = (type: number, code: string) => {
    const item = gl.createShader(type)!;
    shaders.push(item);
    gl.shaderSource(item, code);
    gl.compileShader(item);
    if (!gl.getShaderParameter(item, gl.COMPILE_STATUS))
      throw new Error("Earth shader unavailable");
    return item;
  };
  const program = gl.createProgram()!;
  let buffer: WebGLBuffer | null = null;
  let texture: WebGLTexture | null = null;
  const photo = new window.Image();
  const lost = (event: Event) => {
    event.preventDefault();
    ready = false;
    canvas.dataset.renderer = "fallback";
  };
  const dispose = () => {
    disposed = true;
    ready = false;
    photo.onload = null;
    photo.onerror = null;
    canvas.removeEventListener("webglcontextlost", lost);
    gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    shaders.forEach((item) => gl.deleteShader(item));
  };
  try {
    gl.attachShader(
      program,
      shader(
        gl.VERTEX_SHADER,
        `
      attribute vec2 position;
      varying vec2 uv;
      void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }
    `,
      ),
    );
    gl.attachShader(
      program,
      shader(
        gl.FRAGMENT_SHADER,
        `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D earth;
      uniform vec2 rotation;
      const float PI = 3.14159265359;
      void main() {
        vec2 p = (uv - .5) / .405;
        float r2 = dot(p, p);
        if (r2 > 1.) {
          float glow = exp(-(sqrt(r2) - 1.) * 36.) * .33;
          gl_FragColor = vec4(.24, .65, 1., glow);
          return;
        }
        float depth = sqrt(1. - r2);
        // Invert the orthographic projection and D3's latitude/longitude rotation.
        float x = depth * cos(rotation.y) + p.y * sin(rotation.y);
        float z = p.y * cos(rotation.y) - depth * sin(rotation.y);
        float lon = atan(p.x, x) - rotation.x;
        float lat = asin(clamp(z, -1., 1.));
        vec2 texcoord = vec2(fract(lon / (2. * PI) + .5), .5 - lat / PI);
        vec3 color = texture2D(earth, texcoord).rgb;
        // Preserve surface detail while lifting the satellite image's deep shadows.
        color = pow(color, vec3(.60));
        float light = max(dot(vec3(p, depth), normalize(vec3(-.4, .55, 1.))), 0.);
        color *= .78 + .36 * light;
        float rim = pow(1. - depth, 4.);
        color = mix(color, vec3(.18, .60, 1.), rim * .45);
        gl_FragColor = vec4(color, 1.);
      }
    `,
      ),
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error("Earth renderer unavailable");
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const rotation = gl.getUniformLocation(program, "rotation");
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "earth"), 0);
    canvas.addEventListener("webglcontextlost", lost);
    photo.onload = () => {
      if (disposed || gl.isContextLost()) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, photo);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
      ready = true;
      canvas.dataset.renderer = "webgl";
    };
    photo.onerror = () => {
      canvas.dataset.renderer = "fallback";
    };
    photo.src = source;
    return {
      get ready() {
        return ready;
      },
      render(angles: [number, number]) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.uniform2f(
          rotation,
          (angles[0] * Math.PI) / 180,
          (angles[1] * Math.PI) / 180,
        );
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      },
      dispose,
    };
  } catch {
    dispose();
    return null;
  }
}
