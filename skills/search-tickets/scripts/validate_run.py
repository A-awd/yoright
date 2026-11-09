"""Validate an auditable ticket search; no network, booking or price fabrication."""
import argparse
from datetime import datetime
import json
import math
from pathlib import Path
import re
import sys
from urllib.parse import parse_qsl, urlsplit

STATUSES = {
    'final_total_confirmed': 'إجمالي نهائي مؤكد',
    'offer_fees_unconfirmed': 'عرض موجود، والرسوم غير مؤكدة',
    'event_no_offers': 'المناسبة موجودة، ولا توجد عروض متاحة وقت الفحص',
    'event_not_found': 'لم أجد المناسبة بعد البحث المحدد',
    'login_required': 'يتطلب تسجيل دخول',
    'business_account_required': 'يتطلب حسابًا تجاريًا',
    'human_verification': 'توقف بسبب تحقق بشري أو حظر موثق',
    'technical_error': 'عطل تقني محدد',
    'not_applicable': 'غير مناسبة، مع السبب',
    'not_checked': 'لم يُفحص؛ غير محسوم',
}
CLOSED = {'event_no_offers', 'event_not_found', 'not_applicable'}
UNRESOLVED = set(STATUSES) - CLOSED - {'final_total_confirmed'}
LEVELS = {'discovery', 'page', 'internal_search', 'listing', 'checkout'}
PRIVATE_KEY = re.compile(r'(token|session|authorization|password|secret|email|phone|payment|card|checkout|order|booking)', re.I)
PRIVATE_PATH = re.compile(r'/(checkout|payment|pay|secure|basket|cart|orders?|bookings?)(/|$)', re.I)
UNKNOWN = re.compile(r'\b(unknown|unverified|unspecified)\b|not (selected|verified|checked)|غير (معروف|محدد|متحقق)|لم (يحدد|يتحقق|يفحص)', re.I)

def _date(value):
    if not isinstance(value, str):
        return False
    try:
        parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return parsed.tzinfo is not None
    except ValueError:
        return False

def _positive(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value) and value > 0

def _https(value):
    if not isinstance(value, str) or re.search(r'\s', value):
        return False
    try:
        parts = urlsplit(value)
        return parts.scheme == 'https' and bool(parts.hostname) and not parts.username and not parts.password
    except ValueError:
        return False

def counts(run):
    """Every target contributes exactly once; completeness is distinct from price."""
    rows = {r.get('platform_id'): r for r in run.get('coverage', []) if isinstance(r, dict)}
    statuses = [rows.get(key, {}).get('status') for key in run.get('targets', [])]
    final = statuses.count('final_total_confirmed')
    closed = sum(s in CLOSED for s in statuses)
    complete_final = sum(rows.get(key, {}).get('status') == 'final_total_confirmed'
                         and rows.get(key, {}).get('cheapest_offer_verified') is True
                         for key in run.get('targets', []))
    return {'targeted': len(statuses), 'checked_complete': complete_final + closed,
            'final_totals': final, 'closed_without_quote': closed,
            'unresolved': len(statuses) - complete_final - closed}

def _url_errors(value, path='run'):
    errors = []
    if isinstance(value, dict):
        for key, child in value.items():
            errors.extend(_url_errors(child, path + '.' + str(key)))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            errors.extend(_url_errors(child, path + '[' + str(index) + ']'))
    elif isinstance(value, str):
        for candidate in re.findall(r'https?://[^\s<>"\]]+', value):
            try:
                parts = urlsplit(candidate)
                if parts.username or parts.password or parts.fragment or PRIVATE_PATH.search(parts.path) or any(PRIVATE_KEY.search(k) for k, _ in parse_qsl(parts.query)):
                    errors.append(path + ': private/session URL; retain a public event URL only')
            except ValueError:
                errors.append(path + ': malformed URL')
    return errors

def validate(run):
    errors = []
    if not isinstance(run, dict):
        return ['run must be an object']
    if run.get('schema_version') != 1:
        errors.append('schema_version must be 1')
    if not run.get('run_id') or not _date(run.get('checked_at')):
        errors.append('run_id and timezone-aware checked_at are required')
    request = run.get('request', {})
    quantity = request.get('quantity')
    if not isinstance(quantity, int) or isinstance(quantity, bool) or quantity < 1:
        errors.append('request.quantity must be a positive integer')
    if not isinstance(request.get('adjacent_required'), bool):
        errors.append('request.adjacent_required must be boolean')
    event = run.get('event', {})
    for field in ['name', 'date', 'city', 'country', 'venue']:
        if not event.get(field):
            errors.append('event.' + field + ' is required (use explicit unverified text when unresolved)')
    if not isinstance(run.get('capabilities'), dict):
        errors.append('capabilities object is required')
    targets = run.get('targets', [])
    if not isinstance(targets, list) or not targets or any(not isinstance(t, str) or not t for t in targets):
        return errors + ['targets must be a nonempty list of platform IDs']
    if len(set(targets)) != len(targets):
        errors.append('duplicate targets')
    coverage = run.get('coverage', [])
    if not isinstance(coverage, list) or any(not isinstance(r, dict) for r in coverage):
        return errors + ['coverage must be a list of objects']
    ids = [r.get('platform_id') for r in coverage]
    if len(ids) != len(set(ids)):
        errors.append('duplicate coverage rows')
    if set(ids) != set(targets):
        errors.append('coverage must contain exactly one row per target; missing=' + str(set(targets)-set(ids)) + '; extra=' + str(set(ids)-set(targets)))
    for row in coverage:
        prefix = str(row.get('platform_id')) + ': '
        status = row.get('status')
        if status not in STATUSES:
            errors.append(prefix + 'unknown status')
        for field in ['method', 'evidence']:
            if not row.get(field):
                errors.append(prefix + field + ' is required')
        if row.get('evidence_level') not in LEVELS or not _date(row.get('checked_at')):
            errors.append(prefix + 'evidence_level and timezone-aware checked_at are required')
        url = row.get('url', '')
        if not _https(url):
            errors.append(prefix + 'public HTTPS source/event URL required')
        if status in UNRESOLVED and (not row.get('blocker') or not row.get('next_step')):
            errors.append(prefix + 'unresolved result needs a precise blocker and next_step')
        if status == 'not_applicable' and not row.get('reason'):
            errors.append(prefix + 'not_applicable needs a relevance reason')
        if status == 'event_not_found' and row.get('evidence_level') != 'internal_search':
            errors.append(prefix + 'not_found requires actual internal_search, not a search-engine excerpt')
        if status == 'event_no_offers' and (row.get('evidence_level') not in {'listing', 'checkout'} or row.get('event_matched') is not True):
            errors.append(prefix + 'no_offers requires matched event listing evidence')
        if status != 'final_total_confirmed':
            continue
        if event.get('official_verified') is not True or not event.get('official_sources'):
            errors.append(prefix + 'final recommendation requires verified official event sources')
        else:
            for source in event['official_sources']:
                if not _https(source.get('url')) or not source.get('evidence') or not _date(source.get('checked_at')):
                    errors.append(prefix + 'official source needs URL, dated evidence')
        if row.get('event_matched') is not True or row.get('quantity') != quantity or row.get('evidence_level') != 'checkout':
            errors.append(prefix + 'final total needs matched event, requested quantity and checkout evidence')
        if row.get('fee_conflict_resolved') is not True:
            errors.append(prefix + 'conflicting fee indicators must be resolved')
        if row.get('cheapest_scope') not in {'platform', 'verified_offer_only'}:
            errors.append(prefix + 'cheapest_scope must state platform or verified_offer_only')
        if row.get('cheapest_offer_verified') is True and row.get('cheapest_scope') != 'platform':
            errors.append(prefix + 'minimum verification contradicts verified_offer_only scope')
        if row.get('cheapest_offer_verified') is not True and (row.get('cheapest_scope') != 'verified_offer_only' or not row.get('min_listing_blocker')):
            errors.append(prefix + 'inaccessible minimum cannot be called platform cheapest; document min_listing_blocker')
        total = row.get('total', {})
        if not _positive(total.get('amount')) or not re.fullmatch('[A-Z]{3}', str(total.get('currency', ''))):
            errors.append(prefix + 'positive finite total and ISO currency required')
        if any(total.get(f) is not True for f in ['checkout_verified', 'mandatory_fees_complete', 'optional_excluded']):
            errors.append(prefix + 'checkout, all mandatory fees and optional-extras exclusion must be confirmed')
        if not total.get('payment_assumption') or UNKNOWN.search(str(total.get('payment_assumption'))):
            errors.append(prefix + 'payment fee assumption/method required; unknown surcharge prevents final total')
        if total.get('currency') == 'SAR':
            if total.get('charged_in_sar') is not True:
                errors.append(prefix + 'actual SAR billing must be identified')
        else:
            if total.get('charged_in_sar') is not False:
                errors.append(prefix + 'foreign-currency total must be labelled converted, not charged in SAR')
            if not _positive(total.get('fx_rate_to_sar')) or not total.get('fx_source') or not _date(total.get('fx_checked_at')):
                errors.append(prefix + 'foreign quote needs dated conversion source and positive fx_rate_to_sar')
        seat = row.get('seat', {})
        if any(not seat.get(f) for f in ['description', 'view', 'supporter', 'eligibility']):
            errors.append(prefix + 'seat/view/supporter/eligibility conditions required')
        if request.get('adjacent_required') and seat.get('adjacency_confirmed') is not True:
            errors.append(prefix + 'requested adjacency must be confirmed')
        delivery = row.get('delivery', {})
        if not delivery.get('method') or not delivery.get('deadline'):
            errors.append(prefix + 'delivery method and deadline required')
    errors.extend(_url_errors(run))
    return errors

def _safe_cell(value):
    return str(value).replace('|', '\\|').replace('\n', ' ')

def render_report(run):
    """Refuse invalid runs before ranking. Keeps every coverage row visible."""
    errors = validate(run)
    if errors:
        raise ValueError('\n'.join(errors))
    c = counts(run)
    rows = run['coverage']
    finals = [r for r in rows if r['status'] == 'final_total_confirmed']
    def sar(row):
        total = row['total']
        return total['amount'] * (1 if total['currency'] == 'SAR' else total['fx_rate_to_sar'])
    lines = ['# نتيجة البحث عن تذكرة', '', run['event']['name'] + ' — ' + run['event']['date'], '']
    if finals:
        best = min(finals, key=sar)
        t = best['total']
        lines += [f"هذا أرخص إجمالي مؤكد وجدته بين العروض التي اكتمل فحصها وقت البحث: **{sar(best):.2f} SAR** عبر [{best['platform_id']}]({best['url']})، لعدد {best['quantity']}.",
                  f"العملة الأصلية: {t['amount']} {t['currency']}. " + ('السعر محصّل بالريال.' if t['charged_in_sar'] else 'قيمة الريال تحويل للمقارنة؛ رسوم البنك غير المتحققة غير مشمولة.'),
                  'نطاق أدنى سعر: ' + ('أرخص المنصة ضمن الفرز والشروط المفحوصة.' if best['cheapest_scope']=='platform' else 'عرض مؤكد فقط؛ لم يثبت أنه أدنى المنصة لأن عرضًا أرخص تعذر فحصه.'),
                  f"المقعد: {best['seat']['description']}؛ الرؤية: {best['seat']['view']}؛ الجمهور: {best['seat']['supporter']}؛ الأهلية: {best['seat']['eligibility']}.",
                  f"التسليم: {best['delivery']['method']}؛ بحلول {best['delivery']['deadline']}.",
                  'شرط الدفع المفحوص: ' + t['payment_assumption'], '']
        if t['currency'] != 'SAR':
            lines += [f"التحويل: {t['fx_rate_to_sar']} SAR لكل {t['currency']}؛ المصدر: {t['fx_source']}؛ وقت المصدر: {t['fx_checked_at']}.", '']
    else:
        lines += ['**لم أصل إلى إجمالي نهائي مؤكد؛ لا أوصي بسعر بوصفه الأرخص.**', '']
    lines += [f"المستهدفة: {c['targeted']}؛ مكتملة الفحص: {c['checked_complete']}؛ غير محسومة: {c['unresolved']}؛ إجماليات عروض مؤكدة: {c['final_totals']}؛ نتائج مغلقة بلا سعر: {c['closed_without_quote']}. قد يوجد إجمالي عرض مؤكد مع بقاء فحص أدنى سعر المنصة غير محسوم.", '']
    if run.get('scope_note'):
        lines += [run['scope_note'], '']
    lines += ['| المنصة | النتيجة | إجمالي المنصة | وقت الفحص | الدليل أو العائق |', '| --- | --- | --- | --- | --- |']
    for row in rows:
        total = row.get('total', {}) if row['status']=='final_total_confirmed' else {}
        price = (f"{sar(row):.2f} SAR" + (f" ({total['amount']} {total['currency']}؛ تحويل للمقارنة)" if total['currency']!='SAR' else '؛ تحصيل بالريال')) if total else 'غير مؤكد / لا ينطبق'
        note = row.get('blocker') or row.get('reason') or row['evidence']
        lines.append(f"| [{_safe_cell(row['platform_id'])}]({row['url']}) | {STATUSES[row['status']]} | {price} | {row['checked_at']} | {_safe_cell(note)} |")
    if finals:
        lines += ['', 'شروط مقارنة الإجماليات:', '']
        for row in finals:
            t = row['total']
            fx = '' if t['currency']=='SAR' else f"؛ تحويل {t['fx_rate_to_sar']} SAR لكل {t['currency']} من {t['fx_source']} في {t['fx_checked_at']}"
            lines.append(f"- {row['platform_id']}: شرط الدفع {t['payment_assumption']}{fx}.")
    lines += ['', '## المنصات غير المكتملة والخطوات المطلوبة', '']
    incomplete = [r for r in rows if r['status'] in UNRESOLVED]
    lines += [f"- {r['platform_id']}: {r['blocker']} الخطوة: {r['next_step']}" for r in incomplete]
    for row in finals:
        if row.get('cheapest_offer_verified') is not True:
            incomplete.append(row)
            lines.append(f"- {row['platform_id']}: إجمالي عرض محدد مؤكد، لكن فحص الأرخص غير مكتمل: {row['min_listing_blocker']} الخطوة: أعد فتح العرض الأدنى دون افتراض أن البديل أرخص المنصة.")
    if not incomplete:
        lines.append('لا توجد حالات غير محسومة في النطاق المعلن.')
    lines += ['', 'الأسعار لحظة فحص فقط. لم يُنفذ شراء. اكتمال السجل لا يثبت صحة ادعاء المصدر أو استمرارية توفر المخزون.']
    return '\n'.join(lines) + '\n'

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('run', type=Path)
    parser.add_argument('--report', type=Path, help='Write Arabic Markdown only after validation succeeds')
    args = parser.parse_args()
    try:
        run = json.loads(args.run.read_text(encoding='utf-8'))
        errors = validate(run)
    except (OSError, ValueError, TypeError) as exc:
        print(str(exc), file=sys.stderr); return 1
    if errors:
        print('\n'.join(errors), file=sys.stderr); return 1
    print(json.dumps(counts(run), ensure_ascii=False))
    if args.report:
        args.report.write_text(render_report(run), encoding='utf-8')
    return 0

if __name__ == '__main__':
    sys.exit(main())
