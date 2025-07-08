# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WebGPU learning project focused on implementing camera controls in 3D scenes. The repository is in early development stages.

## Project Purpose

Learning how to control the camera in a 3D scene using WebGPU technology.

## Development Setup

This project uses TypeScript with minimal dependencies and bash scripts for development tasks.

### Commands
All development commands are bash scripts located in `bin/`:
- `./bin/build.sh` - Build TypeScript frontend code
- `./bin/watch.sh` - Watch and rebuild TypeScript on changes
- `./bin/dev.sh` - Start the development server
- `./bin/start-server.ts` - Alternative server start script

### Project Structure
- `client/` - Frontend code
  - `client/src/` - TypeScript source files
  - `client/dist/` - Compiled JavaScript output
  - `client/index.html` - Main HTML file
  - `client/tsconfig.json` - Frontend TypeScript config
- `bin/` - Development scripts
- `server.ts` - Development server with WebGPU CORS headers

## Architecture Notes

When implementing WebGPU camera controls, typical architecture includes:
- Camera matrix calculations for view transformations
- Input handling for camera movement (mouse, keyboard, touch)
- WebGPU render pipeline setup
- Shader programs for vertex and fragment processing
- Buffer management for camera uniform data