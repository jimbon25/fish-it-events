#!/bin/bash

# 🐟 Fish It Roblox - Quick Setup Script
# Script ini membantu setup project dengan cepat

echo "🚀 Fish It Roblox - Quick Setup"
echo "================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git tidak terinstall. Install git terlebih dahulu."
    exit 1
fi

echo "✅ Git terdeteksi"
echo ""

# Step 1: Initialize git repo
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "🎮 Initial commit - Fish It Roblox Landing Page"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository sudah ada"
fi

echo ""

# Step 2: Check GitHub username
echo "🔑 GitHub Setup"
echo "==============="
echo ""
echo "Silakan masukkan GitHub username Anda:"
read github_username

if [ -z "$github_username" ]; then
    echo "❌ GitHub username tidak boleh kosong"
    exit 1
fi

# Step 3: Create GitHub token link
echo ""
echo "📌 Langkah berikutnya:"
echo "1. Buka: https://github.com/settings/tokens/new"
echo "2. Create token dengan scope: repo (full control)"
echo "3. Copy token & simpan di tempat aman"
echo ""

# Step 4: Update configuration
echo "⚙️ Updating configuration..."
echo ""

# Update script.js
sed -i "s/YOUR_USERNAME/$github_username/g" script.js 2>/dev/null || sed -i '' "s/YOUR_USERNAME/$github_username/g" script.js
echo "✅ script.js updated"

# Update admin.js
sed -i "s/YOUR_USERNAME/$github_username/g" admin.js 2>/dev/null || sed -i '' "s/YOUR_USERNAME/$github_username/g" admin.js
echo "✅ admin.js updated"

echo ""
echo "🎉 Setup selesai!"
echo ""
echo "📋 Checklist berikutnya:"
echo "1. ✅ Repository sudah initialized"
echo "2. ✅ Configuration sudah updated ($github_username)"
echo "3. ⏳ Push ke GitHub (git push)"
echo "4. ⏳ Generate GitHub token"
echo "5. ⏳ Deploy ke Vercel"
echo "6. ⏳ Set environment variable GITHUB_TOKEN"
echo ""
echo "📖 Baca QUICK_START.md untuk langkah selanjutnya"
echo ""
echo "Happy coding! 🚀"
