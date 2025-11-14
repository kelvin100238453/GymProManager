#!/bin/bash
cd /workspace/gympro-clean
git add frontend/index.html
git commit -m "Implement local state for routine - fix sync error"
git push origin master
echo "Deployment complete"
