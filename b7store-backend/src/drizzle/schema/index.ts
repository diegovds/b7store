import {
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

/* === USERS === */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  token: text('token'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(userAddresses),
  orders: many(orders),
}))

/* === USER ADDRESSES === */
export const userAddresses = pgTable('user_addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  zipcode: text('zipcode').notNull(),
  street: text('street').notNull(),
  number: text('number').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
  complement: text('complement'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}))

/* === BANNERS === */
export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  img: text('img').notNull(),
  link: text('link').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

/* === CATEGORIES === */
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  metadata: many(categoryMetadata),
}))

/* === CATEGORY METADATA === */
export const categoryMetadata = pgTable('category_metadata', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const categoryMetadataRelations = relations(
  categoryMetadata,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [categoryMetadata.categoryId],
      references: [categories.id],
    }),
    values: many(metadataValues),
  }),
)

/* === METADATA VALUES === */
export const metadataValues = pgTable('metadata_values', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  categoryMetadataId: text('category_metadata_id')
    .notNull()
    .references(() => categoryMetadata.id),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const metadataValuesRelations = relations(metadataValues, ({ one }) => ({
  categoryMetadata: one(categoryMetadata, {
    fields: [metadataValues.categoryMetadataId],
    references: [categoryMetadata.id],
  }),
}))

/* === PRODUCTS === */
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  price: real('price').notNull(),
  description: text('description'),
  categoryId: integer('category_id').references(() => categories.id),
  viewsCount: integer('views_count').notNull().default(0),
  salesCount: integer('sales_count').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  metadata: many(productMetadata),
  orders: many(orderProducts),
}))

/* === PRODUCT IMAGES === */
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  url: text('url').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

/* === PRODUCT METADATA === */
export const productMetadata = pgTable('product_metadata', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  categoryMetadataId: text('category_metadata_id').notNull(),
  metadataValueId: text('metadata_value_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const productMetadataRelations = relations(
  productMetadata,
  ({ one }) => ({
    product: one(products, {
      fields: [productMetadata.productId],
      references: [products.id],
    }),
  }),
)

/* === ORDERS === */
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  status: text('status').notNull().default('pending'),
  total: real('total').notNull(),
  shippingCost: real('shipping_cost').notNull().default(0),
  shippingDays: integer('shipping_days').notNull().default(0),
  shippingZipcode: text('shipping_zipcode'),
  shippingStreet: text('shipping_street'),
  shippingNumber: text('shipping_number'),
  shippingCity: text('shipping_city'),
  shippingState: text('shipping_state'),
  shippingCountry: text('shipping_country'),
  shippingComplement: text('shipping_complement'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderProducts),
}))

/* === ORDER PRODUCTS === */
export const orderProducts = pgTable('order_products', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull().default(1),
  price: real('price').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
  order: one(orders, {
    fields: [orderProducts.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderProducts.productId],
    references: [products.id],
  }),
}))
