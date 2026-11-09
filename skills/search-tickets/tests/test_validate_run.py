import copy
import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'validate_run.py'
if SCRIPT.exists():
    spec = importlib.util.spec_from_file_location('validate_run', SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    validate = module.validate
    counts = module.counts
    render_report = module.render_report
else:
    # The documented contract is intentionally absent during the RED check.
    validate = lambda run: []
    counts = lambda run: {}
    render_report = lambda run: ''

def sample():
    return {
        'schema_version': 1, 'run_id': 'synthetic-test',
        'checked_at': '2026-11-09T10:00:00Z',
        'request': {'quantity': 2, 'adjacent_required': True},
        'event': {'name': 'Synthetic event', 'date': '2026-12-01',
                  'city': 'Lisbon', 'country': 'PT', 'venue': 'Synthetic venue',
                  'official_verified': True,
                  'official_sources': [{'url': 'https://example.org/event',
                                        'checked_at': '2026-11-09T10:00:00Z',
                                        'evidence': 'Synthetic fixture only'}]},
        'capabilities': {'browser': 'synthetic', 'local_sessions_available': False},
        'targets': ['a'],
        'coverage': [{
            'platform_id': 'a', 'status': 'final_total_confirmed',
            'checked_at': '2026-11-09T10:00:00Z',
            'url': 'https://example.com/event/1', 'method': 'browser',
            'evidence_level': 'checkout', 'evidence': 'Synthetic checkout',
            'event_matched': True, 'quantity': 2,
            'cheapest_offer_verified': True, 'cheapest_scope': 'platform',
            'fee_conflict_resolved': True,
            'total': {'amount': 100, 'currency': 'SAR', 'charged_in_sar': True,
                      'checkout_verified': True, 'mandatory_fees_complete': True,
                      'payment_assumption': 'No method surcharge shown; method selected',
                      'optional_excluded': True},
            'seat': {'description': 'Synthetic A1', 'view': 'Unrestricted',
                     'supporter': 'Home', 'eligibility': 'None stated',
                     'adjacency_confirmed': True},
            'delivery': {'method': 'Mobile transfer', 'deadline': '2026-12-01T12:00:00Z'}
        }]
    }

class ValidateRunTests(unittest.TestCase):
    def test_valid_synthetic_final_quote(self):
        self.assertEqual(validate(sample()), [])

    def test_missing_target_cannot_disappear(self):
        run = sample(); run['targets'].append('b')
        self.assertTrue(validate(run))

    def test_search_excerpt_does_not_prove_sold_out(self):
        run = sample(); row = run['coverage'][0]
        row.update(status='event_no_offers', evidence_level='discovery')
        self.assertTrue(validate(run))

    def test_final_quote_requires_official_event(self):
        run = sample(); run['event']['official_verified'] = False
        self.assertTrue(validate(run))

    def test_official_source_requires_public_url(self):
        for malformed in ['official was checked earlier', 'https://']:
            with self.subTest(url=malformed):
                run = sample(); run['event']['official_sources'][0]['url'] = malformed
                self.assertTrue(validate(run))

    def test_report_exposes_fx_and_payment_conditions(self):
        run = sample(); total = run['coverage'][0]['total']
        total.update(currency='EUR', charged_in_sar=False, fx_rate_to_sar=4,
                     fx_source='https://example.org/fx', fx_checked_at='2026-11-09T09:00:00Z')
        report = render_report(run)
        self.assertIn(total['fx_source'], report)
        self.assertIn(total['fx_checked_at'], report)
        self.assertIn(total['payment_assumption'], report)
        self.assertIn('400.00 SAR (100 EUR؛ تحويل للمقارنة)', report)

    def test_report_exposes_declared_scope(self):
        run = sample()
        run['scope_note'] = 'النطاق المعلن: منصة واحدة؛ لم يُفحص مخزون المنصات الأخرى.'
        self.assertIn(run['scope_note'], render_report(run))

    def test_final_quote_requires_checkout_and_mandatory_fees(self):
        for field in ['checkout_verified', 'mandatory_fees_complete']:
            with self.subTest(field=field):
                run = sample(); run['coverage'][0]['total'][field] = False
                self.assertTrue(validate(run))

    def test_final_quote_requires_quantity_and_adjacency(self):
        run = sample(); run['coverage'][0]['quantity'] = 1
        self.assertTrue(validate(run))
        run = sample(); run['coverage'][0]['seat']['adjacency_confirmed'] = False
        self.assertTrue(validate(run))

    def test_fee_conflict_and_unknown_payment_block_final(self):
        run = sample(); run['coverage'][0]['fee_conflict_resolved'] = False
        self.assertTrue(validate(run))
        for unknown in ['unknown', 'Payment method not selected', 'غير معروف']:
            with self.subTest(payment=unknown):
                run = sample(); run['coverage'][0]['total']['payment_assumption'] = unknown
                self.assertTrue(validate(run))

    def test_minimum_scope_cannot_contradict_verification(self):
        run = sample(); run['coverage'][0]['cheapest_scope'] = 'verified_offer_only'
        self.assertTrue(validate(run))
        run = sample(); run['coverage'][0]['total']['payment_assumption'] = ''
        self.assertTrue(validate(run))

    def test_inaccessible_minimum_cannot_be_platform_cheapest(self):
        run = sample(); run['coverage'][0]['cheapest_offer_verified'] = False
        self.assertTrue(validate(run))
        run['coverage'][0].update(cheapest_scope='verified_offer_only',
                                  min_listing_blocker='The cheaper listing failed')
        self.assertEqual(validate(run), [])

    def test_foreign_price_requires_conversion_evidence(self):
        run = sample(); run['coverage'][0]['total'].update(currency='EUR', charged_in_sar=False)
        self.assertTrue(validate(run))

    def test_private_urls_rejected(self):
        for url in ['https://example.com/checkout?session=secret',
                    'https://example.com/event?email=a%40b.com',
                    'https://user:password@example.com/event',
                    'https://example.com/checkout/private-id']:
            with self.subTest(url=url):
                run = sample(); run['coverage'][0]['url'] = url
                self.assertTrue(validate(run))

    def test_coverage_counts_different_outcomes(self):
        run = sample()
        for key, status in [('b','event_not_found'), ('c','technical_error')]:
            run['targets'].append(key)
            run['coverage'].append({'platform_id': key, 'status': status})
        self.assertEqual(counts(run), {'targeted': 3, 'checked_complete': 2,
                                     'final_totals': 1, 'closed_without_quote': 1,
                                     'unresolved': 1})

    def test_not_found_requires_internal_search(self):
        run = sample(); run['coverage'][0].update(status='event_not_found', evidence_level='page')
        self.assertTrue(validate(run))

    def test_confirmed_higher_offer_does_not_close_minimum_check(self):
        run = sample(); run['coverage'][0].update(
            cheapest_offer_verified=False, cheapest_scope='verified_offer_only',
            min_listing_blocker='Cheaper offer cannot be opened')
        self.assertEqual(counts(run), {'targeted': 1, 'checked_complete': 0,
                                     'final_totals': 1, 'closed_without_quote': 0,
                                     'unresolved': 1})

    def test_blocker_requires_precise_next_step(self):
        run = sample(); run['coverage'][0].update(status='technical_error')
        self.assertTrue(validate(run))

if __name__ == '__main__':
    unittest.main()
