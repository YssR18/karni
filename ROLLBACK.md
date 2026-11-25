# نقاط الرجوع — KARNI

كل إصدار هو commit ثابت على `main` برقمه (`vNN`) وهذا الجدول يحفظ رمز كل نقطة. (لا يمكن دفع الوسوم من هذه البيئة، فالرمز هو نقطة الرجوع.)

## الرجوع لنسخة سابقة (آمن، يحتفظ بالسجل)
```
git pull
git revert --no-edit <رمز_النسخة_السليمة>..HEAD   # يلغي كل ما بعدها
git push origin main
```
إلغاء تعديل واحد فقط: `git revert <رمز_التعديل>`.
معاينة نسخة قديمة دون تغيير شيء: `git checkout <رمز>` ثم `git checkout main` للعودة.

## الجدول
| الإصدار | الرمز | التاريخ | الوصف |
|---|---|---|---|
| v68 | `3f1d71b` | 2026-11-25 | move updates card to data tab |
| v67 | `cb37df1` | 2026-11-25 | no not-prepared warning for delivered orders |
| v66 | `e685eeb` | 2026-11-25 | confirm-to-invoice after delivery |
| v65 | `835ac73` | 2026-11-25 | delivered note card, note font size |
| v64 | `6a062db` | 2026-11-25 | notification read button, bold KARNI, delivered orders tab, order card tweaks |
| v63 | `37389ab` | 2026-11-24 | order delivery, notifications (bell + settings), person card & order card tweaks, hide header on phone Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v62 | `1391cf0` | 2026-11-24 | person card collapses to a sticky one-row bar on scroll Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v61 | `6cfeb42` | 2026-11-24 | warehouse dot - ready orders notify once, cleared when orders tab opened Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v60 | `1e3e2d4` | 2026-11-24 | proposed firestore.rules + SECURITY.md; profile-less account rejected when rules deny Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v59 | `80f01b9` | 2026-11-23 | separate eye toggles for customers and suppliers Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v58 | `9e55d5b` | 2026-11-23 | settings regroup (updates card, currency in print), activity log to reports, bolder centered date Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v57 | `876c369` | 2026-11-23 | POS cart fixed buttons, invoice/expenses/close-day layout changes Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v56 | `348e935` | 2026-11-23 | fix modal z-index (shelf bar overlapping add-shelf modal) Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v55 | `d264f9b` | 2026-11-22 | honest image save on phone (share / viewer / native saveFile hook) Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v54 | `0139a9b` | 2026-11-22 | login screen shows badge field only, toggle for password login Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v53 | `51233d0` | 2026-11-22 | per-card print/save button; fix image save on phone Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_012NjQCB33Hp8PCX9rgFSBMp |
| v52 | `3546476` | 2026-11-22 | badge cards 85x55mm, larger barcode, name+role only |
| v51 | `711279f` | 2026-11-22 | barcode badge login per user (replaces attendance scan) |
| v50 | `b94fec7` | 2026-11-21 | remove signup; barcode attendance in reports; 30-day trash in reset |
| v49 | `e589ce8` | 2026-11-21 | movement card bigger numbers, fix date |
| v48 | `fa765d5` | 2026-11-21 | send transaction as detail / voucher / movement (old & new balance) |
| v47 | `6e16dd3` | 2026-11-21 | bigger centered numbers, print/save-as-image report, products ☰ menu, add-warehouse beside count, invoices stats trimmed |
| v46 | `e6cda68` | 2026-11-20 | day close - opt-in approval of invoice cash sales |
| v45 | `a7f55c3` | 2026-11-20 | sidebar notification as red dot instead of number |
| v44 | `6d3c63b` | 2026-11-19 | compact cards on warehouses page (Windows) |
| v43 | `ad8e8a7` | 2026-11-19 | compact product cards on Windows (more columns) |
| v42 | `7b20b5d` | 2026-11-18 | opaque modals in studio theme; rename/delete shelf |
| v41 | `2b94616` | 2026-11-18 | shelf filter select + add-shelf modal (registry on warehouse doc) |
| v40 | `af013ae` | 2026-11-18 | inventory counting by storekeeper with manager approval, delta-based corrections |
| v39 | `d7e44cc` | 2026-11-18 | warehouse hub renamed, tabs, shelves feature, storekeeper landing |
| v38 | `276e00b` | 2026-11-18 | delete user option |
| v37 | `2b0df30` | 2026-11-18 | fix update button hanging (backup beforeunload guard blocked reload) |
| v36 | `d0407ac` | 2026-11-18 | warehouse transfers for storekeeper with log and undo, delta-based stock moves |
| v35 | `ffdddae` | 2026-11-18 | customer orders go to storekeeper for preparation with storage location |
| v34 | `f048054` | 2026-11-17 | report days table removed, clearer handover arrow, reset card centered |
| v33 | `a7e1cac` | 2026-11-17 | storekeeper role and goods receiving/matching flow |
| v32 | `57cf763` | 2026-11-17 | fix stale-device sync overwrite (stock increments, tx diffs), perms modal z-index, UI tweaks |
| v31 | `8ac355b` | 2026-11-17 | reorder expense/income form |
| v30 | `c46f1d6` | 2026-11-17 | truck account tick, download button, direct WhatsApp, update fix |
