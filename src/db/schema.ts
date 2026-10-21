import { pgTable, varchar, text, timestamp, numeric, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 64 }).primaryKey(),
  uid: text('uid').unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  role: varchar('role', { length: 16 }).default('OWNER'),
  businessId: varchar('business_id', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const businesses = pgTable('businesses', {
  id: varchar('id', { length: 64 }).primaryKey(),
  ownerId: varchar('owner_id', { length: 64 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  businessName: varchar('business_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 32 }).notNull(),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  businessType: varchar('business_type', { length: 100 }).default('General Store'),
  upiId: text('upi_id'),
  upiName: text('upi_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const customers = pgTable('customers', {
  id: varchar('id', { length: 64 }).primaryKey(),
  businessId: varchar('business_id', { length: 64 }).notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 32 }).notNull(),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  notes: text('notes'),
  tags: jsonb('tags').default([]),
  attachments: jsonb('attachments').default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  businessId: varchar('business_id', { length: 64 }).notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  customerId: varchar('customer_id', { length: 64 }).notNull().references(() => customers.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 16 }).notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  transactionDate: timestamp('transaction_date', { withTimezone: true }).defaultNow(),
  description: text('description'),
  paymentMethod: varchar('payment_method', { length: 32 }).default('Cash'),
  items: jsonb('items').default([]),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const reminderSettings = pgTable('reminder_settings', {
  businessId: varchar('business_id', { length: 64 }).primaryKey().references(() => businesses.id, { onDelete: 'cascade' }),
  enabled: boolean('enabled').default(true),
  thresholdDays: integer('threshold_days').default(15),
  preferredChannel: varchar('preferred_channel', { length: 16 }).default('WHATSAPP'),
  cooldownDays: integer('cooldown_days').default(3),
  includeUpi: boolean('include_upi').default(true),
  minBalance: numeric('min_balance', { precision: 12, scale: 2 }).default('1'),
  messageTemplateEn: text('message_template_en'),
  messageTemplateHi: text('message_template_hi'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const reminderLogs = pgTable('reminder_logs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  businessId: varchar('business_id', { length: 64 }).notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  customerId: varchar('customer_id', { length: 64 }).notNull().references(() => customers.id, { onDelete: 'cascade' }),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 32 }).notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  daysOverdue: integer('days_overdue').notNull(),
  channel: varchar('channel', { length: 16 }).notNull(),
  status: varchar('status', { length: 16 }).default('SENT'),
  messagePreview: text('message_preview'),
  sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow(),
});
