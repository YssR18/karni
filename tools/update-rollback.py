#!/usr/bin/env python3
# يعيد بناء جدول نقاط الرجوع في ROLLBACK.md من سجل git (commits التي تبدأ بـ vNN:)
import subprocess,re
rows=subprocess.check_output(['git','log','--format=%h|%ad|%s','--date=short'],text=True).splitlines()
head=open('ROLLBACK.md',encoding='utf-8').read().split('## الجدول')[0]
out=head+"## الجدول\n| الإصدار | الرمز | التاريخ | الوصف |\n|---|---|---|---|\n"
for r in rows:
    h,d,m=r.split('|',2); mm=re.match(r'(v\d+):\s*(.*)',m)
    if mm: out+=f"| {mm.group(1)} | `{h}` | {d} | {mm.group(2)} |\n"
open('ROLLBACK.md','w',encoding='utf-8').write(out)
