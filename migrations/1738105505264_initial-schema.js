/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    // Ensure pgcrypto extension for UUID generation
    pgm.sql('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    
    pgm.createTable('polls', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        title: { type: 'text', notNull: true },
        active: { type: 'boolean', notNull: true, default: true },
        created_at: { type: 'timestamp', default: pgm.func('now()') }
    });
  
    pgm.createTable('options', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        poll_id: { type: 'uuid', references: 'polls', onDelete: 'CASCADE', notNull: true },
        option_text: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', default: pgm.func('now()') }
    });
  
    pgm.createTable('votes', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        poll_id: { type: 'uuid', references: 'polls', onDelete: 'CASCADE', notNull: true },
        option_id: { type: 'uuid', references: 'options', onDelete: 'CASCADE', notNull: true },
        created_at: { type: 'timestamp', default: pgm.func('now()') }
    });

    pgm.addIndex('options', 'poll_id');
    pgm.addIndex('votes', ['poll_id', 'option_id']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('votes');
    pgm.dropTable('options');
    pgm.dropTable('polls');
};
