#!/bin/bash
kill $(lsof -t -i :3000) 2>/dev/null || true
npm run dev > /tmp/next_server.log 2>&1 &
