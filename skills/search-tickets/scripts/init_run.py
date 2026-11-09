"""Create a non-overwriting draft ledger; this does not browse or check prices."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import re

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path)
    parser.add_argument('--platform', action='append', required=True, metavar='ID=PUBLIC_URL')
    parser.add_argument('--quantity', type=int, default=1)
    parser.add_argument('--adjacent', action='store_true')
    args = parser.parse_args()
    if args.quantity < 1:
        parser.error('quantity must be positive')
    now = datetime.now(timezone.utc).isoformat(timespec='seconds')
    base = Path(__file__).resolve().parents[1] / 'references' / 'run-template.json'
    run = json.loads(base.read_text(encoding='utf-8'))
    run.update(run_id=args.output.stem, checked_at=now)
    run['request'].update(quantity=args.quantity, adjacent_required=args.adjacent)
    for entry in args.platform:
        platform_id, sep, url = entry.partition('=')
        if not sep or not re.fullmatch('[a-z0-9-]+', platform_id) or not url.startswith('https://'):
            parser.error('platform must be ID=https://public-site.example/')
        if platform_id in run['targets']:
            parser.error('duplicate platform ID')
        run['targets'].append(platform_id)
        run['coverage'].append({
            'platform_id': platform_id, 'status': 'not_checked',
            'checked_at': now, 'url': url, 'method': 'not_attempted',
            'evidence_level': 'discovery',
            'evidence': 'سجل أُنشئ فقط؛ لم تُفتح المنصة بعد.',
            'blocker': 'لم يُنفذ الفحص بعد؛ ليست نتيجة بحث ولا عائق وصول مثبتًا.',
            'next_step': 'افتح المنصة واستخدم البحث الداخلي ثم سجّل الملاحظة الفعلية.'
        })
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open('x', encoding='utf-8') as handle:
        json.dump(run, handle, ensure_ascii=False, indent=2)
        handle.write('\n')
    print(args.output)

if __name__ == '__main__':
    main()
