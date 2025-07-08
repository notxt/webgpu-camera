console.log('WebGPU Camera App Starting...');

async function loadShader(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load shader: ${path}`);
  }
  return await response.text();
}

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const info = document.getElementById('info');
  
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  if (!navigator.gpu) {
    const message = 'WebGPU not supported in this browser';
    console.error(message);
    if (info) {
      info.textContent = message;
    }
    return;
  }

  console.log('WebGPU is supported!');
  if (info) {
    info.textContent = 'WebGPU Camera Controls - Ready';
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error('No WebGPU adapter found');
    }

    const device = await adapter.requestDevice();
    console.log('WebGPU device acquired:', device.label);

    const context = canvas.getContext('webgpu') as GPUCanvasContext;
    if (!context) {
      throw new Error('Failed to get WebGPU context');
    }

    // Set canvas size to match device pixel ratio for sharp rendering
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format,
      alphaMode: 'opaque'
    });

    const shaderCode = await loadShader('/shaders/quad.wgsl');
    const shaderModule = device.createShaderModule({
      label: 'Quad shaders',
      code: shaderCode
    });

    // Vertex data: position (x,y,z) and color (r,g,b)
    const vertices = new Float32Array([
      // position       // color
      -0.5, -0.5, 0.0,  1.0, 0.0, 0.0,  // bottom-left  - red
       0.5, -0.5, 0.0,  0.0, 1.0, 0.0,  // bottom-right - green
       0.5,  0.5, 0.0,  0.0, 0.0, 1.0,  // top-right    - blue
      -0.5,  0.5, 0.0,  1.0, 1.0, 0.0,  // top-left     - yellow
    ]);

    const vertexBuffer = device.createBuffer({
      label: 'Quad vertices',
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    // Index data for two triangles
    const indices = new Uint16Array([
      0, 1, 2,  // first triangle
      0, 2, 3,  // second triangle
    ]);

    const indexBuffer = device.createBuffer({
      label: 'Quad indices',
      size: indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(indexBuffer, 0, indices);

    const pipeline = device.createRenderPipeline({
      label: 'Quad pipeline',
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [{
          arrayStride: 6 * 4, // 6 floats * 4 bytes
          attributes: [
            { // position
              format: 'float32x3',
              offset: 0,
              shaderLocation: 0,
            },
            { // color
              format: 'float32x3',
              offset: 3 * 4, // 3 floats * 4 bytes
              shaderLocation: 1,
            }
          ]
        }]
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [{
          format: format
        }]
      },
      primitive: {
        topology: 'triangle-list'
      }
    });

    function render() {
      const commandEncoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();

      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }]
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.setPipeline(pipeline);
      passEncoder.setVertexBuffer(0, vertexBuffer);
      passEncoder.setIndexBuffer(indexBuffer, 'uint16');
      passEncoder.drawIndexed(6);
      passEncoder.end();

      device.queue.submit([commandEncoder.finish()]);
      requestAnimationFrame(render);
    }

    // Handle window resize
    function onResize() {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
    }
    window.addEventListener('resize', onResize);

    console.log('WebGPU setup complete');
    
    if (info) {
      info.textContent = 'WebGPU Camera Controls - Rendering Quad';
    }

    render();

  } catch (error) {
    console.error('WebGPU setup failed:', error);
    if (info) {
      info.textContent = `Error: ${error}`;
    }
  }
}

main().catch(console.error);