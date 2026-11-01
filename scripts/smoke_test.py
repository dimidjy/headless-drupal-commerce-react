#!/usr/bin/env python3
"""End-to-end API smoke test for the headless storefront.

Runs the same requests the React app makes against a site installed with
`ddev setup` (demo content): GraphQL homepage and product queries, REST
catalogue/search, cart, Nova Poshta reference data and the shipping step.

Usage:
  python3 scripts/smoke_test.py [https://hdcr.ddev.site]
"""
import json
import re
import ssl
import sys
import uuid
from pathlib import Path
from urllib.request import Request, urlopen

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'https://hdcr.ddev.site').rstrip('/')
REACT_SRC = Path(__file__).resolve().parents[1] / 'react-app' / 'src'
CTX = ssl._create_unverified_context()  # DDEV uses a local CA
CART_TOKEN = f'smoke-{uuid.uuid4().hex}'
failures = 0


def call(path, body=None, headers=None):
    data = json.dumps(body).encode() if body is not None else None
    req = Request(BASE + path, data, {'Content-Type': 'application/json',
                                      'Commerce-Cart-Token': CART_TOKEN,
                                      **(headers or {})})
    with urlopen(req, context=CTX, timeout=60) as res:
        return json.load(res)


def check(name, fn):
    global failures
    try:
        print(f'ok    {name}: {fn()}')
    except Exception as exc:  # noqa: BLE001 - report every failure and continue
        failures += 1
        print(f'FAIL  {name}: {exc}')


def gql_documents(path):
    """gql`...` blocks from a React source file, with ${...} interpolations removed."""
    text = (REACT_SRC / path).read_text()
    return [re.sub(r'\$\{[^}]+\}', '', m) for m in re.findall(r'gql`(.*?)`', text, re.S)]


def graphql(query, variables=None):
    res = call('/graphql-default-api', {'query': query, 'variables': variables or {}})
    if res.get('errors'):
        raise AssertionError(res['errors'][0]['message'])
    return res['data']


state = {}


def homepage():
    fragments = [d for f in sorted(REACT_SRC.glob('components/paragraphs/*/*Fragment.js'))
                 for d in gql_documents(f.relative_to(REACT_SRC))]
    homepage_uuid = call('/page-uuids')['required_pages']['homepage']
    page = graphql(gql_documents('components/Page/PageQuery.js')[0] + '\n'.join(fragments),
                   {'id': homepage_uuid})['nodePage']
    paragraphs = page['paragraphs']
    slider = next(p for p in paragraphs if 'productsList' in p)
    state['product_id'] = slider['productsList'][0]['id']
    assert len(paragraphs) >= 10, f'only {len(paragraphs)} paragraphs'
    return f"{len(paragraphs)} paragraphs, {len(slider['productsList'])} products in slider"


def product():
    data = graphql(gql_documents('graphql/queries/product.js')[0], {'id': state['product_id']})
    p = data['commerceProductDefault']
    return f"{p['title']} {p['variations'][0]['price']}"


def menu():
    items = graphql('{ menu(name: MAIN) { items { title url } } }')['menu']['items']
    return ', '.join(i['title'] for i in items)


def catalogue():
    products = call('/products?_format=json')
    assert products, 'no products'
    state['variation_id'] = int(products[0]['variation_id'])
    return f'{len(products)} products'


def search():
    hits = call('/api/search-products?_format=json&search=lamp')
    assert hits, 'no hits'
    return ', '.join(h['title'] for h in hits)


def cart():
    call('/cart/add?_format=json', [{'purchased_entity_type': 'commerce_product_variation',
                                     'purchased_entity_id': state['variation_id'], 'quantity': 2}])
    carts = call('/cart?_format=json')
    order = carts[0] if isinstance(carts, list) else carts
    state['order_id'] = order['order_id']
    return f"order {order['order_id']}, total {order['total_price']['formatted']}"


def shipping():
    regions = call('/api/novaposhta/regions?_format=json')['regions']
    region = regions[5]['Ref']
    cities = call(f'/api/novaposhta/cities/{region}?_format=json')
    city = next(v for v in cities.values() if isinstance(v, list))[0]['Ref']
    warehouses = call(f'/api/novaposhta/warehouses/{city}?_format=json')
    warehouse = next(v for v in warehouses.values() if isinstance(v, list))[0]['Ref']
    res = call('/api/commerce/order/shipping-info?_format=json', {
        'order_id': state['order_id'], 'email': 'buyer@example.com',
        'firstName': 'Demo', 'lastName': 'Buyer', 'novaposhtaRegion': region,
        'novaposhtaCity': city, 'novaposhtaWarehouse': warehouse,
    })
    assert res['status'] == 'success', res
    return res['message']


def payment_gateways():
    gateways = call('/commerce/payment-gateways')
    return ', '.join(g['label'] for g in gateways)


for name, fn in [('GraphQL homepage', homepage), ('GraphQL product', product),
                 ('GraphQL main menu', menu), ('REST catalogue', catalogue),
                 ('Solr search', search), ('Cart add + read', cart),
                 ('Nova Poshta shipping step', shipping),
                 ('Payment gateways', payment_gateways)]:
    check(name, fn)

sys.exit(1 if failures else 0)
