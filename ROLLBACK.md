# نقاط الرجوع — KARNI

كل إصدار له وسم (tag) باسمه: `v30` … `v46` وما بعده. الوسم يحفظ نسخة ثابتة من المشروع كما كانت وقتها.

## الرجوع لنسخة سابقة (آمن، يحتفظ بالسجل)
```
git fetch --tags
git checkout main && git pull
git revert --no-edit <vNN>..HEAD     # يلغي كل ما بعد النسخة vNN
git push origin main
```
أو بإلغاء تعديل واحد فقط: `git revert <commit>`.

## معاينة نسخة قديمة دون تغيير شيء
`git checkout vNN` ثم افتح `index.html`؛ والعودة بـ `git checkout main`.

## ملاحظة
بعد الرجوع يجب أن يكون `APP_VER` و`VERSION` في `sw.js` و`version.json` أعلى من النسخة المعطوبة حتى يتحدّث الجهاز (يرفعها `git revert` تلقائياً لأنها تعدّل الملفات لكن راجعها).
