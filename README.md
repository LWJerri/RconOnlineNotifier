# Description

Script for monitoring online on the server Minecraft with the subsequent sending of information to Telegram chat.

## Installation

### Requirements

- Installed [Node.js](https://nodejs.org/ru) or [Docker](https://www.docker.com/).
- Installed any package manager (npm, yarn, etc.).

### Installing

1. Rename `.env.example` to `.env`.
2. Setup keys inside `.env` file.

#### Docker

1. Build `Dockerfile` - `docker build -t rcon-online-notifier:latest .`.
2. Run your created image - `docker run rcon-online-notifier:latest`.

#### Node.js

1. Install all packages, using your package manager.
2. Run application. Done!

## Contributing

This project opened for contribution and any suggestions! You can create a new `Issue` or make an `Pull request` with your code changes.

## LICENSE

This code has **MIT** license. See the `LICENSE` file for getting more information.
