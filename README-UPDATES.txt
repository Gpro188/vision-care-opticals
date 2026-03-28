================================================================================
           VISION CARE - QUICK UPDATE GUIDE
================================================================================

YOUR WEBSITE IS LIVE: https://vision-care-opticals-one.vercel.app/

================================================================================
WHENEVER YOU MAKE CHANGES IN LOCAL ADMIN PANEL, FOLLOW THESE STEPS:
================================================================================

STEP 1: Make Changes in Admin Panel
  → Open: http://localhost:3456/website-v2/admin.html
  → Add/edit your data (frames, services, banners, etc.)
  → Click Save buttons
  → Data saved to: data.json


STEP 2: Update Live Website (Choose ONE method)
  
  METHOD A - EASIEST (Double-click this file):
  → UPDATE-LIVE.bat
  
  This automatically:
    ✓ Copies data to website-v2 folder
    ✓ Commits to Git
    ✓ Pushes to GitHub
    ✓ Opens Vercel dashboard
    ✓ Deployment starts!
  
  
  METHOD B - Manual Commands (PowerShell):
  cd "C:\Users\user\Desktop\vision care\vision care"
  Copy-Item "data.json" "website-v2\data.json" -Force
  git add website-v2/data.json
  git commit -m "Update website data"
  git push origin main


STEP 3: Wait for Deployment (2-3 minutes)
  → Check: https://vercel.com/dashboard
  → Wait for "Ready" status
  → Email notification sent (if enabled)


STEP 4: Verify Live Website
  → Visit: https://vision-care-opticals-one.vercel.app/
  → Press Ctrl + Shift + R to hard refresh
  → Check all changes are visible


================================================================================
HELPER SCRIPTS CREATED FOR YOU:
================================================================================

1. COPY-DATA.bat
   → Just copies data.json to website-v2/
   → Use if you only want to copy (no deployment)

2. UPDATE-LIVE.bat ⭐ RECOMMENDED
   → Full automatic deployment
   → Does everything in one click
   → USE THIS ONE!


================================================================================
IMPORTANT NOTES:
================================================================================

✓ data.json MUST be in website-v2/ folder for Vercel to read it
✓ Every admin panel change requires a new deployment
✓ Vercel auto-deploys when you push to GitHub
✓ Always test locally before deploying (open website-v2/index.html)
✓ Keep backups of your data.json file


================================================================================
TROUBLESHOOTING:
================================================================================

Problem: Can't open admin panel
Solution: Run START-SERVER.bat first

Problem: Git errors
Solution: Make sure you're in the "vision care" folder (not parent)

Problem: Push fails
Solution: Check internet connection and GitHub login

Problem: Vercel not deploying
Solution: Go to vercel.com/dashboard and check for errors

Problem: Changes not showing on live site
Solution: 
  1. Hard refresh browser (Ctrl + Shift + R)
  2. Clear cache
  3. Wait 3-4 minutes
  4. Verify data.json was actually copied to website-v2/


================================================================================
QUICK REFERENCE:
================================================================================

Local Admin:     http://localhost:3456/website-v2/admin.html
Live Website:    https://vision-care-opticals-one.vercel.app/
GitHub:          https://github.com/gpro188/vision-care-opticals
Vercel Dashboard: https://vercel.com/dashboard


================================================================================
WORKFLOW SUMMARY:
================================================================================

Admin Panel → Save Changes
     ↓
Run UPDATE-LIVE.bat
     ↓
Wait 2-3 minutes
     ↓
Check Live Website ✅


================================================================================
THAT'S IT! Your updates will be live in minutes! 🎉
================================================================================

For detailed guide, see: HOW-TO-UPDATE-LIVE.md
