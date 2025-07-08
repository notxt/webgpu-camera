console.log('WebGPU Camera App Starting...');

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

    const context = canvas.getContext('webgpu');
    if (!context) {
      throw new Error('Failed to get WebGPU context');
    }

    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format,
      alphaMode: 'opaque'
    });

    console.log('WebGPU setup complete');
    
    if (info) {
      info.textContent = 'WebGPU Camera Controls - Initialized';
    }

  } catch (error) {
    console.error('WebGPU setup failed:', error);
    if (info) {
      info.textContent = `Error: ${error}`;
    }
  }
}

main().catch(console.error);