# Storefront API

Base URL in development: `https://hdcr.ddev.site`. The React app is the
reference client: `react-app/src/utils/config.js`, `CartService.js`, the
checkout forms and the GraphQL fragments next to each paragraph component.
`scripts/smoke_test.py` exercises every group below.

## GraphQL

Endpoint: `POST /graphql-default-api` (GraphQL Compose schema).

| Query | Used for |
|---|---|
| `nodePage(id: UUID) { paragraphs { … } }` | Pages and the homepage. One fragment per paragraph type in `react-app/src/components/paragraphs/*/*Fragment.js` |
| `commerceProductDefault(id: UUID)` | Product page: title, body, media image with image-style variations, variations with price |
| `menu(name: MAIN)` | Header navigation |

```graphql
query GetProduct($id: ID!) {
  commerceProductDefault(id: $id) {
    title
    image { mediaImage { url variations(styles: MEDIUM) { url } } }
    variations { ... on CommerceProductVariationDefault { id title price } }
  }
}
```

## Routing helpers (`app_core`)

| Method | Path | Returns |
|---|---|---|
| GET | `/page-uuids` | UUIDs of required pages (`homepage`, `catalog`, …) set in *Admin → Configuration → App Core → Front pages* |
| GET | `/path-to-uuid?path=/home` | `{uuid, nid, title, type}` for a node alias, or `{uuid, product_id, …}` for `/product/{id}` |

## Catalogue and search (Views REST export)

| Method | Path | Notes |
|---|---|---|
| GET | `/products?_format=json` | Product list with price, image style URL and default variation ID |
| GET | `/api/search-products?_format=json&search=lamp` | Search API (Solr) full-text search |

## Cart (`app_commerce`)

Anonymous carts are identified by a client-generated `Commerce-Cart-Token`
header, which `CartTokenSession` maps to the Commerce cart session.

| Method | Path | Body / notes |
|---|---|---|
| POST | `/cart/add?_format=json` | `[{"purchased_entity_type": "commerce_product_variation", "purchased_entity_id": 2, "quantity": 1}]` |
| GET | `/cart?_format=json` | All carts for the token, with order items and totals |
| GET | `/cart/{order}?_format=json` | One cart |
| PATCH | `/cart/{order}/items?_format=json` | Update quantities of several items |
| PATCH | `/cart/{order}/items/{item}?_format=json` | Update one item |
| DELETE | `/cart/{order}/items/{item}?_format=json` | Remove one item |
| DELETE | `/cart/{order}/items?_format=json` | Clear the cart |
| GET / PATCH / DELETE | `/cart/{order}/coupons?_format=json` | Coupons |

Example:

```bash
curl -k -X POST 'https://hdcr.ddev.site/cart/add?_format=json' \
  -H 'Content-Type: application/json' -H 'Commerce-Cart-Token: my-token' \
  -d '[{"purchased_entity_type":"commerce_product_variation","purchased_entity_id":2,"quantity":2}]'
```

## Checkout

| Method | Path | Notes |
|---|---|---|
| GET | `/api/novaposhta/regions?_format=json` | Regions from the Nova Poshta API (cached for a day) |
| GET | `/api/novaposhta/cities/{regionRef}?_format=json` | Cities in a region |
| GET | `/api/novaposhta/warehouses/{cityRef}?_format=json` | Branches in a city |
| POST | `/api/commerce/order/shipping-info?_format=json` | `{order_id, email, firstName, lastName, novaposhtaRegion, novaposhtaCity, novaposhtaWarehouse}`. Creates the customer profile and a shipment on the Nova Poshta shipping method |
| GET | `/commerce/payment-gateways` | Enabled payment gateways (manual test gateway, LiqPay when keys are set) |

CORS for the React dev server (`http://localhost:3000`) is configured in
`web/sites/default/services.yml`, including the `Commerce-Cart-Token`
header.
