#!/bin/bash
set -e

echo "Setting up ServiceHub BD..."
echo ""

echo "--- Backend Setup ---"
cd backend
npm install
npx prisma generate
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
cd ..

echo ""
echo "--- Frontend Setup ---"
cd frontend
npm install
cd ..

echo ""
echo "Setup complete!"
echo ""
echo "Demo Accounts:"
echo "  Admin:     admin@marketplace.com"
echo "  Vendor 1:  rahim@vendor.com"
echo "  Vendor 2:  karim@vendor.com"
echo "  End-User:  fatema@user.com"
echo ""
echo "To run:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000/login"
