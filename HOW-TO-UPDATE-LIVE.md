# 🔄 How to Update Your Live Website

## Current Setup:
- **Local Development**: You edit data via admin panel at `http://localhost:3456/website-v2/admin.html`
- **Data Storage**: Saved to `vision care/data.json` automatically
- **Live Website**: Vercel serves from `website-v2/data.json`
- **Deployment**: Automatic via GitHub → Vercel

---

## 📝 STEP-BY-STEP UPDATE PROCESS:

### **Step 1: Make Changes in Admin Panel**

1. Open admin panel locally:
   - URL: `http://localhost:3456/website-v2/admin.html`
   - Or open: `website-v2/admin.html` in browser

2. Add/edit your data:
   - Add slider banners
   - Add new frames
   - Update services
   - Change contact info
   - etc.

3. Click "Save" buttons
   - Data is saved to `data.json` automatically (if server running)
   - You'll see "✅ Saved successfully!" message

---

### **Step 2: Copy data.json to website-v2 Folder**

**Option A: Using File Explorer (Manual)**
```
1. Go to: C:\Users\user\Desktop\vision care\vision care
2. Find: data.json (in the main folder)
3. Right-click → Copy
4. Go into: website-v2 folder
5. Right-click → Paste (replace existing file)
```

**Option B: Using PowerShell (Quick)**
```powershell
cd "C:\Users\user\Desktop\vision care\vision care"
Copy-Item "data.json" "website-v2\data.json" -Force
```

**Option C: Using Batch Script (Fastest)** ⭐
```batch
@echo off
copy /Y "data.json" "website-v2\data.json"
echo ✅ Data copied successfully!
pause
```
Save as: `COPY-DATA.bat` in `vision care` folder

---

### **Step 3: Commit and Push to GitHub**

**Option A: Manual Git Commands**
```powershell
cd "C:\Users\user\Desktop\vision care\vision care"
git add website-v2/data.json
git commit -m "Update: [describe your changes]"
git push origin main
```

**Option B: One-Click Deploy Script** ⭐ RECOMMENDED
Create this file as `UPDATE-LIVE.bat`:

```batch
@echo off
echo ========================================
echo   Updating Live Website...
echo ========================================
echo.

:: Step 1: Copy data.json
echo [1/3] Copying data to website-v2 folder...
copy /Y "data.json" "website-v2\data.json"
if errorlevel 1 (
    echo ERROR: Failed to copy data.json
    pause
    exit /b 1
)
echo ✅ Data copied!
echo.

:: Step 2: Git add and commit
echo [2/3] Committing changes...
cd website-v2
git add data.json
git commit -m "Auto-update: Admin panel changes"
if errorlevel 1 (
    echo No changes to commit or error occurred
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Changes committed!
echo.

:: Step 3: Push to GitHub
echo [3/3] Pushing to GitHub...
cd website-v2
git push origin main
if errorlevel 1 (
    echo ERROR: Push failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Pushed to GitHub!
echo.

echo ========================================
echo   ✅ UPDATE COMPLETE!
echo ========================================
echo.
echo Your website is deploying now...
echo Wait 2-3 minutes, then check:
echo https://vision-care-opticals-one.vercel.app/
echo.
pause
```

---

### **Step 4: Vercel Auto-Deploys**

1. GitHub receives your push
2. Vercel detects the change automatically
3. Vercel starts deployment (takes 2-3 minutes)
4. New version goes live!

**Check deployment status:**
- Go to: https://vercel.com/dashboard
- Or get automatic email when done

---

## 🚀 QUICK WORKFLOW SUMMARY:

### **Every Time You Update Data:**

```
Admin Panel → Save Changes
     ↓
Copy data.json to website-v2/
     ↓
Git commit & push
     ↓
Vercel auto-deploys
     ↓
Live website updated! ✅
```

---

## 📁 CREATE THESE HELPER SCRIPTS:

### 1. `COPY-DATA.bat` (Simple Copy)
```batch
@echo off
copy /Y "data.json" "website-v2\data.json"
echo ✅ Data copied!
pause
```

### 2. `UPDATE-LIVE.bat` (Full Deployment) ⭐ BEST
[See full script above - copy and save in vision care folder]

### 3. `QUICK-DEPLOY.bat` (Alternative)
```batch
@echo off
cd website-v2
copy /Y "..\data.json" "data.json"
git add data.json
git commit -m "Update website data"
git push origin main
echo ✅ Deploying to Vercel...
start https://vercel.com/dashboard
pause
```

---

## 🔧 TROUBLESHOOTING:

### Problem: "No local server running"
**Solution:** 
- Run: `START-SERVER.bat` first
- Or manually copy data.json using File Explorer

### Problem: "Git not recognized"
**Solution:**
- Install Git: https://git-scm.com/download/win
- Or use GitHub Desktop app instead

### Problem: "Vercel not deploying"
**Solution:**
- Check: https://vercel.com/dashboard
- Look for errors in deployment log
- Make sure you're pushing to correct branch (main)

### Problem: "Changes not showing"
**Solution:**
- Hard refresh browser: Ctrl + Shift + R
- Clear browser cache
- Wait 3-4 minutes for Vercel deployment

---

## 💡 PRO TIPS:

1. **Always test locally first:**
   - Open `website-v2/index.html` in browser
   - Verify changes look good
   - Then deploy to live

2. **Keep data.json backed up:**
   - Export data from admin panel regularly
   - Keep backup copies

3. **Use meaningful commit messages:**
   - "Added 5 new Ray-Ban frames"
   - "Updated WhatsApp number"
   - "Changed business hours"

4. **Check Vercel deployment log:**
   - Shows exactly what changed
   - Helps debug issues

---

## 🎯 FASTEST WORKFLOW (Recommended):

1. Edit in admin panel → Save
2. Double-click `UPDATE-LIVE.bat`
3. Wait 3 minutes
4. Check live site!

That's it! 🎉

---

## 📞 Quick Reference:

- **Local Admin**: `http://localhost:3456/website-v2/admin.html`
- **Live Site**: https://vision-care-opticals-one.vercel.app/
- **GitHub**: https://github.com/gpro188/vision-care-opticals
- **Vercel Dashboard**: https://vercel.com/dashboard
